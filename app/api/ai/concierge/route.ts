import { NextRequest, NextResponse } from "next/server";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ConciergeRequest {
  message: string;
  history?: Message[];
}

// Built-in Luxury Automotive Knowledge Base for fallback & immediate responses
const LUXURY_KNOWLEDGE_BASE = [
  {
    brand: "Ferrari",
    cars: [
      { id: 1, name: "Ferrari SF90 Stradale", price: 75000000, hp: 986, topSpeed: "340 km/h", zeroToHundred: "2.5s", tag: "Hybrid Hypercar" },
      { id: 2, name: "Ferrari 296 GTB", price: 54000000, hp: 819, topSpeed: "330 km/h", zeroToHundred: "2.9s", tag: "Mid-Rear Turbo V6" },
      { id: 3, name: "Ferrari Roma Spider", price: 42000000, hp: 612, topSpeed: "320 km/h", zeroToHundred: "3.4s", tag: "Grand Tourer" },
    ]
  },
  {
    brand: "Lamborghini",
    cars: [
      { id: 4, name: "Lamborghini Revuelto", price: 88900000, hp: 1001, topSpeed: "350 km/h", zeroToHundred: "2.5s", tag: "V12 HPEV Flagship" },
      { id: 5, name: "Lamborghini Urus Performante", price: 42200000, hp: 657, topSpeed: "306 km/h", zeroToHundred: "3.3s", tag: "Super SUV" },
      { id: 6, name: "Lamborghini Huracán Tecnica", price: 40400000, hp: 631, topSpeed: "325 km/h", zeroToHundred: "3.2s", tag: "Track & Road V10" },
    ]
  },
  {
    brand: "Porsche",
    cars: [
      { id: 7, name: "Porsche 911 GT3 RS", price: 35000000, hp: 518, topSpeed: "296 km/h", zeroToHundred: "3.2s", tag: "Atmospheric Track Weapon" },
      { id: 8, name: "Porsche 911 Turbo S", price: 33500000, hp: 640, topSpeed: "330 km/h", zeroToHundred: "2.7s", tag: "All-Weather Supercar" },
      { id: 9, name: "Porsche Taycan Turbo GT", price: 31000000, hp: 1019, topSpeed: "305 km/h", zeroToHundred: "2.2s", tag: "All-Electric Hyper Saloon" },
    ]
  },
  {
    brand: "Rolls-Royce",
    cars: [
      { id: 10, name: "Rolls-Royce Spectre", price: 75000000, hp: 577, topSpeed: "250 km/h", zeroToHundred: "4.5s", tag: "Ultra-Luxury Electric Coupé" },
      { id: 11, name: "Rolls-Royce Ghost Extended", price: 79500000, hp: 563, topSpeed: "250 km/h", zeroToHundred: "4.8s", tag: "Bespoke Sanctuary V12" },
      { id: 12, name: "Rolls-Royce Cullinan Series II", price: 69500000, hp: 592, topSpeed: "250 km/h", zeroToHundred: "5.1s", tag: "Pinnacle All-Terrain SUV" },
    ]
  }
];

