// prisma/seed.js

import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

const CROPS_LIST = [
    "Wheat", "Rice", "Maize", "Cotton", "Sugarcane", "Soybean",
    "Mustard", "Chickpea", "Tomato", "Onion", "Potato", "Groundnut",
];
const STAGES = ["Germination", "Seedling", "Vegetative", "Flowering", "Fruiting", "Maturity"];
const STATES = ["Maharashtra", "Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh", "Gujarat", "Karnataka"];
const MANDIS = ["Amritsar", "Nagpur", "Indore", "Hyderabad", "Pune", "Ahmedabad", "Lucknow", "Jaipur"];
const SOIL_TYPES = ["Black Cotton", "Red Loamy", "Alluvial", "Sandy Loam", "Clay", "Laterite"];
const IRRIGATION = ["Drip Irrigation", "Sprinkler", "Canal", "Borewell", "Rainwater"];
const LOCATIONS = ["North Field", "South Field", "East Field", "West Field"];

function rnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function rndFloat(min, max, dec = 1) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(dec));
}
function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function pickN(arr, n) {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
}

// Demo users with fixed credentials for easy login
const demoUsers = [
    {
        name: "Ramesh Patel",
        email: "ramesh@demo.com",
        password: "demo1234",
        phone: "+91 98765-43210",
        village: "Nadiad",
        district: "Kheda",
        state: "Gujarat",
        soilType: "Black Cotton",
        irrigationType: "Drip Irrigation",
        landHolding: "2.5 acres",
        farmerType: "Small Farmer",
    },
    {
        name: "Sunita Yadav",
        email: "sunita@demo.com",
        password: "demo1234",
        phone: "+91 87654-32109",
        village: "Sehore",
        district: "Sehore",
        state: "Madhya Pradesh",
        soilType: "Alluvial",
        irrigationType: "Canal",
        landHolding: "1.5 acres",
        farmerType: "Marginal Farmer",
    },
    {
        name: "Harish Singh",
        email: "harish@demo.com",
        password: "demo1234",
        phone: "+91 76543-21098",
        village: "Ludhiana Rural",
        district: "Ludhiana",
        state: "Punjab",
        soilType: "Sandy Loam",
        irrigationType: "Borewell",
        landHolding: "4.0 acres",
        farmerType: "Semi-Medium Farmer",
    },
];

const alertMessages = [
    { type: "Pest", icon: "🐛", color: "red", severity: "High", message: "Fall Armyworm spotted in North Field - apply Chlorpyrifos 20 EC @ 2ml/L immediately" },
    { type: "Weather", icon: "🌧️", color: "blue", severity: "Medium", message: "Heavy rainfall expected tomorrow - avoid pesticide spraying for next 48 hours" },
    { type: "Soil", icon: "🌱", color: "amber", severity: "Medium", message: "Nitrogen deficiency detected in North Field sensor - apply urea top dressing" },
    { type: "Market", icon: "📈", color: "green", severity: "Low", message: "Wheat price rose 8% at Amritsar mandi today - good opportunity to sell stored stock" },
    { type: "Advisory", icon: "💡", color: "purple", severity: "Low", message: "Optimal sowing window for Rabi crops starts in 10 days - prepare your fields now" },
    { type: "Pest", icon: "🐛", color: "red", severity: "High", message: "Aphid infestation detected in Wheat field - use Imidacloprid 17.8 SL @ 0.5ml/L" },
    { type: "Weather", icon: "⚠️", color: "amber", severity: "High", message: "Cold wave alert for next 3 days - protect nursery seedlings with mulching" },
    { type: "Advisory", icon: "💡", color: "purple", severity: "Medium", message: "Schedule irrigation for your Sugarcane crop - soil moisture critically low" },
];

