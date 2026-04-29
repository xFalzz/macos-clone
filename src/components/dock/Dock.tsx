import { useMotionValue } from 'framer-motion';
import { useAtom } from 'jotai';
import { RovingTabIndexProvider } from 'react-roving-tabindex';
import { appsConfig } from '__/data/apps/apps-config';
import { openAppsStore } from '__/stores/apps.store';
import css from './Dock.module.scss';
import { DockItem } from './DockItem';

export const Dock = () => {
  const [openApps] = useAtom(openAppsStore);

  const mouseX = useMotionValue<number | null>(null);

  const dockApps = Object.keys(appsConfig).filter(
    (appID) => appsConfig[appID as keyof typeof appsConfig].showInDock !== false || openApps[appID as keyof typeof appsConfig]
  );

  return (
    <section id="dock" class={css.container}>
      <div
        class={css.dockEl}
        onMouseMove={(event) => mouseX.set(event.nativeEvent.x)}
        onMouseLeave={() => mouseX.set(null)}
      >
        <RovingTabIndexProvider options={{ direction: 'horizontal' }}>
          {dockApps.map((appID, i) => (
            <div key={appID} style={{ display: 'contents' }}>
              {appsConfig[appID as keyof typeof appsConfig].dockBreaksBefore && (
                <div class={css.divider} aria-hidden="true" />
              )}
              <DockItem
                index={i}
                mouseX={mouseX}
                appID={appID as keyof typeof appsConfig}
                isOpen={openApps[appID as keyof typeof appsConfig]}
                {...appsConfig[appID as keyof typeof appsConfig]}
              />
            </div>
          ))}
        </RovingTabIndexProvider>
      </div>
    </section>
  );
};
