import clsx from 'clsx';
import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'preact/hooks';
import { appsConfig } from '__/data/apps/apps-config';
import { fileSystemStore, FileSystemItem } from '__/data/file-system';
import { activeAppStore, openAppsStore, AppID } from '__/stores/apps.store';
import css from './Spotlight.module.scss';
import { useFocusOutside } from '__/hooks';

// ── Conversion helpers ─────────────────────────────────
const currencyRates: Record<string, number> = {
  USD: 1, IDR: 16200, EUR: 0.92, GBP: 0.79, JPY: 155.5, SGD: 1.35, MYR: 4.72, AUD: 1.53, CAD: 1.37, KRW: 1380,
};

const unitConversions: { pattern: RegExp; convert: (v: number) => { result: number; label: string } }[] = [
  { pattern: /^([\d.]+)\s*km\s+to\s+miles?$/i, convert: (v) => ({ result: v * 0.621371, label: 'miles' }) },
  { pattern: /^([\d.]+)\s*miles?\s+to\s+km$/i, convert: (v) => ({ result: v / 0.621371, label: 'km' }) },
  { pattern: /^([\d.]+)\s*kg\s+to\s+lbs?$/i, convert: (v) => ({ result: v * 2.20462, label: 'lbs' }) },
  { pattern: /^([\d.]+)\s*lbs?\s+to\s+kg$/i, convert: (v) => ({ result: v / 2.20462, label: 'kg' }) },
  { pattern: /^([\d.]+)\s*(?:celsius|c)\s+to\s+(?:fahrenheit|f)$/i, convert: (v) => ({ result: v * 9 / 5 + 32, label: '°F' }) },
  { pattern: /^([\d.]+)\s*(?:fahrenheit|f)\s+to\s+(?:celsius|c)$/i, convert: (v) => ({ result: (v - 32) * 5 / 9, label: '°C' }) },
  { pattern: /^([\d.]+)\s*cm\s+to\s+inch(?:es)?$/i, convert: (v) => ({ result: v / 2.54, label: 'inches' }) },
  { pattern: /^([\d.]+)\s*inch(?:es)?\s+to\s+cm$/i, convert: (v) => ({ result: v * 2.54, label: 'cm' }) },
  { pattern: /^([\d.]+)\s*m\s+to\s+(?:ft|feet)$/i, convert: (v) => ({ result: v * 3.28084, label: 'ft' }) },
  { pattern: /^([\d.]+)\s*(?:ft|feet)\s+to\s+m$/i, convert: (v) => ({ result: v / 3.28084, label: 'm' }) },
];

function tryCurrencyConversion(q: string): { result: string; from: string; to: string } | null {
  const match = q.match(/^([\d,.]+)\s*([a-z]{3})\s+(?:to|in)\s+([a-z]{3})$/i);
  if (!match) return null;
  const value = parseFloat(match[1].replace(/,/g, ''));
  const from = match[2].toUpperCase();
  const to = match[3].toUpperCase();
  if (!currencyRates[from] || !currencyRates[to]) return null;
  const usd = value / currencyRates[from];
  const converted = usd * currencyRates[to];
  return { result: converted.toLocaleString('en-US', { maximumFractionDigits: 2 }), from, to };
}

function tryUnitConversion(q: string): { result: string; label: string } | null {
  for (const uc of unitConversions) {
    const match = q.match(uc.pattern);
    if (match) {
      const val = parseFloat(match[1]);
      const res = uc.convert(val);
      return { result: res.result.toLocaleString('en-US', { maximumFractionDigits: 4 }), label: res.label };
    }
  }
  return null;
}

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

  // Math evaluation
  let mathResult: string | number | null = null;
  if (query.match(/^[0-9+\-*/().%\s]+$/) && query.trim().length > 0) {
    try {
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

  // Currency conversion
  const currencyResult = tryCurrencyConversion(query);

  // Unit conversion
  const unitResult = tryUnitConversion(query);

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

  const handleWebSearch = () => {
    setOpenApps((prev: any) => ({ ...prev, safari: true }));
    setActiveApp('safari' as AppID);
    setVisible(false);
  };

  const handleInputKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      if (mathResult !== null || currencyResult || unitResult) return;
      if (results[selectedIndex]) {
        handleOpen(results[selectedIndex].id);
      } else {
        handleWebSearch();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(s => Math.min(s + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(s => Math.max(s - 1, 0));
    }
  };

  const hasConversion = currencyResult || unitResult;
  const hasSpecialResult = mathResult !== null || hasConversion;
  const noResults = !hasSpecialResult && results.length === 0 && fileResults.length === 0;

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
            {/* Math result */}
            {mathResult !== null && (
              <div class={css.resultItem}>
                <span class={css.mathIcon}>=</span>
                <div class={css.mathResult}>{mathResult}</div>
              </div>
            )}

            {/* Currency conversion */}
            {currencyResult && (
              <>
                <div class={css.sectionLabel}>Conversion</div>
                <div class={css.resultItem}>
                  <span class={css.mathIcon}>💱</span>
                  <div class={css.mathResult}>
                    {currencyResult.result} {currencyResult.to}
                  </div>
                </div>
              </>
            )}

            {/* Unit conversion */}
            {unitResult && !currencyResult && (
              <>
                <div class={css.sectionLabel}>Conversion</div>
                <div class={css.resultItem}>
                  <span class={css.mathIcon}>📐</span>
                  <div class={css.mathResult}>
                    {unitResult.result} {unitResult.label}
                  </div>
                </div>
              </>
            )}
            
            {/* Application results */}
            {!hasSpecialResult && results.length > 0 && (
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

            {/* File results */}
            {!hasSpecialResult && fileResults.length > 0 && (
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

            {/* Web search fallback */}
            {noResults && (
              <>
                <div class={css.resultItem} onClick={handleWebSearch} style={{ cursor: 'pointer' }}>
                  <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>🌐</span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>Search the Web</span>
                    <span style={{ fontSize: '0.65rem', opacity: 0.5 }}>Search for "{query}" in Safari</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
