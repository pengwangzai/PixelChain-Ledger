
import React, { useState, useEffect } from 'react';
import { usePixelStore } from '../store';
import { getFinancialAdvice } from '../geminiService';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid 
} from 'recharts';

const CustomDot = (props: any) => {
  const { cx, cy, index } = props;
  return (
    <g>
      <circle 
        cx={cx} 
        cy={cy} 
        r={5} 
        fill="#00ff41" 
        className="chart-dot" 
        style={{ 
            animationDelay: `${index * 0.15}s`,
            opacity: 0, 
            animationFillMode: 'forwards'
        }}
      />
      <circle 
        cx={cx} 
        cy={cy} 
        r={2} 
        fill="#1a1a2e" 
      />
    </g>
  );
};

const PixelCorners = () => (
  <>
    <div className="absolute top-0 left-0 w-3 h-3 border-t-4 border-l-4 border-green-500 z-10"></div>
    <div className="absolute top-0 right-0 w-3 h-3 border-t-4 border-r-4 border-green-500 z-10"></div>
    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-4 border-l-4 border-green-500 z-10"></div>
    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-4 border-r-4 border-green-500 z-10"></div>
  </>
);

const ChartSkeleton = ({ title, type }: { title: string, type: 'pie' | 'area' }) => (
  <div className="flex flex-col items-center justify-center h-full w-full relative overflow-hidden bg-[#0a0a12]">
    <div className="absolute inset-0 opacity-10 pointer-events-none">
      <div className="w-full h-full bg-[linear-gradient(to_right,#00ff41_1px,transparent_1px),linear-gradient(to_bottom,#00ff41_1px,transparent_1px)] bg-[size:20px_20px]"></div>
    </div>
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="w-full h-12 bg-gradient-to-b from-transparent via-green-500/20 to-transparent animate-[scan_4s_linear_infinite] absolute top-0 left-0"></div>
    </div>
    <div className="absolute inset-0 grid grid-cols-20 grid-rows-10 opacity-[0.05] pointer-events-none">
        {[...Array(200)].map((_, i) => (
            <div key={i} className="bg-green-500" style={{ animation: `flicker ${Math.random() * 3 + 0.5}s infinite`, animationDelay: `${Math.random() * 2}s` }}></div>
        ))}
    </div>
    <div className="relative z-10 flex flex-col items-center space-y-6">
      {type === 'pie' ? (
        <div className="w-32 h-32 relative flex items-center justify-center">
             {[...Array(12)].map((_, i) => (
                 <div key={i} className="absolute w-4 h-4 bg-green-500/20" style={{ transform: `rotate(${i * 30}deg) translateY(-40px)`, animation: `pixel-glitch 1.5s steps(2) infinite`, animationDelay: `${i * 0.1}s` }}></div>
             ))}
             <div className="w-16 h-16 border-4 border-dashed border-green-500/40 rounded-full animate-[spin_8s_linear_infinite]"></div>
             <div className="absolute w-2 h-2 bg-green-500 animate-pulse"></div>
        </div>
      ) : (
        <div className="w-64 h-32 border-b-4 border-l-4 border-green-900 flex items-end relative px-1 py-1">
            <div className="flex-1 h-full flex items-end space-x-1">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="flex-1 bg-green-500/30" style={{ height: `${Math.sin(i * 0.5) * 30 + 50}%`, animation: `step-bounce 2s steps(4) infinite`, animationDelay: `${i * 0.1}s` }}></div>
              ))}
            </div>
        </div>
      )}
      <div className="text-center px-4">
        <div className="text-sm font-mono text-green-500 font-bold tracking-[0.4em] uppercase mb-2 animate-pulse">{title}</div>
        <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-500 animate-ping"></div>
            <div className="text-[9px] font-mono text-green-900 uppercase tracking-widest">正在同步节点数据... // SYNCING_NODE</div>
        </div>
      </div>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const { state } = usePixelStore();
  const [advice, setAdvice] = useState<string>("正在初始化顾问模块...");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const liquidTotal = state.blocks.reduce((s, b) => s + b.balance, 0);
  const investmentTotal = state.tradingPit.reduce((s, i) => s + (i.currentValue * i.quantity), 0);
  const mineTotal = state.mines.reduce((s, m) => s + m.currentAmount, 0);
  const debtTotal = state.shield.debts.reduce((s, d) => s + d.amount, 0);
  const netWorth = liquidTotal + investmentTotal + mineTotal - debtTotal;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getFinancialAdvice(state).then(setAdvice);
    }, 2500);
    return () => clearTimeout(timeoutId);
  }, [state]);

  const chartData = [
    { name: '流动资产', value: liquidTotal, color: '#00ff41' },
    { name: '投资资产', value: investmentTotal, color: '#bc13fe' },
    { name: '矿产资产', value: mineTotal, color: '#4e9afe' },
  ].filter(d => d.value > 0);

  const trendData = [...state.logs]
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(log => ({
      time: new Date(log.timestamp).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }),
      value: log.totalAssets,
      timestamp: log.timestamp
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1a2e] border-2 border-green-500 p-3 font-mono text-green-500 shadow-[6px_6px_0px_#000] pixel-border z-50">
          <p className="text-[10px] opacity-70 mb-1 border-b border-green-900 pb-1 uppercase tracking-tighter">
            {label ? `${label} 快照` : '实时数据'}
          </p>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-bold tracking-tighter">￥{payload[0].value.toLocaleString()}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-green-500 pb-4 gap-4">
        <div>
          <h2 className="text-4xl glitch-hover cursor-default font-bold uppercase tracking-tighter text-green-500">系统状态 // STATUS_MAIN</h2>
          <p className="text-green-500/70 uppercase font-mono tracking-widest text-xs">
            <span className="animate-pulse">●</span> 网络同步: 极优 | 节点高度: {state.logs.length}
          </p>
        </div>
        <div className="text-left md:text-right bg-black/40 p-4 pixel-border border-purple-500 w-full md:w-auto hover-shake group transition-all">
          <div className="text-xs text-purple-400 font-mono tracking-tighter uppercase mb-1 flex items-center md:justify-end">
            <span className="inline-block w-2 h-2 bg-purple-500 mr-2 opacity-50"></span>
            净资产哈希 // NET_WORTH
          </div>
          <div className="text-5xl font-bold tracking-tighter text-white group-hover:text-green-400 transition-colors">
            ￥{netWorth.toLocaleString()}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: '流动性区块 (LIQUID)', val: liquidTotal, color: 'green', code: 'L_01' },
            { label: '市场流动性 (INVEST)', val: investmentTotal, color: 'purple', code: 'I_02' },
            { label: '矿工提取值 (MINES)', val: mineTotal, color: 'blue', code: 'M_03' },
            { label: '护盾漏洞 (DEBT)', val: debtTotal, color: 'red', prefix: '-', code: 'D_04' }
          ].map((stat, i) => (
            <div key={i} className={`p-4 bg-black/60 pixel-border ${stat.color === 'purple' ? 'border-purple-500' : stat.color === 'blue' ? 'border-blue-500' : stat.color === 'red' ? 'border-red-500' : 'border-green-500'} hover-shake group cursor-pointer relative overflow-hidden`}>
              <div className="absolute -right-2 -bottom-2 opacity-[0.03] text-4xl font-mono select-none">{stat.code}</div>
              {!isReady ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-2 w-24 bg-green-500/20 rounded"></div>
                  <div className="h-8 w-32 bg-green-500/10 rounded"></div>
                </div>
              ) : (
                <>
                  <div className={`text-[10px] ${stat.color === 'purple' ? 'text-purple-400' : stat.color === 'blue' ? 'text-blue-400' : stat.color === 'red' ? 'text-red-400' : 'text-green-400'} group-hover:translate-x-1 transition-transform font-mono uppercase tracking-widest`}>
                    {stat.label}
                  </div>
                  <div className={`text-3xl font-bold mt-1 ${stat.color === 'red' ? 'text-red-500 font-mono' : 'text-white'}`}>
                    {stat.prefix || ''}￥{stat.val.toLocaleString()}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="bg-black/60 pixel-border border-green-900/50 p-6 h-80 flex flex-col relative overflow-hidden group hover:border-green-500 transition-colors">
            <PixelCorners />
            <div className="chart-scanline opacity-20"></div>
            <div className="flex justify-between items-center mb-6 z-10">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 bg-green-500 animate-ping"></div>
                <h3 className="text-xl uppercase tracking-tighter text-green-500 font-mono glitch-hover">分配矩阵 // ALLOCATION</h3>
              </div>
            </div>
            <div className="flex-1 w-full min-h-0 relative z-10 overflow-hidden">
              {!isReady ? (
                <ChartSkeleton title="正在解密资产分布" type="pie" />
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="99%" height="99%">
                  <PieChart>
                      <Pie data={chartData} innerRadius="55%" outerRadius="80%" paddingAngle={8} dataKey="value" stroke="#1a1a2e" strokeWidth={4} cx="50%" cy="45%">
                          {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="bottom" height={30} iconType="square" wrapperStyle={{ fontFamily: 'VT323', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-20 italic font-mono uppercase tracking-widest text-center">
                  等待协议注入...<br/>[NO_DATA]
                </div>
              )}
            </div>
        </div>
      </div>

      <section className="bg-green-900/10 p-6 pixel-border border-purple-900 relative overflow-hidden hover:bg-green-900/20 transition-all group">
        <div className="absolute top-0 right-0 p-2 text-[8px] text-purple-600 font-mono tracking-tighter select-none flex items-center space-x-4">
          <div className="flex items-center">
            <span className="opacity-40 mr-1">算力节点:</span> 
            <span className="text-purple-400">{state.user.ai.provider}</span>
          </div>
          <div className="flex items-center">
            <span className="opacity-40 mr-1">模型:</span> 
            <span className="text-purple-400">{state.user.ai.model}</span>
          </div>
          <div className="flex items-center">
            <span className="opacity-40 mr-1">状态:</span> 
            <span className="text-green-500 animate-pulse">核心激活</span>
          </div>
        </div>
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-4 h-4 bg-purple-500 shadow-[0_0_15px_#bc13fe] animate-pulse"></div>
          <h3 className="text-xl text-purple-400 uppercase tracking-tighter font-mono group-hover:translate-x-2 transition-transform">
             黑客风格财务报告 // LEDGER_ANALYTICS
          </h3>
          <div className="flex-1 flex justify-end pr-10">
             <div className="bg-black/40 px-3 py-1 border border-purple-900/50 flex items-baseline space-x-2">
                <span className="text-[8px] text-purple-900 uppercase">算力余量:</span>
                <span className="text-xs text-purple-400 font-bold">99.4%</span>
                <div className="w-12 h-1.5 bg-purple-900/20 overflow-hidden relative border border-purple-900/30">
                   <div className="h-full bg-purple-500 w-[99%]" style={{boxShadow: '0 0 5px #bc13fe'}}></div>
                </div>
             </div>
          </div>
        </div>
        <div className="p-5 bg-black/40 border-l-4 border-purple-500 relative shadow-inner min-h-[100px] flex items-center">
          {!isReady ? (
            <div className="w-full space-y-2">
              <div className="h-4 bg-purple-500/20 w-3/4 animate-pulse"></div>
              <div className="h-4 bg-purple-500/20 w-1/2 animate-pulse"></div>
            </div>
          ) : (
            <p className="text-lg leading-relaxed tracking-wide font-mono text-purple-100 italic">
              <span className="text-purple-600 mr-2 opacity-50 font-bold">$</span>
              {advice}
              <span className="inline-block w-2.5 h-6 bg-purple-500 animate-flicker ml-2 align-middle"></span>
            </p>
          )}
        </div>
      </section>
    </div>
  );
};
