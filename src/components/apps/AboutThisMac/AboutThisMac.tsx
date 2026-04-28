import clsx from 'clsx';
import { useTheme } from '__/hooks';
import css from './AboutThisMac.module.scss';

export default function AboutThisMac() {
  const [theme] = useTheme();

  return (
    <div class={clsx(css.container, theme === 'dark' && css.dark)}>
      <div class={css.left}>
        <img src="/assets/mac-icon.png" alt="Mac" class={css.macIcon} onError={(e) => {
           e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg';
        }}/>
      </div>
      <div class={css.right}>
        <h2>macOS Sequoia</h2>
        <p class={css.version}>Version 15.0</p>
        
        <div class={css.specs}>
          <div class={css.specRow}>
            <span>Mac</span>
            <span>Web OS Virtual Machine</span>
          </div>
          <div class={css.specRow}>
            <span>Processor</span>
            <span>Apple Silicon (Simulated)</span>
          </div>
          <div class={css.specRow}>
            <span>Memory</span>
            <span>8 GB Unified Memory</span>
          </div>
          <div class={css.specRow}>
            <span>Display</span>
            <span>Built-in Retina Display</span>
          </div>
          <div class={css.specRow}>
            <span>Browser</span>
            <span>{navigator.userAgent.split(' ')[0]}</span>
          </div>
        </div>
        
        <div class={css.actions}>
          <button>More Info...</button>
        </div>
      </div>
    </div>
  );
}
