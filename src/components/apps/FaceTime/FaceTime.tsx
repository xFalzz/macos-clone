import clsx from 'clsx';
import { useEffect, useRef, useState } from 'preact/hooks';
import css from './FaceTime.module.scss';

const FaceTime = () => {
  const videoRef = useRef<HTMLVideoElement>();
  const [hasCamera, setHasCamera] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      // Cleanup: stop all tracks when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasCamera(true);
    } catch {
      setHasCamera(false);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <section class={css.container}>
      <header class={clsx(css.toolbar, 'app-window-drag-handle')}>
        <span class={css.toolbarTitle}>FaceTime</span>
      </header>

      <div class={css.videoArea}>
        {hasCamera && !isVideoOff ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            class={css.video}
          />
        ) : (
          <div class={css.noCamera}>
            <span class={css.noCameraIcon}>📷</span>
            <p>{isVideoOff ? 'Camera Off' : 'No Camera Available'}</p>
            <p class={css.noCameraHint}>
              {isVideoOff
                ? 'Click the camera button to turn it on'
                : 'Connect a camera or allow browser access'}
            </p>
          </div>
        )}

        {/* Self video overlay (pip) */}
        {hasCamera && !isVideoOff && (
          <div class={css.selfView}>
            <div class={css.selfPlaceholder}>You</div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div class={css.controls}>
        <button
          class={clsx(css.controlBtn, isMuted && css.controlActive)}
          onClick={toggleMute}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? '🔇' : '🎤'}
        </button>
        <button
          class={clsx(css.controlBtn, css.endCall)}
          title="End Call"
        >
          📞
        </button>
        <button
          class={clsx(css.controlBtn, isVideoOff && css.controlActive)}
          onClick={toggleVideo}
          title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
        >
          {isVideoOff ? '📵' : '📹'}
        </button>
      </div>
    </section>
  );
};

export default FaceTime;
