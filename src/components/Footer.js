import { Facebook, Leaf, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";
import Link from "next/link";

const footerLinks = {
    Platform: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Crop Advisory", href: "/advisory" },
        { label: "Weather", href: "/weather" },
        { label: "Pest Risk", href: "/pest-risk" },
        { label: "Market Prices", href: "/market" },
        { label: "Community", href: "/community" },
    ],
    "For Farmers": [
        { label: "Getting Started", href: "#" },
        { label: "SMS Alerts", href: "#" },
        { label: "Voice Advisory", href: "#" },
        { label: "Offline Mode", href: "#" },
        { label: "IoT Sensors", href: "#" },
    ],
    "Government Links": [
        { label: "PM-KISAN", href: "https://pmkisan.gov.in" },
        { label: "eNAM Portal", href: "https://www.enam.gov.in" },
        { label: "Kisan Suvidha", href: "https://kisansuvidha.gov.in" },
        { label: "Soil Health Card", href: "https://soilhealth.dac.gov.in" },
        { label: "Crop Insurance", href: "https://pmfby.gov.in" },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-green-900 text-green-100 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand column */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2.5 mb-4">
                            <div className="p-1.5 bg-green-500 rounded-lg">
                                <Leaf className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="font-bold text-white text-lg">SmartCrop Advisor</span>
                            </div>
                        </Link>
                        <p className="text-green-300 text-sm leading-relaxed mb-4">
                            AI-driven, localized crop advisory & risk-management system for small and marginal
                            farmers. Combining local weather, IoT soil sensors and ML-based pest risk prediction.
                        </p>

                        {/* SDG badges */}
                        <div className="flex gap-2 flex-wrap mb-5">
                            {["SDG 2 Zero Hunger", "SDG 1 No Poverty", "SDG 12 Responsible Production"].map((sdg) => (
                                <span
                                    key={sdg}
                                    className="px-2.5 py-1 bg-green-800 text-green-300 text-xs rounded-full border border-green-700"
                                >
                                    {sdg}
                                </span>
                            ))}
                        </div>

                        {/* Contact */}
                        <div className="space-y-1.5 text-sm text-green-300">
                            <div className="flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-green-500" />
                                <span>Kisan Helpline: 1800-180-1551</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-green-500" />
                                <span>support@smartcrop.in</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-green-500" />
                                <span>New Delhi, India</span>
                            </div>
                        </div>
                    </div>

                    {/* Links columns */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="text-white font-semibold text-sm mb-3">{title}</h4>
                            <ul className="space-y-2">
                                {links.map(({ label, href }) => (
                                    <li key={label}>
                                        <Link
                                            href={href}
                                            className="text-green-300 hover:text-white text-sm transition-colors"
                                            target={href.startsWith("http") ? "_blank" : undefined}
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="border-t border-green-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-green-400 text-xs">
                        © 2025 SmartCrop Advisor - Group KC874 Capstone Project. Built for SIH Agriculture & Rural Development.
                    </p>
                    <div className="flex items-center gap-3">
                        <span className="text-green-500 text-xs">Follow us:</span>
                        {[Twitter, Youtube, Facebook].map((Icon, i) => (
                            <button
                                key={i}
                                className="p-1.5 bg-green-800 text-green-400 hover:text-white hover:bg-green-700 rounded-lg transition-colors"
                            >
                                <Icon className="w-3.5 h-3.5" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
