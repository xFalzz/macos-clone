import clsx from 'clsx';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'preact/hooks';
import { systemStateAtom } from '__/stores/system.store';
import { openAppsStore, activeAppStore } from '__/stores/apps.store';
import css from './SystemOverlay.module.scss';
import { wallpaperAtom } from '__/stores/wallpaper.store';

export const SystemOverlay = () => {
  const [systemState, setSystemState] = useAtom(systemStateAtom);
  const [wallpaper] = useAtom(wallpaperAtom);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');

  const [, setOpenApps] = useAtom(openAppsStore);
  const [, setActiveApp] = useAtom(activeAppStore);

  useEffect(() => {
    const handleSystemAction = (e: CustomEvent<string>) => {
      const action = e.detail;
      if (action === 'sleep') setSystemState('sleep');
      if (action === 'restart') setSystemState('restart');
      if (action === 'shutdown') setSystemState('shutdown');
      if (action === 'lock') setSystemState('lock');
      if (action === 'logout') setSystemState('lock');
      if (action === 'about') {
        setOpenApps((prev: any) => ({ ...prev, 'about-this-mac': true }));
        setActiveApp('about-this-mac');
      }
      if (action === 'preferences') {
        setOpenApps((prev: any) => ({ ...prev, 'system-preferences': true }));
        setActiveApp('system-preferences');
      }
    };
    
    document.addEventListener('system-action', handleSystemAction as EventListener);
    return () => document.removeEventListener('system-action', handleSystemAction as EventListener);
  }, [setSystemState, setOpenApps, setActiveApp]);

  useEffect(() => {
    if (systemState === 'lock') {
      setShowLogin(true);
    } else {
      setShowLogin(false);
      setPassword('');
    }
  }, [systemState]);

  // Handle waking up from sleep
  useEffect(() => {
    const wakeUp = () => {
      if (systemState === 'sleep') {
        setSystemState('lock'); // waking from sleep asks for password
      }
    };
    window.addEventListener('keydown', wakeUp);
    window.addEventListener('mousemove', wakeUp);
    window.addEventListener('click', wakeUp);
    return () => {
      window.removeEventListener('keydown', wakeUp);
      window.removeEventListener('mousemove', wakeUp);
      window.removeEventListener('click', wakeUp);
    };
  }, [systemState, setSystemState]);

  const handleLogin = (e: any) => {
    e.preventDefault();
    setSystemState('awake');
  };

  if (systemState === 'awake') return null;

  const isBlackScreen = systemState === 'sleep' || systemState === 'shutdown' || systemState === 'restart';

  return (
    <div 
      class={clsx(css.container, isBlackScreen && css.blackScreen, showLogin && css.loginScreen)}
      style={showLogin ? { backgroundImage: `url(${wallpaper})` } : {}}
    >
      {systemState === 'restart' && <div class={css.appleLogo}>🍎</div>}
      
      {showLogin && (
        <div class={css.loginBox}>
          <img src="/assets/profile.jpg" alt="Profile" class={css.profilePic} onError={(e) => (e.currentTarget.style.display = 'none')} />
          <div class={css.profilePlaceholder}>N</div>
          <h2>nawfal</h2>
          <form onSubmit={handleLogin} class={css.passwordForm}>
            <input 
              type="password" 
              placeholder="Enter Password (any)" 
              value={password}
              onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
              autoFocus
            />
            <button type="submit">→</button>
          </form>
          <div class={css.bottomActions}>
            <button type="button" onClick={() => setSystemState('sleep')}>Sleep</button>
            <button type="button" onClick={() => setSystemState('restart')}>Restart</button>
            <button type="button" onClick={() => setSystemState('shutdown')}>Shut Down</button>
          </div>
        </div>
      )}
    </div>
  );
};
