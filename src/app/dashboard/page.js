import {
    Activity,
    AlertTriangle,
    BarChart3,
    Bell,
    CheckCircle,
    Clock,
    Droplets,
    Leaf,
    MapPin,
    Minus,
    Sun,
    Thermometer,
    TrendingDown,
    TrendingUp,
    Wifi,
    WifiOff,
    Wind,
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { SoilHistoryChart } from "@/components/charts/SoilChart";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
    generateAlerts,
    generateCrops,
    generateCurrentWeather,
    generateSoilHistory,
    generateSoilSensors,
} from "@/lib/faker-data";
import { prisma } from "@/lib/prisma";

function SensorSignalBadge({ signal }) {
    if (signal === "Strong") return <span className="text-green-600 flex items-center gap-1 text-xs"><Wifi className="w-3 h-3" />Strong</span>;
    if (signal === "Moderate") return <span className="text-amber-600 flex items-center gap-1 text-xs"><Wifi className="w-3 h-3" />Moderate</span>;
    return <span className="text-red-500 flex items-center gap-1 text-xs"><WifiOff className="w-3 h-3" />Weak</span>;
}

function MoistureBar({ value }) {
    const color = value < 25 ? "bg-red-400" : value < 50 ? "bg-amber-400" : value < 75 ? "bg-green-500" : "bg-blue-400";
    return (
        <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
            <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${Math.min(value, 100)}%` }} />
        </div>
    );
}

function TrendIcon({ trend }) {
    if (trend === "up") return <TrendingUp className="w-3.5 h-3.5 text-green-500" />;
    if (trend === "down") return <TrendingDown className="w-3.5 h-3.5 text-red-500" />;
    return <Minus className="w-3.5 h-3.5 text-gray-400" />;
}

function AlertSeverityBadge({ severity }) {
    const map = {
        High: "bg-red-100 text-red-700 border-red-200",
        Medium: "bg-amber-100 text-amber-700 border-amber-200",
        Low: "bg-green-100 text-green-700 border-green-200",
    };
    return (
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${map[severity]}`}>
            {severity}
        </span>
    );
}

function WeatherConditionIcon({ condition }) {
    const icons = {
        Sunny: "☀️", "Partly Cloudy": "⛅", Cloudy: "☁️", "Light Rain": "🌦️",
        "Heavy Rain": "🌧️", Thunderstorm: "⛈️", Foggy: "🌫️", Clear: "🌤️",
    };
    return <span className="text-4xl">{icons[condition] || "🌤️"}</span>;
}

