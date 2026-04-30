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
  const [isError, setIsError] = useState(false);
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [mathProblem, setMathProblem] = useState({ question: '', answer: 0 });

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

  const generateMathProblem = () => {
    const isAddition = Math.random() > 0.5;
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    
    if (isAddition) {
      setMathProblem({ question: `${a} + ${b}`, answer: a + b });
    } else {
      // Ensure positive result for subtraction
      const max = Math.max(a, b);
      const min = Math.min(a, b);
      setMathProblem({ question: `${max} - ${min}`, answer: max - min });
    }
  };

  useEffect(() => {
    if (systemState === 'lock') {
      setShowLogin(true);
      generateMathProblem();
    } else {
      setShowLogin(false);
      setPassword('');
      setIsError(false);
    }
  }, [systemState]);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).replace(' AM', '').replace(' PM', ''));
      setDate(now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

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
    e?.preventDefault();
    
    if (parseInt(password) === mathProblem.answer || password === 'admin') {
      setSystemState('awake');
      setPassword('');
      setIsError(false);
    } else {
      setIsError(true);
      setPassword('');
      generateMathProblem(); // New problem on error
      setTimeout(() => setIsError(false), 500);
    }
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
        <div class={css.lockScreenContent}>
          <div class={css.clockContainer}>
            <div class={css.time}>{time}</div>
            <div class={css.date}>{date}</div>
          </div>

          <div class={css.loginContainer}>
            <div class={css.avatar}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="4" fill="currentColor" />
                <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </div>
            <div class={css.username}>Admin</div>
            
            <div class={css.verificationContainer}>
              <div class={css.verificationLabel}>VERIFICATION</div>
              <div class={css.questionBox}>
                What is the result of {mathProblem.question}?
              </div>
            </div>

            <form onSubmit={handleLogin} class={clsx(css.passwordForm, isError && css.shake)}>
              <input 
                type="text" 
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Answer" 
                value={password}
                onInput={(e) => setPassword(e.currentTarget.value)}
                autoFocus
              />
              <button type="submit" aria-label="Unlock">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </form>

            <div class={css.hint}>
              Enter the math result to unlock
            </div>

            <div class={css.bottomActions}>
              <button type="button" onClick={() => setSystemState('sleep')}>Sleep</button>
              <button type="button" onClick={() => setSystemState('restart')}>Restart</button>
              <button type="button" onClick={() => setSystemState('shutdown')}>Shut Down</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
