import { useAtom } from 'jotai';
import { useEffect, useRef } from 'preact/hooks';
import { ContextMenu } from '__/components/Desktop/ContextMenu/ContextMenu';
import { StartupChime } from '__/components/Desktop/StartupChime';
import { WindowsArea } from '__/components/Desktop/Window/WindowsArea';
import { Dock } from '__/components/dock/Dock';
import { TopBar } from '__/components/topbar/TopBar';
import { Launchpad } from '__/components/apps/Launchpad/Launchpad';
import { useTheme } from '__/hooks';
import { wallpaperAtom, darkWallpaperAtom } from '__/stores/wallpaper.store';
import css from './Desktop.module.scss';

export const Desktop = () => {
  const outerRef = useRef<HTMLDivElement>();
  const [theme] = useTheme();
  const [wallpaper] = useAtom(wallpaperAtom);
  const [darkWallpaper] = useAtom(darkWallpaperAtom);

  const activeWallpaper = theme === 'dark' ? darkWallpaper : wallpaper;

  useEffect(() => {
    preloadImage(wallpaper);
    preloadImage(darkWallpaper);
  }, [wallpaper, darkWallpaper]);

  return (
    <>
      <main ref={outerRef} class={css.main}>
        <ContextMenu outerRef={outerRef} />
        <TopBar />
        <WindowsArea />
        <Dock />
      </main>

      <Launchpad />
      <StartupChime />

      <div
        class={css.backgroundCover}
        aria-hidden="true"
        style={{ backgroundImage: `url(${activeWallpaper})` }}
      />
    </>
  );
};

function preloadImage(path: string) {
  const img = new Image();
  img.src = path;
}
