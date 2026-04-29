import clsx from 'clsx';
import { useAtom } from 'jotai';
import { useState, useRef, useEffect } from 'preact/hooks';
import { fileSystemStore, FileSystemItem } from '__/data/file-system';
import css from './Terminal.module.scss';

const neofetchOutput = `                    'c.          nawfal@macbook-pro
                 ,xNMM.          --------------------
               .OMMMMo           OS: macOS Sequoia 15.0
               OMMM0,            Host: MacBook Pro (Web)
     .;loddo:' loolloddol;.      Kernel: Preact 10.x
   cKMMMMMMMMMMNWMMMMMMMMMM0:    Uptime: Since page load
 .KMMMMMMMMMMMMMMMMMMMMMMMWd.    Packages: 37 (npm)
 XMMMMMMMMMMMMMMMMMMMMMMMX.     Shell: Terminal.app
;MMMMMMMMMMMMMMMMMMMMMMMM:      Resolution: \${window.innerWidth}x\${window.innerHeight}
:MMMMMMMMMMMMMMMMMMMMMMMM:      DE: macOS Desktop
.MMMMMMMMMMMMMMMMMMMMMMMMX.     WM: Window Manager (Jotai)
 kMMMMMMMMMMMMMMMMMMMMMMMMWd.   Theme: Sequoia Light/Dark
 .XMMMMMMMMMMMMMMMMMMMMMMMMk    Terminal: Terminal.app
  .XMMMMMMMMMMMMMMMMMMMMK.      CPU: Browser Engine
    kMMMMMMMMMMMMMMMMMMMMd       GPU: WebGL Renderer
     ;KMMMMMMMWXXWMMMMMMMk.     Memory: Web Browser
       .cooc,.    .,coo:.`;

type TerminalLine = { type: 'input' | 'output'; text: string };

