import {
    BadgeIndianRupee,
    BarChart3,
    Info,
    Minus,
    RefreshCw,
    TrendingDown,
    TrendingUp,
} from "lucide-react";
import { MarketPriceTrendChart } from "@/components/charts/MarketChart";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { generateMarketPrices, generatePriceTrend } from "@/lib/faker-data";

function TrendIcon({ trend }) {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
}

function ChangeCell({ change, pct }) {
    const isPos = change >= 0;
    const color = isPos ? "text-green-600" : "text-red-600";
    return (
        <span className={`font-medium flex items-center gap-1 ${color}`}>
            {isPos ? "+" : ""}₹{Math.abs(change)} ({isPos ? "+" : ""}{pct}%)
        </span>
    );
}

function MSPCompare({ modal, msp }) {
    const diff = modal - msp;
    const pct = ((diff / msp) * 100).toFixed(1);
    const color = diff >= 0 ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50";
    return (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>
            {diff >= 0 ? `+${pct}% above MSP` : `${Math.abs(pct)}% below MSP`}
        </span>
    );
}

export default function MarketPage() {
    const prices = generateMarketPrices();
    const priceTrend = generatePriceTrend("Wheat");

    const topGainer = prices.reduce((a, b) => (parseFloat(a.changePct) > parseFloat(b.changePct) ? a : b));
    const topLoser = prices.reduce((a, b) => (parseFloat(a.changePct) < parseFloat(b.changePct) ? a : b));
    const belowMSP = prices.filter((p) => p.modalPrice < p.msp).length;

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <h1 className="text-2xl font-bold text-gray-900">Live Market Prices</h1>
                        </div>
                        <p className="text-gray-500">Mandi prices from APMC markets across India. Updated daily from eNAM portal.</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 bg-white border border-green-100 rounded-xl px-4 py-2">
                        <RefreshCw className="w-3.5 h-3.5 text-green-500" />
                        Last synced: Today, 6:00 AM
                    </div>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        {
                            label: "Top Gainer",
                            value: topGainer.crop,
                            sub: `+${topGainer.changePct}% today`,
                            icon: TrendingUp,
                            color: "green",
                        },
                        {
                            label: "Top Loser",
                            value: topLoser.crop,
                            sub: `${topLoser.changePct}% today`,
                            icon: TrendingDown,
                            color: "red",
                        },
                        {
                            label: "Crops Below MSP",
                            value: belowMSP,
                            sub: `out of ${prices.length} crops`,
                            icon: Info,
                            color: "amber",
                        },
                        {
                            label: "Crops Listed",
                            value: prices.length,
                            sub: "across 10+ mandis",
                            icon: BarChart3,
                            color: "blue",
                        },
                    ].map(({ label, value, sub, icon: Icon, color }) => {
                        const colorMap = {
                            green: "bg-green-100 text-green-700",
                            red: "bg-red-100 text-red-700",
                            amber: "bg-amber-100 text-amber-700",
                            blue: "bg-blue-100 text-blue-700",
                        };
                        return (
                            <div key={label} className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs text-gray-500">{label}</span>
                                    <div className={`p-1.5 rounded-lg ${colorMap[color]}`}>
                                        <Icon className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                                <div className="text-xl font-bold text-gray-900">{value}</div>
                                <div className="text-xs text-gray-400 mt-1">{sub}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Wheat price trend chart */}
                <div className="bg-white rounded-2xl border border-green-100 p-6 shadow-sm mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="font-bold text-gray-900">Wheat Price Trend (6 Months)</h2>
                            <p className="text-xs text-gray-400">Modal price vs MSP - Amritsar Mandi</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-green-500 inline-block" /> Market Price</span>
                            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-amber-400 border-dashed border-t-2 border-amber-400 inline-block" /> MSP</span>
                        </div>
                    </div>
                    <MarketPriceTrendChart data={priceTrend} msp={2015} />
                </div>

                {/* Price Table */}
                <div className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-green-50 flex items-center justify-between">
                        <h2 className="font-bold text-gray-900">All Crops - Today's Prices</h2>
                        <span className="text-xs text-gray-400">Prices in ₹ per quintal (100 kg)</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-green-50 text-gray-600 text-xs">
                                    <th className="text-left px-6 py-3 font-semibold">Crop</th>
                                    <th className="text-right px-4 py-3 font-semibold">Min Price</th>
                                    <th className="text-right px-4 py-3 font-semibold">Modal Price</th>
                                    <th className="text-right px-4 py-3 font-semibold">Max Price</th>
                                    <th className="text-right px-4 py-3 font-semibold">MSP</th>
                                    <th className="text-right px-4 py-3 font-semibold">Change</th>
                                    <th className="text-left px-4 py-3 font-semibold">Mandi</th>
                                    <th className="text-right px-4 py-3 font-semibold">Arrival Qty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prices.map((row, i) => (
                                    <tr
                                        key={row.crop}
                                        className={`border-t border-gray-50 hover:bg-green-50/50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                                            }`}
                                    >
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">🌾</span>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{row.crop}</div>
                                                    <div className="text-[10px] text-gray-400">{row.lastUpdated}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-right px-4 py-3.5 text-gray-600 font-mono text-xs">
                                            ₹{row.minPrice.toLocaleString("en-IN")}
                                        </td>
                                        <td className="text-right px-4 py-3.5">
                                            <div className="font-bold text-gray-900">₹{row.modalPrice.toLocaleString("en-IN")}</div>
                                            <MSPCompare modal={row.modalPrice} msp={row.msp} />
                                        </td>
                                        <td className="text-right px-4 py-3.5 text-gray-600 font-mono text-xs">
                                            ₹{row.maxPrice.toLocaleString("en-IN")}
                                        </td>
                                        <td className="text-right px-4 py-3.5 text-gray-500 text-xs">
                                            ₹{row.msp.toLocaleString("en-IN")}
                                        </td>
                                        <td className="text-right px-4 py-3.5">
                                            <div className="flex items-center justify-end gap-1">
                                                <TrendIcon trend={row.trend} />
                                                <ChangeCell change={row.change} pct={row.changePct} />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 text-gray-600 text-xs">{row.mandi}</td>
                                        <td className="text-right px-4 py-3.5 text-gray-500 text-xs">{row.arrivalQty}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-6 py-3 bg-amber-50 border-t border-amber-100 flex items-start gap-2">
                        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700">
                            Prices sourced from eNAM portal. MSP (Minimum Support Price) is declared by Government of India.
                            Prices may vary by quality and market arrivals. Contact your local APMC for confirmed rates before selling.
                        </p>
                    </div>
                </div>

                {/* Tips */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        {
                            emoji: "📅",
                            title: "Best Time to Sell",
                            desc: "Generally 4–6 weeks after harvest when immediate-sale pressure drops and prices stabilize at higher levels.",
                        },
                        {
                            emoji: "🏦",
                            title: "Warehouse Receipt Financing",
                            desc: "Store grain in registered warehouses and get 70% advance against your stock at low interest rates.",
                        },
                        {
                            emoji: "📱",
                            title: "eNAM Online Bidding",
                            desc: "Register on eNAM portal to sell directly to buyers nationwide without physical mandi presence.",
                        },
                    ].map(({ emoji, title, desc }) => (
                        <div key={title} className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
                            <div className="text-3xl mb-2">{emoji}</div>
                            <h3 className="font-semibold text-gray-900 text-sm mb-2">{title}</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>

            </div>

            <Footer />
        </div>
    );
}
