

export enum AgentName {
  Nexus = 'Nexus',
  Cognito = 'Cognito',
  Relay = 'Relay',
  Sentinel = 'Sentinel',
  Echo = 'Echo',
}

export enum LogType {
  Genesis = 'genesis',
  Origin = 'origin',
  Event = 'event',
  Fragment = 'fragment',
  Consensus = 'consensus',
  Shim = 'shim',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
  Success = 'success',
}

export interface LogEntry {
  timestamp: string;
  message: string;
  type: LogType;
}

export interface AgentConfig {
  name: AgentName;
  role: string;
  expertise: string[];
  systemInstruction: string;
  model: string; // Gemini model to use for this agent
  color: string;
}

export interface AgentStatus {
  name: AgentName;
  status: string; // e.g., 'Idle', 'Thinking', 'Ready', 'Error'
  logs: LogEntry[];
  currentResponse: string;
  active: boolean;
}

export interface EditorContentPart {
  type: 'text' | 'image';
  content: string; // text or base64 data
  mimeType?: string; // e.g., 'image/png'
}

export interface CandidateResult {
  agentId: string;
  candidate: string; // The code chunk from the agent
  entropy: number;
}

export interface SortedChunk {
    agentId: string;
    chunk: string;
    rehashedSortKey: string; // The final SHA256 hash used for sorting
}

export interface ConsensusResult {
  assembledCode: string;
  assemblyChecksum: string; // MD5 checksum of the assembled code
  sortedChunks: SortedChunk[]; // The list of chunks in their final order
  score: number; // A composite score based on final metrics
  metrics: {
    coverage: number;
    avgClusterScore: number;
    scoreVariance: number;
    clusterCount: number; // Can be total fragments
    consensusStrength: number;
  };
  diversity: number;
  collaboration: number; // Can be based on how many agents contributed
  agentCount: number;
  roundCount: number;
  avgEntropy: number;
}


export interface AppSettings {
  quantumMode: boolean;
  hyperthreading: boolean;
  multiAgentMode: boolean;
  autoSave: boolean;
  agentCount: number;
  maxRounds: number;
  reasoningDepth: number;
  ollamaConnected: boolean; // Indicates if Ollama is connected or simulated
}

export interface FileMeta {
  name: string;
  lastModified: number;
}

export interface RecentFile {
  filename: string;
  content: string; // partial content for preview
  timestamp: number;
}

export interface GeminiContentPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

// Interface for AI Studio specific functions available on the window object
// FIX: Removed export to prevent declaration conflicts.

// FIX: Moved AIStudio interface into the `declare global` block to ensure it has a single, global definition,
// which resolves conflicts between multiple declarations of `window.aistudio`.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio: AIStudio;
  }
}