const communityPostsData = [
    {
        title: "Best time to sow Wheat in Punjab this year?",
        body: "Soil temperature is around 22°C in my field. Is it the right time to start sowing? I have 2 acres of sandy loam soil and last year I started on Nov 15 but yield was low.",
        tags: JSON.stringify(["Wheat", "Sowing", "Punjab"]),
    },
    {
        title: "Yellow leaves on Rice crop after urea application - help!",
        body: "My rice plants are showing yellowing from the leaf tips after I applied urea last week. Soil test shows normal NPK. Could it be zinc deficiency or urea burn? Photos in comments.",
        tags: JSON.stringify(["Rice", "Nutrient Deficiency", "Help"]),
    },
    {
        title: "Drip irrigation ROI after 3 years - my experience",
        body: "Set up drip irrigation 3 years ago at ₹18,000/acre with 85% government subsidy. Water savings: 40%. Yield increase: 28%. Payback period was just 14 months. Happy to share details!",
        tags: JSON.stringify(["Irrigation", "Subsidy", "Success Story"]),
    },
    {
        title: "Cotton price vs MSP debate - when to sell?",
        body: "Current cotton price in my mandi is ₹6,200/qtl but MSP is ₹7,020. I've stored for 4 weeks. Warehouse charges eating up margin. What do you all suggest - wait or sell?",
        tags: JSON.stringify(["Cotton", "Market Price", "MSP"]),
    },
    {
        title: "Maize + Soybean intercropping gave me 40% more income",
        body: "Started intercropping last Kharif on my 2.5 acre field. Net income went from ₹45,000 to ₹63,000 from same land with only 15% more input cost. AMA about my setup.",
        tags: JSON.stringify(["Intercropping", "Maize", "Soybean", "Success Story"]),
    },
    {
        title: "Urgent: pest outbreak on Chilli crop spreading fast",
        body: "Yellow spots on leaves with small insects visible under leaves early morning. Started from one corner and now covering 3 rows in 2 days. 1.5 acres at risk. What spray to use?",
        tags: JSON.stringify(["Chilli", "Pest", "Urgent"]),
    },
];

const marketData = [
    { cropName: "Wheat", msp: 2275, modalPrice: 2420, minPrice: 2180, maxPrice: 2680, prevPrice: 2240, mandi: "Amritsar", arrivalQty: "8,240 qtl" },
    { cropName: "Rice", msp: 2183, modalPrice: 2350, minPrice: 2100, maxPrice: 2580, prevPrice: 2410, mandi: "Hyderabad", arrivalQty: "12,500 qtl" },
    { cropName: "Maize", msp: 2090, modalPrice: 1980, minPrice: 1820, maxPrice: 2150, prevPrice: 2020, mandi: "Indore", arrivalQty: "3,800 qtl" },
    { cropName: "Cotton", msp: 7020, modalPrice: 6850, minPrice: 6400, maxPrice: 7200, prevPrice: 6920, mandi: "Nagpur", arrivalQty: "2,100 qtl" },
    { cropName: "Soybean", msp: 4892, modalPrice: 5100, minPrice: 4750, maxPrice: 5400, prevPrice: 4980, mandi: "Indore", arrivalQty: "5,600 qtl" },
    { cropName: "Mustard", msp: 5650, modalPrice: 5820, minPrice: 5500, maxPrice: 6100, prevPrice: 5750, mandi: "Jaipur", arrivalQty: "4,200 qtl" },
    { cropName: "Chickpea", msp: 5440, modalPrice: 5680, minPrice: 5200, maxPrice: 5950, prevPrice: 5590, mandi: "Bhopal", arrivalQty: "2,900 qtl" },
    { cropName: "Tomato", msp: 0, modalPrice: 1850, minPrice: 1400, maxPrice: 2400, prevPrice: 2100, mandi: "Pune", arrivalQty: "18,000 qtl" },
    { cropName: "Onion", msp: 0, modalPrice: 2200, minPrice: 1800, maxPrice: 2800, prevPrice: 1950, mandi: "Lasalgaon", arrivalQty: "35,000 qtl" },
    { cropName: "Potato", msp: 0, modalPrice: 1200, minPrice: 950, maxPrice: 1500, prevPrice: 1280, mandi: "Agra", arrivalQty: "28,000 qtl" },
    { cropName: "Groundnut", msp: 6377, modalPrice: 6500, minPrice: 6100, maxPrice: 6850, prevPrice: 6420, mandi: "Ahmedabad", arrivalQty: "4,800 qtl" },
    { cropName: "Sugarcane", msp: 340, modalPrice: 340, minPrice: 330, maxPrice: 350, prevPrice: 340, mandi: "Lucknow", arrivalQty: "85,000 qtl" },
];

