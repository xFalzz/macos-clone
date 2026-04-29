import { useAtom } from 'jotai';
import { useEffect } from 'preact/hooks';
import { notificationsAtom, Notification } from '__/stores/notifications.store';
import css from './NotificationCenter.module.scss';

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useAtom(notificationsAtom);

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications((prev) => prev.slice(1));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  if (notifications.length === 0) return null;

  return (
    <div class={css.container}>
      {notifications.map((n) => (
        <div key={n.id} class={css.toast}>
          {n.icon && <span class={css.icon}>{n.icon}</span>}
          <div class={css.content}>
            <div class={css.title}>{n.title}</div>
            <div class={css.body}>{n.body}</div>
          </div>
          <button
            class={css.close}
            onClick={() => setNotifications((prev) => prev.filter((x) => x.id !== n.id))}
          >×</button>
        </div>
      ))}
    </div>
  );
};
