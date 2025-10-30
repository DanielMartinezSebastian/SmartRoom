import toast from 'react-hot-toast';

/**
 * Show a success notification
 */
export const showSuccess = (message: string) => {
  toast.success(message, {
    duration: 3000,
    position: 'bottom-right',
  });
};

/**
 * Show an error notification
 */
export const showError = (message: string) => {
  toast.error(message, {
    duration: 4000,
    position: 'bottom-right',
  });
};

/**
 * Show an info notification
 */
export const showInfo = (message: string) => {
  toast(message, {
    duration: 3000,
    position: 'bottom-right',
    icon: 'ℹ️',
  });
};

/**
 * Show a loading notification and return the toast ID
 */
export const showLoading = (message: string): string => {
  return toast.loading(message, {
    position: 'bottom-right',
  });
};

/**
 * Update a loading toast to success
 */
export const updateToSuccess = (toastId: string, message: string): void => {
  toast.success(message, {
    id: toastId,
    duration: 3000,
  });
};

/**
 * Update a loading toast to error
 */
export const updateToError = (toastId: string, message: string): void => {
  toast.error(message, {
    id: toastId,
    duration: 4000,
  });
};

/**
 * Show a confirmation dialog using toast
 * Returns a promise that resolves to true if confirmed, false if cancelled
 */
export const showConfirm = (message: string, confirmText = 'Confirm', cancelText = 'Cancel'): Promise<boolean> => {
  return new Promise((resolve) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-medium text-gray-900 dark:text-white">{message}</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              {confirmText}
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
              className="flex-1 rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            >
              {cancelText}
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: 'top-center',
      }
    );
  });
};

/**
 * Show a destructive confirmation dialog (for delete actions)
 */
export const showDestructiveConfirm = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-medium text-gray-900 dark:text-white">{message}</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
              className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
              className="flex-1 rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: 'top-center',
      }
    );
  });
};

/**
 * Wrap a promise with loading toast
 */
export const withLoadingToast = async <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
): Promise<T> => {
  return toast.promise(
    promise,
    {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    },
    {
      position: 'bottom-right',
    }
  );
};
