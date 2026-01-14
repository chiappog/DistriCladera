
import React, { useState } from 'react';
import { INITIAL_USERS } from '../constants.tsx';

const Users: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-6 animate-in fade-in duration-500">
      <nav className="flex items-center text-sm font-medium text-slate-500">
        <a className="hover:text-primary transition-colors" href="#">Home</a>
        <span className="mx-2 text-slate-400">/</span>
        <span className="text-slate-900 dark:text-white">User Management</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base">Manage system access, assign roles, and control user statuses.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-sm transition-all hover:shadow-md active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span className="font-semibold text-sm">New User</span>
        </button>
      </div>

      <div className="bg-white dark:bg-[#1a2634] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-400">search</span>
          </div>
          <input 
            className="block w-full pl-10 pr-3 py-2.5 border-none bg-slate-100 dark:bg-slate-800 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary transition-all" 
            placeholder="Search users by name, email or role..." 
            type="text" 
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
            All Roles <span className="material-symbols-outlined text-[18px]">arrow_drop_down</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
            Status: Active <span className="material-symbols-outlined text-[18px]">arrow_drop_down</span>
          </button>
          <button className="text-primary text-sm font-semibold hover:underline px-2">Clear filters</button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a2634] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">User</th>
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Role</th>
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {INITIAL_USERS.map((user) => (
                <tr key={user.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-cover bg-center ring-1 ring-slate-200 dark:ring-slate-700" style={{ backgroundImage: `url(${user.avatar})` }}></div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">{user.name}</p>
                        <p className="text-slate-500 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'Admin' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <button className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${user.status ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}>
                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${user.status ? 'translate-x-5' : 'translate-x-0'}`}></span>
                      </button>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{user.status ? 'Active' : 'Inactive'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-md transition-colors">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <p className="text-sm text-slate-500">Showing <span className="font-semibold text-slate-900 dark:text-white">1-3</span> of <span className="font-semibold text-slate-900 dark:text-white">28</span> users</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800">Next</button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#1a2634] rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-primary/10 size-12 rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">person_add</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add New User</h3>
                  <p className="text-sm text-slate-500">Fill in the details to create a new user account.</p>
                </div>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                  <input className="mt-1 block w-full rounded-lg border-slate-300 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary text-slate-900 dark:text-white" placeholder="e.g. Jane Doe" type="text" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                  <input className="mt-1 block w-full rounded-lg border-slate-300 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary text-slate-900 dark:text-white" placeholder="jane@company.com" type="email" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Assign Role</label>
                  <select className="mt-1 block w-full rounded-lg border-slate-300 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 shadow-sm focus:border-primary focus:ring-primary text-slate-900 dark:text-white">
                    <option value="Admin">Administrator (Full Access)</option>
                    <option value="Operario">Operario (Warehouse Access)</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-300 rounded-lg">Cancel</button>
              <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-md">Create User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
