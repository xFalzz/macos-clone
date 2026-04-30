import { useAtom } from 'jotai';
import { spotlightVisibleAtom } from '__/stores/spotlight.store';
import css from './SiriGlow.module.scss';
import clsx from 'clsx';

export const SiriGlow = () => {
  const [visible] = useAtom(spotlightVisibleAtom);

  return (
    <div class={clsx(css.glowContainer, visible && css.visible)}>
      <div class={css.glowBorder} />
    </div>
  );
};
