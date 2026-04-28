import clsx from 'clsx';
import { useState } from 'preact/hooks';
import css from './Photos.module.scss';

const photoList = [
  '1.jpg', '2.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg',
  '11.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg',
  '20.jpg', '21.jpg', '22.jpg', '23.jpg', '27.jpg', '28.jpg',
  'The Beach.jpg', 'The Cliffs.jpg', 'The Desert.jpg', 'The Lake.jpg', 'Tree.jpg', 'Valley.jpg',
];

const Photos = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'library' | 'favorites'>('library');

  return (
    <section class={css.container}>
      <header class={clsx(css.toolbar, 'app-window-drag-handle')}>
        <div class={css.tabs}>
          <button
            class={clsx(css.tab, activeTab === 'library' && css.activeTab)}
            onClick={() => setActiveTab('library')}
          >
            Library
          </button>
          <button
            class={clsx(css.tab, activeTab === 'favorites' && css.activeTab)}
            onClick={() => setActiveTab('favorites')}
          >
            Favorites
          </button>
        </div>
      </header>

      {selectedPhoto ? (
        <div class={css.photoViewer}>
          <button class={css.closeViewer} onClick={() => setSelectedPhoto(null)}>✕</button>
          <img src={`/assets/wallpapers/${selectedPhoto}`} alt={selectedPhoto} class={css.fullPhoto} />
          <div class={css.photoInfo}>
            <span>{selectedPhoto.replace('.jpg', '')}</span>
          </div>
        </div>
      ) : (
        <div class={css.grid}>
          {photoList.map((photo) => (
            <button
              key={photo}
              class={css.photoThumb}
              onClick={() => setSelectedPhoto(photo)}
            >
              <img
                src={`/assets/wallpapers/${photo}`}
                alt={photo}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default Photos;
