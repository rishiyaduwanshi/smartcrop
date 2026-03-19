"use client";

import {
    CalendarClock,
    CheckCircle2,
    CloudRain,
    FlaskConical,
    ShieldAlert,
    Stethoscope,
    TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import DetailPopup from "@/components/ui/DetailPopup";

function RiskBadge({ level, color }) {
    const map = {
        red: "bg-red-100 text-red-700 border-red-200",
        amber: "bg-amber-100 text-amber-700 border-amber-200",
        green: "bg-green-100 text-green-700 border-green-200",
    };
    return (
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${map[color]}`}>
            {level} Risk
        </span>
    );
}

function RiskScoreBar({ score, color }) {
    const barColor = color === "red" ? "bg-red-500" : color === "amber" ? "bg-amber-400" : "bg-green-500";
    return (
        <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
            <div
                className={`${barColor} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${score}%` }}
            />
        </div>
    );
}

const pestInsightLibrary = {
    "Fall Armyworm": {
        diseaseName: "Leaf and Whorl Damage",
        signs: ["Windowing on leaves", "Frass inside whorl", "Shot holes in fresh leaves"],
        detailedSolution: "Direct spray into whorl during evening and re-check infestation after 3 days.",
        preventiveActions: [
            "Install pheromone traps",
            "Destroy egg masses during scouting",
            "Keep field borders weed free",
        ],
    },
    "Brown Plant Hopper": {
        diseaseName: "Hopper Burn",
        signs: ["Yellowing at base", "Dry patches in field", "Hoppers near stem base"],
        detailedSolution: "Drain excess standing water and apply selective systemic control only in hotspot patches.",
        preventiveActions: [
            "Avoid excess nitrogen",
            "Maintain alternate wet and dry irrigation",
            "Conserve natural predators",
        ],
    },
    "Stem Borer": {
        diseaseName: "Dead Heart / White Ear",
        signs: ["Central shoot drying", "White unfilled panicles", "Borer holes on stem"],
        detailedSolution: "Use egg parasitoid release and targeted granule application where incidence crosses ETL.",
        preventiveActions: [
            "Install light traps",
            "Destroy stubble after harvest",
            "Avoid delayed sowing",
        ],
    },
    Aphids: {
        diseaseName: "Sap Sucking Stress",
        signs: ["Leaf curling", "Sticky honeydew", "Sooty mold on leaves"],
        detailedSolution: "Use yellow sticky traps with neem formulation first, then selective insecticide if needed.",
        preventiveActions: [
            "Avoid moisture stress",
            "Prune heavily infested shoots",
            "Do not overuse pyrethroids",
        ],
    },
    Whitefly: {
        diseaseName: "Vector-Borne Viral Pressure",
        signs: ["Leaf yellowing", "Downward curling", "Sticky leaves"],
        detailedSolution: "Focus sprays on lower canopy and rotate chemistry groups to reduce resistance pressure.",
        preventiveActions: [
            "Use reflective mulch in vegetables",
            "Remove alternate host weeds",
            "Install yellow sticky cards",
        ],
    },
    Thrips: {
        diseaseName: "Silvering and Curling Damage",
        signs: ["Leaf silvering", "Flower drop", "Upward leaf curling"],
        detailedSolution: "Spray in early morning with fine coverage and repeat based on field count trends.",
        preventiveActions: [
            "Increase field humidity through irrigation timing",
            "Use blue sticky traps",
            "Keep nursery protected",
        ],
    },
    "Leaf Blight": {
        diseaseName: "Fungal Leaf Blight",
        signs: ["Water-soaked lesions", "Brown elongated spots", "Rapid leaf drying"],
        detailedSolution: "Use preventive fungicide schedule in humid windows and remove heavily infected foliage.",
        preventiveActions: [
            "Improve airflow between rows",
            "Avoid overhead irrigation",
            "Use balanced fertilization",
        ],
    },
    "Powdery Mildew": {
        diseaseName: "Powdery Fungal Infection",
        signs: ["White powdery coating", "Leaf yellowing", "Reduced photosynthesis"],
        detailedSolution: "Spray sulfur-compatible fungicide in low sunlight hours and avoid high-heat sprays.",
        preventiveActions: [
            "Maintain canopy ventilation",
            "Avoid heavy late nitrogen",
            "Remove infected leaves quickly",
        ],
    },
    "Root Rot": {
        diseaseName: "Soil-Borne Root Decline",
        signs: ["Sudden wilting", "Dark root lesions", "Poor nutrient uptake"],
        detailedSolution: "Improve drainage and apply biocontrol plus fungicide drench at root zone.",
        preventiveActions: [
            "Avoid waterlogging",
            "Use treated seed",
            "Practice crop rotation",
        ],
    },
    "Rust Disease": {
        diseaseName: "Rust Fungal Infection",
        signs: ["Orange-brown pustules", "Leaf drying", "Yield drop"],
        detailedSolution: "Spray triazole fungicide at early onset and repeat based on disease progression.",
        preventiveActions: [
            "Use tolerant varieties",
            "Avoid dense canopy",
            "Monitor cool humid periods",
        ],
    },
    "Yellow Mosaic Virus": {
        diseaseName: "Viral Mosaic Stress",
        signs: ["Yellow mosaic patches", "Stunted plants", "Low pod setting"],
        detailedSolution: "Control vector population early and rogue out infected plants immediately.",
        preventiveActions: [
            "Use certified seed",
            "Set sticky traps",
            "Maintain border crop management",
        ],
    },
    "Bacterial Blight": {
        diseaseName: "Bacterial Leaf Blight",
        signs: ["Water-soaked streaks", "Leaf tip burn", "Rapid spread after rain"],
        detailedSolution: "Adopt copper-based control with strict field sanitation and avoid mechanical spread.",
        preventiveActions: [
            "Do not work in wet fields",
            "Use balanced NPK",
            "Maintain seed treatment protocol",
        ],
    },
};

const defaultInsight = {
    diseaseName: "General Pest and Disease Pressure",
    signs: ["Leaf spotting", "Wilting patches", "Abnormal growth"],
    detailedSolution: "Use integrated pest management with threshold-based interventions and expert verification.",
    preventiveActions: [
        "Scout field every 3 days",
        "Rotate control methods",
        "Maintain crop hygiene",
    ],
};

function getPestInsight(pestName) {
    return pestInsightLibrary[pestName] || defaultInsight;
}

export default function PestRiskInteractiveCards({ pestRisks }) {
    const [selectedCrop, setSelectedCrop] = useState("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const selectedRisk = useMemo(() => {
        return pestRisks.find((risk) => risk.crop === selectedCrop) || null;
    }, [pestRisks, selectedCrop]);

    if (!pestRisks.length) {
        return (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-700">
                No pest risk records available right now.
            </div>
        );
    }

    const selectedInsight = selectedRisk ? getPestInsight(selectedRisk.pest) : null;

    const openRiskDetails = (crop) => {
        setSelectedCrop(crop);
        setIsPopupOpen(true);
    };

    const closeRiskDetails = () => {
        setIsPopupOpen(false);
    };

    return (
        <div className="space-y-5">
            <h2 className="text-lg font-bold text-gray-900">Crop-wise Pest Risk Assessment</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {pestRisks.map((pest) => {
                    const isSelected = pest.crop === selectedCrop;

                    return (
                        <button
                            type="button"
                            key={`${pest.crop}-${pest.pest}`}
                            onClick={() => openRiskDetails(pest.crop)}
                            className={`bg-white rounded-2xl border shadow-sm p-6 card-hover text-left transition ${pest.riskLevel === "High"
                                ? "border-red-200"
                                : pest.riskLevel === "Medium"
                                    ? "border-amber-200"
                                    : "border-green-200"
                                } ${isSelected ? "ring-2 ring-amber-200" : "hover:border-amber-300"}`}
                            aria-pressed={isSelected}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${pest.riskLevel === "High"
                                            ? "bg-red-100"
                                            : pest.riskLevel === "Medium"
                                                ? "bg-amber-100"
                                                : "bg-green-100"
                                            }`}
                                    >
                                        {isSelected ? "🎯" : "🐛"}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{pest.crop}</h3>
                                        <p className="text-xs text-gray-500">{pest.pest}</p>
                                    </div>
                                </div>
                                <RiskBadge level={pest.riskLevel} color={pest.riskColor} />
                            </div>

                            <div className="mb-4">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Risk Score</span>
                                    <span className="font-semibold text-gray-700">{pest.riskScore}/100</span>
                                </div>
                                <RiskScoreBar score={pest.riskScore} color={pest.riskColor} />
                            </div>

                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-600 mb-4">
                                <div>
                                    <span className="text-gray-400">Affected area: </span>
                                    <span className="font-medium">{pest.affectedArea}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Spread: </span>
                                    <span className="font-medium">{pest.predictedSpread}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Risk peak: </span>
                                    <span className="font-medium">{pest.nextRiskPeak}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Weather: </span>
                                    <span className="font-medium">{pest.weatherFavorability}</span>
                                </div>
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                                <FlaskConical className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                                <div>
                                    <div className="text-xs font-semibold text-amber-800 mb-0.5">Recommended Treatment</div>
                                    <p className="text-xs text-amber-700">{pest.recommendation}</p>
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-semibold text-amber-700">
                                Tap to view full pest and disease details
                            </div>
                        </button>
                    );
                })}
            </div>

            <DetailPopup
                isOpen={Boolean(isPopupOpen && selectedRisk && selectedInsight)}
                onClose={closeRiskDetails}
                title={selectedRisk ? `${selectedRisk.crop}: ${selectedRisk.pest}` : "Pest details"}
                subtitle="Detailed risk and treatment information for the crop you clicked"
                badge={selectedRisk ? <RiskBadge level={selectedRisk.riskLevel} color={selectedRisk.riskColor} /> : null}
            >
                {selectedRisk && selectedInsight ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                                <div className="flex items-center gap-2 text-red-700 mb-1">
                                    <ShieldAlert className="w-4 h-4" />
                                    <span className="text-xs font-semibold">Disease / Pest Type</span>
                                </div>
                                <p className="text-sm font-semibold text-red-800">{selectedInsight.diseaseName}</p>
                            </div>
                            <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                                <div className="flex items-center gap-2 text-amber-700 mb-1">
                                    <Stethoscope className="w-4 h-4" />
                                    <span className="text-xs font-semibold">Primary Solution</span>
                                </div>
                                <p className="text-sm text-amber-800">{selectedRisk.recommendation}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                            <div className="rounded-xl border border-gray-200 p-4">
                                <div className="text-xs text-gray-500 mb-1">Risk Score</div>
                                <div className="text-2xl font-bold text-gray-900">{selectedRisk.riskScore}/100</div>
                                <RiskScoreBar score={selectedRisk.riskScore} color={selectedRisk.riskColor} />
                            </div>
                            <div className="rounded-xl border border-gray-200 p-4">
                                <div className="text-xs text-gray-500 mb-1">Affected Area</div>
                                <div className="text-sm font-semibold text-gray-800">{selectedRisk.affectedArea}</div>
                            </div>
                            <div className="rounded-xl border border-gray-200 p-4">
                                <div className="text-xs text-gray-500 mb-1">Expected Spread</div>
                                <div className="text-sm font-semibold text-gray-800">{selectedRisk.predictedSpread}</div>
                            </div>
                            <div className="rounded-xl border border-gray-200 p-4">
                                <div className="text-xs text-gray-500 mb-1">Risk Peak</div>
                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                    <CalendarClock className="w-4 h-4 text-amber-500" />
                                    {selectedRisk.nextRiskPeak}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                            <div className="rounded-xl border border-gray-200 p-4">
                                <h4 className="text-xs uppercase tracking-wide text-gray-500 mb-2">Early Signs to Watch</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {selectedInsight.signs.map((sign) => (
                                        <span key={sign} className="text-[11px] px-2 py-1 rounded-full border border-red-200 bg-red-50 text-red-700">
                                            {sign}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="rounded-xl border border-gray-200 p-4">
                                <h4 className="text-xs uppercase tracking-wide text-gray-500 mb-2">Detailed Action Plan</h4>
                                <div className="space-y-2 text-xs text-gray-700">
                                    <p className="flex gap-2">
                                        <FlaskConical className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                                        <span>{selectedInsight.detailedSolution}</span>
                                    </p>
                                    <p className="flex gap-2">
                                        <CloudRain className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                                        <span>Weather effect: {selectedRisk.weatherFavorability}</span>
                                    </p>
                                    <p className="flex gap-2">
                                        <TrendingUp className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                                        <span>Spread alert: {selectedRisk.predictedSpread}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="rounded-xl border border-gray-200 p-4">
                                <h4 className="text-xs uppercase tracking-wide text-gray-500 mb-2">Preventive Checklist</h4>
                                <ul className="space-y-1 text-gray-700">
                                    {selectedInsight.preventiveActions.map((action) => (
                                        <li key={action} className="flex gap-2">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                                            <span className="text-xs">{action}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : null}
            </DetailPopup>
        </div>
    );
}
