import clsx from 'clsx';
import { useState } from 'preact/hooks';
import css from './Safari.module.scss';

type SafariProps = {
  isBeingDragged: boolean;
};

type Bookmark = {
  title: string;
  url: string;
  icon: string;
};

const bookmarks: Bookmark[] = [
  { title: 'Google', url: 'https://www.google.com/webhp?igu=1', icon: '🔍' },
  { title: 'Wikipedia', url: 'https://en.m.wikipedia.org', icon: '📚' },
  { title: 'YouTube', url: 'https://www.youtube.com/embed', icon: '▶️' },
  { title: 'GitHub', url: 'https://github.com', icon: '🐙' },
  { title: 'Reddit', url: 'https://old.reddit.com', icon: '🤖' },
  { title: 'MDN Docs', url: 'https://developer.mozilla.org', icon: '📖' },
];

const Safari = ({ isBeingDragged }: SafariProps) => {
  const [url, setUrl] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const doNavigate = (targetUrl: string) => {
    // Security: block dangerous protocols
    const lowerUrl = targetUrl.toLowerCase().replace(/\s/g, '');
    if (
      lowerUrl.startsWith('javascript:') ||
      lowerUrl.startsWith('data:') ||
      lowerUrl.startsWith('file:') ||
      lowerUrl.startsWith('vbscript:') ||
      lowerUrl.startsWith('blob:')
    ) {
      return;
    }

    if (targetUrl === 'webcam://') {
      setUrl(targetUrl);
      setInputUrl(targetUrl);
      setIsLoading(false);
      setHistory((prev) => [...prev.slice(0, historyIdx + 1), targetUrl]);
      setHistoryIdx((prev) => prev + 1);
      return;
    }

    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      // If it looks like a search query, use Google search
      if (!targetUrl.includes('.') || targetUrl.includes(' ')) {
        targetUrl = `https://www.google.com/search?igu=1&q=${encodeURIComponent(targetUrl)}`;
      } else {
        targetUrl = 'https://' + targetUrl;
      }
    }

    setUrl(targetUrl);
    setInputUrl(targetUrl);
    setIsLoading(true);
    setHistory((prev) => [...prev.slice(0, historyIdx + 1), targetUrl]);
    setHistoryIdx((prev) => prev + 1);
  };

  const navigateTo = (e: any) => {
    e.preventDefault();
    const input = inputUrl.trim();
    if (!input) return;
    doNavigate(input);
  };

  const goBack = () => {
    if (historyIdx > 0) {
      const newIdx = historyIdx - 1;
      setHistoryIdx(newIdx);
      const target = history[newIdx];
      setUrl(target);
      setInputUrl(target);
      setIsLoading(target !== 'webcam://');
    }
  };

  const goForward = () => {
    if (historyIdx < history.length - 1) {
      const newIdx = historyIdx + 1;
      setHistoryIdx(newIdx);
      const target = history[newIdx];
      setUrl(target);
      setInputUrl(target);
      setIsLoading(target !== 'webcam://');
    }
  };

  const reload = () => {
    if (!url || url === 'webcam://') return;
    setIsLoading(true);
    const current = url;
    setUrl('');
    setTimeout(() => setUrl(current), 50);
  };

  const goHome = () => {
    setUrl('');
    setInputUrl('');
    setIsLoading(false);
  };

  return (
    <section class={css.container}>
      {/* Toolbar */}
      <header class={clsx(css.toolbar, 'app-window-drag-handle')}>
        <div class={css.navButtons}>
          <button class={css.navBtn} onClick={goBack} disabled={historyIdx <= 0} title="Back">
            ‹
          </button>
          <button class={css.navBtn} onClick={goForward} disabled={historyIdx >= history.length - 1} title="Forward">
            ›
          </button>
        </div>

        {/* URL bar */}
        <form class={css.urlForm} onSubmit={navigateTo}>
          <div class={css.urlBar}>
            {isLoading && <div class={css.loadingBar} />}
            <span class={css.lockIcon}>{url.startsWith('https://') ? '🔒' : '🔍'}</span>
            <input
              type="text"
              value={inputUrl}
              onInput={(e) => setInputUrl((e.target as HTMLInputElement).value)}
              onFocus={(e) => (e.target as HTMLInputElement).select()}
              class={css.urlInput}
              placeholder="Search or enter website name"
            />
          </div>
        </form>

        <button class={css.navBtn} onClick={goHome} title="Home">
          🏠
        </button>
        <button class={css.navBtn} onClick={() => doNavigate('webcam://')} title="WebCam">
          📷
        </button>
        <button class={css.navBtn} onClick={reload} title="Reload">
          ↻
        </button>
      </header>

      {/* Browser content */}
      <div class={css.content}>
        {url === 'webcam://' ? (
          <WebCamView />
        ) : url ? (
          <iframe
            class={clsx(css.iframe, isBeingDragged && css.iframeDragged)}
            src={url}
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox"
            allow="camera; microphone; display-capture; fullscreen; autoplay"
            referrerPolicy="no-referrer"
          />
        ) : (
          <StartPage onNavigate={doNavigate} />
        )}
      </div>
    </section>
  );
};

// Safari Start Page
const StartPage = ({ onNavigate }: { onNavigate: (url: string) => void }) => {
  return (
    <div class={css.startPage}>
      <h1 class={css.startTitle}>Safari</h1>
      <p class={css.startSubtitle}>Favorites</p>
      <div class={css.bookmarkGrid}>
        {bookmarks.map((b) => (
          <button key={b.url} class={css.bookmarkItem} onClick={() => onNavigate(b.url)}>
            <span class={css.bookmarkIcon}>{b.icon}</span>
            <span class={css.bookmarkLabel}>{b.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const WebCamView = () => {
  return (
    <div class={css.webcamContainer}>
      <video
        ref={(el) => {
          if (el && !el.srcObject) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
              .then((stream) => { el.srcObject = stream; })
              .catch((err) => { console.error("WebCam access denied or not available.", err); });
          }
        }}
        autoPlay
        playsInline
        class={css.webcamVideo}
      />
    </div>
  );
};

export default Safari;
