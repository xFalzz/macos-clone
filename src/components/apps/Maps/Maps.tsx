import clsx from 'clsx';
import css from './Maps.module.scss';

type MapsProps = {
  isBeingDragged?: boolean;
};

const Maps = ({ isBeingDragged }: MapsProps) => {
  return (
    <section class={css.container}>
      <header class={clsx(css.toolbar, 'app-window-drag-handle')}>
        <span class={css.toolbarTitle}>Maps</span>
      </header>
      <div class={css.content}>
        <iframe
          class={clsx(css.iframe, isBeingDragged && css.iframeDragged)}
          src="https://www.openstreetmap.org/export/embed.html?bbox=110.3500%2C-7.8100%2C110.4300%2C-7.7500&layer=mapnik"
          title="OpenStreetMap"
        />
      </div>
    </section>
  );
};

export default Maps;
