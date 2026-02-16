
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { GlobalState, UITheme, AssetType, AIProvider, AISettings } from './types';

const STORAGE_KEY = 'PIXEL_LEDGER_DATA_V2';

class DataService {
    static async save(state: GlobalState) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
    static async load(): Promise<GlobalState | null> {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    }
}

const INITIAL_STATE: GlobalState = {
  blocks: [],
  logs: [],
  mines: [],
  tradingPit: [],
  shield: { emergencyFund: 0, emergencyGoal: 0, insurancePolicies: [], debts: [] },
  user: {
    passwordHash: '8888',
    isDefaultPassword: true,
    username: 'OPERATOR_01',
    avatar: null,
    theme: UITheme.CLASSIC,
    crtEnabled: true,
    soundEnabled: true,
    ai: {
      provider: AIProvider.GEMINI,
      apiKey: '',
      baseUrl: '',
      model: 'gemini-3-flash-preview'
    }
  }
};

interface PixelStoreContextType {
  state: GlobalState;
  addBlock: (block: any) => void;
  deleteBlock: (id: string) => void;
  updateBlock: (id: string, balance: number) => void;
  addMine: (mine: any) => void;
  deleteMine: (id: string) => void;
  addInvestment: (investment: any) => void;
  deleteInvestment: (id: string) => void;
  updateShield: (shield: Partial<GlobalState['shield']>) => void;
  toggleTheme: () => void;
  updateUserSettings: (settings: Partial<GlobalState['user']>) => void;
  updatePassword: (newPassword: string) => void;
  updateAISettings: (ai: AISettings) => void;
  takeSnapshot: (memo: string) => void;
  exportData: () => void;
  importData: (data: GlobalState) => void;
}

const PixelContext = createContext<PixelStoreContextType | null>(null);

export const PixelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GlobalState>(INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    DataService.load().then(saved => {
        if (saved) setState(saved);
        setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (isLoaded) {
        DataService.save(state);
        document.body.setAttribute('data-theme', state.user.theme);
        document.body.className = state.user.crtEnabled ? 'crt-active crt-flicker' : '';
    }
  }, [state, isLoaded]);

  const updateState = useCallback((updater: (prev: GlobalState) => GlobalState) => {
    setState(prev => updater(prev));
  }, []);

  const addBlock = useCallback((block: any) => updateState(s => ({ ...s, blocks: [...s.blocks, { ...block, id: Math.random().toString(36).substr(2, 9) }] })), [updateState]);
  const deleteBlock = useCallback((id: string) => updateState(s => ({ ...s, blocks: s.blocks.filter(b => b.id !== id) })), [updateState]);
  const updateBlock = useCallback((id: string, balance: number) => updateState(s => ({ ...s, blocks: s.blocks.map(b => b.id === id ? { ...b, balance } : b) })), [updateState]);
  
  const addMine = useCallback((mine: any) => updateState(s => ({ ...s, mines: [...s.mines, { ...mine, id: Math.random().toString(36).substr(2, 9) }] })), [updateState]);
  const deleteMine = useCallback((id: string) => updateState(s => ({ ...s, mines: s.mines.filter(m => m.id !== id) })), [updateState]);

  const addInvestment = useCallback((investment: any) => updateState(s => ({ ...s, tradingPit: [...s.tradingPit, { ...investment, id: Math.random().toString(36).substr(2, 9) }] })), [updateState]);
  const deleteInvestment = useCallback((id: string) => updateState(s => ({ ...s, tradingPit: s.tradingPit.filter(i => i.id !== id) })), [updateState]);

  const updateShield = useCallback((shield: Partial<GlobalState['shield']>) => updateState(s => ({ ...s, shield: { ...s.shield, ...shield } })), [updateState]);

  const toggleTheme = useCallback(() => updateState(s => ({ 
    ...s, 
    user: { ...s.user, theme: s.user.theme === UITheme.CLASSIC ? UITheme.NEON : UITheme.CLASSIC } 
  })), [updateState]);

  const updateUserSettings = useCallback((settings: Partial<GlobalState['user']>) => updateState(s => ({
    ...s, user: { ...s.user, ...settings }
  })), [updateState]);

  const updatePassword = useCallback((newPassword: string) => updateState(s => ({
    ...s, user: { ...s.user, passwordHash: newPassword, isDefaultPassword: false }
  })), [updateState]);

  const updateAISettings = useCallback((ai: AISettings) => updateState(s => ({
    ...s, user: { ...s.user, ai }
  })), [updateState]);

  const takeSnapshot = useCallback((memo: string) => {
    const total = state.blocks.reduce((sum, b) => sum + b.balance, 0) + 
                  state.tradingPit.reduce((sum, i) => sum + (i.currentValue * i.quantity), 0);
    const last = state.logs[0];
    const newLog = {
        id: `0x${Math.random().toString(16).substr(2, 8)}`,
        timestamp: Date.now(),
        totalAssets: total,
        delta: last ? total - last.totalAssets : 0,
        memo,
        snapshot: [...state.blocks]
    };
    updateState(s => ({ ...s, logs: [newLog, ...s.logs].slice(0, 100) }));
  }, [state.blocks, state.tradingPit, state.logs, updateState]);

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(state)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pixel_ledger_export_${Date.now()}.json`;
    a.click();
  }, [state]);

  const importData = useCallback((data: GlobalState) => setState(data), []);

  const value = {
    state,
    addBlock, deleteBlock, updateBlock,
    addMine, deleteMine,
    addInvestment, deleteInvestment,
    updateShield,
    toggleTheme, updateUserSettings,
    updatePassword, updateAISettings,
    takeSnapshot, exportData, importData
  };

  // Fix: Use React.createElement instead of JSX syntax to resolve parser errors in .ts file (line 150)
  return React.createElement(PixelContext.Provider, { value }, children);
};

export const usePixelStore = () => {
  const context = useContext(PixelContext);
  if (!context) {
    throw new Error('usePixelStore must be used within a PixelProvider');
  }
  return context;
};
