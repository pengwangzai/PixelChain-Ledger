
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { AssetBlocks } from './views/AssetBlocks';
import { HashLogs } from './views/HashLogs';
import { FutureMine } from './views/FutureMine';
import { TradingPit } from './views/TradingPit';
import { ShieldVault } from './views/ShieldVault';
import { Login } from './views/Login';
import { Profile } from './views/Profile';
import { Config } from './views/Config';
import { usePixelStore } from './store';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = usePixelStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (state.user.isDefaultPassword && location.pathname !== '/profile') {
      navigate('/profile?force=true');
    }
  }, [state.user.isDefaultPassword, location.pathname, navigate]);

  return <>{children}</>;
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const lastAuth = sessionStorage.getItem('PIXEL_LEDGER_AUTH');
    if (!lastAuth) return false;
    const authTime = parseInt(lastAuth, 10);
    return Date.now() - authTime < 3600000;
  });

  const handleLogin = () => {
    sessionStorage.setItem('PIXEL_LEDGER_AUTH', Date.now().toString());
    setIsAuthenticated(true);
  };

  return (
    <HashRouter>
      {!isAuthenticated ? (
        <Routes>
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        </Routes>
      ) : (
        <AuthGuard>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/blocks" element={<AssetBlocks />} />
              <Route path="/logs" element={<HashLogs />} />
              <Route path="/mine" element={<FutureMine />} />
              <Route path="/pit" element={<TradingPit />} />
              <Route path="/vault" element={<ShieldVault />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/config" element={<Config />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </AuthGuard>
      )}
    </HashRouter>
  );
};

export default App;
