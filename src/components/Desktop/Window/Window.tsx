import clsx from 'clsx';
import { useAtom } from 'jotai';
import { RefObject } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { Suspense } from 'react';
import { Rnd } from 'react-rnd';
import { AppNexus } from '__/components/apps/AppNexus';
import { appsConfig } from '__/data/apps/apps-config';
import { randint } from '__/helpers/random';
import { activeAppStore, activeAppZIndexStore, AppID, minimizedAppsStore } from '__/stores/apps.store';
import { snapZoneAtom, SnapZone } from '__/stores/snap.store';
import { TrafficLights } from './TrafficLights';
import css from './Window.module.scss';

type WindowProps = {
  appID: AppID;
};

type WindowSize = {
  width: string | number;
  height: string | number;
};

type WindowPosition = {
  x: number;
  y: number;
};

class WindowRnd extends Rnd {
  base?: HTMLDivElement;
}

export const Window = ({ appID }: WindowProps) => {
  const [activeAppZIndex] = useAtom(activeAppZIndexStore);
  const [activeApp, setActiveApp] = useAtom(activeAppStore);
  const [minimizedApps] = useAtom(minimizedAppsStore);
  const [, setSnapZone] = useAtom(snapZoneAtom);

  const containerRef = useRef<HTMLDivElement>();

  const [appZIndex, setAppZIndex] = useState(0);
  const [isBeingDragged, setIsBeingDragged] = useState(false);

  const randX = useMemo(() => randint(-600, 600), []);
  const randY = useMemo(() => randint(-100, 100), []);

  const windowRef = useRef<WindowRnd>();
  const tileWindow = useTileWindow(windowRef);

  const isMinimized = minimizedApps[appID];

  useEffect(() => {
    if (activeApp === appID) setAppZIndex(activeAppZIndex);
  }, [activeApp]);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const { resizable, height, width, trafficLightsStyle, expandable } = appsConfig[appID];

  const focusCurrentApp = () => {
    setActiveApp(appID);
  };

  return (
    <Rnd
      ref={windowRef}
      style={{ zIndex: appZIndex }}
      default={{
        height,
        width,
        x: ((3 / 2) * document.body.clientWidth + randX) / 2,
        y: (100 + randY) / 2,
      }}
      enableResizing={resizable}
      dragHandleClassName="app-window-drag-handle"
      bounds="parent"
      minWidth="300"
      minHeight="300"
      onDrag={(_e: any, d: any) => {
        const threshold = 16;
        const screenW = window.innerWidth;
        const screenLeft = screenW / 2; // Offset because parent is left: -50vw
        const screenRight = screenW * 1.5;
        
        if (d.x <= screenLeft + threshold) setSnapZone('left');
        else if (d.x + (windowRef.current?.resizableElement?.current?.clientWidth || 0) >= screenRight - threshold) setSnapZone('right');
        else if (d.y <= threshold) setSnapZone('top');
        else setSnapZone(null);
      }}
      onDragStart={() => {
        focusCurrentApp();
        setIsBeingDragged(true);
      }}
      onDragStop={(_e: any, d: any) => {
        setIsBeingDragged(false);
        const threshold = 16;
        const screenW = window.innerWidth;
        const screenLeft = screenW / 2;
        const screenRight = screenW * 1.5;
        const topBarH = document.getElementById('top-bar')?.clientHeight ?? 0;
        const dockH = document.getElementById('dock')?.clientHeight ?? 0;
        const desktopH = document.body.clientHeight - topBarH - dockH;

        if (d.x <= screenLeft + threshold && windowRef.current) {
          windowRef.current.updateSize({ width: screenW / 2, height: desktopH });
          windowRef.current.updatePosition({ x: screenLeft, y: 0 });
        } else if (d.x + (windowRef.current?.resizableElement?.current?.clientWidth || 0) >= screenRight - threshold && windowRef.current) {
          windowRef.current.updateSize({ width: screenW / 2, height: desktopH });
          windowRef.current.updatePosition({ x: screenLeft + screenW / 2, y: 0 });
        } else if (d.y <= threshold && windowRef.current) {
          windowRef.current.updateSize({ width: screenW, height: desktopH });
          windowRef.current.updatePosition({ x: screenLeft, y: 0 });
        }
        setSnapZone(null);
      }}
      className={clsx(css.windowRnd, isMinimized && css.minimized)}
    >
      <section class={css.container} tabIndex={-1} ref={containerRef} onClick={focusCurrentApp}>
        <div
          style={trafficLightsStyle}
          class={clsx(css.trafficLightsContainer, 'app-window-drag-handle')}
        >
          <TrafficLights appID={appID} onTileClick={tileWindow} />
        </div>
        <Suspense fallback={<span></span>}>
          <AppNexus appID={appID} isBeingDragged={isBeingDragged} />
        </Suspense>
      </section>
    </Rnd>
  );
};

