export type Role = "user" | "assistant" | "system";

export type ModelTier = "fast" | "pro" | "ultra" | (string & {});

export interface UserModel {
  id?: string;
  _id?: string;
  name?: string;
  username?: string;
  email?: string;
  avatarUrl?: string;
  preferences?: {
    theme: "dark" | "light" | "system";
    reducedMotion: boolean;
  };
}

export interface ChatSessionMeta {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
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
    rateLimitRemaining?: number | null;
  };
}

export interface AIModelSettings {
  tier: ModelTier;
  temperature: number;
  maxTokens: number;
  topP: number;
  contextWindow: number;
}
