"use client";

import {
    BadgeIndianRupee,
    CheckCircle2,
    Clock3,
    Droplets,
    FlaskConical,
    ShieldAlert,
    Stethoscope,
    Tag,
    TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import DetailPopup from "@/components/ui/DetailPopup";

function ConfidenceBadge({ label, score }) {
    const color =
        label === "High"
            ? "bg-green-100 text-green-700 border-green-200"
            : label === "Medium"
                ? "bg-amber-100 text-amber-700 border-amber-200"
                : "bg-gray-100 text-gray-600 border-gray-200";
    return (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${color}`}>
            {label} confidence ({score}%)
        </span>
    );
}

function PriorityDot({ priority }) {
    const map = {
        High: "bg-red-500",
        Medium: "bg-amber-400",
        Low: "bg-gray-300",
    };
    return <span className={`inline-block w-2 h-2 rounded-full ${map[priority]}`} />;
}

const cropInsightLibrary = {
    Wheat: {
        disease: "Rust Disease",
        symptoms: ["Orange powder on leaves", "Early leaf drying", "Reduced grain filling"],
        solution: "Spray Propiconazole 25 EC @ 1 ml/L water and repeat after 10 days if needed.",
        prevention: [
            "Avoid excess nitrogen top dressing",
            "Maintain wider row spacing for airflow",
            "Remove severely infected leaves",
        ],
        monitoringWindow: "Inspect lower and middle canopy every 3 days in cool-humid weather.",
    },
    Rice: {
        disease: "Brown Plant Hopper / Blast",
        symptoms: ["Hopper burn patches", "Lesions on leaves", "Sudden yellowing in patches"],
        solution: "Use Neem-based spray first, then targeted Imidacloprid only where hopper count crosses threshold.",
        prevention: [
            "Avoid standing water for long periods",
            "Use light traps at field edges",
            "Do not overuse broad-spectrum insecticide",
        ],
        monitoringWindow: "Scout 10 random hills per acre every 2-3 days.",
    },
    Maize: {
        disease: "Fall Armyworm",
        symptoms: ["Window-pane damage on leaves", "Frass in whorl", "Shot holes in emerging leaves"],
        solution: "Apply Emamectin Benzoate at recommended dose in whorl and monitor damage after 72 hours.",
        prevention: [
            "Install pheromone traps",
            "Destroy egg masses early morning",
            "Maintain weed-free bunds",
        ],
        monitoringWindow: "Check whorl stage plants every 2 days for first 30 days.",
    },
    Cotton: {
        disease: "Whitefly and Leaf Curl Complex",
        symptoms: ["Leaf curling", "Honeydew and sooty mold", "Stunted growth"],
        solution: "Rotate selective insecticides and spray in evening with proper droplet coverage under leaves.",
        prevention: [
            "Use yellow sticky traps",
            "Avoid continuous cotton cropping",
            "Remove alternate host weeds",
        ],
        monitoringWindow: "Monitor underside of top 3 leaves twice weekly.",
    },
    Tomato: {
        disease: "Early Blight / Leaf Spot",
        symptoms: ["Concentric spots", "Lower leaf yellowing", "Defoliation"],
        solution: "Spray Mancozeb 75 WP @ 2.5 g/L water and remove heavily infected foliage.",
        prevention: [
            "Use drip instead of overhead irrigation",
            "Improve field drainage",
            "Follow 2-3 year crop rotation",
        ],
        monitoringWindow: "Inspect lower canopy every 2 days after rainfall.",
    },
    Potato: {
        disease: "Late Blight",
        symptoms: ["Water-soaked lesions", "White fungal growth underside", "Rapid foliage collapse"],
        solution: "Start preventive fungicide schedule immediately and keep spray interval tight during wet spells.",
        prevention: [
            "Avoid evening irrigation",
            "Use disease-free seed tubers",
            "Remove volunteer plants",
        ],
        monitoringWindow: "Daily scouting during consecutive cloudy or wet days.",
    },
};

const defaultInsight = {
    disease: "General Fungal and Pest Pressure",
    symptoms: ["Leaf discoloration", "Patchy growth", "Unexpected wilting"],
    solution: "Follow crop-specific integrated pest and nutrient plan and verify with local extension worker.",
    prevention: [
        "Maintain crop hygiene",
        "Use threshold-based spray decision",
        "Record weekly crop observations",
    ],
    monitoringWindow: "Scout at least twice a week and after every major weather event.",
};

function getCropInsight(crop) {
    return cropInsightLibrary[crop] || defaultInsight;
}

export default function AdvisoryInteractiveCards({ advisories }) {
    const [selectedCrop, setSelectedCrop] = useState("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const selectedAdvisory = useMemo(() => {
        return advisories.find((advisory) => advisory.crop === selectedCrop) || null;
    }, [advisories, selectedCrop]);

    if (!advisories.length) {
        return (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-sm text-green-700">
                No advisory records available right now.
            </div>
        );
    }

    const selectedInsight = selectedAdvisory ? getCropInsight(selectedAdvisory.crop) : null;

    const openCropDetails = (crop) => {
        setSelectedCrop(crop);
        setIsPopupOpen(true);
    };

    const closeCropDetails = () => {
        setIsPopupOpen(false);
    };

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {advisories.map((advisory) => {
                    const isSelected = advisory.crop === selectedCrop;

                    return (
                        <button
                            type="button"
                            key={advisory.crop}
                            onClick={() => openCropDetails(advisory.crop)}
                            className={`bg-white rounded-2xl border shadow-sm p-6 card-hover text-left transition ${isSelected
                                ? "border-green-400 ring-2 ring-green-200"
                                : "border-green-100 hover:border-green-300"
                                }`}
                            aria-pressed={isSelected}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                                        {isSelected ? "✅" : "🌾"}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-gray-900 text-lg">{advisory.crop}</h3>
                                            <PriorityDot priority={advisory.priority} />
                                            <span className="text-xs text-gray-400">{advisory.priority} priority</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <ConfidenceBadge label={advisory.confidenceLabel} score={advisory.confidence} />
                                            <span className="text-xs text-gray-400">{advisory.season}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-2xl font-bold text-green-700">{advisory.confidence}%</div>
                                    <div className="text-[10px] text-gray-400">ML confidence</div>
                                </div>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                                    <p className="text-sm font-medium text-green-800">{advisory.recommendedAction}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Droplets className="w-3.5 h-3.5 text-blue-500" />
                                    <div>
                                        <div className="text-[10px] text-gray-400">Water Need</div>
                                        <div className="font-medium">{advisory.waterRequirement}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <FlaskConical className="w-3.5 h-3.5 text-purple-500" />
                                    <div>
                                        <div className="text-[10px] text-gray-400">Fertilizer Dose</div>
                                        <div className="font-medium">{advisory.fertilizerDose}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                                    <div>
                                        <div className="text-[10px] text-gray-400">Expected Yield</div>
                                        <div className="font-medium">{advisory.expectedYield}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <BadgeIndianRupee className="w-3.5 h-3.5 text-amber-500" />
                                    <div>
                                        <div className="text-[10px] text-gray-400">Est. Profit Margin</div>
                                        <div className="font-medium">INR {advisory.profitMargin.toLocaleString("en-IN")}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 flex-wrap mb-3">
                                <span className="text-[10px] text-gray-400 mr-1">Based on:</span>
                                {advisory.basis.map((basis) => (
                                    <span key={`${advisory.crop}-${basis}`} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                                        {basis}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center gap-1.5 flex-wrap">
                                <Tag className="w-3 h-3 text-gray-400" />
                                {advisory.tags.map((tag) => (
                                    <span key={`${advisory.crop}-${tag}`} className="text-[10px] px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-semibold text-green-700">
                                Tap to view full disease and solution details
                            </div>
                        </button>
                    );
                })}
            </div>

            <DetailPopup
                isOpen={Boolean(isPopupOpen && selectedAdvisory && selectedInsight)}
                onClose={closeCropDetails}
                title={selectedAdvisory ? `${selectedAdvisory.crop} Disease & Solution` : "Crop details"}
                subtitle="Detailed advisory for the crop you clicked"
                badge={selectedAdvisory ? (
                    <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
                        {selectedAdvisory.priority} priority
                    </span>
                ) : null}
            >
                {selectedAdvisory && selectedInsight ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                                <div className="flex items-center gap-2 text-red-700 mb-1">
                                    <ShieldAlert className="w-4 h-4" />
                                    <span className="text-xs font-semibold">Likely Disease / Threat</span>
                                </div>
                                <p className="text-sm font-semibold text-red-800">{selectedInsight.disease}</p>
                            </div>
                            <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                                <div className="flex items-center gap-2 text-green-700 mb-1">
                                    <Stethoscope className="w-4 h-4" />
                                    <span className="text-xs font-semibold">Recommended Solution</span>
                                </div>
                                <p className="text-sm text-green-800">{selectedInsight.solution}</p>
                            </div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                                <p className="text-sm font-medium text-green-800">{selectedAdvisory.recommendedAction}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                            <div className="flex items-center gap-2 text-gray-600 rounded-xl border border-gray-200 p-3">
                                <Droplets className="w-3.5 h-3.5 text-blue-500" />
                                <div>
                                    <div className="text-[10px] text-gray-400">Water Need</div>
                                    <div className="font-medium">{selectedAdvisory.waterRequirement}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 rounded-xl border border-gray-200 p-3">
                                <FlaskConical className="w-3.5 h-3.5 text-purple-500" />
                                <div>
                                    <div className="text-[10px] text-gray-400">Fertilizer Dose</div>
                                    <div className="font-medium">{selectedAdvisory.fertilizerDose}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 rounded-xl border border-gray-200 p-3">
                                <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                                <div>
                                    <div className="text-[10px] text-gray-400">Expected Yield</div>
                                    <div className="font-medium">{selectedAdvisory.expectedYield}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 rounded-xl border border-gray-200 p-3">
                                <BadgeIndianRupee className="w-3.5 h-3.5 text-amber-500" />
                                <div>
                                    <div className="text-[10px] text-gray-400">Est. Profit Margin</div>
                                    <div className="font-medium">INR {selectedAdvisory.profitMargin.toLocaleString("en-IN")}</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                            <div className="rounded-xl border border-gray-200 p-4">
                                <h4 className="text-xs uppercase tracking-wide text-gray-500 mb-2">Early Symptoms</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {selectedInsight.symptoms.map((symptom) => (
                                        <span key={symptom} className="text-[11px] px-2 py-1 rounded-full border border-red-200 bg-red-50 text-red-700">
                                            {symptom}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="rounded-xl border border-gray-200 p-4">
                                <h4 className="text-xs uppercase tracking-wide text-gray-500 mb-2">Prevention Steps</h4>
                                <ul className="space-y-1 text-gray-700">
                                    {selectedInsight.prevention.map((step) => (
                                        <li key={step} className="flex gap-2">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                                            <span className="text-xs">{step}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="rounded-xl border border-gray-200 p-4">
                                <h4 className="text-xs uppercase tracking-wide text-gray-500 mb-2">Monitoring Window</h4>
                                <div className="flex gap-2 text-gray-700">
                                    <Clock3 className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                    <p className="text-xs">{selectedInsight.monitoringWindow}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </DetailPopup>
        </div>
    );
}
