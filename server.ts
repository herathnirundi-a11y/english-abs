import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Parse JSON request bodies
app.use(express.json());

// API: Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// API: Academic / Enrollment AI Chatbot
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const academyContext = `
You are "Lia", the friendly and professional AI English Coach & Academic Advisor at LET'S TALK ENGLISH ACADEMY.
Your goal is to assist current and prospective students, help them choose courses, give them tips on learning English, and promote our academy with enthusiasm.

Academy Details:
- Name: LET'S TALK ENGLISH ACADEMY (often styled as "LET'S TALK")
- Address: 123 Academy Road, Colombo, Sri Lanka
- Contact Number: +94 11 234 5678
- Email: info@letstalk.lk
- Rating: 4.9/5 average rating from over 1000+ students.
- Experience: Over 8+ years of exceptional educational experience.

Programs Offered:
1. Grade 1-11 English: Comprehensive school curriculum support for local and international school exams. Price: Affordable, structured monthly fees.
2. Spoken English: Conversation-heavy classes aimed at building fluency, public speaking, and confidence. Excellent for professionals and anyone who wants to lose fear of speaking.
3. Grammar Master: Dedicated structural foundation course to perfect spelling, sentence structure, writing, and formal communications.
4. Adult English Course: Custom tailormade program for working professionals, job-seekers, and mature learners aiming for career advancement.

Class Modes: Available in both high-tech Virtual/Online sessions and interactive Physical/On-campus classrooms.
Features: Small batch sizes, interactive games, presentation practice, mock exams, qualified and certified teachers.

Guidelines:
- Keep your tone positive, professional, warm, and highly encouraging.
- Keep your answers concise, structured (using markdown bullets when necessary), and clear.
- Do not make up any other contact information or addresses.
- If they ask about fees, mention that we offer flexible, affordable monthly structures starting from as low as $15/month depending on the course, and they can enroll directly using our "Enroll Now" form to get a personalized quote.
- Speak in grammatically pristine, beautiful English, and occasionally offer brief, gentle grammar tips if appropriate, but keep it subtle.
`;

    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: academyContext,
      },
    });

    // Reconstruct history if any
    if (history && Array.isArray(history)) {
      // The @google/genai chats.create doesn't take raw historical parameters in the exact same format,
      // but we can pass previous contents or just format a composite prompt.
      // Alternatively, we can let Gemini generate the chat response directly using generateContent with full chat prompt.
    }

    // Let's perform standard content generation to avoid session persistence edge cases in stateless environments
    const promptWithHistory = history && history.length > 0
      ? `${history.map((h: any) => `${h.role === 'user' ? 'Student' : 'Lia'}: ${h.text}`).join('\n')}\nStudent: ${message}\nLia:`
      : message;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptWithHistory,
      config: {
        systemInstruction: academyContext,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I am sorry, I couldn't process that. Please try again!";
    res.json({ reply });
  } catch (err: any) {
    console.error("Chat API Error:", err);
    res.status(500).json({ error: "Failed to generate response from Gemini AI. Please check your API key." });
  }
});

// API: Generate Placement Test
app.post("/api/placement-test", async (req, res) => {
  try {
    const { level } = req.body; // 'Beginner' | 'Intermediate' | 'Advanced'
    const chosenLevel = level || "Intermediate";

    const prompt = `
Generate a beautiful, customized 5-question English Placement Test for a student testing at the "${chosenLevel}" level.
The test must be output strictly as a JSON array where each item has the following structure:
{
  "id": number (1 to 5),
  "question": "A clear, challenging question or fill-in-the-blank prompt",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "The exact string corresponding to the correct option",
  "explanation": "A friendly and educational 1-2 sentence explanation of why this answer is correct, offering a quick tip."
}

Rules:
- Questions must strictly fit the "${chosenLevel}" proficiency level.
- Provide clear grammar, vocabulary, or situational questions.
- Return ONLY valid JSON array content without any markdown blocks like \`\`\`json.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["id", "question", "options", "correctAnswer", "explanation"]
          }
        },
        temperature: 0.8,
      }
    });

    const jsonText = response.text?.trim() || "[]";
    const quiz = JSON.parse(jsonText);
    res.json({ quiz });
  } catch (err: any) {
    console.error("Placement Test API Error:", err);
    res.status(500).json({ error: "Failed to generate placement test. Please ensure GEMINI_API_KEY is configured." });
  }
});

// API: Simulated Enrollment Request
app.post("/api/enroll", (req, res) => {
  const { name, email, phone, course, remarks, mode } = req.body;
  if (!name || !email || !course) {
    return res.status(400).json({ error: "Name, email, and course selection are required." });
  }

  // Generate a mock application reference ID
  const refId = "LT-" + Math.floor(100000 + Math.random() * 900000);

  console.log(`[Enrollment Received] Ref: ${refId} | Student: ${name} (${email}) | Course: ${course} | Mode: ${mode}`);

  res.json({
    success: true,
    refId,
    message: `Thank you, ${name}! Your enrollment request for "${course}" (${mode}) has been recorded. Reference Code: ${refId}. We will reach out to you within 24 hours.`
  });
});

// Integrate Vite Middleware for dev or serve dist in prod
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Failed to start server:", err);
});
