import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Analyzes a health coaching transcript using Google's Gemini API
 * and returns structured client wellness intelligence.
 * 
 * @param {string} conversation - The transcript text to analyze.
 * @param {object} [metadata] - Optional session metadata (client_name, client_id, session_type, session_date).
 * @returns {Promise<object>} The analyzed JSON client intelligence object.
 */
export async function analyzeConversation(conversation, metadata = null) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Gemini API key is not defined. Please obtain a free developer key from Google AI Studio and configure GEMINI_API_KEY in your backend/.env file.');
  }

  // Initialize the Gemini client
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Use gemini-2.5-flash for fast and cost-effective structured text generation
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: { responseMimeType: 'application/json' }
  });

  const systemPrompt = `You are a healthcare conversation analysis assistant.

Analyze the conversation between a health coach and client.
Your job is to extract structured client intelligence.

Never invent information (never hallucinate). If something is missing, return null.

For every finding classify the source of information as exactly one of:
- "Confirmed Fact"
- "Client Reported"
- "AI Inference"
- "Missing Information"

Return ONLY valid JSON. Do not output markdown.

For every section, include:
- summary
- classification
- confidence
- evidence

Supporting evidence must contain exact quotes from the conversation.
Confidence should be "High", "Medium", or "Low" (or null if the section has Missing Information).

Your JSON output must follow this exact structure (do not add or change top-level keys):
{
  "weekly_summary": {
    "summary": "Concise weekly summary, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote, or null"
  },
  "nutrition": {
    "summary": "Nutrition details, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote, or null"
  },
  "exercise": {
    "summary": "Exercise details, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote, or null"
  },
  "steps": {
    "summary": "Step count details, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote, or null"
  },
  "sleep": {
    "summary": "Sleep patterns, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote, or null"
  },
  "water": {
    "summary": "Water intake details, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote, or null"
  },
  "symptoms": {
    "summary": "Symptoms reported, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote, or null"
  },
  "stress": {
    "summary": "Stress levels, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote, or null"
  },
  "engagement_level": {
    "summary": "Engagement/motivation rating, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote, or null"
  },
  "energy": {
    "summary": "Energy levels and fatigue patterns, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote, or null"
  },
  "progress_analysis": {
    "summary": "Overall progress analysis and trajectory, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote, or null"
  },
  "key_barriers": {
    "summary": "Key barriers to goals, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote, or null"
  },
  "pending_followups": {
    "summary": "Pending follow-ups and next steps, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote, or null"
  },
  "pending_actions": {
    "summary": "Pending actions/commits, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote, or null"
  },
  "risk_flags": {
    "summary": "Risk warning signs, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote, or null"
  },
  "coach_recommendation": {
    "summary": "Coach guidelines, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote, or null"
  },
  "supporting_evidence": {
    "summary": "Supporting evidence context, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote, or null"
  }
}`;

  try {
    const prompt = `${systemPrompt}\n\nHere is the coaching transcript to analyze:\n\n${conversation}`;
    
    // Call the model generateContent API
    const responseResult = await model.generateContent(prompt);
    const content = responseResult.response.text();

    if (!content) {
      throw new Error('Gemini returned an empty response.');
    }

    // Parse the JSON string to return it as a structured object
    const parsedData = JSON.parse(content.trim());

    // Append default human review status & session metadata
    parsedData.human_review = {
      status: 'Pending'
    };

    if (metadata) {
      parsedData.session_metadata = metadata;
    }

    return parsedData;
  } catch (error) {
    console.error('Error in Gemini analysis service:', error);
    throw error;
  }
}
