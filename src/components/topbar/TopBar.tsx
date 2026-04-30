import { useAtom } from 'jotai';
import { BatterySVG } from '__/assets/sf-icons/Battery.svg';
import { SpotlightSVG } from '__/assets/sf-icons/Spotlight.svg';
import { ActionCenterToggle } from './ActionCenter/ActionCenterToggle';
import { MenuBar } from './menubar/MenuBar';
import css from './Topbar.module.scss';
import { TopBarIconButton } from './TopBarIconButton';
import { TopBarTime } from './TopBarTime';
import { widgetPanelVisibleAtom } from '__/components/Desktop/Widgets/WidgetEngine';

export const TopBar = () => {
  const [, setWidgetVisible] = useAtom(widgetPanelVisibleAtom);

  return (
    <header id="top-bar" class={css.header}>
      <MenuBar />

      <span style={{ flex: '1 1 auto' }} />

      <TopBarIconButton>
        <BatterySVG size={19} />
      </TopBarIconButton>

      <TopBarIconButton onClick={() => setWidgetVisible((v) => !v)}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <rect x="1" y="1" width="6" height="6" rx="1.5" />
          <rect x="9" y="1" width="6" height="6" rx="1.5" />
          <rect x="1" y="9" width="6" height="6" rx="1.5" />
          <rect x="9" y="9" width="6" height="6" rx="1.5" opacity="0.4" />
        </svg>
      </TopBarIconButton>

      <TopBarIconButton>
        <SpotlightSVG size={14} />
      </TopBarIconButton>

      <ActionCenterToggle />

      <button>
        <TopBarTime />
      </button>
    </header>
  );
};
