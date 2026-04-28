import { atomWithStorage } from 'jotai/utils';

export const wallpaperAtom = atomWithStorage<string>(
  'wallpaper:path',
  '/assets/wallpapers/37-2.jpg',
);

export const darkWallpaperAtom = atomWithStorage<string>(
  'wallpaper:dark-path',
  '/assets/wallpapers/37-1.jpg',
);
