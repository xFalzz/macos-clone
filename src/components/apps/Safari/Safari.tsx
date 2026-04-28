import clsx from 'clsx';
import { useState } from 'preact/hooks';
import css from './Safari.module.scss';

type SafariProps = {
  isBeingDragged: boolean;
};

const Safari = ({ isBeingDragged }: SafariProps) => {
  const [url, setUrl] = useState('https://duckduckgo.com');
  const [inputUrl, setInputUrl] = useState('https://duckduckgo.com');
  const [isLoading, setIsLoading] = useState(true);

  const navigateTo = (e: any) => {
    e.preventDefault();
    let targetUrl = inputUrl.trim();

    if (targetUrl === 'webcam://') {
      setUrl(targetUrl);
      setIsLoading(false);
      return;
    }

    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    setUrl(targetUrl);
    setInputUrl(targetUrl);
    setIsLoading(true);
  };

  const goBack = () => {
    // Browser history is managed by the iframe internally
  };

  const reload = () => {
    setIsLoading(true);
    const current = url;
    setUrl('');
    setTimeout(() => setUrl(current), 50);
  };

  return (
    <section class={css.container}>
      {/* Toolbar */}
      <header class={clsx(css.toolbar, 'app-window-drag-handle')}>
        <div class={css.navButtons}>
          <button class={css.navBtn} onClick={goBack} title="Back">
            ‹
          </button>
          <button class={css.navBtn} disabled title="Forward">
            ›
          </button>
        </div>

        {/* URL bar */}
        <form class={css.urlForm} onSubmit={navigateTo}>
          <div class={css.urlBar}>
            {isLoading && <div class={css.loadingBar} />}
            <span class={css.lockIcon}>🔒</span>
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

        <button class={css.navBtn} onClick={() => { setInputUrl('webcam://'); navigateTo(new Event('submit')); }} title="Test WebCam">
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
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            allow="camera; microphone; display-capture; fullscreen; autoplay"
          />
        ) : null}
      </div>
    </section>
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
