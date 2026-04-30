import { useAtom } from 'jotai';
import { ComponentChildren, RefObject } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { RovingTabIndexProvider, useFocusEffect, useRovingTabIndex } from 'react-roving-tabindex';
import { contextMenuConfig } from '__/data/menu/context.menu.config';
import { useContextMenu, useFocusOutside } from '__/hooks';
import { playSound } from '__/helpers/sound-effects';
import css from './ContextMenu.module.scss';

type Props = {
  outerRef: RefObject<HTMLDivElement>;
};

import { fileSystemStore } from '__/data/file-system';
import { activeAppStore, openAppsStore } from '__/stores/apps.store';
import { notificationsAtom, pushNotification } from '__/stores/notifications.store';

export const ContextMenu = ({ outerRef }: Props) => {
  const { xPos, yPos, isMenuVisible, setIsMenuVisible } = useContextMenu(outerRef);
  const containerRef = useRef<HTMLDivElement>();
  const defMenu = contextMenuConfig.default;

  const [, setFileSystem] = useAtom(fileSystemStore);
  const [, setOpenApps] = useAtom(openAppsStore);
  const [, setActiveApp] = useAtom(activeAppStore);
  const [, setNotifications] = useAtom(notificationsAtom);

  useEffect(() => {
    isMenuVisible && containerRef.current.focus();
  }, [isMenuVisible]);

  useFocusOutside(containerRef, () => isMenuVisible && setIsMenuVisible(false));

  const handleAction = (key: string) => {
    setIsMenuVisible(false);
    playSound('click');
    
    switch (key) {
      case 'new-folder':
        setFileSystem((prev: any) => {
          const newFs = JSON.parse(JSON.stringify(prev));
          const desktop = newFs.find((i: any) => i.name === 'Desktop');
          if (desktop) {
            const baseName = 'untitled folder';
            let name = baseName;
            let counter = 1;
            while (desktop.children?.find((i: any) => i.name === name)) {
              counter++;
              name = `${baseName} ${counter}`;
            }
            desktop.children = desktop.children || [];
            desktop.children.push({
              name,
              type: 'folder',
              modified: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            });
          }
          return newFs;
        });
        setNotifications(prev => [...prev, pushNotification('Finder', 'New folder created on Desktop', '📁')]);
        break;
      case 'change-desktop-bg':
        setOpenApps((apps: any) => {
          const newApps = { ...apps };
          newApps['system-preferences'] = true;
          return newApps;
        });
        setActiveApp('system-preferences');
        break;
      case 'sort-by':
        setFileSystem((prev: any) => {
          const newFs = JSON.parse(JSON.stringify(prev));
          const desktop = newFs.find((i: any) => i.name === 'Desktop');
          if (desktop && desktop.children) {
            desktop.children.sort((a: any, b: any) => a.name.localeCompare(b.name));
          }
          return newFs;
        });
        setNotifications(prev => [...prev, pushNotification('Finder', 'Desktop sorted by name', '📂')]);
        break;
      case 'get-info':
        setNotifications(prev => [...prev, pushNotification('macOS Web Clone', 'Version 2.0 — Built with Preact, TypeScript & SCSS', '💻')]);
        break;
      default:
        setNotifications(prev => [...prev, pushNotification('System', `${key} action triggered`, '⚙️')]);
    }
  };

  return isMenuVisible ? (
    <div
      class={css.contextContainer}
      tabIndex={-1}
      ref={containerRef}
      style={{ top: yPos, left: xPos }}
    >
      <RovingTabIndexProvider options={{ direction: 'vertical', loopAround: true }}>
        {Object.keys(defMenu).map((key) => (
          <>
            <ContextMenuButton onClick={() => handleAction(key)}>{defMenu[key].title}</ContextMenuButton>
            {(defMenu[key] as any).breakAfter && <div class={css.divider}></div>}
          </>
        ))}
      </RovingTabIndexProvider>
    </div>
  ) : (
    <></>
  );
};

type ContextMenuButtonProps = {
  children: ComponentChildren;
  onClick?: () => void;
};

const ContextMenuButton = ({ children, onClick }: ContextMenuButtonProps) => {
  const ref = useRef<HTMLButtonElement>();

  const [tabIndex, focused, handleKeyDown, handleClick] = useRovingTabIndex(ref, false);

  useFocusEffect(focused, ref);

  const _onClick = () => {
    handleClick();
    onClick?.();
  };

  return (
    <button
      onKeyDown={handleKeyDown}
      onClick={_onClick}
      tabIndex={tabIndex}
      ref={ref}
      class={css.menuItem}
    >
      {children}
    </button>
  );
};
