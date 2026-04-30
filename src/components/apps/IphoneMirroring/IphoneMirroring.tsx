import clsx from 'clsx';
import { useState, useEffect } from 'preact/hooks';
import css from './IphoneMirroring.module.scss';

export const IphoneMirroring = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).replace(' AM', '').replace(' PM', ''));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div class={css.container}>
      <div class={css.bezel}>
        <div class={css.screen}>
          {/* Dynamic Island */}
          <div class={css.dynamicIsland}>
            <div class={css.camera} />
          </div>

          {!unlocked ? (
            <div class={css.lockScreen} onClick={() => setUnlocked(true)}>
              <div class={css.statusBar}>
                <span class={css.carrier}>T-Mobile</span>
                <div class={css.statusIcons}>
                  <span>📶</span>
                  <span>🔋</span>
                </div>
              </div>
              <div class={css.lockIcon}>🔒</div>
              <div class={css.timeDisplay}>{currentTime}</div>
              <div class={css.dateDisplay}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
              
              <div class={css.swipeIndicator}>Swipe up to open</div>
            </div>
          ) : (
            <div class={css.homeScreen}>
              <div class={css.statusBar}>
                <span class={css.carrier}>{currentTime}</span>
                <div class={css.statusIcons}>
                  <span>📶</span>
                  <span>🔋</span>
                </div>
              </div>
              
              <div class={css.appGrid}>
                {['FaceTime', 'Calendar', 'Photos', 'Camera', 'Mail', 'Notes', 'Reminders', 'Clock', 'TV', 'Podcasts', 'App Store', 'Maps'].map((app) => (
                  <div class={css.appIconWrapper} key={app}>
                    <div class={css.appIcon} />
                    <span class={css.appName}>{app}</span>
                  </div>
                ))}
              </div>

              <div class={css.dock}>
                {['Phone', 'Safari', 'Messages', 'Music'].map((app) => (
                  <div class={css.dockIcon} key={app} />
                ))}
              </div>
              
              <div class={css.homeIndicator} onClick={() => setUnlocked(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
