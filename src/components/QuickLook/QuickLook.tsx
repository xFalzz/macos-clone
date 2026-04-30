import { useAtom } from 'jotai';
import { useEffect } from 'preact/hooks';
import { selectedFileAtom, quickLookVisibleAtom } from '__/stores/selection.store';
import { getFileIcon } from '__/data/file-system';
import css from './QuickLook.module.scss';
import clsx from 'clsx';

export const QuickLook = () => {
  const [selectedFile] = useAtom(selectedFileAtom);
  const [visible, setVisible] = useAtom(quickLookVisibleAtom);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        // Prevent page scrolling
        e.preventDefault();
        
        if (selectedFile) {
          setVisible((v) => !v);
        }
      }
      
      if (e.key === 'Escape' && visible) {
        setVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFile, visible]);

  if (!visible || !selectedFile) return null;

  return (
    <div class={css.overlay} onClick={() => setVisible(false)}>
      <div class={css.container} onClick={(e) => e.stopPropagation()}>
        <header class={css.header}>
          <div class={css.fileInfo}>
            <span class={css.icon}>{selectedFile.type === 'folder' ? '📁' : getFileIcon(selectedFile.name)}</span>
            <span class={css.filename}>{selectedFile.name}</span>
          </div>
          <button class={css.closeBtn} onClick={() => setVisible(false)}>×</button>
        </header>
        
        <main class={css.previewArea}>
          <div class={css.largeIcon}>{selectedFile.type === 'folder' ? '📁' : getFileIcon(selectedFile.name)}</div>
          <div class={css.details}>
            <p><strong>Type:</strong> {selectedFile.type === 'folder' ? 'Folder' : 'File'}</p>
            <p><strong>Size:</strong> {selectedFile.size || '--'}</p>
            <p><strong>Modified:</strong> {selectedFile.modified || '--'}</p>
          </div>
        </main>
      </div>
    </div>
  );
};