/**
 * Extract the x and y from the transform style of the base element using Regex
 * Why using this hacking method:
 * react-rnd uses transform and translate to shift window around instead of top
 * and left and it does not provide the access to x and y values from ref
 * @param transformStyle The transform style string. e.g. translate(1123.75px, 7px)
 * @returns The window position. e.g. { x: 1123.75, y: 7 }
 */
function extractPositionFromTransformStyle(transformStyle: string): WindowPosition {
  const matched = transformStyle.matchAll(/[0-9.]+/g);
  try {
    return { x: Number(matched.next().value[0]), y: Number(matched.next().value[0]) };
  } catch {
    return { x: 0, y: 0 };
  }
}

const useTileWindow = (windowRef: RefObject<WindowRnd>) => {
  const originalSizeRef = useRef<WindowSize>({ height: 0, width: 0 });
  const originalPositionRef = useRef<WindowPosition>({
    x: 0,
    y: 0,
  });
  const transitionClearanceRef = useRef<number>();

  return (type: 'maximize' | 'left' | 'right') => {
    if (!windowRef?.current?.resizableElement?.current || !windowRef?.current?.base) {
      return;
    }

    const dockElementHeight = document.getElementById('dock')?.clientHeight ?? 0;
    const topBarElementHeight = document.getElementById('top-bar')?.clientHeight ?? 0;
    const desktopHeight = document.body.clientHeight - dockElementHeight - topBarElementHeight;
    const deskTopWidth = document.body.clientWidth;

    const { clientWidth: windowWidth, clientHeight: windowHeight } =
      windowRef.current.resizableElement.current;

    const { x: windowLeft, y: windowTop } = extractPositionFromTransformStyle(
      windowRef.current.base.style.transform,
    );

    windowRef.current.base.style.transition =
      'height 0.3s ease, width 0.3s ease, transform 0.3s ease';

    clearTimeout(transitionClearanceRef.current);
    transitionClearanceRef.current = setTimeout(() => {
      if (windowRef.current?.base) {
        windowRef.current.base.style.transition = '';
      }
      transitionClearanceRef.current = 0;
    }, 300);

    // Save original state if not currently tiled (full or half screen)
    if (windowWidth !== deskTopWidth && windowWidth !== deskTopWidth / 2) {
      originalSizeRef.current = { width: windowWidth, height: windowHeight };
      originalPositionRef.current = { x: windowLeft, y: windowTop };
    }

    if (type === 'maximize') {
      if (windowWidth === deskTopWidth && windowHeight === desktopHeight) {
        windowRef.current.updateSize(originalSizeRef.current);
        windowRef.current.updatePosition(originalPositionRef.current);
      } else {
        windowRef.current.updateSize({ height: desktopHeight, width: deskTopWidth });
        windowRef.current.updatePosition({ x: deskTopWidth / 2, y: 0 });
      }
    } else if (type === 'left') {
      windowRef.current.updateSize({ height: desktopHeight, width: deskTopWidth / 2 });
      windowRef.current.updatePosition({ x: deskTopWidth / 2, y: 0 });
    } else if (type === 'right') {
      windowRef.current.updateSize({ height: desktopHeight, width: deskTopWidth / 2 });
      windowRef.current.updatePosition({ x: deskTopWidth, y: 0 });
    }
  };
};

export default Window;
