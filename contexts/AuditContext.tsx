import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AuditEntry } from '../types';
import { INITIAL_AUDIT } from '../constants';

interface AuditContextType {
  auditEntries: AuditEntry[];
  addAuditEntry: (entry: Omit<AuditEntry, 'id' | 'date' | 'time'>) => void;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export const AuditProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>(INITIAL_AUDIT);

  const generateAuditId = (): string => {
    const lastEntry = auditEntries[auditEntries.length - 1];
    if (lastEntry) {
      const lastNumber = parseInt(lastEntry.id.replace('A-', ''));
      return `A-${String(lastNumber + 1).padStart(3, '0')}`;
    }
    return 'A-001';
  };

  const formatDate = (): { date: string; time: string } => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = now.toLocaleString('es-ES', { month: 'short' });
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return {
      date: `${day} ${month} ${year}`,
      time: `${hours}:${minutes}:${seconds}`,
    };
  };

  const addAuditEntry = (entry: Omit<AuditEntry, 'id' | 'date' | 'time'>) => {
    const { date, time } = formatDate();
    const newEntry: AuditEntry = {
      ...entry,
      id: generateAuditId(),
      date,
      time,
    };
    setAuditEntries(prev => [newEntry, ...prev]);
  };

  return (
    <AuditContext.Provider value={{ auditEntries, addAuditEntry }}>
      {children}
    </AuditContext.Provider>
  );
};

export const useAudit = () => {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error('useAudit debe usarse dentro de AuditProvider');
  }
  return context;
};
