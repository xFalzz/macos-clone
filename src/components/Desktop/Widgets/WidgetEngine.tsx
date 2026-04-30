import clsx from 'clsx';
import { useAtom } from 'jotai';
import { atom } from 'jotai';
import { useEffect, useState } from 'preact/hooks';
import css from './WidgetEngine.module.scss';

export const widgetPanelVisibleAtom = atom(false);

// ── Clock Widget ──────────────────────────────────────────
const ClockWidget = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Analog clock angles
  const hourAngle = (hours % 12) * 30 + minutes * 0.5;
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  const timeStr = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const cityName = Intl.DateTimeFormat().resolvedOptions().timeZone.split('/').pop()?.replace(/_/g, ' ') || 'Local';

  return (
    <div class={css.widget}>
      <div class={css.widgetHeader}>
        <span class={css.widgetIcon}>🕐</span>
        <span class={css.widgetTitle}>Clock</span>
      </div>
      <div class={css.clockBody}>
        <div class={css.analogClock}>
          <div class={css.clockFace}>
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                class={css.clockMark}
                style={{ transform: `rotate(${i * 30}deg)` }}
              />
            ))}
            <div
              class={clsx(css.clockHand, css.hourHand)}
              style={{ transform: `rotate(${hourAngle}deg)` }}
            />
            <div
              class={clsx(css.clockHand, css.minuteHand)}
              style={{ transform: `rotate(${minuteAngle}deg)` }}
            />
            <div
              class={clsx(css.clockHand, css.secondHand)}
              style={{ transform: `rotate(${secondAngle}deg)` }}
            />
            <div class={css.clockCenter} />
          </div>
        </div>
        <div class={css.clockDigital}>
          <span class={css.clockTime}>{timeStr}</span>
          <span class={css.clockCity}>{cityName}</span>
        </div>
      </div>
    </div>
  );
};

// ── Calendar Widget ──────────────────────────────────────
const CalendarWidget = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const dayOfWeek = now.getDay();

  const monthName = now.toLocaleDateString('en-US', { month: 'long' });
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div class={css.widget}>
      <div class={css.widgetHeader}>
        <span class={css.widgetIcon}>📅</span>
        <span class={css.widgetTitle}>Calendar</span>
      </div>
      <div class={css.calendarBody}>
        <div class={css.calendarToday}>
          <span class={css.calendarDayName}>{dayName}</span>
          <span class={css.calendarDateBig}>{today}</span>
          <span class={css.calendarMonth}>{monthName} {year}</span>
        </div>
        <div class={css.calendarGrid}>
          <div class={css.calendarWeekHeader}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <span key={d} class={css.calendarWeekDay}>{d}</span>
            ))}
          </div>
          <div class={css.calendarDays}>
            {days.map((day, i) => (
              <span
                key={i}
                class={clsx(css.calendarDay, day === today && css.calendarToHighlight, !day && css.calendarEmpty)}
              >
                {day || ''}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Weather Widget ──────────────────────────────────────
const weatherData = [
  { city: 'Yogyakarta', temp: 29, condition: '☀️', high: 32, low: 24 },
  { city: 'Jakarta', temp: 31, condition: '⛅', high: 33, low: 26 },
  { city: 'Tokyo', temp: 18, condition: '🌤️', high: 21, low: 14 },
  { city: 'New York', temp: 12, condition: '🌧️', high: 15, low: 8 },
];

const WeatherWidget = () => {
  const [selectedCity, setSelectedCity] = useState(0);
  const w = weatherData[selectedCity];

  return (
    <div class={css.widget}>
      <div class={css.widgetHeader}>
        <span class={css.widgetIcon}>🌤️</span>
        <span class={css.widgetTitle}>Weather</span>
      </div>
      <div class={css.weatherBody}>
        <div class={css.weatherMain}>
          <span class={css.weatherCondition}>{w.condition}</span>
          <div class={css.weatherInfo}>
            <span class={css.weatherTemp}>{w.temp}°</span>
            <span class={css.weatherCity}>{w.city}</span>
            <span class={css.weatherHL}>H:{w.high}° L:{w.low}°</span>
          </div>
        </div>
        <div class={css.weatherCities}>
          {weatherData.map((city, i) => (
            <button
              key={city.city}
              class={clsx(css.weatherCityBtn, selectedCity === i && css.weatherCityActive)}
              onClick={() => setSelectedCity(i)}
            >
              <span>{city.condition}</span>
              <span class={css.weatherCityName}>{city.city}</span>
              <span class={css.weatherCityTemp}>{city.temp}°</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Battery Widget ──────────────────────────────────────
const BatteryWidget = () => {
  const [battery, setBattery] = useState({ level: 0.85, charging: false });
  const [uptime, setUptime] = useState('');

  useEffect(() => {
    // Try real Battery API
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((bat: any) => {
        setBattery({ level: bat.level, charging: bat.charging });
        bat.addEventListener('levelchange', () => setBattery({ level: bat.level, charging: bat.charging }));
        bat.addEventListener('chargingchange', () => setBattery({ level: bat.level, charging: bat.charging }));
      }).catch(() => {});
    }

    // Uptime ticker
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const h = Math.floor(elapsed / 3600);
      const m = Math.floor((elapsed % 3600) / 60);
      const s = elapsed % 60;
      setUptime(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  const pct = Math.round(battery.level * 100);
  const barColor = pct > 20 ? (pct > 50 ? '#30d158' : '#ff9f0a') : '#ff3b30';

  return (
    <div class={css.widget}>
      <div class={css.widgetHeader}>
        <span class={css.widgetIcon}>🔋</span>
        <span class={css.widgetTitle}>Battery</span>
      </div>
      <div class={css.batteryBody}>
        <div class={css.batteryVisual}>
          <div class={css.batteryShell}>
            <div class={css.batteryFill} style={{ width: `${pct}%`, background: barColor }} />
          </div>
          <div class={css.batteryTip} />
        </div>
        <div class={css.batteryInfo}>
          <span class={css.batteryPct}>{pct}%</span>
          <span class={css.batteryStatus}>{battery.charging ? '⚡ Charging' : 'On Battery'}</span>
        </div>
        <div class={css.batteryMeta}>
          <div class={css.batteryMetaItem}>
            <span class={css.batteryMetaLabel}>Session Uptime</span>
            <span class={css.batteryMetaValue}>{uptime || '0h 0m 0s'}</span>
          </div>
          <div class={css.batteryMetaItem}>
            <span class={css.batteryMetaLabel}>Power Source</span>
            <span class={css.batteryMetaValue}>{battery.charging ? 'AC Power' : 'Battery'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Widget Engine (Container) ───────────────────────────
export const WidgetEngine = () => {
  const [visible, setVisible] = useAtom(widgetPanelVisibleAtom);

  if (!visible) return null;

  return (
    <div class={css.overlay} onClick={(e: any) => { if (e.target === e.currentTarget) setVisible(false); }}>
      <div class={clsx(css.panel, visible && css.panelVisible)}>
        <div class={css.panelHeader}>
          <h2 class={css.panelTitle}>Widgets</h2>
          <button class={css.panelClose} onClick={() => setVisible(false)}>Done</button>
        </div>
        <div class={css.panelGrid}>
          <ClockWidget />
          <CalendarWidget />
          <WeatherWidget />
          <BatteryWidget />
        </div>
      </div>
    </div>
  );
};
