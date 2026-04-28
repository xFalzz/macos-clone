import { BatterySVG } from '__/assets/sf-icons/Battery.svg';
import { SpotlightSVG } from '__/assets/sf-icons/Spotlight.svg';
import { ActionCenterToggle } from './ActionCenter/ActionCenterToggle';
import { MenuBar } from './menubar/MenuBar';
import css from './Topbar.module.scss';
import { TopBarIconButton } from './TopBarIconButton';
import { TopBarTime } from './TopBarTime';

export const TopBar = () => {
  return (
    <header id="top-bar" class={css.header}>
      <MenuBar />

      <span style={{ flex: '1 1 auto' }} />

      <TopBarIconButton>
        <BatterySVG size={19} />
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
