export type Role = "user" | "assistant" | "system";

export type ModelTier = "fast" | "pro" | "ultra";

export interface UserModel {
  id: string;
  name: string;
  avatarUrl?: string;
  preferences: {
    theme: "dark" | "light" | "system";
    reducedMotion: boolean;
  };
}

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  metadata?: {
    isTyping?: boolean;
    tokensUsed?: number;
    modelUsed?: ModelTier;
  };
}

export interface AIModelSettings {
  tier: ModelTier;
  temperature: number;
  maxTokens: number;
  topP: number;
  contextWindow: number;
}
