
import { useState, useCallback } from 'react';
import { FocusState, FocusType } from '../types';

export function useFocus() {
  const [focus, setFocus] = useState<FocusState>({ type: null, id: null, data: null });
  const [history, setHistory] = useState<FocusState[]>([]);

  const updateFocus = useCallback((type: FocusType, item: any) => {
    if (!item) {
      setFocus({ type: null, id: null, data: null });
      return;
    }
    if (focus.id === item.id) {
      setFocus({ type: null, id: null, data: null });
    } else {
      const newFocus = { type, id: item.id, data: item };
      setFocus(newFocus);
      setHistory(prev => [newFocus, ...prev.filter(h => h.id !== item.id)].slice(0, 10));
    }
  }, [focus.id]);

  return { focus, setFocus, history, setHistory, updateFocus };
}
