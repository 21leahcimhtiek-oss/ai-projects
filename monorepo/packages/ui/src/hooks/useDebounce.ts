// ─── useDebounce ──────────────────────────────────────────────────────────────
// Delays updating a value until after a specified delay.
// Ideal for search inputs, autocomplete, and resize handlers.

import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}