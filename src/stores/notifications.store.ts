import { atom, useAtom } from 'jotai';
import { useEffect } from 'preact/hooks';

export type Notification = {
  id: number;
  title: string;
  body: string;
  icon?: string;
};

let notifId = 0;

export const notificationsAtom = atom<Notification[]>([]);

export const pushNotification = (title: string, body: string, icon?: string) => {
  const id = ++notifId;
  return { id, title, body, icon };
};
