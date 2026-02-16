
import React, { useState, useMemo } from 'react';
import { usePixelStore } from '../store';
import { InvestmentType, Investment } from '../types';

const CATEGORY_MAP = {
  STOCK: { label: '股票战区', icon: '📈', color: 'text-blue-400', border: 'border-blue-500' },
  FUND: { label: '基金战区', icon: '📊', color: 'text-green-400', border: 'border-green-500' },
  CRYPTO: { label: '加密战区', icon: '₿', color: 'text-purple-400', border: 'border-purple-500' },
  METAL: { label: '贵金属战区', icon: '💎', color: 'text-yellow-400', border: 'border-yellow-500' }
};

const CRYPTO_ICONS: Record<string, string> = {
  BTC: '🌕',
  ETH: '💎',
  SOL: '⚡',
  USDT: '💵',
  DOGE: '🐕'
};

const MOCK_QUERY_DB: Record<string, { name: string, price: number }> = {
  '600519': { name: '贵州茅台', price: 1650.00 },
  '000001': { name: '平安银行', price: 11.20 },
  '300750': { name: '宁德时代', price: 198.50 },
  '320007': { name: '诺安成长混合', price: 0.98 },
  '000001_F': { name: '华夏成长混合', price: 1.12 },
  'BTC': { name: 'Bitcoin', price: 96000 },
  'ETH': { name: 'Ethereum', price: 2800 },
  'SOL': { name: 'Solana', price: 230 },
  'GOLD': { name: '黄金 (AU999)', price: 620 },
  'SILVER': { name: '白银 (AG999)', price: 7.8 }
};

