import { faker } from "@faker-js/faker";

const CROPS = [
    "Wheat",
    "Rice",
    "Maize",
    "Cotton",
    "Sugarcane",
    "Soybean",
    "Mustard",
    "Chickpea",
    "Tomato",
    "Onion",
    "Potato",
    "Groundnut",
    "Sunflower",
    "Bajra",
    "Jowar",
];

const STATES = [
    "Maharashtra",
    "Punjab",
    "Haryana",
    "Uttar Pradesh",
    "Madhya Pradesh",
    "Rajasthan",
    "Gujarat",
    "Karnataka",
    "Andhra Pradesh",
    "Telangana",
];

const PESTS = [
    "Fall Armyworm",
    "Brown Plant Hopper",
    "Stem Borer",
    "Aphids",
    "Whitefly",
    "Thrips",
    "Leaf Blight",
    "Powdery Mildew",
    "Root Rot",
    "Rust Disease",
    "Yellow Mosaic Virus",
    "Bacterial Blight",
];

const WEATHER_CONDITIONS = [
    "Sunny",
    "Partly Cloudy",
    "Cloudy",
    "Light Rain",
    "Heavy Rain",
    "Thunderstorm",
    "Foggy",
    "Clear",
];

const GROWTH_STAGES = [
    "Germination",
    "Seedling",
    "Vegetative",
    "Flowering",
    "Fruiting",
    "Maturity",
    "Harvest Ready",
];

