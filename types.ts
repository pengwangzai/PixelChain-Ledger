
export enum AssetType {
  CASH = 'CASH',
  BANK = 'BANK',
  WECHAT = 'WECHAT',
  ALIPAY = 'ALIPAY',
  CRYPTO = 'CRYPTO',
  STOCK = 'STOCK',
  REAL_ESTATE = 'REAL_ESTATE',
  INSURANCE = 'INSURANCE',
  DEBT = 'DEBT'
}

export enum UITheme {
  CLASSIC = 'CLASSIC',
  NEON = 'NEON'
}

export interface AssetBlock {
  id: string;
  name: string;
  type: AssetType;
  balance: number;
  icon: string;
}

export interface HashLog {
  id: string;
  timestamp: number;
  totalAssets: number;
  delta: number;
  memo: string;
  snapshot: AssetBlock[];
}

export type InvestmentType = 'STOCK' | 'FUND' | 'CRYPTO' | 'METAL';

export interface Investment {
  id: string;
  name: string;
  code: string;
  buyDate: string;
  cost: number;
  quantity: number;
  currentValue: number;
  type: InvestmentType;
}

export interface FutureMine {
  id: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  monthlyContribution: number;
  type: 'PENSION' | 'SOCIAL_SECURITY' | 'SAVINGS';
}

export interface ShieldVault {
  emergencyFund: number;
  emergencyGoal: number;
  insurancePolicies: { id: string; name: string; coverage: number; premium: number }[];
  debts: { id: string; name: string; amount: number; interest: number }[];
}

export enum AIProvider {
  GEMINI = 'GEMINI',
  DEEPSEEK = 'DEEPSEEK',
  KIMI = 'KIMI',
  DOUBAO = 'DOUBAO'
}

export interface AISettings {
  provider: AIProvider;
  apiKey: string;
  baseUrl: string;
  model: string;
}

export interface UserSettings {
  passwordHash: string;
  isDefaultPassword: boolean;
  username: string;
  avatar: string | null; // Base64 pixelated image
  theme: UITheme;
  crtEnabled: boolean;
  soundEnabled: boolean;
  ai: AISettings;
}

export interface GlobalState {
  blocks: AssetBlock[];
  logs: HashLog[];
  mines: FutureMine[];
  tradingPit: Investment[];
  shield: ShieldVault;
  user: UserSettings;
}
