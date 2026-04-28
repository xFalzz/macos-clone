const appleMenu = {
  title: 'apple',
  menu: {
    'about-this-mac': {
      title: 'About This Mac',
      breakAfter: true,
      action: () => document.dispatchEvent(new CustomEvent('system-action', { detail: 'about' })),
    },
    'system-preferences': {
      title: 'System Preferences...',
      action: () => document.dispatchEvent(new CustomEvent('system-action', { detail: 'preferences' })),
    },
    'app-store': {
      title: 'App Store...',
      breakAfter: true,
    },
    'recent-items': {
      title: 'Recent Items',
      breakAfter: true,
    },
    'force-quit': {
      title: 'Force Quit...',
      breakAfter: true,
    },
    sleep: {
      title: 'Sleep',
      action: () => document.dispatchEvent(new CustomEvent('system-action', { detail: 'sleep' })),
    },
    restart: {
      title: 'Restart...',
      action: () => document.dispatchEvent(new CustomEvent('system-action', { detail: 'restart' })),
    },
    shutdown: {
      title: 'Shut Down...',
      breakAfter: true,
      action: () => document.dispatchEvent(new CustomEvent('system-action', { detail: 'shutdown' })),
    },
    'lock-screen': {
      title: 'Lock Screen',
      action: () => document.dispatchEvent(new CustomEvent('system-action', { detail: 'lock' })),
    },
    logout: {
      title: 'Log Out User...',
      action: () => document.dispatchEvent(new CustomEvent('system-action', { detail: 'logout' })),
    },
  },
};

export const createMenuConfig = <T extends {}>(et: T) => ({ apple: appleMenu, ...et });
