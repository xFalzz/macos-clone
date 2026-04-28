import { atom } from 'jotai';

/** WiFi toggle state */
export const wifiAtom = atom(true);

/** Bluetooth toggle state */
export const bluetoothAtom = atom(true);

/** AirDrop toggle state */
export const airdropAtom = atom(false);

/** Screen brightness (0 to 100) */
export const brightnessAtom = atom(100);
