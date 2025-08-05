import { StateCreator } from "zustand";
import { StoreUtils } from "@/utils/storeUtils";

/**
 * Base interface for async store state
 */
export interface AsyncStoreState {
  loading: boolean;
  error: string | null;
}

/**
 * Base interface for async store actions
 */
export interface AsyncStoreActions {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

/**
 * Creates base async store functionality
 */
export const createAsyncStore = <T extends Record<string, any>>(
  storeCreator: (set: any, get: any, api: any) => T
) => {
  return (set: any, get: any, api: any) => ({
    loading: false,
    error: null,

    setLoading: (loading: boolean) => set({ loading }),
    setError: (error: string | null) => set({ error }),
    clearError: () => set({ error: null }),

    ...storeCreator(set, get, api),
  });
};

/**
 * Helper to execute async operations with automatic loading/error handling
 */
export const executeAsyncOperation = async <T>(
  operation: () => Promise<T>,
  actions: Pick<AsyncStoreActions, "setLoading" | "setError">,
  errorMessage: string
): Promise<T | null> => {
  return StoreUtils.handleAsyncOperation(
    operation,
    actions.setLoading,
    actions.setError,
    errorMessage
  );
};
