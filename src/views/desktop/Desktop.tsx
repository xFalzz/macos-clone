import clsx from 'clsx';
import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'preact/hooks';
import { ContextMenu } from '__/components/Desktop/ContextMenu/ContextMenu';
import { StartupChime } from '__/components/Desktop/StartupChime';
import { WindowsArea } from '__/components/Desktop/Window/WindowsArea';
import { WidgetEngine } from '__/components/Desktop/Widgets/WidgetEngine';
import { Dock } from '__/components/dock/Dock';
import { TopBar } from '__/components/topbar/TopBar';
import { Launchpad } from '__/components/apps/Launchpad/Launchpad';
import { SystemOverlay } from '__/components/SystemOverlay/SystemOverlay';
import { Spotlight } from '__/components/Spotlight/Spotlight';
import { NotificationCenter } from '__/components/NotificationCenter/NotificationCenter';
import { NotificationPanel } from '__/components/NotificationCenter/NotificationPanel';
import { useTheme } from '__/hooks';
import { wallpaperAtom, darkWallpaperAtom } from '__/stores/wallpaper.store';
import css from './Desktop.module.scss';

import { fileSystemStore } from '__/data/file-system';

export const Desktop = () => {
  const outerRef = useRef<HTMLDivElement>();
  const [theme] = useTheme();
  const [wallpaper] = useAtom(wallpaperAtom);
  const [darkWallpaper] = useAtom(darkWallpaperAtom);
  const [fileSystem, setFileSystem] = useAtom(fileSystemStore);
  const [isDragging, setIsDragging] = useState(false);

  const activeWallpaper = theme === 'dark' ? darkWallpaper : wallpaper;

  useEffect(() => {
    preloadImage(wallpaper);
    preloadImage(darkWallpaper);
  }, [wallpaper, darkWallpaper]);

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map((file: any) => ({
        name: file.name,
        type: 'file' as const,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        modified: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      }));
      
      setFileSystem(prev => {
        const desktopIndex = prev.findIndex(f => f.name === 'Desktop');
        if (desktopIndex >= 0) {
          const newFs = [...prev];
          newFs[desktopIndex] = {
            ...newFs[desktopIndex],
            children: [...(newFs[desktopIndex].children || []), ...newFiles]
          };
          return newFs;
        }
        return prev;
      });
    }
  };

  return (
    <>
      <main 
        ref={outerRef} 
        class={clsx(css.main, isDragging && css.dragging)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <ContextMenu outerRef={outerRef} />
        <TopBar />
        <WindowsArea />
        <Dock />
      </main>

      <Launchpad />
      <SystemOverlay />
      <Spotlight />
      <NotificationCenter />
      <NotificationPanel />
      <WidgetEngine />
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