export const TradingPit: React.FC = () => {
  const { state, addInvestment, deleteInvestment } = usePixelStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    type: 'STOCK' as InvestmentType,
    code: '',
    name: '',
    buyDate: new Date().toISOString().split('T')[0],
    cost: 0,
    quantity: 0,
    currentValue: 0
  });

  // Calculate War Dashboard stats
  const stats = useMemo(() => {
    return Object.keys(CATEGORY_MAP).map(type => {
      const items = state.tradingPit.filter(i => i.type === type);
      const totalCost = items.reduce((sum, i) => sum + (i.cost * i.quantity), 0);
      const totalValue = items.reduce((sum, i) => sum + (i.currentValue * i.quantity), 0);
      const profit = totalValue - totalCost;
      const profitPct = totalCost !== 0 ? (profit / totalCost) * 100 : 0;
      
      return {
        type: type as InvestmentType,
        profit,
        profitPct,
        hasData: items.length > 0
      };
    });
  }, [state.tradingPit]);

  const handleQuery = async () => {
    if (!formData.code) return;
    setIsQuerying(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const searchKey = formData.type === 'FUND' ? `${formData.code}_F` : formData.code.toUpperCase();
    const result = MOCK_QUERY_DB[searchKey];

    if (result) {
      setFormData(prev => ({
        ...prev,
        name: result.name,
        currentValue: result.price
      }));
    } else {
      alert("未找到对应资产信息 // DATA_NOT_FOUND");
    }
    setIsQuerying(false);
  };

  const handleAdd = () => {
    if (formData.name && formData.quantity > 0) {
      addInvestment({
        ...formData,
        code: formData.code || 'MANUAL'
      });
      setIsAdding(false);
      setFormData({
        type: 'STOCK',
        code: '',
        name: '',
        buyDate: new Date().toISOString().split('T')[0],
        cost: 0,
        quantity: 0,
        currentValue: 0
      });
    }
  };

  const performDelete = (id: string) => {
    setDeletingId(id);
    // Visual disintegration feedback
    setTimeout(() => {
      deleteInvestment(id);
      setDeletingId(null);
      setConfirmingDelete(null);
    }, 500);
  };

  return (
    <div className="space-y-8 pb-10 font-mono">
      <header className="flex justify-between items-start border-b-2 border-purple-500 pb-4">
        <div>
          <h2 className="text-5xl font-bold text-purple-500 uppercase tracking-tighter glitch-hover">交易竞技场 // TRADING_PIT</h2>
          <p className="text-purple-400/70 text-sm tracking-widest mt-1 uppercase">
            <span className="animate-pulse mr-2">●</span> 高波动性资产博弈模块正在运行
          </p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 pixel-border-purple hover-shake transition-all uppercase tracking-widest shadow-[4px_4px_0px_#000]"
        >
          开启新仓位
        </button>
      </header>

      {/* War Dashboard Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => {
          const config = CATEGORY_MAP[stat.type];
          const isPositive = stat.profit >= 0;
          return (
            <div key={stat.type} className={`bg-black/60 p-4 pixel-border border-opacity-30 border-white hover:border-opacity-100 transition-all group relative overflow-hidden`}>
               <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">{config.icon}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${config.color}`}>{config.label}</span>
               </div>
               
               {stat.hasData ? (
                 <div className="space-y-2">
                    <div className="text-2xl font-bold text-white tracking-tighter">
                       ￥{stat.profit.toLocaleString()}
                    </div>
                    <div className={`text-xs font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                       {isPositive ? '▲' : '▼'} {stat.profitPct.toFixed(2)}%
                    </div>
                    {/* Energy Slot */}
                    <div className="h-2 bg-gray-900 pixel-border border-gray-800 relative overflow-hidden mt-2">
                        <div 
                           className={`h-full transition-all duration-1000 ${isPositive ? 'bg-green-500 animate-pulse' : 'bg-red-500 opacity-30'}`} 
                           style={{ width: `${Math.min(100, isPositive ? 100 : 20)}%` }}
                        ></div>
                    </div>
                 </div>
               ) : (
                 <div className="py-6 text-center opacity-20 italic text-[10px] uppercase">等待部署 // NO_DATA</div>
               )}
            </div>
          );
        })}
      </div>

      {/* Add Position Form */}
      {isAdding && (
        <div className="bg-black/80 pixel-border border-purple-500 p-8 space-y-6 animate-in fade-in zoom-in duration-300 relative">
          <div className="absolute top-0 right-0 p-2 text-[8px] text-purple-900 opacity-40">FORM_ID: TRD_EX_0x92</div>
          <h3 className="text-2xl text-purple-400 font-bold uppercase tracking-widest flex items-center">
             <span className="mr-3 animate-ping">●</span> 执行新交易指令
          </h3>
          
          <div className="space-y-4">
             {/* Type Selection */}
             <div className="flex flex-wrap gap-4">
                {(Object.keys(CATEGORY_MAP) as InvestmentType[]).map(type => (
                  <button 
                    key={type}
                    onClick={() => setFormData({...formData, type})}
                    className={`flex-1 py-2 px-4 font-bold border-2 transition-all ${formData.type === type ? 'bg-purple-600 text-white border-white' : 'bg-transparent text-purple-500 border-purple-900 hover:border-purple-500'}`}
                  >
                    {CATEGORY_MAP[type].icon} {CATEGORY_MAP[type].label.split(' ')[0]}
                  </button>
                ))}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] text-purple-900 uppercase">资产代码 (ASSET_CODE)</label>
                  <div className="flex space-x-2">
                    <input 
                      className="flex-1 bg-[#0a0a12] border-2 border-purple-900 p-3 text-purple-400 outline-none focus:border-purple-400 transition-colors" 
                      placeholder="如: 600519 / BTC" 
                      value={formData.code} 
                      onChange={e => setFormData({...formData, code: e.target.value})}
                    />
                    <button 
                      onClick={handleQuery}
                      disabled={isQuerying}
                      className="bg-purple-900 hover:bg-purple-700 px-4 text-xs font-bold uppercase disabled:opacity-50"
                    >
                      {isQuerying ? '查询中...' : '同步API'}
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-purple-900 uppercase">资产名称 (ASSET_NAME)</label>
                  <input 
                    className="w-full bg-[#0a0a12] border-2 border-purple-900 p-3 text-purple-400 outline-none focus:border-purple-400 transition-colors" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-purple-900 uppercase">入场日期 (ENTRY_DATE)</label>
                  <input 
                    type="date"
                    className="w-full bg-[#0a0a12] border-2 border-purple-900 p-3 text-purple-400 outline-none focus:border-purple-400 transition-colors" 
                    value={formData.buyDate} 
                    onChange={e => setFormData({...formData, buyDate: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-purple-900 uppercase">买入单价 (COST_PER_UNIT)</label>
                  <input 
                    type="number"
                    className="w-full bg-[#0a0a12] border-2 border-purple-900 p-3 text-purple-400 outline-none focus:border-purple-400 transition-colors" 
                    value={formData.cost} 
                    onChange={e => setFormData({...formData, cost: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-purple-900 uppercase">持仓数量 (QUANTITY)</label>
                  <input 
                    type="number"
                    className="w-full bg-[#0a0a12] border-2 border-purple-900 p-3 text-purple-400 outline-none focus:border-purple-400 transition-colors" 
                    value={formData.quantity} 
                    onChange={e => setFormData({...formData, quantity: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-purple-900 uppercase">当前价格 (MARKET_PRICE)</label>
                  <input 
                    type="number"
                    className="w-full bg-[#0a0a12] border-2 border-purple-900 p-3 text-purple-400 outline-none focus:border-purple-400 transition-colors" 
                    value={formData.currentValue} 
                    onChange={e => setFormData({...formData, currentValue: parseFloat(e.target.value) || 0})}
                  />
                </div>
             </div>
          </div>

          <div className="flex space-x-4 pt-4 border-t border-purple-900/30">
            <button onClick={handleAdd} className="flex-1 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold pixel-border border-black uppercase tracking-widest active:translate-y-1 transition-all shadow-[4px_4px_0px_#000]">确认成交指令 // EXECUTE_ORDER</button>
            <button onClick={() => setIsAdding(false)} className="flex-none px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold pixel-border border-black uppercase tracking-widest active:translate-y-1 transition-all shadow-[4px_4px_0px_#000]">终止</button>
          </div>
        </div>
      )}

      {/* Positions List */}
      <div className="space-y-4">
        {state.tradingPit.map(inv => {
          const config = CATEGORY_MAP[inv.type];
          const totalCost = inv.cost * inv.quantity;
          const totalValue = inv.currentValue * inv.quantity;
          const profit = totalValue - totalCost;
          const profitPct = inv.cost !== 0 ? (profit / totalCost) * 100 : 0;
          const isPositive = profit >= 0;
          const isConfirming = confirmingDelete === inv.id;
          const isDeleting = deletingId === inv.id;

          const displayIcon = inv.type === 'CRYPTO' ? (CRYPTO_ICONS[inv.code.toUpperCase()] || '₿') : config.icon;

          return (
            <div 
              key={inv.id} 
              className={`bg-black/40 p-5 pixel-border border-purple-900/40 hover:border-purple-500 transition-all group relative flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden ${isConfirming ? 'pixel-border-red border-red-500 z-30 shadow-[0_0_25px_rgba(255,0,0,0.3)]' : ''} ${isDeleting ? 'disintegrate' : ''}`}
            >
                {/* Delete Confirmation Overlay */}
                {isConfirming && (
                  <div className="absolute inset-0 bg-red-900/95 z-40 flex flex-col items-center justify-center space-y-4 p-4 animate-in fade-in duration-200">
                    <div className="text-xl font-bold text-white uppercase tracking-widest animate-pulse">确认执行平仓指令？</div>
                    <div className="text-[10px] text-red-100 uppercase font-mono tracking-tighter text-center max-w-xs">
                      该战区头寸 [{inv.name}] 将被永久销毁。系统将不再追踪其后续波动。
                    </div>
                    <div className="flex space-x-4">
                      <button 
                        onClick={() => performDelete(inv.id)} 
                        className="bg-white text-red-600 font-bold px-6 py-2 pixel-border border-black hover:bg-red-100 transition-colors uppercase tracking-widest"
                      >
                        确认销毁 // LIQUIDATE
                      </button>
                      <button 
                        onClick={() => setConfirmingDelete(null)} 
                        className="bg-black text-white font-bold px-6 py-2 border-2 border-white hover:bg-white/10 transition-colors uppercase tracking-widest"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                )}

                {/* Background K-line hint */}
                {!isConfirming && (
                  <div className="absolute right-0 top-0 bottom-0 opacity-[0.05] pointer-events-none w-48 flex items-end px-2 space-x-1">
                      {[...Array(12)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-2 ${isPositive ? 'bg-green-500' : 'bg-red-500'}`} 
                          style={{ height: `${Math.random() * 80 + 10}%`, transition: 'height 2s' }}
                        ></div>
                      ))}
                  </div>
                )}

                <div className="flex items-center space-x-5 z-10">
                   <div className="w-16 h-16 flex items-center justify-center bg-purple-900/20 border-2 border-purple-900 group-hover:bg-purple-500/20 group-hover:border-purple-400 transition-all grayscale group-hover:grayscale-0 text-3xl">
                      {displayIcon}
                   </div>
                   <div>
                      <h4 className="text-2xl font-bold text-white tracking-tighter uppercase group-hover:text-purple-400 transition-colors">
                        {inv.name} <span className="text-xs text-purple-900 ml-2">({inv.code})</span>
                      </h4>
                      <div className="text-[10px] text-purple-900 font-mono uppercase tracking-widest flex space-x-4">
                         <span>买入于: {inv.buyDate}</span>
                         <span>数量: {inv.quantity}</span>
                      </div>
                      <div className="mt-1 text-[10px] text-gray-600 uppercase">
                         单价成本: ￥{inv.cost.toLocaleString()} | 市值单价: ￥{inv.currentValue.toLocaleString()}
                      </div>
                   </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 md:gap-16 z-10 text-right">
                   <div className="flex flex-col justify-center">
                      <div className="text-[10px] text-purple-900 uppercase tracking-tighter">本金总计 (PRINCIPAL)</div>
                      <div className="text-xl font-bold font-mono text-gray-400">￥{totalCost.toLocaleString()}</div>
                   </div>
                   <div className="flex flex-col justify-center min-w-[140px]">
                      <div className="text-[10px] text-purple-900 uppercase tracking-tighter">当前市值 (MARKET_CAP)</div>
                      <div className="text-3xl font-bold font-mono text-white">￥{totalValue.toLocaleString()}</div>
                   </div>
                   <div className="flex flex-col justify-center min-w-[120px] bg-black/40 p-3 pixel-border border-purple-900/20 group-hover:border-purple-500/50 transition-all">
                      <div className={`text-xl font-bold font-mono ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                         {isPositive ? '+' : ''}{profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className={`text-sm font-bold font-mono ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                         {isPositive ? '▲' : '▼'} {profitPct.toFixed(2)}%
                      </div>
                   </div>
                   
                   {!isConfirming && (
                    <button 
                      onClick={() => setConfirmingDelete(inv.id)}
                      className="absolute top-3 right-3 text-[10px] text-red-600 opacity-0 group-hover:opacity-100 hover:text-red-400 underline decoration-dotted uppercase tracking-tighter transition-all font-mono"
                    >
                      销毁项目 // DESTROY_POS
                    </button>
                   )}
                </div>
            </div>
          );
        })}

        {state.tradingPit.length === 0 && (
           <div className="py-20 border-2 border-dashed border-purple-900/30 text-center opacity-30 italic pixel-border group hover:opacity-100 transition-opacity cursor-pointer" onClick={() => setIsAdding(true)}>
              <div className="text-6xl mb-4 animate-bounce">⚔️</div>
              <p className="text-2xl font-mono uppercase tracking-widest">竞技场空无一人 // ARENA_EMPTY</p>
              <p className="text-xs mt-2 uppercase tracking-widest text-purple-400">点击此处部署您的首个进攻头寸</p>
           </div>
        )}
      </div>

      <section className="bg-purple-900/10 p-4 pixel-border border-purple-900 opacity-40 text-[9px] uppercase tracking-[0.2em] font-mono leading-relaxed">
         注意: 所有市场数据由 'LOCAL_NODE_MOCK_ENGINE' 提供。真实世界同步需接入外部哈希网关。<br/>
         当前战术环境: {state.tradingPit.length > 0 ? 'ACTIVE_ENGAGEMENT' : 'IDLE_SCANNING'} | 延迟: 14ms | 状态: 稳固
      </section>
    </div>
  );
};
