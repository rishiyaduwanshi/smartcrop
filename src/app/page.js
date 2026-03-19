import {
  ArrowRight,
  BarChart3,
  Bug,
  CheckCircle2,
  CloudSun,
  Cpu,
  Leaf,
  MessageSquare,
  ShieldCheck,
  Smartphone,
  Star,
  TrendingUp,
  Users,
  Wifi,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  generatePlatformStats,
  generateTestimonials,
} from "@/lib/faker-data";

const features = [
  {
    icon: CloudSun,
    title: "Hyper-Local Weather",
    desc: "District-level 7-day forecasts integrated with IMD data. Get farming-specific weather advice for your exact location.",
    color: "blue",
  },
  {
    icon: Bug,
    title: "ML Pest Risk Prediction",
    desc: "AI model trained on 10+ years of pest outbreak data. Get 72-hour advance warning before infestations occur.",
    color: "red",
  },
  {
    icon: Cpu,
    title: "IoT Soil Sensors",
    desc: "Real-time NPK, moisture, pH and temperature monitoring from low-cost sensors deployed directly in your field.",
    color: "amber",
  },
  {
    icon: TrendingUp,
    title: "Market Price Alerts",
    desc: "Live mandi prices from 585+ APMC markets. Know when to sell for maximum profit vs MSP comparison.",
    color: "green",
  },
  {
    icon: Smartphone,
    title: "Voice & SMS Advisory",
    desc: "No smartphone required. Get personalized crop advisories via IVR calls in 12 regional languages including Hindi.",
    color: "purple",
  },
  {
    icon: Wifi,
    title: "Offline-First Mode",
    desc: "Works without internet. Cached weather, advisories and risk data auto-sync when connectivity is available.",
    color: "indigo",
  },
  {
    icon: ShieldCheck,
    title: "Crop Insurance Help",
    desc: "PM Fasal Bima Yojana integration. Auto-generate claim reports from field data and sensor readings.",
    color: "teal",
  },
  {
    icon: Users,
    title: "Farmer Community",
    desc: "Connect with 1 lakh+ farmers. Share experiences, ask experts, and get peer-to-peer knowledge from your region.",
    color: "orange",
  },
  {
    icon: BarChart3,
    title: "Yield Analytics",
    desc: "Track crop performance across seasons. Compare yields, costs and profit margins with regional benchmarks.",
    color: "cyan",
  },
];

const featureColorMap = {
  blue: "bg-blue-100 text-blue-700",
  red: "bg-red-100 text-red-700",
  amber: "bg-amber-100 text-amber-700",
  green: "bg-green-100 text-green-700",
  purple: "bg-purple-100 text-purple-700",
  indigo: "bg-indigo-100 text-indigo-700",
  teal: "bg-teal-100 text-teal-700",
  orange: "bg-orange-100 text-orange-700",
  cyan: "bg-cyan-100 text-cyan-700",
};

const steps = [
  {
    step: "01",
    title: "Register & Set Up Profile",
    desc: "Enter your village/district, land holding, soil type, and current crops. Takes under 2 minutes.",
    icon: "📝",
  },
  {
    step: "02",
    title: "Connect IoT Sensors (Optional)",
    desc: "Plug in low-cost soil sensor (₹2,499) for real-time NPK and moisture data directly from your field.",
    icon: "🔌",
  },
  {
    step: "03",
    title: "Receive Smart Advisories",
    desc: "Get daily push alerts, SMS, or voice calls with crop-specific advice, pest warnings, and market opportunities.",
    icon: "🌱",
  },
];

const sdgBadges = [
  {
    goal: "SDG 2",
    title: "Zero Hunger",
    desc: "Improving crop yield and food security for 125+ million small and marginal farmers across India.",
    emoji: "🌾",
    bg: "bg-yellow-50 border-yellow-200",
    text: "text-yellow-800",
  },
  {
    goal: "SDG 1",
    title: "No Poverty",
    desc: "Data-driven income enhancement by reducing crop losses, improving market timing, and access to government schemes.",
    emoji: "💰",
    bg: "bg-red-50 border-red-200",
    text: "text-red-800",
  },
  {
    goal: "SDG 12",
    title: "Responsible Production",
    desc: "Precision application of water, fertilizer, and pesticides reduces environmental impact and input costs.",
    emoji: "♻️",
    bg: "bg-green-50 border-green-200",
    text: "text-green-800",
  },
];

