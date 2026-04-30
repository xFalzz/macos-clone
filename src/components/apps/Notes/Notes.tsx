import clsx from 'clsx';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useState } from 'preact/hooks';
import css from './Notes.module.scss';

type Note = { id: number; title: string; content: string; date: string };

const defaultNotes: Note[] = [
  { id: 1, title: 'Welcome to Notes', content: 'This is a note-taking app built for macOS Web. You can create, edit, and organize your thoughts here.\n\nTry clicking "New Note" to create a new one!', date: 'Apr 29, 2026' },
  { id: 2, title: 'Todo List', content: '☐ Finish macOS clone project\n☐ Add more wallpapers\n☐ Implement Launchpad\n☑ Create Terminal app\n☑ Create Notes app', date: 'Apr 28, 2026' },
  { id: 3, title: 'Project Ideas', content: '1. Portfolio website redesign\n2. Real-time chat application\n3. AI-powered code assistant\n4. Mobile game prototype', date: 'Apr 25, 2026' },
];

const notesAtom = atomWithStorage<Note[]>('macos:notes', defaultNotes);
let nextId = 4;

const Notes = () => {
  const [notes, setNotes] = useAtom(notesAtom);
  const [selectedId, setSelectedId] = useState(notes.length > 0 ? notes[0].id : 1);

  const selectedNote = notes.find((n) => n.id === selectedId);

  const createNote = () => {
    const newNote: Note = {
      id: nextId++,
      title: 'New Note',
      content: '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setNotes([newNote, ...notes]);
    setSelectedId(newNote.id);
  };

  const updateContent = (content: string) => {
    // Math Notes: detect "expression =" at the end of a line
    let newContent = content;
    const lines = content.split('\n');
    const lastLine = lines[lines.length - 1];
    
    // Pattern: something like "1 + 2 =" or "50 * 2 ="
    const mathMatch = lastLine.match(/^(.+?)\s*=\s*$/);
    if (mathMatch) {
      const expression = mathMatch[1].trim();
      // Only evaluate if it looks like math (numbers and operators)
      if (expression.match(/^[0-9+\-*/().%\s^]+$/)) {
        try {
          // Replace ^ with ** for power
          const sanitized = expression.replace(/\^/g, '**');
          const result = new Function(`"use strict"; return (${sanitized})`)();
          if (typeof result === 'number' && isFinite(result)) {
            newContent = content + ' ' + result;
          }
        } catch (e) {}
      }
    }

    setNotes(notes.map((n) => (n.id === selectedId ? { ...n, content: newContent, title: newContent.split('\n')[0].slice(0, 40) || 'New Note' } : n)));
  };

  const deleteNote = () => {
    const filtered = notes.filter((n) => n.id !== selectedId);
    setNotes(filtered);
    if (filtered.length > 0) setSelectedId(filtered[0].id);
  };

  return (
    <section class={css.container}>
      <header class={clsx(css.toolbar, 'app-window-drag-handle')}>
        <button class={css.toolBtn} onClick={createNote} title="New Note">✏️</button>
        <span class={css.toolbarTitle}>Notes</span>
        <button class={css.toolBtn} onClick={deleteNote} title="Delete Note">🗑️</button>
      </header>
      <div class={css.body}>
        <aside class={css.sidebar}>
          {notes.map((note) => (
            <button
              key={note.id}
              class={clsx(css.noteItem, selectedId === note.id && css.activeNote)}
              onClick={() => setSelectedId(note.id)}
            >
              <span class={css.noteTitle}>{note.title}</span>
              <span class={css.noteDate}>{note.date}</span>
              <span class={css.notePreview}>{note.content.slice(0, 50)}</span>
            </button>
          ))}
        </aside>
        <div class={css.editor}>
          {selectedNote ? (
            <textarea
              class={css.textarea}
              value={selectedNote.content}
              onInput={(e) => updateContent((e.target as HTMLTextAreaElement).value)}
              placeholder="Start typing..."
            />
          ) : (
            <div class={css.noSelection}>No Note Selected</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Notes;