const Terminal = () => {
  const [fileSystem, setFileSystem] = useAtom(fileSystemStore);
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', text: 'Last login: ' + new Date().toLocaleString() + ' on ttys000' },
  ]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>();
  const scrollRef = useRef<HTMLDivElement>();

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [lines]);

  // Navigate the VFS to find the current directory items
  const getItemsAtPath = (path: string[]): FileSystemItem[] | null => {
    let items = fileSystem;
    for (const segment of path) {
      const found = items.find(i => i.name === segment);
      if (found?.type === 'folder' && found.children) {
        items = found.children;
      } else {
        return null;
      }
    }
    return items;
  };

  const getPromptPath = () => {
    if (cwd.length === 0) return '~';
    return '~/' + cwd.join('/');
  };

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    const newHistory = [...history, trimmed];
    setHistory(newHistory);
    setHistoryIndex(-1);

    const newLines: TerminalLine[] = [
      ...lines,
      { type: 'input', text: `nawfal@macbook-pro ${getPromptPath()} % ${cmd}` },
    ];

    const args = trimmed.split(/\s+/);
    const command = args[0]?.toLowerCase();
    const param = args.slice(1).join(' ');

    switch (command) {
      case 'ls': {
        const items = getItemsAtPath(cwd);
        if (items) {
          const listing = items.map(i => i.type === 'folder' ? `\x1b[1m${i.name}/\x1b[0m` : i.name);
          newLines.push({ type: 'output', text: listing.join('    ') || '(empty)' });
        } else {
          newLines.push({ type: 'output', text: 'ls: directory not found' });
        }
        break;
      }
      case 'cd': {
        if (!param || param === '~') {
          setCwd([]);
        } else if (param === '..') {
          setCwd(prev => prev.slice(0, -1));
        } else if (param === '/') {
          setCwd([]);
        } else {
          // Check if directory exists
          const items = getItemsAtPath(cwd);
          const target = items?.find(i => i.name === param && i.type === 'folder');
          if (target) {
            setCwd(prev => [...prev, param]);
          } else {
            newLines.push({ type: 'output', text: `cd: no such file or directory: ${param}` });
          }
        }
        break;
      }
      case 'pwd': {
        newLines.push({ type: 'output', text: '/Users/nawfal' + (cwd.length > 0 ? '/' + cwd.join('/') : '') });
        break;
      }
      case 'mkdir': {
        if (!param) {
          newLines.push({ type: 'output', text: 'mkdir: missing operand' });
        } else {
          // Sanitize folder name
          const safeName = param.replace(/[<>:"/\\|?*]/g, '').trim();
          if (!safeName) {
            newLines.push({ type: 'output', text: 'mkdir: invalid folder name' });
          } else {
            setFileSystem((prev: FileSystemItem[]) => {
              const newFs = JSON.parse(JSON.stringify(prev));
              let items = newFs;
              for (const segment of cwd) {
                const found = items.find((i: any) => i.name === segment);
                if (found?.children) items = found.children;
                else return prev;
              }
              if (items.find((i: any) => i.name === safeName)) {
                return prev; // Already exists
              }
              items.push({
                name: safeName,
                type: 'folder',
                modified: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                children: [],
              });
              return newFs;
            });
            newLines.push({ type: 'output', text: '' });
          }
        }
        break;
      }
      case 'touch': {
        if (!param) {
          newLines.push({ type: 'output', text: 'touch: missing operand' });
        } else {
          const safeName = param.replace(/[<>:"/\\|?*]/g, '').trim();
          if (!safeName) {
            newLines.push({ type: 'output', text: 'touch: invalid file name' });
          } else {
            setFileSystem((prev: FileSystemItem[]) => {
              const newFs = JSON.parse(JSON.stringify(prev));
              let items = newFs;
              for (const segment of cwd) {
                const found = items.find((i: any) => i.name === segment);
                if (found?.children) items = found.children;
                else return prev;
              }
              if (!items.find((i: any) => i.name === safeName)) {
                items.push({
                  name: safeName,
                  type: 'file',
                  size: '0 KB',
                  modified: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                });
              }
              return newFs;
            });
            newLines.push({ type: 'output', text: '' });
          }
        }
        break;
      }
      case 'rm': {
        if (!param) {
          newLines.push({ type: 'output', text: 'rm: missing operand' });
        } else {
          const items = getItemsAtPath(cwd);
          const target = items?.find(i => i.name === param);
          if (!target) {
            newLines.push({ type: 'output', text: `rm: ${param}: No such file or directory` });
          } else {
            setFileSystem((prev: FileSystemItem[]) => {
              const newFs = JSON.parse(JSON.stringify(prev));
              let currentItems = newFs;
              for (const segment of cwd) {
                const found = currentItems.find((i: any) => i.name === segment);
                if (found?.children) currentItems = found.children;
                else return prev;
              }
              const idx = currentItems.findIndex((i: any) => i.name === param);
              if (idx >= 0) {
                const removed = currentItems.splice(idx, 1)[0];
                // Move to Trash
                const trash = newFs.find((i: any) => i.name === 'Trash');
                if (trash?.children) trash.children.push(removed);
              }
              return newFs;
            });
            newLines.push({ type: 'output', text: '' });
          }
        }
        break;
      }
      case 'cat': {
        if (!param) {
          newLines.push({ type: 'output', text: 'cat: missing operand' });
        } else {
          const items = getItemsAtPath(cwd);
          const target = items?.find(i => i.name === param && i.type === 'file');
          if (target) {
            newLines.push({ type: 'output', text: `[Contents of ${param}]` });
          } else {
            newLines.push({ type: 'output', text: `cat: ${param}: No such file or directory` });
          }
        }
        break;
      }
      case 'whoami': {
        newLines.push({ type: 'output', text: 'nawfal' });
        break;
      }
      case 'date': {
        newLines.push({ type: 'output', text: new Date().toString() });
        break;
      }
      case 'clear': {
        setLines([]);
        setInput('');
        return;
      }
      case 'echo': {
        newLines.push({ type: 'output', text: param });
        break;
      }
      case 'neofetch': {
        newLines.push({ type: 'output', text: neofetchOutput });
        break;
      }
      case 'uname': {
        newLines.push({ type: 'output', text: 'Darwin macbook-pro.local 23.0.0 Preact RELEASE_WEB x86_64' });
        break;
      }
      case 'help': {
        newLines.push({ type: 'output', text: 'Available commands:\n  ls          List directory contents\n  cd <dir>    Change directory\n  pwd         Print working directory\n  mkdir <n>   Create a new folder\n  touch <n>   Create a new file\n  rm <name>   Move file/folder to Trash\n  cat <file>  Display file contents\n  whoami      Display current user\n  date        Display current date/time\n  clear       Clear terminal\n  echo <msg>  Print message\n  neofetch    Display system info\n  uname       Display OS info\n  help        Show this help' });
        break;
      }
      case '': {
        // empty command, do nothing
        break;
      }
      default: {
        newLines.push({ type: 'output', text: `zsh: command not found: ${command}` });
        break;
      }
    }

    setLines(newLines);
    setInput('');
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIdx = historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIdx);
        setInput(history[newIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIdx = historyIndex + 1;
        if (newIdx >= history.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIdx);
          setInput(history[newIdx]);
        }
      }
    }
  };

  return (
    <section class={css.container} onClick={() => inputRef.current?.focus()}>
      <header class={clsx(css.toolbar, 'app-window-drag-handle')}>
        <span class={css.toolbarTitle}>nawfal — zsh — 80×24</span>
      </header>
      <div class={css.terminal} ref={scrollRef}>
        {lines.map((line, i) => (
          <div key={i} class={clsx(css.line, line.type === 'input' && css.inputLine)}>
            <pre>{line.text}</pre>
          </div>
        ))}
        <div class={css.inputLine}>
          <span class={css.prompt}>nawfal@macbook-pro {getPromptPath()} % </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onInput={(e) => setInput((e.target as HTMLInputElement).value)}
            onKeyDown={handleKeyDown}
            class={css.input}
            autoFocus
          />
        </div>
      </div>
    </section>
  );
};

export default Terminal;
