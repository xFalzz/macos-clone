import clsx from 'clsx';
import { useAtom } from 'jotai';
import { launchpadVisibleAtom } from '__/stores/launchpad.store';
import { activeAppStore, openAppsStore, AppID } from '__/stores/apps.store';
import css from './Launchpad.module.scss';

type LaunchpadApp = {
  id: AppID | string;
  name: string;
  icon: string;
  /** If set, will open Safari to this URL instead of opening an app window */
  safariUrl?: string;
};

const launchpadApps: LaunchpadApp[] = [
  { id: 'finder', name: 'Finder', icon: '/assets/app-icons/finder/256.png' },
  { id: 'safari', name: 'Safari', icon: '/assets/app-icons/safari/256.png' },
  { id: 'messages', name: 'Messages', icon: '/assets/app-icons/messages/256.png' },
  { id: 'mail', name: 'Mail', icon: '/assets/app-icons/mail/256.png' },
  { id: 'maps', name: 'Maps', icon: '/assets/app-icons/maps/256.png' },
  { id: 'photos', name: 'Photos', icon: '/assets/app-icons/photos/256.png' },
  { id: 'facetime', name: 'FaceTime', icon: '/assets/app-icons/facetime/256.png' },
  { id: 'calendar', name: 'Calendar', icon: '/assets/app-icons/calendar/256.png' },
  { id: 'notes', name: 'Notes', icon: '/assets/app-icons/notes/256.png' },
  { id: 'terminal', name: 'Terminal', icon: '/assets/app-icons/terminal/256.png' },
  { id: 'calculator', name: 'Calculator', icon: '/assets/app-icons/calculator/256.png' },
  { id: 'system-preferences', name: 'System Preferences', icon: '/assets/app-icons/system-preferences/256.png' },
  { id: 'vscode', name: 'VS Code', icon: '/assets/app-icons/vscode/256.png' },
  { id: 'music', name: 'Music', icon: '/assets/app-icons/music/256.png' },
  { id: 'contacts', name: 'Contacts', icon: '/assets/app-icons/contacts/256.png' },
  { id: 'reminders', name: 'Reminders', icon: '/assets/app-icons/reminders/256.png' },
  // These open Safari to their respective web versions
  { id: 'news', name: 'News', icon: '/assets/app-icons/news/256.png', safariUrl: 'https://news.google.com' },
  { id: 'podcasts', name: 'Podcasts', icon: '/assets/app-icons/podcasts/256.png', safariUrl: 'https://podcasts.google.com' },
  { id: 'tv', name: 'TV', icon: '/assets/app-icons/tv/256.png', safariUrl: 'https://www.youtube.com/embed' },
  { id: 'appstore', name: 'App Store', icon: '/assets/app-icons/appstore/256.png', safariUrl: 'https://apps.apple.com' },
  { id: 'keynote', name: 'Keynote', icon: '/assets/app-icons/keynote/256.png', safariUrl: 'https://www.icloud.com/keynote' },
];

export const Launchpad = () => {
  const [visible, setVisible] = useAtom(launchpadVisibleAtom);
  const [, setOpenApps] = useAtom(openAppsStore);
  const [, setActiveApp] = useAtom(activeAppStore);

  if (!visible) return null;

  const handleAppClick = (app: LaunchpadApp) => {
    if (app.safariUrl) {
      // Open Safari and navigate to the URL
      setOpenApps((prev) => ({ ...prev, safari: true }));
      setActiveApp('safari' as AppID);
      setVisible(false);
      return;
    }

    const appID = app.id as AppID;
    setOpenApps((prev) => ({ ...prev, [appID]: true }));
    setActiveApp(appID);
    setVisible(false);
  };

  const handleBackdropClick = (e: any) => {
    if (e.target === e.currentTarget) {
      setVisible(false);
    }
  };

  return (
    <div class={clsx(css.overlay, visible && css.visible)} onClick={handleBackdropClick}>
      <div class={css.grid}>
        {launchpadApps.map((app) => (
          <button
            key={app.id}
            class={css.appItem}
            onClick={() => handleAppClick(app)}
          >
            <img
              src={app.icon}
              alt={app.name}
              class={css.appIcon}
              loading="lazy"
            />
            <span class={css.appName}>{app.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
