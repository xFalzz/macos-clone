import clsx from 'clsx';
import { useAtom } from 'jotai';
import { useImmerAtom } from 'jotai/immer';
import { CloseIcon } from '__/assets/traffic-icons/Close.svg';
import { GreenLightIcon } from '__/assets/traffic-icons/GreenLightIcon';
import { MinimizeIcon } from '__/assets/traffic-icons/Minimize.svg';
import { appsConfig } from '__/data/apps/apps-config';
import { activeAppStore, AppID, openAppsStore, minimizedAppsStore } from '__/stores/apps.store';
import css from './TrafficLights.module.scss';

type TrafficLightProps = {
  appID: AppID;
  onTileClick: (type: 'maximize' | 'left' | 'right') => void;
  class?: string | null;
};

export const TrafficLights = ({ appID, onTileClick, class: className }: TrafficLightProps) => {
  const [, setOpenApps] = useImmerAtom(openAppsStore);
  const [, setMinimizedApps] = useImmerAtom(minimizedAppsStore);
  const [activeApp] = useAtom(activeAppStore);

  const closeApp = () =>
    setOpenApps((openApps) => {
      openApps[appID] = false;
      return openApps;
    });

  const minimizeApp = () =>
    setMinimizedApps((minimizedApps) => {
      minimizedApps[appID] = true;
      return minimizedApps;
    });

  const greenLightAction = () => {
    if (!appsConfig[appID].expandable) {
      onTileClick('maximize');
    }
  };

  return (
    <div class={clsx(css.container, activeApp !== appID && css.unFocussed, className)}>
      <button class={css.closeLight} onClick={closeApp}>
        <CloseIcon />
      </button>
      <button class={css.minimizeLight} onClick={minimizeApp}>
        <MinimizeIcon />
      </button>
      <div class={css.stretchContainer}>
        <button class={css.stretchLight} onClick={greenLightAction}>
          <GreenLightIcon {...appsConfig[appID]} />
        </button>
        {!appsConfig[appID].expandable && (
          <div class={css.tilingMenu}>
            <button onClick={() => onTileClick('maximize')}>Enter Full Screen</button>
            <div class={css.divider} />
            <button onClick={() => onTileClick('left')}>Move Window to Left Side of Screen</button>
            <button onClick={() => onTileClick('right')}>Move Window to Right Side of Screen</button>
          </div>
        )}
      </div>
    </div>
  );
};
