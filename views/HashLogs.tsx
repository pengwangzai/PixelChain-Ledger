
import React from 'react';
import { usePixelStore } from '../store';

export const HashLogs: React.FC = () => {
  const { state } = usePixelStore();

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-4xl underline decoration-double">哈希日志</h2>
        <p className="text-green-500/70">不可篡改的财务快照链</p>
      </header>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-green-900/30"></div>
        <div className="space-y-8">
          {state.logs.map((log, idx) => (
            <div key={log.id} className="relative pl-16">
              <div className={`absolute left-[29px] w-3 h-3 border-2 ${idx === 0 ? 'bg-green-500 border-white animate-ping' : 'bg-black border-green-800'} rounded-full`}></div>
              {idx !== 0 && <div className={`absolute left-[33px] w-1 h-3 bg-green-800 -top-4`}></div>}
              
              <div className="bg-black/40 pixel-border p-6 hover:bg-black/60 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-purple-400 font-mono text-xs mb-1">区块ID: {log.id}</div>
                    <div className="text-2xl text-white">{log.memo || '系统快照'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm opacity-50">{new Date(log.timestamp).toLocaleString()}</div>
                    <div className={`text-2xl ${log.delta >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {log.delta >= 0 ? '+' : ''}{log.delta.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    {log.snapshot.map(s => (
                        <div key={s.id} className="text-xs border border-green-900/50 p-1">
                            {s.name}: <span className="text-green-400">￥{s.balance}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t border-green-900/20 flex justify-between items-center">
                    <div className="text-xs">该时刻资产总量</div>
                    <div className="text-xl font-bold">￥{log.totalAssets.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
          {state.logs.length === 0 && (
            <div className="text-center py-20 opacity-30 italic">
                尚未挖掘任何区块。请前往“资产区块”进行同步。
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
