import clsx from 'clsx';
import { useRef, useState, useEffect } from 'preact/hooks';
import css from './Music.module.scss';
import { useTheme } from '__/hooks';

export default function Music() {
  const [theme] = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>();

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: any) => {
    const value = e.target.value;
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setProgress(value);
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div class={clsx(css.container, theme === 'dark' && css.dark)}>
      <div class={css.sidebar}>
        <div class={css.search}>
          <input type="text" placeholder="Search" />
        </div>
        <div class={css.menu}>
          <h3>Apple Music</h3>
          <ul>
            <li class={css.active}>Listen Now</li>
            <li>Browse</li>
            <li>Radio</li>
          </ul>
          <h3>Library</h3>
          <ul>
            <li>Recently Added</li>
            <li>Artists</li>
            <li>Albums</li>
            <li>Songs</li>
          </ul>
        </div>
      </div>
      
      <div class={css.main}>
        <div class={css.header}>
          <h2>Listen Now</h2>
        </div>
        
        <div class={css.content}>
          <div class={css.albumArt}>
            <img src="/assets/wallpapers/33.webp" alt="Album Art" />
          </div>
          <div class={css.info}>
            <div class={css.title}>Lo-Fi Beats</div>
            <div class={css.artist}>Chill Study</div>
          </div>
        </div>
      </div>

      <div class={css.player}>
        <audio 
          ref={audioRef} 
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />
        
        <div class={css.controls}>
          <button class={css.controlBtn}>⏮</button>
          <button class={css.playBtn} onClick={togglePlay}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button class={css.controlBtn}>⏭</button>
        </div>
        
        <div class={css.progressContainer}>
          <span class={css.time}>{formatTime(progress)}</span>
          <input 
            type="range" 
            class={css.progressBar} 
            min="0" 
            max={duration || 100} 
            value={progress}
            onInput={handleSeek}
          />
          <span class={css.time}>-{formatTime(duration - progress)}</span>
        </div>
        
        <div class={css.volume}>
          <span>🔉</span>
          <input type="range" min="0" max="1" step="0.01" onInput={(e) => {
            if (audioRef.current) audioRef.current.volume = parseFloat((e.target as HTMLInputElement).value);
          }} />
        </div>
      </div>
    </div>
  );
}
