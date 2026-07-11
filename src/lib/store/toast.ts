/**
 * Lightweight toast store — no external deps.
 */
export interface Toast {
  id: string;
  title: string;
  description?: string;
}

type Listener = (toasts: Toast[]) => void;

class ToastStore {
  private toasts: Toast[] = [];
  private listeners = new Set<Listener>();

  getState() {
    return this.toasts;
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l(this.toasts));
  }

  push(title: string, description?: string) {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    this.toasts = [...this.toasts, { id, title, description }];
    this.notify();
    setTimeout(() => this.dismiss(id), 4000);
  }

  dismiss(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }
}

export const toastStore = new ToastStore();

export function toast(title: string, description?: string) {
  toastStore.push(title, description);
}
