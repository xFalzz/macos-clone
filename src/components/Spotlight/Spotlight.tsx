import clsx from 'clsx';
import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'preact/hooks';
import { appsConfig } from '__/data/apps/apps-config';
import { fileSystemStore, FileSystemItem } from '__/data/file-system';
import { activeAppStore, openAppsStore, AppID } from '__/stores/apps.store';
import css from './Spotlight.module.scss';
import { useFocusOutside } from '__/hooks';

export const Spotlight = () => {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const [, setOpenApps] = useAtom(openAppsStore);
  const [, setActiveApp] = useAtom(activeAppStore);
  const [fileSystem] = useAtom(fileSystemStore);
  
  const inputRef = useRef<HTMLInputElement>();
  const containerRef = useRef<HTMLDivElement>();

  useFocusOutside(containerRef, () => setVisible(false));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd + Space or Ctrl + Space
      if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
        e.preventDefault();
        setVisible((v) => !v);
        setQuery('');
      }
      
      if (e.key === 'Escape' && visible) {
        setVisible(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible]);

  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [visible]);

  if (!visible) return null;

  // Search logic
  const apps = Object.entries(appsConfig).map(([id, config]) => ({ id, ...config }));
  const results = apps.filter(app => app.title.toLowerCase().includes(query.toLowerCase())).slice(0, 5);

  // VFS file search
  const searchFiles = (items: FileSystemItem[], path: string): { name: string; path: string; type: string }[] => {
    const found: { name: string; path: string; type: string }[] = [];
    for (const item of items) {
      const fullPath = path ? `${path}/${item.name}` : item.name;
      if (item.name.toLowerCase().includes(query.toLowerCase())) {
        found.push({ name: item.name, path: fullPath, type: item.type });
      }
      if (item.type === 'folder' && item.children) {
        found.push(...searchFiles(item.children, fullPath));
      }
    }
    return found;
  };
  const fileResults = query.length >= 2 ? searchFiles(fileSystem, '').slice(0, 5) : [];

  let mathResult: string | number | null = null;
  if (query.match(/^[0-9+\-*/().%\s]+$/) && query.trim().length > 0) {
    try {
      // Safe math evaluation: only allow numeric expressions
      const sanitized = query.replace(/[^0-9+\-*/().%\s]/g, '');
      if (sanitized.length > 0) {
        const fn = new Function(`"use strict"; return (${sanitized})`);
        const result = fn();
        if (typeof result === 'number' && isFinite(result)) {
          mathResult = result;
        }
      }
    } catch (e) {
      // Not a valid math expression, ignore
    }
  }

  const handleOpen = (id: string) => {
    setOpenApps((prev: any) => ({ ...prev, [id]: true }));
    setActiveApp(id as AppID);
    setVisible(false);
  };

  const handleOpenFinder = () => {
    setOpenApps((prev: any) => ({ ...prev, finder: true }));
    setActiveApp('finder' as AppID);
    setVisible(false);
  };

  const handleInputKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      if (mathResult !== null) return;
      if (results[selectedIndex]) {
        handleOpen(results[selectedIndex].id);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(s => Math.min(s + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(s => Math.max(s - 1, 0));
    }
  };

  return (
    <div class={css.overlay}>
      <div class={css.spotlightContainer} ref={containerRef}>
        <div class={css.searchBar}>
          <span class={css.searchIcon}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Spotlight Search"
            value={query}
            onInput={(e) => {
              setQuery((e.target as HTMLInputElement).value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
          />
        </div>
        
        {query && (
          <div class={css.results}>
            {mathResult !== null && (
              <div class={css.resultItem}>
                <span class={css.mathIcon}>=</span>
                <div class={css.mathResult}>{mathResult}</div>
              </div>
            )}
            
            {mathResult === null && results.length > 0 && (
              <>
                <div class={css.sectionLabel}>Applications</div>
                {results.map((app, idx) => (
                  <div 
                    key={app.id} 
                    class={clsx(css.resultItem, selectedIndex === idx && css.selected)}
                    onClick={() => handleOpen(app.id)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <img src={`/assets/app-icons/${app.id}/256.png`} alt={app.title} onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/app-icons/finder/256.png';
                    }}/>
                    <span>{app.title}</span>
                  </div>
                ))}
              </>
            )}

            {mathResult === null && fileResults.length > 0 && (
              <>
                <div class={css.sectionLabel}>Files & Folders</div>
                {fileResults.map((file) => (
                  <div key={file.path} class={css.resultItem} onClick={handleOpenFinder}>
                    <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>{file.type === 'folder' ? '📁' : '📄'}</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span>{file.name}</span>
                      <span style={{ fontSize: '0.65rem', opacity: 0.5 }}>{file.path}</span>
                    </div>
                  </div>
                ))}
              </>
            )}
            
            {mathResult === null && results.length === 0 && fileResults.length === 0 && (
              <div class={css.noResults}>No Results</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
