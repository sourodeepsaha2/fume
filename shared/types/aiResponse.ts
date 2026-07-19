export type ClassificationType = 
  | 'Confirmed Fact' 
  | 'Client Reported' 
  | 'AI Inference' 
  | 'Missing Information';

export type ConfidenceType = 'Low' | 'Medium' | 'High' | null;

export interface AISection {
  summary: string | null;
  classification: ClassificationType;
  confidence: ConfidenceType;
  evidence: string | null;
}

export interface HumanReview {
  status: 'Pending' | 'Approved' | 'Rejected' | string;
}

export interface AIResponse {
  weekly_summary: AISection;
  nutrition: AISection;
  exercise: AISection;
  steps: AISection;
  sleep: AISection;
  water: AISection;
  symptoms: AISection;
  stress: AISection;
  engagement_level: AISection;
  key_barriers: AISection;
  pending_actions: AISection;
  risk_flags: AISection;
  coach_recommendation: AISection;
  supporting_evidence: AISection;
  human_review: HumanReview;
}
