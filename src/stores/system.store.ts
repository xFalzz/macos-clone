import { atom } from 'jotai';

export type SystemState = 'awake' | 'sleep' | 'restart' | 'shutdown' | 'lock';

export const systemStateAtom = atom<SystemState>('awake');
