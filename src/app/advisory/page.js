import { Leaf, Lightbulb } from "lucide-react";
import AdvisoryInteractiveCards from "@/components/advisory/AdvisoryInteractiveCards";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { generateAdvisory, generateFarmer, generateSoilSensors } from "@/lib/faker-data";

export default function AdvisoryPage() {
    const advisories = generateAdvisory();
    const farmer = generateFarmer();
    const sensors = generateSoilSensors();

    const avgMoisture = (sensors.reduce((s, x) => s + x.moisture, 0) / sensors.length).toFixed(1);
    const avgPH = (sensors.reduce((s, x) => s + x.ph, 0) / sensors.length).toFixed(1);
    const avgN = (sensors.reduce((s, x) => s + x.nitrogen, 0) / sensors.length).toFixed(1);

    const seasons = ["Kharif", "Rabi", "Zaid"];

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-5 h-5 text-green-600" />
                        <h1 className="text-2xl font-bold text-gray-900">AI Crop Advisory</h1>
                    </div>
                    <p className="text-gray-500">
                        Personalized recommendations for {farmer.name} based on your soil sensors, weather data,
                        and historical yield patterns.
                    </p>
                </div>

                {/* Soil Context Bar */}
                <div className="bg-green-700 text-white rounded-2xl p-5 mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                        <div className="text-green-300 text-xs mb-1">Avg Soil Moisture</div>
                        <div className="text-xl font-bold">{avgMoisture}%</div>
                    </div>
                    <div>
                        <div className="text-green-300 text-xs mb-1">Avg Soil pH</div>
                        <div className="text-xl font-bold">{avgPH}</div>
                    </div>
                    <div>
                        <div className="text-green-300 text-xs mb-1">Avg Nitrogen</div>
                        <div className="text-xl font-bold">{avgN} kg/ha</div>
                    </div>
                    <div>
                        <div className="text-green-300 text-xs mb-1">Soil Type</div>
                        <div className="text-xl font-bold">{farmer.soilType}</div>
                    </div>
                </div>

                {/* Season filter tabs */}
                <div className="flex gap-2 mb-6">
                    {["All", ...seasons].map((s) => (
                        <span
                            key={s}
                            className={`px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors ${s === "All"
                                ? "bg-green-600 text-white"
                                : "bg-white border border-green-200 text-gray-600 hover:bg-green-50"
                                }`}
                        >
                            {s}
                        </span>
                    ))}
                </div>

                <AdvisoryInteractiveCards advisories={advisories} />

                {/* Bottom CTA */}
                <div className="mt-10 bg-linear-to-r from-green-700 to-green-600 text-white rounded-2xl p-8 text-center">
                    <Leaf className="w-8 h-8 mx-auto mb-3 text-green-300" />
                    <h3 className="text-xl font-bold mb-2">Need Expert Help?</h3>
                    <p className="text-green-200 text-sm mb-4">
                        Call our Kisan Helpline for personalized advice from an agricultural expert in your language.
                    </p>
                    <a
                        href="tel:18001801551"
                        className="inline-flex items-center gap-2 bg-yellow-400 text-green-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-300 transition-colors"
                    >
                        📞 1800-180-1551 (Toll Free)
                    </a>
                </div>

            </div>

            <Footer />
        </div>
    );
}
