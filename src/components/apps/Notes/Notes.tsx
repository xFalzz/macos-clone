import clsx from 'clsx';
import { useState } from 'preact/hooks';
import css from './Notes.module.scss';

type Note = { id: number; title: string; content: string; date: string };

const defaultNotes: Note[] = [
  { id: 1, title: 'Welcome to Notes', content: 'This is a note-taking app built for macOS Web. You can create, edit, and organize your thoughts here.\n\nTry clicking "New Note" to create a new one!', date: 'Apr 29, 2026' },
  { id: 2, title: 'Todo List', content: '☐ Finish macOS clone project\n☐ Add more wallpapers\n☐ Implement Launchpad\n☑ Create Terminal app\n☑ Create Notes app', date: 'Apr 28, 2026' },
  { id: 3, title: 'Project Ideas', content: '1. Portfolio website redesign\n2. Real-time chat application\n3. AI-powered code assistant\n4. Mobile game prototype', date: 'Apr 25, 2026' },
];

let nextId = 4;

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>(defaultNotes);
  const [selectedId, setSelectedId] = useState(1);

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
    setNotes(notes.map((n) => (n.id === selectedId ? { ...n, content, title: content.split('\n')[0].slice(0, 40) || 'New Note' } : n)));
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
