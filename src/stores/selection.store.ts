import { atom } from 'jotai';
import { FileSystemItem } from '__/data/file-system';

export const selectedFileAtom = atom<FileSystemItem | null>(null);
export const quickLookVisibleAtom = atom(false);