export default function LandingPage() {
  const stats = generatePlatformStats();
  const testimonials = generateTestimonials();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-800 via-green-700 to-green-600 text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-green-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-green-900/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600/50 rounded-full text-green-100 text-sm mb-6 border border-green-500/40">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                <span>AI-Powered • IoT-Enabled • Mobile-First</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Smart Farming
                <span className="block text-yellow-300">Starts Here</span>
              </h1>

              <p className="text-green-100 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
                SmartCrop Advisor combines <strong className="text-white">local weather forecasts</strong>,{" "}
                <strong className="text-white">IoT soil sensors</strong>, and{" "}
                <strong className="text-white">ML-based pest prediction</strong> to help small &amp;
                marginal farmers boost yields by up to{" "}
                <span className="text-yellow-300 font-bold">{stats.avgIncrease}%</span>.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-6 py-3 bg-yellow-400 text-green-900 font-semibold rounded-xl hover:bg-yellow-300 transition-all shadow-lg hover:shadow-xl"
                >
                  Open Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/advisory"
                  className="flex items-center gap-2 px-6 py-3 bg-green-600/60 text-white font-semibold rounded-xl border border-green-400/50 hover:bg-green-600/80 transition-all"
                >
                  View Crop Advisory
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-4 text-sm text-green-200">
                {[
                  "✓ Free for marginal farmers",
                  "✓ Works in 12 languages",
                  "✓ SMS & voice support",
                ].map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>

            {/* Right - live stats card */}
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full pulse-green" />
                  <span className="text-sm text-green-200 font-medium">Live Platform Stats</span>
                </div>
                {[
                  { label: "Farmers Registered", value: `${(stats.farmers / 1000).toFixed(0)}K+`, icon: "👨‍🌾" },
                  { label: "Villages Covered", value: `${(stats.villages / 1000).toFixed(1)}K+`, icon: "🏘️" },
                  { label: "ML Accuracy", value: `${stats.accuracyPct}%`, icon: "🤖" },
                  { label: "States Active", value: `${stats.statesCovered}`, icon: "🗺️" },
                  { label: "Alerts Sent (This Season)", value: `${(stats.alertsSent / 1000).toFixed(0)}K+`, icon: "🔔" },
                  { label: "IoT Sensors Deployed", value: `${(stats.iotSensors / 1000).toFixed(0)}K+`, icon: "📡" },
                ].map(({ label, value, icon }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{icon}</span>
                      <span className="text-sm text-green-100">{label}</span>
                    </div>
                    <span className="font-bold text-white text-lg">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-green-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-green-100">
            {[
              { value: `${(stats.farmers / 1000).toFixed(0)}K+`, label: "Farmers Helped", sub: "across India" },
              { value: `${stats.accuracyPct}%`, label: "AI Advisory Accuracy", sub: "validated in field trials" },
              { value: `${stats.statesCovered} States`, label: "Active Coverage", sub: "& 700+ districts" },
              { value: `${stats.avgIncrease}%`, label: "Average Yield Increase", sub: "vs non-users" },
            ].map(({ value, label, sub }) => (
              <div key={label} className="text-center py-6 px-4">
                <div className="text-3xl font-bold text-green-700 mb-1">{value}</div>
                <div className="text-sm font-semibold text-gray-700">{label}</div>
                <div className="text-xs text-gray-400">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold tracking-widest text-green-600 uppercase">Everything You Need</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Built for India's Farmers
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            A complete farming intelligence platform designed specifically for the realities of small
            and marginal farmers in India - low connectivity, multiple languages, diverse crops.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="card-hover bg-white rounded-2xl border border-green-100 p-6 shadow-sm"
            >
              <div className={`inline-flex p-2.5 rounded-xl mb-4 ${featureColorMap[color]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="bg-green-50 border-y border-green-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold tracking-widest text-green-600 uppercase">Simple to Use</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              How SmartCrop Works
            </h2>
            <p className="text-gray-500">Get started in under 5 minutes. No technical expertise needed.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map(({ step, title, desc, icon }, i) => (
              <div key={step} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(100%-1rem)] w-8 text-green-300 text-2xl z-10">→</div>
                )}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-green-100 text-center card-hover">
                  <div className="text-5xl mb-4">{icon}</div>
                  <div className="text-xs font-bold text-green-500 tracking-widest mb-2">STEP {step}</div>
                  <h3 className="font-bold text-gray-900 text-lg mb-3">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold tracking-widest text-green-600 uppercase">Farmer Stories</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Real Results from Real Farmers
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {testimonials.map(({ name, state, crop, quote, increase }) => (
            <div
              key={name}
              className="bg-white rounded-2xl p-7 shadow-sm border border-green-100 card-hover relative"
            >
              <div className="absolute top-5 right-6 flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">
                  {name[0]}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{name}</div>
                  <div className="text-xs text-gray-400">
                    {crop} Farmer · {state}
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">"{quote}"</p>

              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Yield increased by {increase} this season
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SDG SECTION ──────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-green-900 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold tracking-widest text-green-400 uppercase">UN Sustainable Development Goals</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
              Aligned with Global Goals
            </h2>
            <p className="text-green-200 max-w-xl mx-auto">
              SmartCrop Advisor directly contributes to three UN SDGs through technology-enabled
              agricultural development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sdgBadges.map(({ goal, title, desc, emoji, bg, text }) => (
              <div key={goal} className={`rounded-2xl p-7 border ${bg} card-hover`}>
                <div className="text-5xl mb-3">{emoji}</div>
                <div className={`text-xs font-bold tracking-wider mb-1 ${text}`}>{goal}</div>
                <h3 className={`text-xl font-bold mb-3 ${text}`}>{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-green-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-gray-500 text-lg mb-8">
            Join {(stats.farmers / 1000).toFixed(0)}K+ farmers already using SmartCrop Advisor.
            Free for small and marginal farmers.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-8 py-3.5 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-all shadow-lg"
            >
              <Leaf className="w-4 h-4" />
              Go to Dashboard
            </Link>
            <Link
              href="/community"
              className="flex items-center gap-2 px-8 py-3.5 bg-white text-green-700 font-semibold rounded-xl border-2 border-green-200 hover:border-green-400 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              Join Community
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            SIH Capstone Project · Group KC874 · TRL 4–6 · Mapped to Agriculture &amp; Rural Development
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
