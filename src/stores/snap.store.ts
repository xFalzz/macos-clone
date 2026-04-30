import { atom } from 'jotai';

export type SnapZone = 'left' | 'right' | 'top' | null;

/** The currently active snap zone preview */
export const snapZoneAtom = atom<SnapZone>(null);