async function main() {
    console.log("🌱 Seeding SmartCrop database...\n");

    // Clean up
    await prisma.communityComment.deleteMany();
    await prisma.communityPost.deleteMany();
    await prisma.alert.deleteMany();
    await prisma.soilReading.deleteMany();
    await prisma.crop.deleteMany();
    await prisma.marketPrice.deleteMany();
    await prisma.user.deleteMany();

    console.log("✓ Cleaned existing data");

    // Create Market Prices
    for (const mp of marketData) {
        await prisma.marketPrice.create({ data: mp });
    }
    console.log(`✓ Created ${marketData.length} market prices`);

    // Create demo users
    for (const userData of demoUsers) {
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const user = await prisma.user.create({
            data: {
                ...userData,
                password: hashedPassword,
            },
        });

        // Create 3-4 crops per user
        const userCrops = pickN(CROPS_LIST, rnd(3, 4));
        const cropIds = [];
        for (const cropName of userCrops) {
            const sowingDaysAgo = rnd(20, 90);
            const harvestDaysFromNow = rnd(15, 120);
            const today = new Date();
            const sowingDate = new Date(today);
            sowingDate.setDate(today.getDate() - sowingDaysAgo);
            const harvestDate = new Date(today);
            harvestDate.setDate(today.getDate() + harvestDaysFromNow);

            const crop = await prisma.crop.create({
                data: {
                    userId: user.id,
                    name: cropName,
                    stage: pick(STAGES),
                    health: rnd(45, 97),
                    area: `${rndFloat(0.25, 2.5)} acres`,
                    sowingDate: sowingDate.toLocaleDateString("en-IN"),
                    expectedHarvest: harvestDate.toLocaleDateString("en-IN"),
                    waterRequired: pick(["Low", "Medium", "High"]),
                    lastAction: pick([
                        "Fertilizer applied", "Irrigation done", "Pesticide sprayed",
                        "Weeding completed", "Soil test done",
                    ]),
                    daysToHarvest: harvestDaysFromNow,
                },
            });
            cropIds.push(crop.id);
        }

        // Create soil sensor readings per location
        for (let i = 0; i < LOCATIONS.length; i++) {
            await prisma.soilReading.create({
                data: {
                    userId: user.id,
                    cropId: cropIds[i % cropIds.length],
                    sensorId: `SENSOR-${String(i + 1).padStart(3, "0")}`,
                    location: LOCATIONS[i],
                    moisture: rndFloat(15, 85),
                    temperature: rndFloat(20, 38),
                    ph: rndFloat(5.5, 8.5),
                    nitrogen: rndFloat(10, 80),
                    phosphorus: rndFloat(5, 60),
                    potassium: rndFloat(50, 250),
                    ec: rndFloat(0.1, 2.5, 2),
                    battery: rnd(20, 100),
                    signal: pick(["Strong", "Moderate", "Weak"]),
                    depth: pick(["0–15 cm", "15–30 cm", "30–60 cm"]),
                    trend: pick(["up", "down", "stable"]),
                },
            });
        }

        // Create alerts for user
        const userAlerts = pickN(alertMessages, 6);
        for (const alertData of userAlerts) {
            await prisma.alert.create({
                data: {
                    userId: user.id,
                    type: alertData.type,
                    icon: alertData.icon,
                    color: alertData.color,
                    severity: alertData.severity,
                    message: alertData.message,
                    isRead: Math.random() > 0.6,
                },
            });
        }

        // Create community posts for this user
        const userPosts = pickN(communityPostsData, rnd(2, 3));
        for (const postData of userPosts) {
            const post = await prisma.communityPost.create({
                data: {
                    userId: user.id,
                    title: postData.title,
                    body: postData.body,
                    tags: postData.tags,
                    likes: rnd(5, 180),
                    views: rnd(80, 1500),
                    upvotes: rnd(0, 90),
                    isAnswered: Math.random() > 0.5,
                },
            });

            // Add sample comments
            await prisma.communityComment.create({
                data: {
                    postId: post.id,
                    authorName: "Dr. A.K. Sharma",
                    authorRole: "KVK Officer",
                    body: "Great question! Based on current weather patterns and soil conditions in your region, I would recommend waiting another 5-7 days before taking action. Monitor the situation daily.",
                    isExpert: true,
                },
            });
            await prisma.communityComment.create({
                data: {
                    postId: post.id,
                    authorName: pick(["Mukesh Tiwari", "Priya Devi", "Rajesh Gupta", "Lokesh Verma"]),
                    authorRole: "Small Farmer",
                    body: "I faced the same issue last year! Here's what worked for me in similar conditions...",
                    isExpert: false,
                },
            });
        }

        console.log(`✓ Created user: ${user.email} (${user.name}) - ${userCrops.length} crops, 4 sensors, 6 alerts`);
    }

    console.log("\n🎉 Seeding complete!\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("  DEMO LOGIN CREDENTIALS");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    for (const u of demoUsers) {
        console.log(`  📧 ${u.email.padEnd(22)} 🔑 demo1234`);
    }
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
