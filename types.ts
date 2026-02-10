export enum IndustryMode {
  ACADEMIC = 'STUDENT',
  ECOMMERCE = 'BUSINESS',
  CREATIVE = 'DESIGN',
  GENERAL = 'LIFE'
}

export enum AppSection {
  DASHBOARD = 'DASHBOARD',
  STRATEGIST = 'STRATEGIST',
  VISUALIZER = 'VISUALIZER',
  VOICE = 'VOICE'
}

export type IngestionType = 'TASK' | 'EVENT' | 'NOTE' | 'ACTION' | 'SALES' | 'INVENTORY' | 'CRM' | 'UNKNOWN';

export interface IngestedItem {
  id: string;
  type: IngestionType;
  content: string;
  timestamp: number;
  mode: IndustryMode;
  metadata?: {
    deadline?: string;
    priority?: 'LOW' | 'MED' | 'HIGH';
    tags?: string[];
  };
}

/**
 * Interface representing the autonomous planning output from the agent.
 */
export interface AgentPlan {
  goalSummary: string;
  reasoningSteps: {
    thought: string;
    action: string;
  }[];
  finalStrategy: string;
  potentialRisks: string[];
}

/**
 * Interface for daily briefing data generated from user items.
 */
export interface DailyBrief {
  schedule: string[];
  bigWin: string;
  creativeTip: string;
}

/**
 * Interface for system diagnostic results analyzing goals and failures.
 */
export interface DiagnosticResult {
  systemOverview: string;
  failureLoop: {
    name: string;
    stages: string[];
    triggerPoints: string[];
  };
  minimalChange: string;
  brutalTruth: string;
}

/**
 * Valid resolutions for Gemini 3 Pro image generation.
 */
export type ImageSize = '1K' | '2K' | '4K';