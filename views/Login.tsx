
import React, { useState, useEffect } from 'react';
import { usePixelStore } from '../store';

interface LoginProps {
  onLogin: (isDefault: boolean) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { state } = usePixelStore();
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'WAITING' | 'DECRYPTING' | 'ERROR' | 'GRANTED'>('WAITING');
  const [cursor, setCursor] = useState(true);
  const [terminalLines, setTerminalLines] = useState<string[]>([
    '系统引导: 正常',
    '内存自检: 640KB 可用',
    '访客@像素账本:~$ sudo 解锁 --加密库'
  ]);

  useEffect(() => {
    const interval = setInterval(() => setCursor(c => !c), 500);
    return () => clearInterval(interval);
  }, []);

  const addLine = (line: string) => {
    setTerminalLines(prev => [...prev.slice(-5), line]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'WAITING' || !password) return;

    if (password === state.user.passwordHash || (state.user.isDefaultPassword && (password === '8888' || password === 'admin'))) {
      setStatus('DECRYPTING');
      addLine(`[认证] 正在尝试密钥匹配...`);
      
      setTimeout(() => {
        addLine(`[信息] 哈希链验证通过`);
        addLine(`[正常] 协议同步完成`);
        
        setTimeout(() => {
          setStatus('GRANTED');
          addLine(`[访问] 欢迎, 操作员`);
          
          setTimeout(() => onLogin(state.user.isDefaultPassword), 800);
        }, 1000);
      }, 1500);
    } else {
      setStatus('ERROR');
      addLine(`[错误] 无效的哈希密钥`);
      addLine(`[错误] 节点 01 拒绝访问`);
      
      setTimeout(() => {
        setStatus('WAITING');
        setPassword('');
        addLine(`访客@像素账本:~$ 重试 --强制`);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center p-4 relative overflow-hidden font-mono selection:bg-green-500 selection:text-black">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(#00ff41_1px,transparent_1px)] [background-size:24px_24px]"></div>
      </div>

      <div className="max-w-md w-full z-10">
        <div className="bg-black/90 pixel-border border-green-500 p-8 relative overflow-hidden group shadow-[0_0_50px_rgba(0,255,65,0.1)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-green-500/30 animate-pulse"></div>
          
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold text-green-500 tracking-tighter italic glitch-hover uppercase">
              像素账本
            </h1>
            <div className="text-[10px] text-green-900 font-mono mt-2 tracking-[0.4em] uppercase">
              受限访问 // SECURE_NODE_01
            </div>
          </div>

          <div className="space-y-6 text-sm">
            <div className="bg-[#0a0a12] p-4 border border-green-900/50 text-green-500 text-[10px] min-h-[160px] relative overflow-hidden flex flex-col justify-end">
              <div className="flex flex-col space-y-1 mb-2">
                {terminalLines.map((line, i) => (
                  <div key={i} className={`
                    ${line.includes('[错误]') ? 'text-red-500' : ''} 
                    ${line.includes('[正常]') ? 'text-green-400' : ''} 
                    ${line.includes('[信息]') ? 'text-blue-400' : ''}
                    opacity-70 font-mono
                  `}>
                    {line}
                  </div>
                ))}
              </div>
              
              {status === 'WAITING' && (
                <div className="flex items-center mt-2 border-t border-green-900/30 pt-2">
                   <span className="mr-2 text-green-500 font-bold uppercase tracking-tighter">密码:</span>
                   <span className="text-green-500 opacity-80">{'*'.repeat(password.length)}</span>
                   {cursor && <span className="w-2 h-4 bg-green-500 ml-1"></span>}
                </div>
              )}
              
              {status === 'DECRYPTING' && (
                <div className="text-yellow-500 mt-2 space-y-1 font-bold animate-pulse uppercase">
                   [!] 正在解密本地哈希链...
                </div>
              )}
              
              {status === 'GRANTED' && (
                <div className="text-white bg-green-600 px-2 mt-2 animate-[glitch_0.2s_infinite] inline-block font-bold uppercase">
                   [权限已授予]
                </div>
              )}

              {status === 'ERROR' && (
                <div className="text-red-500 mt-2 font-bold animate-bounce uppercase">
                   [!] 认证失败
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input 
                  type="password"
                  autoFocus
                  className="w-full bg-black border-2 border-green-900 p-4 text-green-500 text-center text-2xl tracking-[0.5em] outline-none focus:border-green-400 transition-colors pixel-border shadow-[4px_4px_0px_#000] font-mono"
                  placeholder="****"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={status !== 'WAITING'}
                  autoComplete="current-password"
                />
                <div className="absolute top-1 right-2 text-[8px] text-green-900 uppercase font-bold">加密密钥</div>
              </div>
              
              <button 
                type="submit"
                disabled={status !== 'WAITING'}
                className="w-full py-4 bg-green-600 hover:bg-green-500 text-black font-bold text-xl pixel-border border-black transition-all active:translate-y-1 hover-shake uppercase tracking-widest disabled:opacity-50"
              >
                解密并连接 // CONNECT
              </button>
            </form>

            <div className="text-center pt-2">
               <p className="text-[9px] text-green-900 uppercase font-mono tracking-tighter leading-tight">
                 提示: 默认密码为 'admin' 或 '8888'<br/>
                 所有通信均采用 8-BIT 端到端哈希加密协议
               </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-between items-center px-2">
          <div className="text-[10px] text-green-900 font-mono uppercase tracking-widest font-bold">
            安全协议: SECURE_V3_FINAL
          </div>
          <div className="flex space-x-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-green-900 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
