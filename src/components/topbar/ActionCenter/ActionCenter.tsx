import { mdiBluetooth, mdiKeyboard, mdiWifiStrength4 } from '@mdi/js';
import { useAtom } from 'jotai';
import { FC } from 'preact/compat';
import { AirDropSVG } from '__/assets/sf-icons/AirDrop.svg';
import { MoonSVG } from '__/assets/sf-icons/Moon.svg';
import { AppIcon } from '__/components/utils/AppIcon';
import { useTheme } from '__/hooks';
import {
  airdropAtom,
  bluetoothAtom,
  brightnessAtom,
  wifiAtom,
} from '__/stores/action-center.store';
import css from './ActionCenter.module.scss';
import { ActionCenterShell } from './ActionCenterShell';
import { ActionCenterSurface } from './ActionCenterSurface';
import { ActionCenterTile } from './ActionCenterTile';

export const ActionCenter = () => {
  const [theme, setTheme] = useTheme();
  const [wifi, setWifi] = useAtom(wifiAtom);
  const [bluetooth, setBluetooth] = useAtom(bluetoothAtom);
  const [airdrop, setAirdrop] = useAtom(airdropAtom);
  const [brightness, setBrightness] = useAtom(brightnessAtom);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const ThemeSVGComp = MoonSVG;

  return (
    <ActionCenterShell>
      <section class={css.container}>
        {/* Main Controls: Wifi, Bluetooth, Airdrop */}
        <ActionCenterSurface
          grid={[
            [1, 6],
            [1, 4],
          ]}
        >
          {/* Wifi */}
          <ActionCenterTile grid={[1, 1]}>
            <Toggle filled={wifi} onClick={() => setWifi((v) => !v)}>
              <AppIcon path={mdiWifiStrength4} size={16} />
            </Toggle>
            Wi-Fi
          </ActionCenterTile>

          {/* Bluetooth */}
          <ActionCenterTile grid={[2, 1]}>
            <Toggle filled={bluetooth} onClick={() => setBluetooth((v) => !v)}>
              <AppIcon path={mdiBluetooth} size={18} />
            </Toggle>
            Bluetooth
          </ActionCenterTile>

          {/* Airdrop */}
          <ActionCenterTile grid={[3, 1]}>
            <Toggle filled={airdrop} onClick={() => setAirdrop((v) => !v)}>
              <AirDropSVG size={16} />
            </Toggle>
            Airdrop
          </ActionCenterTile>
        </ActionCenterSurface>

        {/* Theme Switcher */}
        <ActionCenterSurface
          grid={[
            [7, 6],
            [1, 2],
          ]}
        >
          <ActionCenterTile grid={[1, 1]}>
            <Toggle onClick={toggleTheme} filled={theme === 'dark'}>
              <ThemeSVGComp size={16} />
            </Toggle>
            Dark mode
          </ActionCenterTile>
        </ActionCenterSurface>

        {/* Keyboard Brightness */}
        <ActionCenterSurface
          grid={[
            [7, 6],
            [3, 2],
          ]}
        >
          <ActionCenterTile grid={[1, 1]}>
            <Toggle filled={!0}>
              <AppIcon path={mdiKeyboard} size={16} />
            </Toggle>
            Keyboard
          </ActionCenterTile>
        </ActionCenterSurface>

        {/* Brightness Slider */}
        <ActionCenterSurface
          grid={[
            [1, 6],
            [5, 8],
          ]}
        >
          <div class={css.sliderSection}>
            <label class={css.sliderLabel}>Display</label>
            <div class={css.sliderContainer}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="8" r="3" />
                <line x1="8" y1="1" x2="8" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="8" y1="13" x2="8" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="1" y1="8" x2="3" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="13" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="range"
                min="20"
                max="100"
                value={brightness}
                onInput={(e) => {
                  const val = Number((e.target as HTMLInputElement).value);
                  setBrightness(val);
                  document.documentElement.style.filter = `brightness(${val / 100})`;
                }}
                class={css.slider}
              />
              <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="8" r="3" />
                <line x1="8" y1="0" x2="8" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="8" y1="13" x2="8" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="0" y1="8" x2="3" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="13" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="2.3" y1="2.3" x2="4.4" y2="4.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="11.6" y1="11.6" x2="13.7" y2="13.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="2.3" y1="13.7" x2="4.4" y2="11.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="11.6" y1="4.4" x2="13.7" y2="2.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </ActionCenterSurface>
      </section>
    </ActionCenterShell>
  );
};

const Toggle: FC<{ filled: boolean } & JSX.IntrinsicElements['button']> = ({
  filled,
  children,
  ...props
}) => (
  <button
    class={css.toggle}
    style={
      {
        '--bgcolor': `var(--app-color-${filled ? 'primary' : 'dark'}-hsl)`,
        '--bgalpha': filled ? 1 : 0.1,

        '--svgcolor': `var(--app-color-${filled ? 'primary' : 'light'}-contrast-hsl)`,
        '--svgalpha': filled ? 1 : 0.9,
      } as React.CSSProperties
    }
    {...props}
  >
    {children}
  </button>
);
