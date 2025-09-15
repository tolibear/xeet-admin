/**
 * Accessibility utilities for atomic design components
 * Ensures WCAG 2.1 AA compliance across all atomic levels
 */

export type AriaRole = 
  | "alert"
  | "button" 
  | "checkbox"
  | "dialog"
  | "grid"
  | "gridcell"
  | "heading"
  | "img"
  | "link"
  | "listbox"
  | "menu"
  | "menuitem"
  | "option"
  | "progressbar"
  | "radio"
  | "searchbox"
  | "slider"
  | "spinbutton"
  | "status"
  | "tab"
  | "tabpanel"
  | "textbox"
  | "tooltip";

/**
 * Generate screen reader friendly text for numeric values
 */
export function formatForScreenReader(value: string | number, prefix?: string, suffix?: string): string {
  const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;
  return `${prefix || ''}${formattedValue}${suffix || ''}`;
}

/**
 * Generate accessible IDs for form elements
 */
export function generateAccessibleId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Common ARIA attributes for interactive elements
 */
export const INTERACTIVE_ARIA_PROPS = {
  button: {
    role: "button" as AriaRole,
    tabIndex: 0,
  },
  link: {
    role: "link" as AriaRole,
    tabIndex: 0,
  },
  checkbox: {
    role: "checkbox" as AriaRole,
    tabIndex: 0,
  },
} as const;

/**
 * Common ARIA attributes for status/informational elements  
 */
export const STATUS_ARIA_PROPS = {
  status: {
    role: "status" as AriaRole,
    "aria-live": "polite" as const,
  },
  alert: {
    role: "alert" as AriaRole,
    "aria-live": "assertive" as const,
  },
  progressbar: {
    role: "progressbar" as AriaRole,
  },
} as const;

/**
 * Keyboard event handler utility for custom interactive elements
 */
export function createKeyboardHandler(onClick: () => void) {
  return (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };
}

/**
 * Focus management utility for modals and dialogs
 */
export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0] as HTMLElement;
  const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  function handleTabKey(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  }
  
  element.addEventListener('keydown', handleTabKey);
  firstFocusable?.focus();
  
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
}

/**
 * Announce content to screen readers
 */
export function announceToScreenReader(message: string) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'assertive');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}
