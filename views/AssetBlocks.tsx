
import React, { useState } from 'react';
import { usePixelStore } from '../store';
import { AssetType } from '../types';

export const AssetBlocks: React.FC = () => {
  const { state, addBlock, updateBlock, deleteBlock, takeSnapshot } = usePixelStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newBlock, setNewBlock] = useState({ name: '', type: AssetType.CASH, balance: 0, icon: '💰' });
  
  // Track jumping state for each block
  const [jumpingNodes, setJumpingNodes] = useState<Record<string, boolean>>({});

  const handleAdd = () => {
    if (newBlock.name) {
      addBlock(newBlock);
      setNewBlock({ name: '', type: AssetType.CASH, balance: 0, icon: '💰' });
      setIsAdding(false);
    }
  };

  const handleSync = () => {
      const memo = prompt("请输入区块同步备注 (HASH_MEMO):");
      if (memo !== null) {
          takeSnapshot(memo || "手动区块同步");
          alert("快照已成功添加至区块链！ // SNAPSHOT_COMMITTED_TO_LEDGER");
      }
  };

  const onUpdateBalance = (id: string, val: number) => {
    updateBlock(id, val);
    // Trigger jump animation
    setJumpingNodes(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setJumpingNodes(prev => ({ ...prev, [id]: false }));
    }, 150);
  };

  const typeLabels: Record<AssetType, string> = {
      [AssetType.CASH]: '现金 (CASH)',
      [AssetType.BANK]: '银行 (BANK)',
      [AssetType.WECHAT]: '微信支付 (WECHAT)',
      [AssetType.ALIPAY]: '支付宝 (ALIPAY)',
      [AssetType.CRYPTO]: '加密货币 (CRYPTO)',
      [AssetType.STOCK]: '股票 (STOCK)',
      [AssetType.REAL_ESTATE]: '不动产 (REAL_ESTATE)',
      [AssetType.INSURANCE]: '保险 (INSURANCE)',
      [AssetType.DEBT]: '债务 (DEBT)'
  };

  const getBorderClass = (type: AssetType) => {
    switch (type) {
      case AssetType.CASH:
      case AssetType.ALIPAY:
      case AssetType.WECHAT:
        return 'pixel-border'; // Default Green
      case AssetType.BANK:
      case AssetType.REAL_ESTATE:
      case AssetType.INSURANCE:
        return 'pixel-border-blue';
      case AssetType.STOCK:
      case AssetType.CRYPTO:
        return 'pixel-border-purple';
      case AssetType.DEBT:
        return 'pixel-border-red';
      default:
        return 'pixel-border';
    }
  };

  const getAccentColorClass = (type: AssetType) => {
    switch (type) {
      case AssetType.CASH:
      case AssetType.ALIPAY:
      case AssetType.WECHAT:
        return 'text-green-400 group-hover:text-green-300';
      case AssetType.BANK:
      case AssetType.REAL_ESTATE:
      case AssetType.INSURANCE:
        return 'text-blue-400 group-hover:text-blue-300';
      case AssetType.STOCK:
      case AssetType.CRYPTO:
        return 'text-purple-400 group-hover:text-purple-300';
      case AssetType.DEBT:
        return 'text-red-400 group-hover:text-red-300';
      default:
        return 'text-green-400';
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-5xl glitch-hover cursor-default">资产区块 // ASSET_BLOCKS</h2>
          <p className="text-green-500/70 font-mono text-sm tracking-widest mt-1 uppercase">
            <span className="animate-pulse mr-2">●</span> 独立账户存储节点已就绪
          </p>
        </div>
        <div className="flex space-x-4 w-full md:w-auto">
            <button 
                onClick={() => setIsAdding(true)}
                className="pixel-border flex-1 md:flex-none px-6 py-3 bg-green-500 text-black hover:bg-green-400 active:scale-95 transition-all font-bold hover-shake uppercase tracking-tighter"
            >
                + 添加新节点
            </button>
            <button 
                onClick={handleSync}
                className="pixel-border border-purple-500 flex-1 md:flex-none px-6 py-3 bg-purple-600 text-white hover:bg-purple-500 active:scale-95 transition-all font-bold hover-shake uppercase tracking-tighter shadow-[4px_4px_0px_#1a1a2e,4px_4px_0px_2px_#bc13fe]"
            >
                全链同步
            </button>
        </div>
      </header>

      {isAdding && (
        <div className="p-8 bg-black/80 pixel-border border-yellow-400 space-y-6 relative overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400/20"></div>
          <h3 className="text-2xl text-yellow-400 font-mono tracking-tighter flex items-center">
             <span className="mr-3 animate-bounce">▶</span> 初始化新资产区块协议...
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-[10px] text-yellow-600 font-mono uppercase">区块名称 (NODE_NAME)</label>
                <input 
                  className="w-full bg-black border-2 border-green-900 p-3 outline-none text-green-400 focus:border-yellow-400 transition-colors font-mono" 
                  placeholder="例如: 核心储蓄节点" 
                  value={newBlock.name}
                  onChange={e => setNewBlock({...newBlock, name: e.target.value})}
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] text-yellow-600 font-mono uppercase">资产类型 (MODALITY)</label>
                <select 
                  className="w-full bg-black border-2 border-green-900 p-3 outline-none text-green-400 focus:border-yellow-400 transition-colors font-mono"
                  value={newBlock.type}
                  onChange={e => setNewBlock({...newBlock, type: e.target.value as AssetType})}
                >
                  {Object.values(AssetType).map(t => <option key={t} value={t}>{typeLabels[t]}</option>)}
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-[10px] text-yellow-600 font-mono uppercase">初始余额 (INIT_VALUE)</label>
                <input 
                  type="number"
                  className="w-full bg-black border-2 border-green-900 p-3 outline-none text-green-400 focus:border-yellow-400 transition-colors font-mono" 
                  placeholder="0.00" 
                  value={newBlock.balance}
                  onChange={e => setNewBlock({...newBlock, balance: parseFloat(e.target.value) || 0})}
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] text-yellow-600 font-mono uppercase">视觉标识 (ICON_HEX)</label>
                <input 
                  className="w-full bg-black border-2 border-green-900 p-3 outline-none text-center text-2xl focus:border-yellow-400 transition-colors" 
                  placeholder="🌐" 
                  value={newBlock.icon}
                  onChange={e => setNewBlock({...newBlock, icon: e.target.value})}
                />
            </div>
          </div>
          <div className="flex space-x-4 pt-4">
            <button onClick={handleAdd} className="bg-yellow-500 hover:bg-yellow-400 px-8 py-2 text-black font-bold pixel-border border-black transition-all active:scale-95">注入协议</button>
            <button onClick={() => setIsAdding(false)} className="bg-red-600 hover:bg-red-500 px-8 py-2 text-white font-bold pixel-border border-black transition-all active:scale-95">终止进程</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {state.blocks.map(block => {
          const borderClass = getBorderClass(block.type);
          const accentColorClass = getAccentColorClass(block.type);
          
          return (
            <div key={block.id} className={`relative p-6 bg-black/40 ${borderClass} hover:border-white transition-all group hover:-translate-y-1 hover-shake`}>
              <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => deleteBlock(block.id)} className="text-red-600 text-[10px] font-mono hover:text-red-400 uppercase underline decoration-dotted">销毁区块</button>
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 flex items-center justify-center bg-green-900/10 pixel-border border-green-900/40 text-4xl group-hover:bg-green-500/20 group-hover:border-green-400 transition-all grayscale group-hover:grayscale-0">
                  {block.icon}
                </div>
                <div>
                  <h4 className={`text-3xl font-bold leading-none tracking-tighter text-white transition-colors ${accentColorClass}`}>{block.name}</h4>
                  <span className="text-[10px] opacity-50 font-mono uppercase tracking-widest">{typeLabels[block.type]}</span>
                </div>
              </div>

              <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] opacity-60 font-mono uppercase">NODE_LIQUIDITY_VALUE</span>
                      <span className="text-[10px] opacity-40 font-mono animate-pulse uppercase">MOD_ENCRYPTED</span>
                  </div>
                  <div className={`bg-black/20 p-4 border-2 border-opacity-30 border-green-900 group-hover:border-opacity-100 transition-all ${borderClass.replace('pixel-border', 'border')} ${jumpingNodes[block.id] ? 'pixel-value-jump' : ''}`}>
                      <div className="flex justify-between items-center">
                          <span className="text-2xl opacity-60 font-mono">￥</span>
                          <input 
                              type="number" 
                              value={block.balance}
                              onChange={e => onUpdateBalance(block.id, parseFloat(e.target.value) || 0)}
                              className="bg-transparent border-none focus:outline-none text-3xl font-bold text-white text-right w-full font-mono tracking-tighter"
                          />
                      </div>
                  </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity h-4">
                 <div className="text-[8px] font-mono text-green-900 uppercase">Status: Unlocked</div>
                 <div className="w-24 h-1 bg-green-900 overflow-hidden">
                    <div className="h-full bg-green-500 animate-[flicker_2s_infinite]"></div>
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
