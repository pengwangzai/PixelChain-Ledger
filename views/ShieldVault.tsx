
import React, { useState } from 'react';
import { usePixelStore } from '../store';

export const ShieldVault: React.FC = () => {
  const { state, updateShield } = usePixelStore();
  const [editGoal, setEditGoal] = useState(false);
  const [newGoal, setNewGoal] = useState(state.shield.emergencyGoal);

  // Financial Calculations for Risk Ratio
  const liquidTotal = state.blocks.reduce((s, b) => s + b.balance, 0);
  const investmentTotal = state.tradingPit.reduce((s, i) => s + i.currentValue, 0);
  const mineTotal = state.mines.reduce((s, m) => s + m.currentAmount, 0);
  const totalAssets = liquidTotal + investmentTotal + mineTotal;
  const debtTotal = state.shield.debts.reduce((s, d) => s + d.amount, 0);
  
  const riskRatio = totalAssets > 0 ? (debtTotal / totalAssets) * 100 : (debtTotal > 0 ? 100 : 0);

  const shieldIntegrity = state.shield.emergencyGoal !== 0 ? (state.shield.emergencyFund / state.shield.emergencyGoal) * 100 : 0;
  const progressClamped = Math.min(100, Math.max(0, shieldIntegrity));

  const saveGoal = () => {
    updateShield({ emergencyGoal: newGoal });
    setEditGoal(false);
  };

  const getIntegrityStatus = () => {
    if (shieldIntegrity >= 100) return { label: '极限防御 // MAXIMUM_ARMOR', color: 'text-green-400' };
    if (shieldIntegrity > 75) return { label: '高度稳定 // STABLE_SHIELD', color: 'text-blue-400' };
    if (shieldIntegrity > 40) return { label: '警告: 护盾薄弱 // LOW_INTEGRITY', color: 'text-yellow-400' };
    return { label: '危险: 能量匮乏 // CRITICAL_FAILURE', color: 'text-red-500 animate-pulse' };
  };

  const getRiskStatus = (ratio: number) => {
    if (ratio === 0) return { label: '零风险 // ZERO_RISK', color: 'text-green-500', segments: 0 };
    if (ratio < 10) return { label: '安全 // SECURE', color: 'text-green-400', segments: 2 };
    if (ratio < 30) return { label: '可控 // CONTROLLED', color: 'text-yellow-400', segments: 4 };
    if (ratio < 50) return { label: '警戒 // CAUTION', color: 'text-orange-500', segments: 7 };
    return { label: '高危 // HIGH_ALERT', color: 'text-red-500 animate-pulse', segments: 10 };
  };

  const status = getIntegrityStatus();
  const risk = getRiskStatus(riskRatio);

  return (
    <div className="space-y-8 pb-10">
      <header className="border-b-2 border-red-500 pb-4">
        <h2 className="text-5xl glitch-hover cursor-default font-bold uppercase tracking-tighter text-red-500">能量护盾 // ENERGY_SHIELD</h2>
        <p className="text-red-500/70 font-mono text-sm tracking-widest mt-1 uppercase">
          <span className="animate-pulse mr-2">●</span> 核心安全协议及紧急避险储备金已上线
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Integrity Display */}
        <div className="bg-black/60 pixel-border-red border-red-900 p-8 space-y-8 flex flex-col relative overflow-hidden group hover:bg-black/80 transition-all">
            <div className="absolute inset-0 pointer-events-none opacity-5">
                <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#ff0000_3px)]"></div>
            </div>

            <div className="flex justify-between items-start z-10">
                <div className="flex flex-col">
                    <h3 className="text-2xl font-bold uppercase tracking-tighter text-red-400">护盾完整度控制台</h3>
                    <span className={`text-[10px] font-mono uppercase tracking-[0.2em] ${status.color}`}>
                        Status: {status.label}
                    </span>
                </div>
                <div className="text-right">
                    <div className="text-[10px] text-red-900 font-mono uppercase">Node_ID</div>
                    <div className="text-sm font-mono text-red-700">SHLD_0x82A1</div>
                </div>
            </div>
            
            <div className="relative flex flex-col items-center justify-center py-6 z-10">
                <div className={`text-[100px] leading-none mb-4 transition-transform duration-500 ${shieldIntegrity < 40 ? 'animate-pulse scale-110' : 'group-hover:scale-105'}`}>
                    {shieldIntegrity >= 100 ? '🛡️' : shieldIntegrity > 0 ? '🔋' : '⚠️'}
                </div>
                <div className="text-5xl font-bold text-white font-mono tracking-tighter">
                    {Math.round(shieldIntegrity)}%
                </div>
                <div className="text-[10px] text-red-900 font-mono uppercase mt-1">Integrity_Coefficient</div>
            </div>

            {/* Visual Progress Bar - The Big One */}
            <div className="space-y-3 z-10">
                <div className="flex justify-between items-end px-1">
                    <span className="text-[10px] text-red-500 font-mono uppercase tracking-widest">能量加载进度 // POWER_LEVEL</span>
                    <span className="text-[10px] text-red-900 font-mono uppercase">Cap: {state.shield.emergencyGoal.toLocaleString()}</span>
                </div>
                <div className="h-10 bg-red-900/20 pixel-border-red border-red-900 relative overflow-hidden p-1">
                    <div 
                        className={`h-full transition-all duration-1000 ease-out relative ${shieldIntegrity >= 100 ? 'bg-green-500 shadow-[0_0_20px_#00ff41]' : 'bg-red-500 shadow-[0_0_15px_#ff0000]'}`} 
                        style={{ width: `${progressClamped}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 skew-x-12 animate-[pulse_2s_infinite]"></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 z-10">
                <div className="space-y-2">
                    <label className="text-[10px] text-red-900 font-mono uppercase tracking-tighter">当前应急储备 (LIQUID_VAULT)</label>
                    <div className="bg-black/40 border-2 border-red-900 p-4 pixel-border-red group-hover:border-red-500 transition-colors">
                        <div className="flex items-center">
                            <span className="text-xl text-red-500 font-mono mr-2">￥</span>
                            <input 
                                type="number" 
                                className="bg-transparent border-none outline-none w-full text-2xl font-bold text-white font-mono tracking-tighter"
                                value={state.shield.emergencyFund}
                                onChange={e => updateShield({ emergencyFund: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] text-red-900 font-mono uppercase tracking-tighter">目标护盾强度 (GOAL_CAPACITY)</label>
                    <div className={`bg-black/40 border-2 p-4 pixel-border-red transition-all ${editGoal ? 'border-yellow-500' : 'border-red-900 group-hover:border-red-500'}`}>
                        {editGoal ? (
                            <div className="flex items-center space-x-2">
                                <span className="text-xl text-yellow-500 font-mono">￥</span>
                                <input 
                                    className="bg-transparent border-none outline-none w-full text-2xl font-bold text-white font-mono tracking-tighter" 
                                    type="number" 
                                    autoFocus
                                    value={newGoal} 
                                    onChange={e => setNewGoal(parseFloat(e.target.value) || 0)} 
                                />
                                <button onClick={saveGoal} className="text-xs font-mono text-green-500 hover:text-green-300 uppercase underline">存入</button>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center h-8">
                                <span className="text-2xl font-bold text-white font-mono tracking-tighter">￥{state.shield.emergencyGoal.toLocaleString()}</span>
                                <button onClick={() => setEditGoal(true)} className="text-[10px] text-red-500 hover:text-red-300 font-mono uppercase underline decoration-dotted">重调</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Financial Risk / Debt-to-Asset Ratio */}
            <div className="pt-6 border-t border-red-900/30 z-10 space-y-4">
                <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-red-500">财务风险指数 // RISK_EXPOSURE</h4>
                    <span className={`text-xs font-mono ${risk.color}`}>{risk.label}</span>
                </div>
                <div className="bg-black/40 p-4 pixel-border-red border-red-900">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] text-red-900 uppercase font-mono">债务/资产比率 (DEBT_RATIO)</span>
                        <span className={`text-xl font-bold font-mono ${risk.color}`}>{riskRatio.toFixed(1)}%</span>
                    </div>
                    {/* Segmented Risk Meter */}
                    <div className="flex space-x-1 h-4">
                        {[...Array(10)].map((_, i) => {
                            const isActive = i < Math.ceil(riskRatio / 10);
                            const segmentColor = i < 3 ? 'bg-green-500' : i < 6 ? 'bg-yellow-500' : 'bg-red-500';
                            return (
                                <div 
                                    key={i} 
                                    className={`flex-1 ${isActive ? segmentColor : 'bg-red-900/10'} border border-red-900/20 transition-all duration-500`}
                                    style={{ boxShadow: isActive ? `0 0 5px ${segmentColor.replace('bg-', '')}` : 'none' }}
                                ></div>
                            );
                        })}
                    </div>
                    <div className="mt-2 text-[8px] text-red-900 font-mono uppercase tracking-tighter flex justify-between">
                        <span>Total_Assets: ￥{totalAssets.toLocaleString()}</span>
                        <span>Total_Debt: ￥{debtTotal.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="pt-4 flex justify-between items-center opacity-40 text-[8px] font-mono text-red-900 uppercase tracking-[0.3em] z-10">
                <span>Buffer_Status: Optimized</span>
                <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-red-500 animate-flicker"></div>
                    <div className="w-1.5 h-1.5 bg-red-500 animate-flicker" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-1.5 h-1.5 bg-red-500 animate-flicker" style={{animationDelay: '0.2s'}}></div>
                </div>
            </div>
        </div>

        {/* Debt & Insurance Details */}
        <div className="space-y-6">
            <section className="bg-black/40 pixel-border-red border-red-900/50 p-6 hover:bg-black/60 transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-2 text-[8px] font-mono text-red-900 opacity-20">MEM_LEAK_DETECTED</div>
                <h3 className="text-2xl text-red-500 font-bold uppercase tracking-tighter mb-6 flex justify-between items-center">
                    <span>护盾漏洞 // DEBT_EXPOSURE</span>
                    <button className="text-[10px] font-mono text-red-800 hover:text-red-400 uppercase underline decoration-dotted">记录漏洞</button>
                </h3>
                <div className="space-y-4">
                    {state.shield.debts.length === 0 && (
                        <div className="py-10 border-2 border-dashed border-red-900/30 text-center">
                            <div className="text-3xl mb-2 opacity-20">🛡️</div>
                            <div className="text-xs text-red-900 font-mono uppercase tracking-widest">护盾未受损 // NO_DEBTS_ACTIVE</div>
                        </div>
                    )}
                    {state.shield.debts.map(debt => (
                        <div key={debt.id} className="flex justify-between items-center bg-red-900/10 p-4 border border-red-900/30 hover:border-red-500 transition-colors group">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-red-600 animate-pulse"></div>
                                <span className="text-lg font-mono uppercase text-red-100">{debt.name}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold font-mono text-red-500">-￥{debt.amount.toLocaleString()}</span>
                                <div className="text-[8px] text-red-900 font-mono">INT_RATE: {debt.interest}%</div>
                            </div>
                        </div>
                    ))}
                </div>
                {state.shield.debts.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-red-900/30 flex justify-between items-center">
                        <span className="text-xs text-red-900 font-mono uppercase">总负债流量</span>
                        <span className="text-xl font-bold text-red-600 font-mono">
                            -￥{state.shield.debts.reduce((s, d) => s + d.amount, 0).toLocaleString()}
                        </span>
                    </div>
                )}
            </section>

            <section className="bg-black/40 pixel-border border-green-900/50 p-6 hover:bg-black/60 transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-2 text-[8px] font-mono text-green-900 opacity-20">REPAIR_MODULE_V3</div>
                <h3 className="text-2xl text-green-500 font-bold uppercase tracking-tighter mb-6 flex justify-between items-center">
                    <span>外部修补协议 // INSURANCE</span>
                    <button className="text-[10px] font-mono text-green-800 hover:text-green-400 uppercase underline decoration-dotted">添加防护层</button>
                </h3>
                <div className="space-y-4">
                    {state.shield.insurancePolicies.length === 0 && (
                        <div className="py-10 border-2 border-dashed border-green-900/30 text-center">
                            <div className="text-3xl mb-2 opacity-20">🩹</div>
                            <div className="text-xs text-green-900 font-mono uppercase tracking-widest">暂无外部修补协议 // NO_POLICIES</div>
                        </div>
                    )}
                    {state.shield.insurancePolicies.map(ins => (
                        <div key={ins.id} className="flex justify-between items-center bg-green-900/10 p-4 border border-green-900/30 hover:border-green-400 transition-colors">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-green-600 animate-pulse"></div>
                                <span className="text-lg font-mono uppercase text-green-100">{ins.name}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-xl font-bold font-mono text-green-500">￥{ins.coverage.toLocaleString()}</span>
                                <div className="text-[8px] text-green-900 font-mono uppercase">COVERAGE_LIMIT</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
      </div>
    </div>
  );
};
