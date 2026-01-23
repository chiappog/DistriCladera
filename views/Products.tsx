
import React, { useState } from 'react';
import { INITIAL_PRODUCTS } from '../constants.tsx';

const Products: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const filteredProducts = INITIAL_PRODUCTS.filter(prod => 
    prod.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    prod.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto max-w-7xl flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="mb-2 flex items-center text-sm">
        <a className="text-slate-500 hover:text-slate-700 dark:text-slate-400 font-medium" href="#">Inicio</a>
        <span className="mx-2 text-slate-400">/</span>
        <span className="text-slate-900 dark:text-white font-medium">Productos</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Administración de Productos</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Administra el catálogo de productos y precios.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a2634] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-400">search</span>
          </div>
          <input 
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg leading-5 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition duration-150" 
            placeholder="Buscar por código, descripción o SKU..." 
            type="text" 
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative min-w-[140px] flex-1 sm:flex-none">
            <select className="w-full pl-3 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm appearance-none text-slate-700 dark:text-slate-300">
              <option value="">Todas las Unidades</option>
              <option value="kg">KG</option>
              <option value="unit">Unidad</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-sm">expand_more</span>
          </div>
          
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium transition-colors">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            <span>Filtros</span>
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Crear Producto</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a2634] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Código</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Unidad</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {paginatedProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-primary">{prod.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl">{prod.emoji}</div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{prod.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">${prod.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      prod.unit === 'KG' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                    }`}>
                      {prod.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-slate-400 hover:text-primary transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700" title="Editar">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button className="text-slate-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20" title="Eliminar">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <p className="text-sm text-slate-700 dark:text-slate-400">
            Mostrando <span className="font-medium text-slate-900 dark:text-white">
              {filteredProducts.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : '0'}
            </span> a <span className="font-medium text-slate-900 dark:text-white">
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}
            </span> de <span className="font-medium text-slate-900 dark:text-white">{filteredProducts.length}</span> resultados
          </p>
          <nav className="inline-flex rounded-md shadow-sm -space-x-px">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'z-10 bg-primary/10 dark:bg-primary/20 border-primary text-primary'
                    : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </nav>
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
                      <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">KG</span>
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
