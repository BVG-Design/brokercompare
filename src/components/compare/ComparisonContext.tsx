'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Software, Service } from '@/lib/types';

export type ComparisonItem = {
  id: string;
  type: 'software' | 'service';
  name: string;
  logoUrl: string;
  category: string;
  data: Software | Service;
};

interface ComparisonContextType {
  items: ComparisonItem[];
  addItem: (item: Software | Service, type: 'software' | 'service') => boolean;
  removeItem: (id: string) => void;
  clearAll: () => void;
  isInComparison: (id: string) => boolean;
  canAddMore: boolean;
  maxItems: number;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const STORAGE_KEY = 'brokercompare_comparison';
const MAX_ITEMS = 4;

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ComparisonItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setItems(parsed);
      }
    } catch (error) {
      console.error('Failed to load comparison from storage:', error);
    }
    setIsHydrated(true);
  }, []);

  // Save to sessionStorage whenever items change
  useEffect(() => {
    if (isHydrated) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Failed to save comparison to storage:', error);
      }
    }
  }, [items, isHydrated]);

  const addItem = useCallback((item: Software | Service, type: 'software' | 'service'): boolean => {
    if (items.length >= MAX_ITEMS) {
      return false; // Cannot add more
    }

    // Check if already in comparison
    if (items.some(i => i.id === item.id)) {
      return false; // Already added
    }

    const comparisonItem: ComparisonItem = {
      id: item.id,
      type,
      name: item.name,
      logoUrl: item.logoUrl,
      category: item.category,
      data: item,
    };

    setItems(prev => [...prev, comparisonItem]);
    return true;
  }, [items]);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  const isInComparison = useCallback((id: string) => {
    return items.some(item => item.id === id);
  }, [items]);

  const canAddMore = items.length < MAX_ITEMS;

  const value: ComparisonContextType = {
    items,
    addItem,
    removeItem,
    clearAll,
    isInComparison,
    canAddMore,
    maxItems: MAX_ITEMS,
  };

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}


