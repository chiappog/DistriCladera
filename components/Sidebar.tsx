
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Panel General', icon: 'dashboard', path: '/' },
    { name: 'Productos', icon: 'inventory_2', path: '/productos' },
    { name: 'Clientes', icon: 'group', path: '/clientes' },
    { name: 'Pedidos', icon: 'shopping_cart', path: '/pedidos' },
    { name: 'Usuarios', icon: 'manage_accounts', path: '/usuarios' },
    { name: 'Auditoría', icon: 'fact_check', path: '/auditoria' },
  ];

  return (
    <aside className="w-72 hidden md:flex flex-col bg-white dark:bg-[#1a2634] border-r border-slate-200 dark:border-slate-800 h-full flex-shrink-0 transition-all duration-300 z-20">
      <div className="flex flex-col h-full p-4 justify-between">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 px-2">
            <div className="bg-primary/10 flex items-center justify-center rounded-lg size-10">
              <span className="material-symbols-outlined text-primary fill">local_shipping</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-slate-900 dark:text-white text-base font-bold leading-tight">DistriCladera</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Administración</p>
            </div>
          </div>
          
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                {/* Fixed the isActive scope error by utilizing NavLink's render prop for children */}
                {({ isActive }) => (
                  <>
                    <span className={`material-symbols-outlined transition-colors group-hover:${isActive ? '' : 'text-primary'}`}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium">{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="px-2 py-3 border-t border-slate-100 dark:border-slate-800 mt-auto">
          <div className="flex items-center gap-3">
            <div 
              className="size-9 rounded-full bg-cover bg-center border border-slate-200 dark:border-slate-700" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBrprRuyoRqWKijO9YLnmZ8yNmz8EuDrlMAKCBMT3bJyak1YQo0vt5ayS-aQ70xZLidOtbwQbAhkTWd2gun7sC-m933JC2u56v97RZwieGtDH4qDDN30BBFVrsjHlRlM0lusRUhOl9F1LB3OmpkNAQypyvn6e7P1TVQKAbuWpA5E9GgOEy5xhrD1XT8s1vccaySv5vE864EyZ5VjH4a7q-SOKdq9BQnbcJZ2DNaHHl_Pcn3jD66pf5KNFnbQsI3sVZ83RwoU-hGIsaK")' }}
            ></div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">Carlos Ruiz</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate">admin@empresa.com</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
