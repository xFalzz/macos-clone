import clsx from 'clsx';
import { useAtom } from 'jotai';
import { useState } from 'preact/hooks';
import { useTheme } from '__/hooks';
import { wallpaperAtom, darkWallpaperAtom } from '__/stores/wallpaper.store';
import css from './SystemPreferences.module.scss';

const wallpaperList = [
  '37-2.jpg', '37-1.jpg', '1.jpg', '2.jpg', '3-1.jpg', '3-2.jpg',
  '4-1.jpg', '4-2.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg',
  '9.jpg', '10.jpg', '11.jpg', '13.jpg', '14.jpg', '15.jpg',
  '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg', '21.jpg',
  '22.jpg', '23.jpg', '27.jpg', '28.jpg', '30.jpg', '31.jpg',
  '32.jpg', '33.jpg',
  'The Beach.jpg', 'The Cliffs.jpg', 'The Desert.jpg', 'The Lake.jpg',
  'Tree.jpg', 'Valley.jpg',
];

type Panel = 'main' | 'appearance' | 'desktop';

const prefPanels = [
  { id: 'appearance', icon: '🎨', label: 'General' },
  { id: 'desktop', icon: '🖼️', label: 'Desktop & Screen Saver' },
  { id: 'dock', icon: '⬇️', label: 'Dock & Menu Bar' },
  { id: 'network', icon: '🌐', label: 'Network' },
  { id: 'bluetooth', icon: '📶', label: 'Bluetooth' },
  { id: 'sound', icon: '🔊', label: 'Sound' },
  { id: 'notifications', icon: '🔔', label: 'Notifications' },
  { id: 'keyboard', icon: '⌨️', label: 'Keyboard' },
  { id: 'display', icon: '🖥️', label: 'Displays' },
  { id: 'battery', icon: '🔋', label: 'Battery' },
  { id: 'privacy', icon: '🔒', label: 'Privacy & Security' },
  { id: 'users', icon: '👤', label: 'Users & Groups' },
];

const SystemPreferences = () => {
  const [panel, setPanel] = useState<Panel>('main');
  const [theme, setTheme] = useTheme();
  const [wallpaper, setWallpaper] = useAtom(wallpaperAtom);
  const [darkWallpaper, setDarkWallpaper] = useAtom(darkWallpaperAtom);

  const goHome = () => setPanel('main');

  return (
    <section class={css.container}>
      {/* Toolbar */}
      <header class={clsx(css.toolbar, 'app-window-drag-handle')}>
        {panel !== 'main' && (
          <button class={css.backBtn} onClick={goHome}>
            ‹ All
          </button>
        )}
        <span class={css.toolbarTitle}>
          {panel === 'main' ? 'System Preferences' : panel === 'appearance' ? 'General' : 'Desktop & Screen Saver'}
        </span>
      </header>

      {/* Main grid */}
      {panel === 'main' && (
        <div class={css.mainGrid}>
          {prefPanels.map((p) => (
            <button
              key={p.id}
              class={css.prefItem}
              onClick={() => {
                if (p.id === 'appearance' || p.id === 'desktop') {
                  setPanel(p.id as Panel);
                }
              }}
            >
              <span class={css.prefIcon}>{p.icon}</span>
              <span class={css.prefLabel}>{p.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Appearance panel */}
      {panel === 'appearance' && (
        <div class={css.panelContent}>
          <div class={css.section}>
            <h3 class={css.sectionTitle}>Appearance</h3>
            <div class={css.themeSelector}>
              <button
                class={clsx(css.themeOption, theme === 'light' && css.activeTheme)}
                onClick={() => setTheme('light')}
              >
                <div class={clsx(css.themePreview, css.lightPreview)} />
                <span>Light</span>
              </button>
              <button
                class={clsx(css.themeOption, theme === 'dark' && css.activeTheme)}
                onClick={() => setTheme('dark')}
              >
                <div class={clsx(css.themePreview, css.darkPreview)} />
                <span>Dark</span>
              </button>
            </div>
          </div>

          <div class={css.section}>
            <h3 class={css.sectionTitle}>Accent Color</h3>
            <div class={css.accentColors}>
              {['#007AFF', '#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#5856D6', '#AF52DE', '#FF2D55'].map((color) => (
                <button
                  key={color}
                  class={css.accentDot}
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop panel */}
      {panel === 'desktop' && (
        <div class={css.panelContent}>
          <div class={css.section}>
            <h3 class={css.sectionTitle}>Desktop Picture</h3>
            <div class={css.wallpaperGrid}>
              {wallpaperList.map((wp) => {
                const path = `/assets/wallpapers/${wp}`;
                const isActive = theme === 'dark' ? darkWallpaper === path : wallpaper === path;
                return (
                  <button
                    key={wp}
                    class={clsx(css.wallpaperThumb, isActive && css.activeWallpaper)}
                    onClick={() => {
                      if (theme === 'dark') {
                        setDarkWallpaper(path);
                      } else {
                        setWallpaper(path);
                      }
                    }}
                  >
                    <img src={path} alt={wp} loading="lazy" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SystemPreferences;