export default async function DashboardPage() {
    const session = await auth();
    const weather = generateCurrentWeather();
    const sensors = generateSoilSensors();
    const crops = generateCrops();
    const alerts = generateAlerts();
    const soilHistory = generateSoilHistory(14);

    const userProfile = session?.user?.id
        ? await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                name: true,
                village: true,
                district: true,
                state: true,
                landHolding: true,
                farmerType: true,
            },
        })
        : null;

    const farmer = {
        name: userProfile?.name || session?.user?.name || "Farmer",
        village: userProfile?.village || session?.user?.village || "Village not set",
        district: userProfile?.district || "District not set",
        state: userProfile?.state || session?.user?.state || "State not set",
        landHolding: userProfile?.landHolding || "Land holding not set",
        farmerType: userProfile?.farmerType || session?.user?.farmerType || "Farmer",
    };

    const unreadAlerts = alerts.filter((a) => !a.isRead).length;
    const highAlerts = alerts.filter((a) => a.severity === "High").length;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* ─── Welcome Header ────────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full pulse-green" />
                            <span className="text-xs text-green-600 font-medium">Live Dashboard</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Jai Hind, {farmer.name} 👋
                        </h1>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{farmer.village}, {farmer.district}, {farmer.state}</span>
                            <span className="text-gray-300">·</span>
                            <span>{farmer.landHolding}</span>
                            <span className="text-gray-300">·</span>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{farmer.farmerType}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {unreadAlerts > 0 && (
                            <div className="flex items-center gap-1.5 px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                                <Bell className="w-4 h-4" />
                                {unreadAlerts} new alerts
                            </div>
                        )}
                        <Link
                            href="/advisory"
                            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors"
                        >
                            Get Advisory
                        </Link>
                    </div>
                </div>

                {/* ─── Quick Stats ───────────────────────────────────────────── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        {
                            icon: Leaf,
                            label: "Crops Tracked",
                            value: crops.length,
                            sub: `${crops.filter((c) => c.health >= 75).length} healthy`,
                            color: "green",
                        },
                        {
                            icon: Activity,
                            label: "Soil Sensors",
                            value: sensors.length,
                            sub: "All online",
                            color: "blue",
                        },
                        {
                            icon: AlertTriangle,
                            label: "Active Alerts",
                            value: highAlerts,
                            sub: `${unreadAlerts} unread`,
                            color: highAlerts > 0 ? "red" : "green",
                        },
                        {
                            icon: BarChart3,
                            label: "Avg Crop Health",
                            value: `${Math.round(crops.reduce((s, c) => s + c.health, 0) / crops.length)}%`,
                            sub: "This season",
                            color: "amber",
                        },
                    ].map(({ icon: Icon, label, value, sub, color }) => {
                        const colorMap = {
                            green: "bg-green-100 text-green-700",
                            blue: "bg-blue-100 text-blue-700",
                            red: "bg-red-100 text-red-700",
                            amber: "bg-amber-100 text-amber-700",
                        };
                        return (
                            <div key={label} className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm card-hover">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-gray-500">{label}</span>
                                    <div className={`p-2 rounded-lg ${colorMap[color]}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-gray-900">{value}</div>
                                <div className="text-xs text-gray-400 mt-1">{sub}</div>
                            </div>
                        );
                    })}
                </div>

                {/* ─── Main Grid: Weather + Alerts ───────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

                    {/* Weather Widget */}
                    <div className="lg:col-span-1 bg-linear-to-br from-blue-600 to-blue-500 text-white rounded-2xl p-6 shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="text-xs text-blue-200 mb-1 font-medium uppercase tracking-wider">Current Weather</div>
                                <div className="text-sm text-blue-100 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> {weather.location}
                                </div>
                            </div>
                            <WeatherConditionIcon condition={weather.condition} />
                        </div>

                        <div className="mb-4">
                            <div className="text-6xl font-bold">{weather.temp}°C</div>
                            <div className="text-blue-200 text-sm mt-1">{weather.condition} · Feels {weather.feelsLike}°C</div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {[
                                { icon: Droplets, label: "Humidity", value: `${weather.humidity}%` },
                                { icon: Wind, label: "Wind", value: `${weather.windSpeed} km/h` },
                                { icon: Thermometer, label: "Dew Point", value: `${weather.dewPoint}°C` },
                                { icon: Sun, label: "UV Index", value: weather.uvIndex },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className="flex items-center gap-2">
                                    <Icon className="w-3.5 h-3.5 text-blue-200" />
                                    <div>
                                        <div className="text-[10px] text-blue-300">{label}</div>
                                        <div className="text-sm font-semibold">{value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-blue-400/40 pt-3 flex justify-between text-xs text-blue-200">
                            <span>Rainfall: {weather.rainfall} mm</span>
                            <span>Updated: {weather.lastUpdated}</span>
                        </div>

                        <Link href="/weather" className="mt-3 block text-center text-xs text-blue-100 bg-blue-700/40 hover:bg-blue-700/60 rounded-lg py-2 transition-colors">
                            View 7-Day Forecast →
                        </Link>
                    </div>

                    {/* Alerts Panel */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-green-100 shadow-sm">
                        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-green-50">
                            <div>
                                <h2 className="font-bold text-gray-900">Recent Alerts</h2>
                                <p className="text-xs text-gray-400">{highAlerts} high priority · {unreadAlerts} unread</p>
                            </div>
                            <Link href="/pest-risk" className="text-xs text-green-600 hover:text-green-700 font-medium">
                                View All →
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                            {alerts.slice(0, 6).map((alert) => (
                                <div
                                    key={alert.id}
                                    className={`flex items-start gap-3 px-6 py-3.5 ${!alert.isRead ? "bg-yellow-50/50" : ""}`}
                                >
                                    <span className="text-xl mt-0.5">{alert.icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-xs font-semibold text-gray-700">{alert.type}</span>
                                            <AlertSeverityBadge severity={alert.severity} />
                                            {!alert.isRead && (
                                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 truncate">{alert.message}</p>
                                        <div className="flex items-center gap-1 mt-0.5 text-[10px] text-gray-400">
                                            <Clock className="w-2.5 h-2.5" /> {alert.timestamp}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ─── Soil Sensors ──────────────────────────────────────────── */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">IoT Soil Sensors</h2>
                            <p className="text-sm text-gray-500">Real-time field monitoring · All {sensors.length} sensors active</p>
                        </div>
                        <Link href="/advisory" className="text-sm text-green-600 hover:text-green-700 font-medium">
                            Get Advisory →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {sensors.map((sensor) => (
                            <div key={sensor.id} className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm card-hover">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="font-semibold text-gray-800 text-sm">{sensor.location}</div>
                                        <div className="text-[10px] text-gray-400 font-mono">{sensor.id}</div>
                                    </div>
                                    <SensorSignalBadge signal={sensor.signal} />
                                </div>

                                {/* Moisture */}
                                <div className="mb-3">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-500">Soil Moisture</span>
                                        <span className="font-semibold text-gray-700 flex items-center gap-1">
                                            {sensor.moisture}% <TrendIcon trend={sensor.trend} />
                                        </span>
                                    </div>
                                    <MoistureBar value={sensor.moisture} />
                                    <div className="text-[10px] text-gray-400 mt-0.5">Status: {sensor.moistureStatus}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-y-1.5 text-xs">
                                    {[
                                        { label: "Temp", value: `${sensor.temperature}°C` },
                                        { label: "pH", value: sensor.ph },
                                        { label: "Nitrogen", value: `${sensor.nitrogen} kg/ha` },
                                        { label: "Phosphorus", value: `${sensor.phosphorus} kg/ha` },
                                        { label: "Potassium", value: `${sensor.potassium} kg/ha` },
                                        { label: "EC", value: `${sensor.ec} dS/m` },
                                    ].map(({ label, value }) => (
                                        <div key={label}>
                                            <span className="text-gray-400">{label}: </span>
                                            <span className="text-gray-700 font-medium">{value}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-[10px] text-gray-400">
                                    <span>Depth: {sensor.depth}</span>
                                    <span>🔋 {sensor.battery}% · {sensor.lastReading}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─── Soil History Chart ─────────────────────────────────────── */}
                <div className="bg-white rounded-2xl border border-green-100 p-6 shadow-sm mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="font-bold text-gray-900">Soil Health Trends (14 Days)</h2>
                            <p className="text-xs text-gray-400">Moisture · Nitrogen · pH - averaged across all sensors</p>
                        </div>
                    </div>
                    <SoilHistoryChart data={soilHistory} />
                </div>

                {/* ─── Crops Grid ────────────────────────────────────────────── */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Crop Status</h2>
                            <p className="text-sm text-gray-500">{crops.length} crops monitored this season</p>
                        </div>
                        <Link href="/advisory" className="text-sm text-green-600 hover:text-green-700 font-medium">
                            Full Advisory →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {crops.map((crop) => {
                            const healthColor =
                                crop.health >= 75 ? "text-green-700 bg-green-100" :
                                    crop.health >= 50 ? "text-amber-700 bg-amber-100" :
                                        "text-red-700 bg-red-100";
                            const barColor =
                                crop.health >= 75 ? "bg-green-500" :
                                    crop.health >= 50 ? "bg-amber-500" : "bg-red-400";
                            return (
                                <div key={crop.name} className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm card-hover">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">🌾</span>
                                            <div>
                                                <div className="font-semibold text-gray-900">{crop.name}</div>
                                                <div className="text-xs text-gray-400">{crop.area} · {crop.stage}</div>
                                            </div>
                                        </div>
                                        <div className={`text-sm font-bold px-2.5 py-1 rounded-lg ${healthColor}`}>
                                            {crop.health}%
                                        </div>
                                    </div>

                                    {/* Health bar */}
                                    <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                                        <div className={`${barColor} h-1.5 rounded-full`} style={{ width: `${crop.health}%` }} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-500 mb-3">
                                        <div>Sown: <span className="text-gray-700">{crop.sowingDate}</span></div>
                                        <div>Harvest: <span className="text-gray-700">{crop.expectedHarvest}</span></div>
                                        <div>Yield est.: <span className="text-gray-700">{crop.yield}</span></div>
                                        <div>Water: <span className="text-gray-700">{crop.waterRequired}</span></div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="text-xs flex items-center gap-1 text-gray-500">
                                            <CheckCircle className="w-3 h-3 text-green-500" />
                                            {crop.lastAction}
                                        </div>
                                        <span className="text-xs text-green-600 font-medium">{crop.daysToHarvest}d to harvest</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>

            <Footer />
        </div>
    );
}
