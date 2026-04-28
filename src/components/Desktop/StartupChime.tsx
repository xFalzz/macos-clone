import { mdiApple } from '@mdi/js';
import clsx from 'clsx';
import { useState } from 'preact/hooks';
import { useTimeout } from '__/hooks';
import { AppIcon } from '../utils/AppIcon';
import css from './StartupChime.module.scss';

export const StartupChime = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Start fade out after 2.5 seconds
  useTimeout(() => {
    setFadeOut(true);
  }, 2500);

  // Fully hide after fade animation completes (2.5s + 0.8s)
  useTimeout(() => {
    setHidden(true);
  }, 3300);

  if (hidden) return null;

  return (
    <>
      <div
        class={clsx({
          [css.splashScreen]: true,
          [css.fadeOut]: fadeOut,
        })}
      >
        <AppIcon path={mdiApple} fill="white" size={56} />
        <div class={css.progressContainer}>
          <div class={css.progressBar} />
        </div>
      </div>
      <audio hidden autoPlay src="/assets/sounds/mac-startup-sound.mp3" />
    </>
  );
};
