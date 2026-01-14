
import React, { useState } from 'react';
import { INITIAL_PRODUCTS } from '../constants.tsx';

const Products: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Productos</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Administra el catálogo de productos y precios.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm shadow-blue-500/30 flex items-center gap-2 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Crear Producto
        </button>
      </div>

      <div className="bg-white dark:bg-[#1a2634] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all text-slate-900 dark:text-white placeholder:text-slate-400" 
            placeholder="Buscar por código, descripción o SKU..." 
            type="text" 
          />
        </div>
        <div className="flex gap-3">
          <div className="relative min-w-[140px]">
            <select className="w-full pl-3 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm appearance-none text-slate-700 dark:text-slate-300">
              <option value="">Todas las Unidades</option>
              <option value="kilo">Kilo</option>
              <option value="unit">Unidad</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-sm">expand_more</span>
          </div>
          <button className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-sm font-medium transition-colors">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Filtros
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a2634] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Código</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Descripción</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Precio</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Unidad</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {INITIAL_PRODUCTS.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-medium text-primary">{prod.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl">{prod.emoji}</div>
                      <span className="font-medium">{prod.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-semibold text-right">${prod.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${prod.unit === 'Kilo' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'}`}>
                      {prod.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors" title="Editar">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Eliminar">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <span className="text-sm text-slate-500 dark:text-slate-400">Mostrando <span className="font-medium text-slate-900 dark:text-white">1-5</span> de <span className="font-medium text-slate-900 dark:text-white">48</span> productos</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-colors">Anterior</button>
            <button className="px-3 py-1.5 rounded-lg border border-primary bg-primary text-sm font-medium text-white">1</button>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors">2</button>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors">Siguiente</button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px] p-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#1a2634] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Crear Nuevo Producto</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Código</label>
                <input className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-slate-900 dark:text-white" placeholder="Ej: PD-2023" type="text" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Descripción</label>
                <textarea className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm resize-none text-slate-900 dark:text-white" placeholder="Nombre y detalles del producto" rows={3}></textarea>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Precio</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 font-medium">$</span>
                    <input className="w-full pl-7 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-slate-900 dark:text-white" placeholder="0.00" type="number" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Unidad de Venta</label>
                  <div className="flex gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input className="w-4 h-4 text-primary border-slate-300 dark:border-slate-600 focus:ring-primary bg-transparent" name="unit" type="radio" defaultChecked />
                      <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">Kilo</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input className="w-4 h-4 text-primary border-slate-300 dark:border-slate-600 focus:ring-primary bg-transparent" name="unit" type="radio" />
                      <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">Unidad</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 rounded-b-2xl">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">Cancelar</button>
              <button className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-blue-600 shadow-md shadow-blue-500/20 transition-all active:scale-95">Guardar Producto</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
