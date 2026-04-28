import clsx from 'clsx';
import { useState, useRef, useEffect } from 'preact/hooks';
import css from './Terminal.module.scss';

const neofetchOutput = `                    'c.          nawfal@macbook-pro
                 ,xNMM.          --------------------
               .OMMMMo           OS: macOS Sequoia 15.0
               OMMM0,            Host: MacBook Pro (Web)
     .;loddo:' loolloddol;.      Kernel: Preact 10.x
   cKMMMMMMMMMMNWMMMMMMMMMM0:    Uptime: Since page load
 .KMMMMMMMMMMMMMMMMMMMMMMMWd.    Packages: 37 (npm)
 XMMMMMMMMMMMMMMMMMMMMMMMX.     Shell: Terminal.app
;MMMMMMMMMMMMMMMMMMMMMMMM:      Resolution: ${window.innerWidth}x${window.innerHeight}
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
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', text: 'Last login: ' + new Date().toLocaleString() + ' on ttys000' },
  ]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>();
  const scrollRef = useRef<HTMLDivElement>();

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [lines]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const newLines: TerminalLine[] = [
      ...lines,
      { type: 'input', text: `nawfal@macbook-pro ~ % ${cmd}` },
    ];

    if (trimmed === 'ls') {
      newLines.push({ type: 'output', text: 'Desktop    Documents  Downloads  Applications  Pictures  Music' });
    } else if (trimmed === 'pwd') {
      newLines.push({ type: 'output', text: '/Users/nawfal' });
    } else if (trimmed === 'whoami') {
      newLines.push({ type: 'output', text: 'nawfal' });
    } else if (trimmed === 'date') {
      newLines.push({ type: 'output', text: new Date().toString() });
    } else if (trimmed === 'clear') {
      setLines([]);
      setInput('');
      return;
    } else if (trimmed === 'echo hello') {
      newLines.push({ type: 'output', text: 'hello' });
    } else if (trimmed.startsWith('echo ')) {
      newLines.push({ type: 'output', text: cmd.slice(5) });
    } else if (trimmed === 'neofetch') {
      newLines.push({ type: 'output', text: neofetchOutput });
    } else if (trimmed === 'uname -a') {
      newLines.push({ type: 'output', text: 'Darwin macbook-pro.local 23.0.0 Preact RELEASE_WEB x86_64' });
    } else if (trimmed === 'help') {
      newLines.push({ type: 'output', text: 'Available commands: ls, pwd, whoami, date, clear, echo, neofetch, uname -a, help' });
    } else if (trimmed === '') {
      // Do nothing for empty command
    } else {
      newLines.push({ type: 'output', text: `zsh: command not found: ${cmd.trim()}` });
    }

    setLines(newLines);
    setInput('');
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
          <span class={css.prompt}>nawfal@macbook-pro ~ % </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onInput={(e) => setInput((e.target as HTMLInputElement).value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCommand(input);
            }}
            class={css.input}
            autoFocus
          />
        </div>
      </div>
    </section>
  );
};

export default Terminal;
