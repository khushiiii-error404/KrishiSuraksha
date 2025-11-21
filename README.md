# 🌾 Krushi Suraksha

# DEMO-LINK : [krishisuraksha.vercel.app](https://krishisuraksha.vercel.app/)

### **AI-Powered Parametric Crop Insurance for Instant Settlements**

Krushi Suraksha is an InsurTech platform designed to revolutionize crop insurance by using AI-driven crop analysis, weather intelligence, and satellite context to process claims **within minutes instead of months**.

---

## 🧠 Problem We Are Solving

Farmers under schemes like PMFBY currently face:

- ⏳ Slow claim processing (3–6 months)
- 🚜 Manual survey dependency
- 💸 High verification and travel cost
- ❌ Fraud, subjectivity, and errors
- 😔 Financial stress after disasters like floods, pests, and droughts

---

## ⚡ Our Solution

A **parametric insurance automation platform**:

1. Farmer captures crop damage photo (Geo-tagged input).
2. Gemini AI analyzes crop, disaster type & severity.
3. Weather API validates environmental conditions.
4. Satellite NDVI trend confirms historical vegetation health.
5. PMFBY-based formula calculates payout deterministically.
6. Claim is instantly marked as **Approved / Under Review / Fraud**.

> Fully compliant with **PMFBY Clause 15.3, 15.5, and 20** (Innovative Tech Use).

---

## 🛠 Tech Stack

| Layer | Technology Used |
|-------|----------------|
| **Frontend** | React 19, TypeScript, Tailwind CSS, Lucide React |
| **AI Engine** | Google Gemini 2.5 Flash (Vision + Reasoning) |
| **Mapping & Geo** | Leaflet.js + Esri World Imagery + HTML5 GPS |
| **External Data** | Open-Meteo Weather API, simulated Bhoomi/PMFBY DB |
| **Logic Layer** | Prisma Schema + TypeScript deterministic payout functions |
| **Charts** | Recharts dashboard visualization |

---

## 🧩 Architecture Flow

📱 Image Upload (Geo-tag)
↓
🤖 Gemini AI Assessment (Crop + Severity + Disaster Type)
↓
🌦 Weather Verification (Rainfall, Temp, Wind)
↓
🛰 Satellite NDVI Health Trend Check
↓
📊 PMFBY Payout Rule Engine (Formula-based)
↓
💰 Instant Claim Result: Approved / Review / Fraud