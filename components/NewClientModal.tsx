import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Client } from '../types';

/**
 * FLUJO – Modal Crear Cliente
 * 1. abrirModal: Click en "+ Crear Cliente" → se abre el modal centrado con overlay.
 * 2. Al abrir: se resetea el formulario, se genera el código (generarCodigoCliente) y
 *    se enfoca el primer input (Nombre).
 * 3. validarFormulario: Nombre obligatorio; email válido si se completa. Guardar
 *    deshabilitado si no es válido; feedback visual (borde rojo + mensaje) en campos inválidos.
 * 4. cerrarModal: Cancelar, click fuera o ESC → se cierra el modal y se resetea el form.
 * 5. agregarClienteATabla: Al Guardar → se crea el cliente, se inserta en la tabla (vía
 *    onAddClient), se cierra el modal y se resetea el formulario. No se recarga la página.
 */

/** Expresión regular para validar email (formato básico) */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface NewClientForm {
  name: string;
  status: 'Activo' | 'Inactivo';
  phone: string;
  email: string;
  contactPerson: string;
  address: string;
  notes: string;
}

const INITIAL_FORM: NewClientForm = {
  name: '',
  status: 'Activo',
  phone: '',
  email: '',
  contactPerson: '',
  address: '',
  notes: '',
};

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  onAddClient: (client: Client) => void;
}

/**
 * Genera el siguiente código de cliente (ej: CL-006) tomando el mayor
 * numérico existente en los ids con formato CL-XXX.
 */
function generarCodigoCliente(clients: Client[]): string {
  let max = 0;
  for (const c of clients) {
    const m = c.id.match(/^CL-(\d+)$/i);
    if (m) {
      const n = parseInt(m[1], 10);
      if (n > max) max = n;
    }
  }
  const next = String(max + 1).padStart(3, '0');
  return `CL-${next}`;
}

/**
 * Obtiene iniciales del nombre: primeras letras de los dos primeros
 * palabras, o los dos primeros caracteres si hay una sola.
 */
function getInitials(name: string): string {
  const t = name.trim();
  if (!t) return '??';
  const words = t.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return t.slice(0, 2).toUpperCase();
}

/**
 * Valida el formulario. Nombre obligatorio; email válido si se completa.
 */
function validarFormulario(form: NewClientForm): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!form.name.trim()) {
    errors.name = 'El nombre o razón social es obligatorio';
  }

  if (form.email.trim()) {
    if (!EMAIL_REGEX.test(form.email.trim())) {
      errors.email = 'El email no tiene un formato válido';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

const NewClientModal: React.FC<NewClientModalProps> = ({
  isOpen,
  onClose,
  clients,
  onAddClient,
}) => {
  const [form, setForm] = useState<NewClientForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const firstInputRef = useRef<HTMLInputElement>(null);

  const codigo = generarCodigoCliente(clients);
  const { valid } = validarFormulario(form);

  /** Abre el modal: resetea formulario y errores, enfoca primer input */
  const abrirModal = useCallback(() => {
    setForm(INITIAL_FORM);
    setErrors({});
    // Focus se aplica en useEffect cuando isOpen cambia
  }, []);

  /** Cierra el modal y resetea el formulario */
  const cerrarModal = useCallback(() => {
    setForm(INITIAL_FORM);
    setErrors({});
    onClose();
  }, [onClose]);

  /** Cierra al pulsar ESC */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrarModal();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, cerrarModal]);

  /** Al abrir: reset y focus en primer input */
  useEffect(() => {
    if (isOpen) {
      abrirModal();
      const t = setTimeout(() => firstInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen, abrirModal]);

  /** Agrega el nuevo cliente a la tabla, cierra el modal y resetea el formulario */
  const agregarClienteATabla = (e: React.FormEvent) => {
    e.preventDefault();

    const { valid: ok, errors: nextErrors } = validarFormulario(form);
    if (!ok) {
      setErrors(nextErrors);
      return;
    }

    const newClient: Client = {
      id: codigo,
      name: form.name.trim(),
      initials: getInitials(form.name.trim()),
      address: form.address.trim() || '—',
      status: form.status,
      ...(form.phone.trim() && { phone: form.phone.trim() }),
      ...(form.email.trim() && { email: form.email.trim() }),
      ...(form.contactPerson.trim() && { contactPerson: form.contactPerson.trim() }),
      ...(form.notes.trim() && { notes: form.notes.trim() }),
    };

    onAddClient(newClient);
    cerrarModal();
  };

  const update = (key: keyof NewClientForm, value: string | 'Activo' | 'Inactivo') => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  /** Click en overlay cierra; click en el panel no */
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) cerrarModal();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px] p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-client-modal-title"
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-[#1a2634] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <h2 id="new-client-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">
            Crear Cliente
          </h2>
          <button
            type="button"
            onClick={cerrarModal}
            className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Cerrar"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form id="new-client-form" onSubmit={agregarClienteATabla} className="flex-1 overflow-y-auto p-6">
          {/* 1. Datos básicos */}
          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Datos básicos
            </h3>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Código de cliente
              </label>
              <input
                type="text"
                value={codigo}
                readOnly
                className="w-full px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
                tabIndex={-1}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nombre / Razón social <span className="text-red-500">*</span>
              </label>
              <input
                ref={firstInputRef}
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Ej: Distribuidora Central"
                className={`w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-slate-900 dark:text-white placeholder-slate-400 ${
                  errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                }`}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-xs text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Estado
              </label>
              <select
                value={form.status}
                onChange={(e) => update('status', e.target.value as 'Activo' | 'Inactivo')}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-900 dark:text-white"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          {/* 2. Contacto */}
          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Contacto
            </h3>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Teléfono
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="Ej: +54 11 1234-5678"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="Ej: contacto@empresa.com"
                className={`w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-slate-900 dark:text-white placeholder-slate-400 ${
                  errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                }`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-xs text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Persona de contacto (opcional)
              </label>
              <input
                type="text"
                value={form.contactPerson}
                onChange={(e) => update('contactPerson', e.target.value)}
                placeholder="Ej: Juan Pérez"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>
          </div>

          {/* 3. Dirección */}
          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Dirección
            </h3>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Dirección completa
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                placeholder="Ej: Av. Libertador 1234, CABA"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>
          </div>

          {/* 4. Observaciones */}
          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Observaciones
            </h3>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Notas (opcional)
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => update('notes', e.target.value)}
                placeholder="Observaciones o comentarios..."
                rows={3}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-slate-900 dark:text-white placeholder-slate-400 resize-none"
              />
            </div>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={cerrarModal}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="new-client-form"
            disabled={!valid}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            Guardar Cliente
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewClientModal;
