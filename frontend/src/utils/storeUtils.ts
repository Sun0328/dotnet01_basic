import { toast } from "sonner";

/**
 * Store utility functions for common patterns
 */
export class StoreUtils {
  /**
   * Handle async operation with loading state
   */
  static async handleAsyncOperation<T>(
    operation: () => Promise<T>,
    setLoading: (loading: boolean) => void,
    setError: (error: string | null) => void,
    errorMessage: string
  ): Promise<T | null> {
    setLoading(true);
    setError(null);

    try {
      const result = await operation();
      return result;
    } catch (err) {
      console.error(`${errorMessage}:`, err);
      toast.error(errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }

  /**
   * Handle successful toast with optional condition
   */
  static showSuccessToast(message: string, condition: boolean = true): void {
    if (condition) {
      toast.success(message);
    }
  }
}
