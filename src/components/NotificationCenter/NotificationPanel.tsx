import clsx from 'clsx';
import { useAtom } from 'jotai';
import { useRef, useState } from 'preact/hooks';
import { notificationPanelVisibleAtom } from '__/stores/notification-panel.store';
import { useFocusOutside } from '__/hooks';
import css from './NotificationPanel.module.scss';

// ── Mini Calendar ──────────────────────────────────────
const MiniCalendar = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  const monthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div class={css.calSection}>
      <div class={css.calHeader}>{monthName}</div>
      <div class={css.calWeek}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div class={css.calDays}>
        {days.map((day, i) => (
          <span key={i} class={clsx(css.calDay, day === today && css.calToday, !day && css.calEmpty)}>
            {day || ''}
          </span>
        ))}
      </div>
    </div>
  );
};

// ── Weather Preview ────────────────────────────────────
const WeatherPreview = () => (
  <div class={css.weatherSection}>
    <div class={css.weatherRow}>
      <div class={css.weatherLeft}>
        <span class={css.weatherEmoji}>☀️</span>
        <div>
          <div class={css.weatherTemp}>29°</div>
          <div class={css.weatherCity}>Yogyakarta</div>
        </div>
      </div>
      <div class={css.weatherRight}>
        <span>H: 32°</span>
        <span>L: 24°</span>
      </div>
    </div>
  </div>
);

// ── Focus Mode ─────────────────────────────────────────
const FocusSection = () => {
  const [focusOn, setFocusOn] = useState(false);
  return (
    <div class={css.focusSection}>
      <div class={css.focusRow}>
        <div class={css.focusInfo}>
          <span class={css.focusIcon}>🌙</span>
          <div>
            <div class={css.focusTitle}>Do Not Disturb</div>
            <div class={css.focusSubtitle}>{focusOn ? 'On' : 'Off'}</div>
          </div>
        </div>
        <button
          class={clsx(css.focusToggle, focusOn && css.focusToggleOn)}
          onClick={() => setFocusOn(!focusOn)}
        >
          <span class={css.focusToggleKnob} />
        </button>
      </div>
    </div>
  );
};

// ── Notification Panel ─────────────────────────────────
export const NotificationPanel = () => {
  const [visible, setVisible] = useAtom(notificationPanelVisibleAtom);
  const panelRef = useRef<HTMLDivElement>();

  useFocusOutside(panelRef, () => visible && setVisible(false));

  if (!visible) return null;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div class={css.overlay} onClick={(e: any) => { if (e.target === e.currentTarget) setVisible(false); }}>
      <div class={css.panel} ref={panelRef}>
        <div class={css.panelDate}>{dateStr}</div>

        <FocusSection />
        <MiniCalendar />
        <WeatherPreview />

        <div class={css.notifSection}>
          <div class={css.notifHeader}>Notifications</div>
          <div class={css.notifEmpty}>No New Notifications</div>
        </div>
      </div>
    </div>
  );
};