export async function POST(req: NextRequest) {
  try {
    const body: ConciergeRequest = await req.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // 1. If Gemini API Key is available, use Google Gemini endpoint
    if (apiKey) {
      try {
        const systemPrompt = `You are the exclusive VIP Concierge & Master Automotive Specialist for "Carstore", the world's most prestigious luxury & hypercar atelier.
Your tone is sophisticated, welcoming, knowledgeable, elegant, and discreet — akin to a private concierge at Mayfair or Monaco.
You assist distinguished clientele with:
- Selecting supercars, grand tourers, hypercars, and ultra-luxury SUVs (Ferrari, Lamborghini, Porsche, Rolls-Royce, Bentley, McLaren, Aston Martin).
- Explaining specifications: horsepower, V8/V10/V12 acoustics, 0-100 km/h, aerodynamics, bespoke carbon trims, and track telemetry.
- Directing clients to our interactive 360° Visualizer, Bespoke Configurator, Live Hypercar Auctions, and complimentary VIP Test Drive booking.
- Pricing in Indian Rupees (₹ Crores / Lakhs).
Keep responses concise, captivating, and formatted in clean markdown. Always invite the client to test drive or view the vehicle.`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: `${systemPrompt}\n\nClient inquiry: ${message}` }]
                }
              ],
              generationConfig: {
                maxOutputTokens: 600,
                temperature: 0.7,
              }
            })
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return NextResponse.json({
              reply: replyText,
              suggestedQuestions: [
                "Which car has the highest top speed in your collection?",
                "How do I customize bespoke carbon fiber options?",
                "Can you schedule a private track day test drive?",
              ],
              recommendations: findMatchingCars(message)
            });
          }
        }
      } catch (geminiError) {
        console.warn("Gemini API call failed, falling back to VIP automotive rule engine:", geminiError);
      }
    }

    // 2. Intelligent Luxury Automotive Rule & Fallback Engine
    const lower = message.toLowerCase();
    let reply = "";
    let suggestions = [
      "Show me supercars under ₹5 Crores",
      "Which vehicle offers the best V12 soundtrack?",
      "How do I participate in the Live Hypercar Auction?",
      "Can I schedule a home test drive in Mumbai or Delhi?",
    ];
    let matchedCars: any[] = [];

    if (lower.includes("urus") && (lower.includes("ghost") || lower.includes("rolls"))) {
      reply = `**A Clash of Titans: Lamborghini Urus vs. Rolls-Royce Ghost**\n\n* **Lamborghini Urus Performante**: The quintessential Super SUV. Powered by a twin-turbo 4.0L V8 developing 666 CV, it hurtles from 0-100 km/h in an astonishing 3.3 seconds. Perfect for the driver demanding visceral adrenaline and track agility with everyday practicality.\n\n* **Rolls-Royce Ghost Extended**: The sanctuary of whisper-quiet peerless luxury. Its 6.75L twin-turbo V12 effortlessly glides on the Planar Suspension System with bespoke starlight headlining and lambswool comfort.\n\n*Recommendation*: If you prioritize lap times and spine-tingling exhaust notes, select the **Urus**. If supreme tranquility, prestige, and chauffer-driven sanctuary are your criteria, the **Ghost** is unmatched.`;
      matchedCars = [
        LUXURY_KNOWLEDGE_BASE[1].cars[1], // Urus
        LUXURY_KNOWLEDGE_BASE[3].cars[1], // Ghost
      ];
    } else if (lower.includes("track") || lower.includes("gt3") || lower.includes("circuit") || lower.includes("lap")) {
      reply = `For sheer apex precision and circuit mastery, nothing rivals the **Porsche 911 GT3 RS** and the **Ferrari 296 GTB**.\n\n* **Porsche 911 GT3 RS**: Naturally aspirated 4.0L flat-six screaming to 9,000 RPM with DRS active aero producing 860 kg of downforce at 285 km/h.\n* **Ferrari 296 GTB**: Mid-rear 120° V6 turbo hybrid churning out 830 cv, delivering instantaneous torque and razor-sharp weight transfer.\n\nBoth vehicles are equipped with carbon-ceramic braking suites and telemetry loggers. Would you like our concierge team to reserve private track time for your test drive?`;
      matchedCars = [
        LUXURY_KNOWLEDGE_BASE[2].cars[0], // GT3 RS
        LUXURY_KNOWLEDGE_BASE[0].cars[1], // 296 GTB
      ];
    } else if (lower.includes("fastest") || lower.includes("speed") || lower.includes("quickest") || lower.includes("0-100") || lower.includes("hypercar")) {
      reply = `Our crown jewels for blistering acceleration and hypercar dominance:\n\n1. **Lamborghini Revuelto**: 1,001 HP naturally-aspirated V12 hybrid. 0-100 km/h in **2.5 seconds** with a top speed exceeding **350 km/h**.\n2. **Ferrari SF90 Stradale**: 986 HP plug-in hybrid V8 AWD with quad-motor vectoring. 0-100 km/h in **2.5 seconds**.\n3. **Porsche Taycan Turbo GT**: 1,019 HP electric apex predator. 0-100 km/h in **2.2 seconds**.\n\nEach model is available for bespoke configuration in our 3D Studio.`;
      matchedCars = [
        LUXURY_KNOWLEDGE_BASE[1].cars[0], // Revuelto
        LUXURY_KNOWLEDGE_BASE[0].cars[0], // SF90
        LUXURY_KNOWLEDGE_BASE[2].cars[2], // Taycan Turbo GT
      ];
    } else if (lower.includes("test drive") || lower.includes("book") || lower.includes("schedule") || lower.includes("trial")) {
      reply = `**Complimentary VIP White-Glove Test Drive**\n\nWe provide seamless test-drive experiences at your private residence, corporate office, or at any of our exclusive flagship showrooms in **Bandra (Mumbai), Aerocity (Delhi), and UB City (Bengaluru)**.\n\n* Each private session includes a dedicated factory-certified specialist.\n* Complete vehicle walk-around and dynamic performance demonstration.\n* Simply navigate to any car detail page and select **'Book VIP Test Drive'** to select your preferred date and time.`;
      suggestions = [
        "What documents are required for a supercar test drive?",
        "Can the vehicle be delivered to my residence?",
        "Show me all Ferraris currently available in Mumbai",
      ];
    } else if (lower.includes("auction") || lower.includes("bid")) {
      reply = `**Live Hypercar Auction Room**\n\nOur exclusive real-time auction platform offers verified collectors access to rare, limited-edition allocations:\n\n* **Verified Provenance**: Every vehicle is 150-point certified by factory technicians.\n* **Instant VIP Bidding**: Increment bids with one click (+₹5,00,000 / +₹10,00,000).\n* **Escrow Guarantee**: All bids and down payments are secured in private banking escrow.\n\nVisit our **Auctions** salon in the navigation bar to witness the live countdown and participate in ongoing bids.`;
      suggestions = [
        "How do I register as a verified VIP bidder?",
        "What is the reserve price on current hypercars?",
        "Show me cars available for immediate purchase",
      ];
    } else if (lower.includes("price") || lower.includes("crore") || lower.includes("lakh") || lower.includes("budget") || lower.includes("under")) {
      reply = `Our curated inventory spans from accessible grand tourers starting at ₹2.5 Crores up to bespoke bespoke hypercars at ₹8+ Crores.\n\n* **₹3.0 Cr - ₹4.5 Cr Range**: Porsche 911 GT3 RS, Ferrari Roma Spider, Lamborghini Huracán Tecnica.\n* **₹4.5 Cr - ₹6.5 Cr Range**: Ferrari 296 GTB, Lamborghini Urus Performante, Bentley Continental GT.\n* **₹6.5 Cr+ Pinnacle Collection**: Ferrari SF90 Stradale, Lamborghini Revuelto, Rolls-Royce Spectre.\n\nEvery purchase includes complimentary Pan-India white-glove transport, 3 years of concierge maintenance, and 24/7 dedicated pit-crew support.`;
      matchedCars = findMatchingCars(message);
    } else {
      reply = `Thank you for consulting Carstore VIP Concierge. We take profound pride in curating the finest automotive marvels in the subcontinent.\n\nWhether your ambition is the raw acoustic crescendo of a high-revving naturally aspirated V12, the whisper-smooth grace of a bespoke Rolls-Royce, or circuit-focused telemetry in a Porsche GT3, our atelier is at your complete disposal.\n\nHow may I tailor your consultation today?`;
      matchedCars = [
        LUXURY_KNOWLEDGE_BASE[0].cars[0],
        LUXURY_KNOWLEDGE_BASE[1].cars[0],
      ];
    }

    return NextResponse.json({
      reply,
      suggestedQuestions: suggestions,
      recommendations: matchedCars.length > 0 ? matchedCars : findMatchingCars(message),
    });
  } catch (error: any) {
    console.error("AI Concierge error:", error);
    return NextResponse.json(
      {
        reply: "Welcome to Carstore VIP Concierge. Our specialists are on standby to guide you through our bespoke supercar collection, customized pricing, and private showroom test drives.",
        suggestedQuestions: [
          "Show me the top 3 supercars in stock",
          "How do I customize custom paint and carbon options?",
          "How does the Live Hypercar Auction work?",
        ],
      },
      { status: 200 }
    );
  }
}

function findMatchingCars(text: string) {
  const lower = text.toLowerCase();
  const results: any[] = [];

  for (const brandGroup of LUXURY_KNOWLEDGE_BASE) {
    if (lower.includes(brandGroup.brand.toLowerCase())) {
      results.push(...brandGroup.cars);
    } else {
      for (const c of brandGroup.cars) {
        if (lower.includes(c.name.toLowerCase()) || lower.includes(c.tag.toLowerCase())) {
          results.push(c);
        }
      }
    }
  }

  return results.slice(0, 3);
}
