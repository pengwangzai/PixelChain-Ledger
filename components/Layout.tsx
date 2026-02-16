
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePixelStore } from '../store';

const SidebarLink: React.FC<{ to: string, label: string, icon: string, disabled?: boolean }> = ({ to, label, icon, disabled }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  if (disabled) {
    return (
      <div className="flex items-center space-x-4 p-4 border-b border-white/5 opacity-20 grayscale cursor-not-allowed">
        <span className="text-2xl">{icon}</span>
        <span className="text-lg font-mono uppercase">{label}</span>
      </div>
    );
  }

  return (
    <Link 
        to={to} 
        className={`flex items-center space-x-4 p-4 border-b border-white/5 transition-all relative group overflow-hidden ${isActive ? 'bg-white/10 text-white border-l-4 border-l-[var(--accent)]' : 'hover:bg-white/5'}`}
    >
      <span className={`text-2xl ${isActive ? 'scale-110' : 'grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100'}`}>
        {icon}
      </span>
      <span className={`text-lg font-mono uppercase ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white/80'}`}>
        {label}
      </span>
    </Link>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = usePixelStore();
  const isForced = state.user.isDefaultPassword;
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <nav className="w-64 bg-[var(--bg-secondary)] border-r-4 border-[var(--accent)] flex flex-col fixed h-full z-20 shadow-2xl">
        <div className="p-6 border-b-4 border-[var(--accent)] bg-[var(--bg-primary)]">
          <h1 className="text-3xl font-bold tracking-tighter text-[var(--accent)] glitch-hover cursor-pointer mb-2">
            像素账本
          </h1>
          <div className="flex items-center space-x-3 mt-4">
             <div className="w-10 h-10 pixel-border bg-black overflow-hidden">
                {state.user.avatar ? (
                    <img src={state.user.avatar} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs opacity-50 font-bold">BYT</div>
                )}
             </div>
             <div className="flex-1">
                <div className="text-[10px] text-[var(--accent)] opacity-60 uppercase font-mono truncate">操作员: {state.user.username}</div>
                <div className="text-[9px] text-white/40 uppercase">主题: {state.user.theme === 'CLASSIC' ? '经典' : '霓虹'}</div>
             </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {isForced && (
            <div className="p-4 bg-yellow-900/40 text-yellow-500 text-[10px] font-bold animate-pulse border-b border-yellow-500/50">
              ⚠️ 警告: 请先前往[个人中心]修改默认密码以解锁全量功能
            </div>
          )}
          <SidebarLink to="/" label="系统状态" icon="📊" disabled={isForced} />
          <SidebarLink to="/blocks" label="资产区块" icon="📦" disabled={isForced} />
          <SidebarLink to="/logs" label="哈希日志" icon="📜" disabled={isForced} />
          <SidebarLink to="/mine" label="未来矿场" icon="⛏️" disabled={isForced} />
          <SidebarLink to="/pit" label="交易竞技场" icon="📈" disabled={isForced} />
          <SidebarLink to="/vault" label="能量护盾" icon="🛡️" disabled={isForced} />
          <div className="mt-4 border-t border-white/5 pt-2">
            <SidebarLink to="/config" label="系统配置" icon="⚙️" disabled={isForced} />
            <SidebarLink to="/profile" label="个人中心" icon="👤" />
          </div>
        </div>
        
        <div className="p-4 bg-black/20 text-[9px] font-mono text-white/30 uppercase text-center tracking-widest">
            © 2025 LedgerOS v2.0
        </div>
      </nav>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-10 relative">
        <div className="max-w-6xl mx-auto">
            {children}
        </div>
      </main>
    </div>
  );
};
