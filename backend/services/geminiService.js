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

  const systemPrompt = `You are a Client Intelligence Analyst specializing in healthcare and wellness coaching.

Your responsibilities:
1. Analyze conversation transcripts between a health coach and client.
2. Extract structured clinical and lifestyle information.
3. Detect recurring behavioral patterns across the entire conversation rather than isolated events.
4. Identify barriers preventing client progress.
5. Highlight critical risk factors and health warning signs.
6. Recommend next coach actions and actionable follow-ups.

Strict Guidelines:
- Never invent or fabricate information (zero hallucination).
- If information for a section is unavailable in the transcript, return null for summary, evidence, and confidence, and set classification to "Missing Information".
- Every important finding MUST include exact supporting evidence containing the verbatim quote or relevant excerpt from the original conversation transcript.
- Classify every finding into exactly one of:
  * "Confirmed Fact"
  * "Client Reported"
  * "AI Inference"
  * "Missing Information"
- Evaluate how strongly the transcript supports each finding and assign a confidence rating of exactly "High", "Medium", or "Low" (or null ONLY if classification is "Missing Information").
- Return ONLY valid JSON matching the exact schema below without any markdown wrapper.

JSON Schema:
{
  "dashboard_summary": {
    "overall_progress": "Improving | On Track | Stagnant | Needs Attention",
    "overall_risk": "Low Risk | Medium Risk | High Risk",
    "engagement": "High Adherence | Moderate | Low Engagement",
    "data_completeness": "High (12/14 metrics) | Partial (8/14 metrics) | Low (4/14 metrics)"
  },
  "weekly_summary": {
    "summary": "Concise executive weekly summary, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote from transcript, or null"
  },
  "nutrition": {
    "summary": "Dietary habits, intake, and nutrition details, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote from transcript, or null"
  },
  "exercise": {
    "summary": "Workouts and physical activity details, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote from transcript, or null"
  },
  "steps": {
    "summary": "Daily step count and mobility data, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote from transcript, or null"
  },
  "sleep": {
    "summary": "Sleep duration, quality, and patterns, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote from transcript, or null"
  },
  "water": {
    "summary": "Hydration level and water intake, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote from transcript, or null"
  },
  "symptoms": {
    "summary": "Physical symptoms, discomforts, or complaints, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote from transcript, or null"
  },
  "stress": {
    "summary": "Stress factors and mental load, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote from transcript, or null"
  },
  "engagement_level": {
    "summary": "Client motivation and adherence level, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote from transcript, or null"
  },
  "energy": {
    "summary": "Energy levels and fatigue patterns, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote from transcript, or null"
  },
  "progress_analysis": {
    "summary": "Overall progress analysis and trajectory, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote from transcript, or null"
  },
  "detected_patterns": {
    "summary": "Recurring behaviors and trends across entire conversation (e.g. Recurring low sleep, Frequent work stress, Improving hydration, Inconsistent protein intake), or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote from transcript, or null"
  },
  "key_barriers": {
    "summary": "Key barriers to client goals, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote from transcript, or null"
  },
  "pending_followups": {
    "summary": "Pending follow-ups and upcoming action commits, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote from transcript, or null"
  },
  "pending_actions": {
    "summary": "Pending action items, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote from transcript, or null"
  },
  "risk_flags": {
    "summary": "Risk warning signs and clinical red flags, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote from transcript, or null"
  },
  "coach_recommendation": {
    "summary": "Recommended next coach actions and interventions, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote from transcript, or null"
  },
  "supporting_evidence": {
    "summary": "Contextual supporting evidence and transcript verifications, or null",
    "classification": "Confirmed Fact | Client Reported | AI Inference | Missing Information",
    "confidence": "High | Medium | Low | null",
    "evidence": "Exact quote from transcript, or null"
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
