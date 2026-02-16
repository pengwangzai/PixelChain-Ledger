
import React, { useState } from 'react';
import { usePixelStore } from '../store';

export const FutureMine: React.FC = () => {
  const { state, addMine, deleteMine } = usePixelStore();
  const [isAdding, setIsAdding] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newMine, setNewMine] = useState({ name: '', currentAmount: 0, targetAmount: 100000, monthlyContribution: 0, type: 'SAVINGS' as any });

  const handleAdd = () => {
    if (newMine.name) {
      addMine(newMine);
      setIsAdding(false);
      setNewMine({ name: '', currentAmount: 0, targetAmount: 100000, monthlyContribution: 0, type: 'SAVINGS' });
    }
  };

  const performDelete = (id: string) => {
    setDeletingId(id);
    // 延迟执行实际删除，以展示“崩解”动画
    setTimeout(() => {
      deleteMine(id);
      setDeletingId(null);
      setConfirmingDelete(null);
    }, 500);
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl glitch-hover cursor-default font-bold uppercase tracking-tighter">未来矿场 // FUTURE_MINE</h2>
          <p className="text-green-500/70 text-sm font-mono tracking-widest uppercase mt-1">
            <span className="animate-pulse">●</span> 长期价值提取与积累协议
          </p>
        </div>
        <button 
          onClick={() => setIsAdding(true)} 
          className="pixel-border px-6 py-2 bg-blue-600 hover:bg-blue-500 font-bold hover-shake transition-all text-white uppercase tracking-tighter shadow-[4px_4px_0px_#000]"
        >
          启动挖掘项目
        </button>
      </header>

      {isAdding && (
          <div className="p-6 bg-black/60 pixel-border border-blue-500 space-y-6 relative overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/30"></div>
              <h3 className="text-2xl text-blue-400 font-mono tracking-tighter flex items-center">
                <span className="mr-3 animate-pulse">▶</span> 初始化矿产项目协议...
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] text-blue-800 font-mono uppercase tracking-widest">项目代号 (ID_NAME)</label>
                    <input placeholder="例如: 公积金提取节点" className="w-full bg-black border-2 p-3 border-blue-900 outline-none text-blue-400 focus:border-blue-400 transition-colors font-mono" value={newMine.name} onChange={e => setNewMine({...newMine, name: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-blue-800 font-mono uppercase tracking-widest">已采集量 (EXTRACTED)</label>
                    <input type="number" placeholder="0.00" className="w-full bg-black border-2 p-3 border-blue-900 outline-none text-blue-400 focus:border-blue-400 transition-colors font-mono" value={newMine.currentAmount} onChange={e => setNewMine({...newMine, currentAmount: parseFloat(e.target.value) || 0})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-blue-800 font-mono uppercase tracking-widest">储量目标 (CAPACITY)</label>
                    <input type="number" placeholder="100000.00" className="w-full bg-black border-2 p-3 border-blue-900 outline-none text-blue-400 focus:border-blue-400 transition-colors font-mono" value={newMine.targetAmount} onChange={e => setNewMine({...newMine, targetAmount: parseFloat(e.target.value) || 0})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-blue-800 font-mono uppercase tracking-widest">月度挖掘率 (FLOW_RATE)</label>
                    <input type="number" placeholder="0.00" className="w-full bg-black border-2 p-3 border-blue-900 outline-none text-blue-400 focus:border-blue-400 transition-colors font-mono" value={newMine.monthlyContribution} onChange={e => setNewMine({...newMine, monthlyContribution: parseFloat(e.target.value) || 0})} />
                  </div>
              </div>
              <div className="flex space-x-4 pt-2">
                <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-500 px-8 py-2 text-white font-bold pixel-border border-black transition-all active:scale-95 uppercase tracking-tighter">部署挖掘</button>
                <button onClick={() => setIsAdding(false)} className="bg-red-600 hover:bg-red-500 px-8 py-2 text-white font-bold pixel-border border-black transition-all active:scale-95 uppercase tracking-tighter">终止进程</button>
              </div>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {state.mines.map(mine => {
            const progress = (mine.currentAmount / mine.targetAmount) * 100;
            const isConfirming = confirmingDelete === mine.id;
            const isDeleting = deletingId === mine.id;

            return (
                <div 
                    key={mine.id} 
                    className={`bg-black/40 pixel-border border-blue-900 p-6 space-y-4 relative group hover:border-blue-400 transition-all ${isConfirming ? 'pixel-border-red border-red-500 shadow-[0_0_20px_rgba(255,0,0,0.2)]' : ''} ${isDeleting ? 'disintegrate' : ''}`}
                >
                    {!isConfirming ? (
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setConfirmingDelete(mine.id)} 
                            className="text-red-600 text-[10px] font-mono hover:text-red-400 uppercase underline decoration-dotted tracking-tighter"
                          >
                            销毁项目 // DELETE_NODE
                          </button>
                        </div>
                    ) : (
                        <div className="absolute inset-0 bg-red-900/90 z-20 flex flex-col items-center justify-center space-y-4 p-4 animate-in fade-in duration-200">
                           <div className="text-xl font-bold text-white uppercase tracking-widest animate-pulse">确认销毁该挖掘节点？</div>
                           <div className="text-[10px] text-red-200 uppercase font-mono tracking-tighter text-center">
                              所有历史开采协议及其关联数据将永久丢失。
                           </div>
                           <div className="flex space-x-4">
                              <button 
                                onClick={() => performDelete(mine.id)} 
                                className="bg-white text-red-600 font-bold px-4 py-1 pixel-border border-black hover:bg-red-100 transition-colors uppercase tracking-tighter"
                              >
                                确认销毁
                              </button>
                              <button 
                                onClick={() => setConfirmingDelete(null)} 
                                className="bg-black text-white font-bold px-4 py-1 border border-white hover:bg-white/10 transition-colors uppercase tracking-tighter"
                              >
                                取消
                              </button>
                           </div>
                        </div>
                    )}

                    <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors leading-none tracking-tighter uppercase">{mine.name}</h4>
                          <span className="text-[10px] text-blue-700 font-mono uppercase tracking-widest">MINING_NODE_STABLE</span>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] opacity-40 uppercase font-mono tracking-tighter">已提取 // EXTRACTED</div>
                            <div className="text-2xl font-bold font-mono">￥{mine.currentAmount.toLocaleString()}</div>
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-blue-500 font-mono uppercase tracking-tighter">
                            <span>挖掘进度 // PROGRESS</span>
                            <span>{progress.toFixed(1)}%</span>
                        </div>
                        <div className="h-4 bg-blue-900/30 pixel-border border-blue-900 flex overflow-hidden">
                            <div 
                                className="bg-blue-500 h-full shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-pulse" 
                                style={{ width: `${Math.min(100, progress)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                        <div className="p-3 bg-blue-900/10 border border-blue-900/40 group-hover:border-blue-500 transition-colors">
                            <div className="text-[10px] opacity-60 uppercase font-mono tracking-tighter">目标储备 (CAPACITY)</div>
                            <div className="text-lg font-bold font-mono">￥{mine.targetAmount.toLocaleString()}</div>
                        </div>
                        <div className="p-3 bg-blue-900/10 border border-blue-900/40 group-hover:border-blue-500 transition-colors">
                            <div className="text-[10px] opacity-60 uppercase font-mono tracking-tighter">月度挖掘速率 (RATE)</div>
                            <div className="text-lg font-bold font-mono text-blue-400">+￥{mine.monthlyContribution.toLocaleString()}</div>
                        </div>
                    </div>
                    
                    <div className="pt-2 opacity-0 group-hover:opacity-40 transition-opacity flex justify-between items-center text-[8px] font-mono text-blue-900 uppercase tracking-[0.2em]">
                      <span>Protocol: SHA-256_ACTIVE</span>
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-blue-500 animate-flicker"></div>
                        <div className="w-1 h-1 bg-blue-500 animate-flicker" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-1 h-1 bg-blue-500 animate-flicker" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                </div>
            );
        })}
        {state.mines.length === 0 && (
          <div className="col-span-full py-20 border-2 border-dashed border-blue-900/30 text-center opacity-30 italic pixel-border hover:opacity-50 transition-opacity cursor-pointer" onClick={() => setIsAdding(true)}>
              <div className="text-5xl mb-4 animate-bounce">⛏️</div>
              <p className="text-2xl font-mono uppercase tracking-widest">目前无矿产项目 // NO_MINES_ACTIVE</p>
              <p className="text-xs mt-2 uppercase tracking-widest text-blue-400">点击此处或右上角启动新的价值提取协议</p>
          </div>
        )}
      </div>
    </div>
  );
};
