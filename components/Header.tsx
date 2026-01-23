
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a2634] px-8 py-4 sticky top-0 z-10 transition-colors">
      <div className="flex items-center gap-4">
        <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">
          {title}
        </h2>
      </div>
      
      <div className="flex items-center gap-6">
        <label className="hidden md:flex flex-col min-w-64 h-10">
          <div className="flex w-full flex-1 items-stretch rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
            <div className="text-slate-400 flex items-center justify-center pl-3">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>search</span>
            </div>
            <input 
              className="flex w-full min-w-0 flex-1 bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 text-sm px-3" 
              placeholder="Buscar pedidos, clientes..." 
            />
          </div>
        </label>
        
        <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-700 pl-6">
          <button className="flex items-center justify-center rounded-lg size-10 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1a2634]"></span>
          </button>
          <button 
            onClick={() => document.documentElement.classList.toggle('dark')}
            className="flex items-center justify-center rounded-lg size-10 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors"
          >
            <span className="material-symbols-outlined">dark_mode</span>
          </button>
          <button className="flex items-center justify-center rounded-lg size-10 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </button>
          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center rounded-lg size-10 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors"
              title="Cerrar sesión"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