// ─── Farmer Profile ───────────────────────────────────────────────────────────
export function generateFarmer() {
    const firstNames = [
        "Ramesh",
        "Suresh",
        "Mahesh",
        "Dinesh",
        "Rajesh",
        "Lokesh",
        "Ganesh",
        "Harish",
        "Naresh",
        "Mukesh",
    ];
    const lastNames = [
        "Patel",
        "Sharma",
        "Yadav",
        "Singh",
        "Verma",
        "Gupta",
        "Chaudhary",
        "Tiwari",
        "Mishra",
        "Jha",
    ];
    return {
        name: `${faker.helpers.arrayElement(firstNames)} ${faker.helpers.arrayElement(lastNames)}`,
        village: faker.location.city(),
        district: faker.location.city(),
        state: faker.helpers.arrayElement(STATES),
        landHolding: `${faker.number.float({ min: 0.5, max: 5, fractionDigits: 1 })} acres`,
        farmerType: faker.helpers.arrayElement([
            "Small Farmer",
            "Marginal Farmer",
            "Semi-Medium Farmer",
        ]),
        phone: `+91 ${faker.string.numeric(5)}-${faker.string.numeric(5)}`,
        farmerId: `SC-${faker.string.alphanumeric(8).toUpperCase()}`,
        memberSince: faker.date.past({ years: 3 }).getFullYear(),
        crops: faker.helpers.arrayElements(CROPS, { min: 2, max: 4 }),
        soilType: faker.helpers.arrayElement([
            "Black Cotton",
            "Red Loamy",
            "Alluvial",
            "Sandy Loam",
            "Clay",
            "Laterite",
        ]),
        irrigationType: faker.helpers.arrayElement([
            "Drip Irrigation",
            "Sprinkler",
            "Canal",
            "Borewell",
            "Rainwater",
        ]),
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${faker.string.alphanumeric(6)}`,
    };
}

// ─── Current Weather ───────────────────────────────────────────────────────────
export function generateCurrentWeather() {
    const condition = faker.helpers.arrayElement(WEATHER_CONDITIONS);
    return {
        temp: faker.number.int({ min: 18, max: 42 }),
        feelsLike: faker.number.int({ min: 16, max: 45 }),
        humidity: faker.number.int({ min: 30, max: 95 }),
        windSpeed: faker.number.float({ min: 2, max: 35, fractionDigits: 1 }),
        windDir: faker.helpers.arrayElement([
            "N",
            "NE",
            "E",
            "SE",
            "S",
            "SW",
            "W",
            "NW",
        ]),
        rainfall: faker.number.float({ min: 0, max: 20, fractionDigits: 1 }),
        uvIndex: faker.number.int({ min: 1, max: 11 }),
        pressure: faker.number.int({ min: 995, max: 1025 }),
        visibility: faker.number.float({ min: 2, max: 15, fractionDigits: 1 }),
        dewPoint: faker.number.int({ min: 10, max: 28 }),
        condition,
        location: `${faker.location.city()}, ${faker.helpers.arrayElement(STATES)}`,
        lastUpdated: new Date().toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        }),
        cloudCover: faker.number.int({ min: 0, max: 100 }),
        aqiIndex: faker.number.int({ min: 30, max: 200 }),
        aqiLabel: faker.helpers.arrayElement([
            "Good",
            "Moderate",
            "Satisfactory",
        ]),
    };
}

// ─── 7-Day Weather Forecast ──────────────────────────────────────────────────
export function generateWeatherForecast(days = 7) {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    return Array.from({ length: days }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        return {
            day: i === 0 ? "Today" : i === 1 ? "Tomorrow" : dayNames[d.getDay()],
            date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
            condition: faker.helpers.arrayElement(WEATHER_CONDITIONS),
            high: faker.number.int({ min: 26, max: 42 }),
            low: faker.number.int({ min: 14, max: 26 }),
            humidity: faker.number.int({ min: 30, max: 90 }),
            rainfall: faker.number.float({ min: 0, max: 30, fractionDigits: 1 }),
            windSpeed: faker.number.float({ min: 5, max: 30, fractionDigits: 1 }),
            chanceOfRain: faker.number.int({ min: 0, max: 100 }),
            farmingAdvice: faker.helpers.arrayElement([
                "Good day for spraying fertilizer",
                "Avoid irrigation today",
                "Ideal for harvesting",
                "Stay indoors during peak hours",
                "Check crop for moisture stress",
                "Good conditions for field work",
                "Postpone pesticide application",
            ]),
        };
    });
}

// ─── Hourly Weather (24 hrs) ─────────────────────────────────────────────────
export function generateHourlyWeather() {
    return Array.from({ length: 24 }, (_, i) => ({
        hour: `${String(i).padStart(2, "0")}:00`,
        temp: faker.number.int({ min: 18, max: 42 }),
        humidity: faker.number.int({ min: 30, max: 90 }),
        rainfall: faker.number.float({ min: 0, max: 5, fractionDigits: 1 }),
        windSpeed: faker.number.float({ min: 2, max: 25, fractionDigits: 1 }),
    }));
}

// ─── Soil Sensors (IoT) ──────────────────────────────────────────────────────
export function generateSoilSensors() {
    const locations = ["North Field", "South Field", "East Field", "West Field"];
    return locations.map((loc, i) => ({
        id: `SENSOR-${String(i + 1).padStart(3, "0")}`,
        location: loc,
        moisture: faker.number.float({ min: 15, max: 85, fractionDigits: 1 }),
        moistureStatus: faker.helpers.arrayElement(["Optimal", "Low", "High", "Critical"]),
        temperature: faker.number.float({ min: 20, max: 38, fractionDigits: 1 }),
        ph: faker.number.float({ min: 5.5, max: 8.5, fractionDigits: 1 }),
        nitrogen: faker.number.float({ min: 10, max: 80, fractionDigits: 1 }),
        phosphorus: faker.number.float({ min: 5, max: 60, fractionDigits: 1 }),
        potassium: faker.number.float({ min: 50, max: 250, fractionDigits: 1 }),
        ec: faker.number.float({ min: 0.1, max: 2.5, fractionDigits: 2 }),
        om: faker.number.float({ min: 0.3, max: 3.5, fractionDigits: 1 }),
        depth: faker.helpers.arrayElement(["0–15 cm", "15–30 cm", "30–60 cm"]),
        battery: faker.number.int({ min: 20, max: 100 }),
        signal: faker.helpers.arrayElement(["Strong", "Moderate", "Weak"]),
        lastReading: `${faker.number.int({ min: 1, max: 59 })} min ago`,
        trend: faker.helpers.arrayElement(["up", "down", "stable"]),
    }));
}

// ─── Soil History (for chart) ─────────────────────────────────────────────────
export function generateSoilHistory(days = 14) {
    const today = new Date();
    return Array.from({ length: days }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (days - 1 - i));
        return {
            date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
            moisture: faker.number.float({ min: 20, max: 80, fractionDigits: 1 }),
            nitrogen: faker.number.float({ min: 15, max: 75, fractionDigits: 1 }),
            ph: faker.number.float({ min: 5.8, max: 8.2, fractionDigits: 1 }),
        };
    });
}

// ─── Crops Health Data ────────────────────────────────────────────────────────
export function generateCrops() {
    return faker.helpers.arrayElements(CROPS, { min: 4, max: 6 }).map((crop) => ({
        name: crop,
        stage: faker.helpers.arrayElement(GROWTH_STAGES),
        health: faker.number.int({ min: 45, max: 98 }),
        healthLabel: faker.helpers.arrayElement(["Excellent", "Good", "Fair", "Poor"]),
        area: `${faker.number.float({ min: 0.25, max: 2.5, fractionDigits: 2 })} acres`,
        sowingDate: faker.date.recent({ days: 90 }).toLocaleDateString("en-IN"),
        expectedHarvest: faker.date.future({ years: 0.5 }).toLocaleDateString("en-IN"),
        yield: `${faker.number.float({ min: 10, max: 45, fractionDigits: 1 })} qtl/acre`,
        waterRequired: faker.helpers.arrayElement(["Low", "Medium", "High"]),
        lastAction: faker.helpers.arrayElement([
            "Fertilizer applied",
            "Irrigation done",
            "Pesticide sprayed",
            "Weeding completed",
            "Soil test done",
        ]),
        daysToHarvest: faker.number.int({ min: 5, max: 120 }),
        color: faker.helpers.arrayElement([
            "bg-green-100 text-green-800",
            "bg-amber-100 text-amber-800",
            "bg-blue-100 text-blue-800",
            "bg-purple-100 text-purple-800",
        ]),
    }));
}

// ─── Alerts ──────────────────────────────────────────────────────────────────
export function generateAlerts() {
    const alertTypes = [
        {
            type: "Pest",
            icon: "🐛",
            color: "red",
            messages: [
                "Fall Armyworm spotted in Maize - spray chlorpyrifos immediately",
                "Aphid infestation detected in Wheat field",
                "Brown Plant Hopper alert for Rice crops",
            ],
        },
        {
            type: "Weather",
            icon: "🌧️",
            color: "blue",
            messages: [
                "Heavy rainfall expected in next 24 hours - avoid spraying",
                "Cyclone warning for coastal districts - secure crops",
                "Cold wave approaching - protect nursery seedlings",
            ],
        },
        {
            type: "Soil",
            icon: "🌱",
            color: "amber",
            messages: [
                "Nitrogen deficiency detected in North Field sensor",
                "Soil moisture critically low - irrigate immediately",
                "pH imbalance in East Field - lime application recommended",
            ],
        },
        {
            type: "Market",
            icon: "📈",
            color: "green",
            messages: [
                "Wheat price rose 8% at Amritsar mandi today",
                "Onion prices at 5-year high - good time to sell",
                "Cotton MSP increased by ₹250/qtl this season",
            ],
        },
        {
            type: "Advisory",
            icon: "💡",
            color: "purple",
            messages: [
                "Optimal sowing window for Rabi crops starts in 10 days",
                "Schedule irrigation for Sugarcane before weekend",
                "Apply second dose of urea to Paddy crop now",
            ],
        },
    ];

    return Array.from({ length: 8 }, (_, i) => {
        const alertGroup = faker.helpers.arrayElement(alertTypes);
        return {
            id: i + 1,
            type: alertGroup.type,
            icon: alertGroup.icon,
            color: alertGroup.color,
            severity: faker.helpers.arrayElement(["High", "Medium", "Low"]),
            message: faker.helpers.arrayElement(alertGroup.messages),
            timestamp: faker.date.recent({ days: 2 }).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
            }),
            isRead: faker.datatype.boolean(),
        };
    });
}

// ─── Pest Risks ───────────────────────────────────────────────────────────────
export function generatePestRisks() {
    return faker.helpers.arrayElements(CROPS, { min: 6, max: 8 }).map((crop) => {
        const riskScore = faker.number.int({ min: 5, max: 95 });
        return {
            crop,
            pest: faker.helpers.arrayElement(PESTS),
            riskScore,
            riskLevel:
                riskScore >= 70 ? "High" : riskScore >= 40 ? "Medium" : "Low",
            riskColor:
                riskScore >= 70
                    ? "red"
                    : riskScore >= 40
                        ? "amber"
                        : "green",
            affectedArea: `${faker.number.float({ min: 5, max: 85, fractionDigits: 0 })}% of field`,
            predictedSpread: faker.helpers.arrayElement([
                "Contained",
                "Spreading slowly",
                "Rapid spread expected",
            ]),
            recommendation: faker.helpers.arrayElement([
                "Apply Chlorpyrifos 20 EC @ 2ml/L water",
                "Use Neem-based spray (5%), spray at dusk",
                "Apply Carbendazim 50 WP @ 1g/L water",
                "Introduce natural predators (ladybirds)",
                "Fumigate with Phostoxin tablets",
                "Uproot and burn infected plants",
                "Apply Trichoderma viride to soil",
                "Spray Mancozeb 75 WP @ 2.5g/L water",
            ]),
            nextRiskPeak: faker.date.soon({ days: 14 }).toLocaleDateString("en-IN"),
            weatherFavorability: faker.helpers.arrayElement([
                "High (wet weather)",
                "Medium",
                "Low (dry)",
            ]),
        };
    });
}

// ─── Pest Risk History (for chart) ────────────────────────────────────────────
export function generatePestRiskHistory() {
    const weeks = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];
    return weeks.map((week) => ({
        week,
        wheat: faker.number.int({ min: 10, max: 80 }),
        rice: faker.number.int({ min: 10, max: 80 }),
        maize: faker.number.int({ min: 10, max: 80 }),
        cotton: faker.number.int({ min: 10, max: 80 }),
    }));
}

// ─── Market Prices ────────────────────────────────────────────────────────────
export function generateMarketPrices() {
    const mandis = [
        "Amritsar",
        "Nagpur",
        "Indore",
        "Hyderabad",
        "Pune",
        "Ahmedabad",
        "Lucknow",
        "Jaipur",
        "Bhopal",
        "Chandigarh",
    ];

    return CROPS.slice(0, 12).map((crop) => {
        const msp = faker.number.int({ min: 1200, max: 6500 });
        const modalPrice = msp + faker.number.int({ min: -300, max: 800 });
        const prevPrice = modalPrice + faker.number.int({ min: -200, max: 200 });
        const change = modalPrice - prevPrice;
        return {
            crop,
            msp,
            modalPrice,
            minPrice: modalPrice - faker.number.int({ min: 50, max: 300 }),
            maxPrice: modalPrice + faker.number.int({ min: 50, max: 400 }),
            prevPrice,
            change,
            changePct: ((change / prevPrice) * 100).toFixed(2),
            trend: change > 0 ? "up" : change < 0 ? "down" : "stable",
            mandi: faker.helpers.arrayElement(mandis),
            arrivalQty: `${faker.number.int({ min: 100, max: 15000 })} qtl`,
            unit: "per qtl",
            lastUpdated: faker.date.recent({ days: 1 }).toLocaleDateString("en-IN"),
        };
    });
}

// ─── Market Price Trend (for chart) ───────────────────────────────────────────
export function generatePriceTrend(crop = "Wheat") {
    const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];
    return months.map((month) => ({
        month,
        price: faker.number.int({ min: 1800, max: 2800 }),
        msp: 2015,
    }));
}

// ─── Crop Advisory ────────────────────────────────────────────────────────────
export function generateAdvisory() {
    return faker.helpers.arrayElements(CROPS, { min: 5, max: 8 }).map((crop) => {
        const confidence = faker.number.int({ min: 60, max: 97 });
        return {
            crop,
            recommendedAction: faker.helpers.arrayElement([
                "Sow now - soil moisture and temperature are optimal",
                "Apply top dressing of 25 kg/acre urea within 5 days",
                "Irrigate at 80% depletion - check soil sensors",
                "Schedule harvest in 7–10 days for maximum yield",
                "Apply potash fertilizer to boost grain filling",
                "Foliar spray of micronutrients recommended this week",
                "Reduce watering frequency - rains expected",
                "Thin seedlings to 15 cm spacing for better yield",
            ]),
            confidence,
            confidenceLabel:
                confidence >= 80 ? "High" : confidence >= 65 ? "Medium" : "Low",
            basis: faker.helpers.arrayElements(
                ["Weather data", "Soil sensors", "Historical data", "ML model", "Pest risk analysis", "Market trends"],
                { min: 2, max: 4 }
            ),
            season: faker.helpers.arrayElement(["Kharif", "Rabi", "Zaid"]),
            waterRequirement: faker.helpers.arrayElement([
                "180–220 mm",
                "350–450 mm",
                "550–650 mm",
                "800–1000 mm",
            ]),
            fertilizerDose: `${faker.number.int({ min: 50, max: 180 })}:${faker.number.int({ min: 20, max: 80 })}:${faker.number.int({ min: 20, max: 60 })} NPK kg/ha`,
            expectedYield: `${faker.number.float({ min: 15, max: 50, fractionDigits: 1 })} qtl/acre`,
            profitMargin: faker.number.int({ min: 8000, max: 45000 }),
            priority: faker.helpers.arrayElement(["High", "Medium", "Low"]),
            tags: faker.helpers.arrayElements(
                ["Drought Tolerant", "High Yield", "Short Duration", "Organic Friendly", "Export Quality", "Disease Resistant"],
                { min: 2, max: 3 }
            ),
        };
    });
}

// ─── Community Posts ──────────────────────────────────────────────────────────
export function generateCommunityPosts() {
    const firstNames = ["Ramesh", "Suresh", "Priya", "Kavita", "Mahesh", "Dinesh", "Sunita", "Rajesh", "Anita", "Lokesh"];
    const lastNames = ["Patel", "Sharma", "Yadav", "Singh", "Verma", "Devi", "Gupta", "Tiwari"];

    const topics = [
        {
            title: "Best time to sow Wheat in Punjab this year?",
            body: "Soil temperature is around 22°C in my field. Is it the right time to start sowing? I have 2 acres of sandy loam soil.",
            tags: ["Wheat", "Sowing", "Punjab"],
        },
        {
            title: "Yellow leaves on Rice crop - what's wrong?",
            body: "My rice plants are showing yellowing from the tips. Applied urea last week but no improvement. Soil test shows normal NPK. Help!",
            tags: ["Rice", "Nutrient Deficiency", "Help"],
        },
        {
            title: "Drip irrigation setup for ₹15,000 per acre - is it worth it?",
            body: "Thinking of setting up drip irrigation. My district has 40% water level. Government subsidy available? Anyone with experience?",
            tags: ["Irrigation", "Subsidy", "Water Conservation"],
        },
        {
            title: "Cotton crop price dropped - when to sell?",
            body: "Current cotton price in my mandi is ₹6,200/qtl but MSP is ₹7,020. Should I wait or sell now? Stored for 4 weeks.",
            tags: ["Cotton", "Market Price", "Storage"],
        },
        {
            title: "Intercropping Maize with Soybean - sharing results",
            body: "Started intercropping 6 months ago. 40% increase in income from same land! Sharing detailed report. AMA.",
            tags: ["Intercropping", "Maize", "Soybean", "Success Story"],
        },
        {
            title: "Free soil testing camps in Maharashtra - details inside",
            body: "Agriculture department running free soil testing from 15-25 Feb. Contact your local Krishi Vigyan Kendra. Sharing district list.",
            tags: ["Soil Testing", "Maharashtra", "Government Scheme"],
        },
        {
            title: "Organic certification process - step by step guide",
            body: "Got PGS-India certification last month. Documenting my 2-year journey. Happy to help others. DM for documents.",
            tags: ["Organic Farming", "Certification", "PGS-India"],
        },
        {
            title: "Pest outbreak in Chilli crop - urgent help needed",
            body: "Yellow spots on leaves, small insects visible around 8 am. Spreading to neighboring rows. 1.5 acres affected. What spray?",
            tags: ["Chilli", "Pest", "Urgent"],
        },
    ];

    return topics.map((topic, i) => ({
        id: i + 1,
        author: `${faker.helpers.arrayElement(firstNames)} ${faker.helpers.arrayElement(lastNames)}`,
        authorState: faker.helpers.arrayElement(STATES),
        authorType: faker.helpers.arrayElement(["Small Farmer", "Marginal Farmer", "Agricultural Expert", "KVK Officer"]),
        title: topic.title,
        body: topic.body,
        tags: topic.tags,
        likes: faker.number.int({ min: 5, max: 245 }),
        comments: faker.number.int({ min: 2, max: 67 }),
        views: faker.number.int({ min: 50, max: 1500 }),
        timeAgo: faker.helpers.arrayElement([
            "2 hours ago",
            "5 hours ago",
            "1 day ago",
            "2 days ago",
            "3 days ago",
            "1 week ago",
        ]),
        isAnswered: faker.datatype.boolean(),
        isVerified: faker.helpers.arrayElement([true, false, false]),
        upvotes: faker.number.int({ min: 0, max: 120 }),
    }));
}

// ─── Platform Stats (for landing) ────────────────────────────────────────────
export function generatePlatformStats() {
    return {
        farmers: faker.number.int({ min: 85000, max: 125000 }),
        villages: faker.number.int({ min: 3200, max: 5800 }),
        cropsMonitored: faker.number.int({ min: 18, max: 24 }),
        accuracyPct: faker.number.float({ min: 90.5, max: 96.8, fractionDigits: 1 }),
        alertsSent: faker.number.int({ min: 420000, max: 680000 }),
        statesCovered: faker.number.int({ min: 16, max: 22 }),
        avgIncrease: faker.number.float({ min: 24, max: 38, fractionDigits: 1 }),
        iotSensors: faker.number.int({ min: 12000, max: 18000 }),
    };
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
export function generateTestimonials() {
    const people = [
        {
            name: "Ramesh Patel",
            state: "Gujarat",
            crop: "Cotton",
            quote:
                "SmartCrop alerts saved my entire cotton crop from bollworm. Got early warning 3 days before outbreak. Income increased by ₹40,000 this year!",
            increase: "35%",
        },
        {
            name: "Sunita Yadav",
            state: "Madhya Pradesh",
            crop: "Soybean",
            quote:
                "The weather forecasts are incredibly accurate. I saved ₹8,000 by not spraying pesticides before rain - which the platform predicted correctly.",
            increase: "28%",
        },
        {
            name: "Harish Singh",
            state: "Punjab",
            crop: "Wheat",
            quote:
                "IoT soil sensors in Hindi interface! Finally a solution that respects our language. Market price alerts helped me sell at peak season price.",
            increase: "42%",
        },
        {
            name: "Kavita Devi",
            state: "Uttar Pradesh",
            crop: "Sugarcane",
            quote:
                "As a woman farmer, this platform gives me confidence. The voice advisory in my local dialect is a game changer. No smartphone needed for basic alerts.",
            increase: "31%",
        },
    ];
    return people;
}
