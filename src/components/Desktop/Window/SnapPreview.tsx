import css from './SnapPreview.module.scss';

type SnapPreviewProps = {
  zone: 'left' | 'right' | 'top' | null;
};

export const SnapPreview = ({ zone }: SnapPreviewProps) => {
  if (!zone) return null;

  return <div class={`${css.preview} ${css[zone]}`} />;
};
