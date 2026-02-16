
import React, { useState, useRef } from 'react';
import { usePixelStore } from '../store';
import { useLocation, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { AIProvider } from '../types';

const PROVIDER_DEFAULTS = {
  [AIProvider.GEMINI]: { baseUrl: '', model: 'gemini-3-flash-preview' },
  [AIProvider.DEEPSEEK]: { baseUrl: 'https://api.deepseek.com/v1', model: 'deepseek-chat' },
  [AIProvider.KIMI]: { baseUrl: 'https://api.moonshot.cn/v1', model: 'moonshot-v1-8k' },
  [AIProvider.DOUBAO]: { baseUrl: 'https://ark.cn-beijing.volces.com/api/v3', model: 'ep-xxx-xxx' },
};

export const Profile: React.FC = () => {
  const { state, updateUserSettings, updatePassword, updateAISettings } = usePixelStore();
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const isForced = query.get('force') === 'true' || state.user.isDefaultPassword;

  const [username, setUsername] = useState(state.user.username);
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [msg, setMsg] = useState<{ text: string, type: 'success' | 'error' | 'none' }>({ text: '', type: 'none' });
  const [aiConfig, setAiConfig] = useState(state.user.ai);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            const size = 64; 
            canvas.width = size;
            canvas.height = size;
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(img, 0, 0, size, size);
            const pixelatedData = canvas.toDataURL('image/png');
            updateUserSettings({ avatar: pixelatedData });
        };
        img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass) {
      setMsg({ text: '请输入新密码 // PASS_EMPTY', type: 'error' });
      return;
    }
    if (newPass !== confirmPass) {
      setMsg({ text: '密码不匹配 // HASH_MISMATCH', type: 'error' });
      return;
    }
    
    // 执行更新
    updatePassword(newPass);
    setMsg({ text: '哈希密钥更新成功！正在解锁全链协议...', type: 'success' });
    
    // 关键修复：使用路由跳转而非硬刷新
    setTimeout(() => {
        navigate('/');
    }, 1500);
  };

  const handleSaveIdentity = () => {
      const cleanUsername = DOMPurify.sanitize(username);
      updateUserSettings({ username: cleanUsername });
      setMsg({ text: '身份信息已同步。', type: 'success' });
      setTimeout(() => setMsg({ text: '', type: 'none' }), 2000);
  };

  const handleSaveAI = () => {
    updateAISettings(aiConfig);
    setMsg({ text: 'AI节点协议已保存 // AI_CONFIG_SYNCED', type: 'success' });
    setTimeout(() => setMsg({ text: '', type: 'none' }), 3000);
  };

  const changeProvider = (p: AIProvider) => {
    setAiConfig({
      ...aiConfig,
      provider: p,
      baseUrl: PROVIDER_DEFAULTS[p].baseUrl,
      model: PROVIDER_DEFAULTS[p].model
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className={`border-b-2 ${isForced ? 'border-yellow-500 animate-pulse shadow-[0_4px_10px_rgba(234,179,8,0.2)]' : 'border-[var(--accent)]'} pb-4`}>
        <h2 className={`text-4xl font-bold uppercase tracking-widest ${isForced ? 'text-yellow-500' : 'text-[var(--accent)]'}`}>
          {isForced ? '紧急指令: 必须修改初始密码' : '个人中心 // USER_PROFILE'}
        </h2>
        {isForced && (
          <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/50 inline-block">
            <p className="text-yellow-500 text-xs uppercase font-mono">
              [!] 系统检测到初始弱口令。在旋转密钥之前，所有其他功能模块将被锁定。
            </p>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-8">
            <section className={`bg-black/60 p-8 pixel-border-blue border-blue-900 ${isForced ? 'ring-2 ring-yellow-500/50' : ''}`}>
                <h3 className="text-xl mb-6 text-blue-400 font-bold uppercase font-mono tracking-widest flex items-center">
                   <span className="mr-2">🔑</span> 认证密钥旋转 // AUTH_ROTATION
                </h3>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] text-blue-800 opacity-60 uppercase">设置新哈希密码 (NEW_PASSWORD)</label>
                        <input 
                          type="password" 
                          value={newPass} 
                          onChange={e => setNewPass(e.target.value)} 
                          className="w-full bg-black border-2 border-blue-900 p-3 text-white outline-none focus:border-blue-400 font-mono tracking-widest" 
                          placeholder="****" 
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-blue-800 opacity-60 uppercase">确认新密码 (CONFIRM_PASSWORD)</label>
                        <input 
                          type="password" 
                          value={confirmPass} 
                          onChange={e => setConfirmPass(e.target.value)} 
                          className="w-full bg-black border-2 border-blue-900 p-3 text-white outline-none focus:border-blue-400 font-mono tracking-widest" 
                          placeholder="****" 
                        />
                    </div>
                    <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold pixel-border border-black uppercase tracking-widest transition-all active:translate-y-1 shadow-[4px_4px_0_#000]">
                        执行旋转指令 // EXECUTE_ROTATION
                    </button>
                </form>
            </section>

            {!isForced && (
              <section className="bg-black/40 p-8 pixel-border">
                  <h3 className="text-xl mb-6 text-[var(--accent)] uppercase font-mono tracking-widest">头像处理 // AVATAR_PROCESS</h3>
                  <div className="flex items-center space-x-6">
                      <div className="w-32 h-32 pixel-border bg-black flex items-center justify-center overflow-hidden">
                          {state.user.avatar ? (
                              <img src={state.user.avatar} className="w-full h-full object-cover" />
                          ) : (
                              <span className="text-4xl opacity-20">?</span>
                          )}
                      </div>
                      <div className="space-y-4">
                          <label className="block bg-[var(--accent)] text-black font-bold py-2 px-4 cursor-pointer hover:bg-white transition-colors text-center uppercase text-sm">
                              上传并像素化
                              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                          </label>
                          <p className="text-[10px] opacity-50 uppercase font-mono max-w-[150px]">
                              图像将自动降采样至 64x64 以符合 8-bit 传输协议。
                          </p>
                      </div>
                  </div>
                  <canvas ref={canvasRef} className="hidden" />
              </section>
            )}
        </div>

        <div className="space-y-8">
            {!isForced && (
              <section className="bg-black/40 p-8 pixel-border">
                  <h3 className="text-xl mb-6 text-[var(--accent)] uppercase font-mono tracking-widest">操作员身份 // IDENTITY</h3>
                  <div className="space-y-4">
                      <div className="space-y-1">
                          <label className="text-[10px] opacity-40 uppercase">节点代号 / 昵称</label>
                          <input value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-black border-2 border-white/10 p-4 text-white outline-none focus:border-[var(--accent)]" />
                      </div>
                      <button onClick={handleSaveIdentity} className="w-full py-4 bg-[var(--accent)] text-black font-bold uppercase hover:bg-white transition-colors">
                          更新注册表
                      </button>
                  </div>
              </section>
            )}

            {!isForced && (
              <section className="bg-black/60 pixel-border-purple border-purple-900 p-8 space-y-6">
                  <h3 className="text-xl text-purple-400 font-bold uppercase tracking-widest flex items-center">
                      AI 顾问节点配置 // AI_CONFIG
                  </h3>
                  <div className="space-y-4">
                      <div className="space-y-1">
                          <label className="text-[10px] opacity-40 uppercase">算力提供商</label>
                          <div className="flex flex-wrap gap-2">
                              {Object.values(AIProvider).map(p => (
                                  <button key={p} onClick={() => changeProvider(p)} className={`px-3 py-1 border-2 text-[10px] font-bold uppercase ${aiConfig.provider === p ? 'bg-purple-600 text-white border-white' : 'border-purple-900 text-purple-900 hover:border-purple-500'}`}>
                                      {p}
                                  </button>
                              ))}
                          </div>
                      </div>
                      <div className="space-y-1">
                          <label className="text-[10px] opacity-40 uppercase">API密钥 (SECRET_KEY)</label>
                          <input type="password" value={aiConfig.apiKey} onChange={e => setAiConfig({...aiConfig, apiKey: e.target.value})} className="w-full bg-black border-2 border-purple-900 p-3 text-purple-400 outline-none" placeholder="sk-..." />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                              <label className="text-[10px] opacity-40 uppercase">端点 (ENDPOINT)</label>
                              <input value={aiConfig.baseUrl} onChange={e => setAiConfig({...aiConfig, baseUrl: e.target.value})} className="w-full bg-black border-2 border-purple-900 p-3 text-purple-400 text-xs" />
                          </div>
                          <div className="space-y-1">
                              <label className="text-[10px] opacity-40 uppercase">模型 (MODEL)</label>
                              <input value={aiConfig.model} onChange={e => setAiConfig({...aiConfig, model: e.target.value})} className="w-full bg-black border-2 border-purple-900 p-3 text-purple-400 text-xs" />
                          </div>
                      </div>
                      <button onClick={handleSaveAI} className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold pixel-border border-black uppercase tracking-widest">
                          同步AI协议
                      </button>
                  </div>
              </section>
            )}
        </div>
      </div>
      
      {msg.type !== 'none' && (
          <div className={`fixed bottom-10 right-10 p-4 border-4 ${msg.type === 'error' ? 'border-red-500 bg-black text-red-500' : 'border-green-500 bg-black text-green-500'} z-50 font-mono animate-bounce shadow-[8px_8px_0_#000]`}>
              <div className="flex items-center space-x-2">
                  <span className="text-lg">{msg.type === 'error' ? '❌' : '✅'}</span>
                  <span className="uppercase">{msg.text}</span>
              </div>
          </div>
      )}
    </div>
  );
};
