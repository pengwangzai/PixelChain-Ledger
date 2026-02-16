
import React from 'react';
import { usePixelStore } from '../store';

export const Config: React.FC = () => {
  const { state, toggleTheme, updateUserSettings, exportData, importData } = usePixelStore();

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target?.result as string);
            if (window.confirm("确定要使用导入的 JSON 覆盖当前节点数据吗？")) {
                importData(data);
                window.location.reload();
            }
        } catch (err) {
            alert("无效的账本文件 // DATA_CORRUPTION_DETECTED");
        }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
      if (window.confirm("警告: 销毁所有本地数据？此操作不可逆！")) {
          localStorage.clear();
          window.location.reload();
      }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <header className="border-b-2 border-[var(--accent)] pb-4">
        <h2 className="text-4xl font-bold uppercase tracking-widest text-[var(--accent)]">系统配置 // SYS_CTRL</h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-black/40 p-8 pixel-border">
              <h3 className="text-xl mb-6 text-[var(--accent)] uppercase font-mono tracking-widest">界面与环境 // UI_ENV</h3>
              <div className="space-y-6">
                  <div className="flex justify-between items-center">
                      <div>
                          <div className="font-bold">视觉主题</div>
                          <div className="text-[10px] opacity-50 uppercase">经典赛博 vs 霓虹链</div>
                      </div>
                      <button onClick={toggleTheme} className="bg-white/10 px-4 py-2 border-2 border-white/20 hover:border-white uppercase text-xs">
                          切换至 {state.user.theme === 'CLASSIC' ? '霓虹主题' : '经典主题'}
                      </button>
                  </div>
                  <div className="flex justify-between items-center">
                      <div>
                          <div className="font-bold">CRT 模拟器</div>
                          <div className="text-[10px] opacity-50 uppercase">开启/关闭扫描线和抖动</div>
                      </div>
                      <button 
                        onClick={() => updateUserSettings({ crtEnabled: !state.user.crtEnabled })}
                        className={`px-4 py-2 border-2 uppercase text-xs ${state.user.crtEnabled ? 'bg-green-600 text-black border-white' : 'border-white/20'}`}
                      >
                          {state.user.crtEnabled ? '已开启' : '已关闭'}
                      </button>
                  </div>
                  <div className="flex justify-between items-center">
                      <div>
                          <div className="font-bold">8-Bit 音效</div>
                          <div className="text-[10px] opacity-50 uppercase">操作系统的听觉反馈</div>
                      </div>
                      <button 
                        onClick={() => updateUserSettings({ soundEnabled: !state.user.soundEnabled })}
                        className={`px-4 py-2 border-2 uppercase text-xs ${state.user.soundEnabled ? 'bg-blue-600 text-black border-white' : 'border-white/20'}`}
                      >
                          {state.user.soundEnabled ? '开启' : '静音'}
                      </button>
                  </div>
              </div>
          </section>

          <section className="bg-black/40 p-8 pixel-border border-red-500">
              <h3 className="text-xl mb-6 text-red-500 uppercase font-mono tracking-widest">数据管理 // DATA_MGMT</h3>
              <div className="space-y-4">
                  <button onClick={exportData} className="w-full py-4 bg-green-600 text-black font-bold uppercase hover:bg-white transition-colors mb-2">
                      导出所有数据 // CLONE_NODE
                  </button>
                  <label className="block w-full py-4 bg-blue-600 text-black font-bold uppercase text-center cursor-pointer hover:bg-white transition-colors">
                      导入账本数据 // INJECT_PROTO
                      <input type="file" className="hidden" accept=".json" onChange={handleImport} />
                  </label>
                  <button onClick={handleReset} className="w-full py-2 text-red-500 text-[10px] font-mono hover:text-red-400 uppercase underline decoration-dotted mt-4">
                      格式化本地全链 // HARD_RESET
                  </button>
              </div>
          </section>
      </div>

      <div className="bg-black/60 p-8 pixel-border border-purple-500">
          <h3 className="text-xl mb-4 text-purple-400 uppercase tracking-widest">开发者笔记</h3>
          <p className="text-sm opacity-60 leading-relaxed font-mono italic">
            "我们站在巨人的肩膀上。这套架构是为迁移而设计的。
            IndexedDB 钩子已就绪。REST 代理插槽已预留。妥善保管你的密钥。"
          </p>
      </div>
    </div>
  );
};
