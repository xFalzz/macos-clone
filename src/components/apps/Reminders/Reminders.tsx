import clsx from 'clsx';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useState } from 'preact/hooks';
import css from './Reminders.module.scss';

type Reminder = {
  id: number;
  text: string;
  done: boolean;
  date: string;
};

type ReminderList = {
  name: string;
  color: string;
  items: Reminder[];
};

const defaultLists: ReminderList[] = [
  {
    name: 'Today',
    color: '#007aff',
    items: [
      { id: 1, text: 'Review macOS clone project', done: false, date: 'Today' },
      { id: 2, text: 'Push latest changes to GitHub', done: true, date: 'Today' },
      { id: 3, text: 'Test all Launchpad apps', done: false, date: 'Today' },
    ],
  },
  {
    name: 'Personal',
    color: '#ff9500',
    items: [
      { id: 4, text: 'Buy groceries', done: false, date: 'Tomorrow' },
      { id: 5, text: 'Call dentist', done: false, date: 'Next week' },
    ],
  },
  {
    name: 'Work',
    color: '#34c759',
    items: [
      { id: 6, text: 'Prepare presentation slides', done: false, date: 'Friday' },
      { id: 7, text: 'Submit weekly report', done: true, date: 'Yesterday' },
    ],
  },
];

const remindersAtom = atomWithStorage<ReminderList[]>('macos:reminders', defaultLists);
let nextRemId = 10;

const Reminders = () => {
  const [lists, setLists] = useAtom(remindersAtom);
  const [activeList, setActiveList] = useState(0);
  const [newText, setNewText] = useState('');

  const currentList = lists[activeList];

  const toggleItem = (id: number) => {
    setLists(lists.map((list, idx) =>
      idx === activeList
        ? { ...list, items: list.items.map((item) => (item.id === id ? { ...item, done: !item.done } : item)) }
        : list
    ));
  };

  const addItem = () => {
    if (!newText.trim()) return;
    const item: Reminder = {
      id: nextRemId++,
      text: newText.trim(),
      done: false,
      date: 'Today',
    };
    setLists(lists.map((list, idx) =>
      idx === activeList ? { ...list, items: [...list.items, item] } : list
    ));
    setNewText('');
  };

  const deleteItem = (id: number) => {
    setLists(lists.map((list, idx) =>
      idx === activeList ? { ...list, items: list.items.filter((item) => item.id !== id) } : list
    ));
  };

  return (
    <section class={css.container}>
      <header class={clsx(css.toolbar, 'app-window-drag-handle')}>
        <span class={css.title}>Reminders</span>
      </header>
      <div class={css.body}>
        <aside class={css.sidebar}>
          {lists.map((list, idx) => (
            <button
              key={list.name}
              class={clsx(css.listItem, activeList === idx && css.active)}
              onClick={() => setActiveList(idx)}
            >
              <span class={css.listDot} style={{ background: list.color }} />
              <span>{list.name}</span>
              <span class={css.listCount}>{list.items.filter((i) => !i.done).length}</span>
            </button>
          ))}
        </aside>
        <div class={css.main}>
          <h2 class={css.listTitle} style={{ color: currentList.color }}>
            {currentList.name}
          </h2>
          <div class={css.items}>
            {currentList.items.map((item) => (
              <div key={item.id} class={clsx(css.reminderItem, item.done && css.done)}>
                <button
                  class={css.checkbox}
                  style={{ borderColor: currentList.color }}
                  onClick={() => toggleItem(item.id)}
                >
                  {item.done && <span style={{ color: currentList.color }}>✓</span>}
                </button>
                <div class={css.itemContent}>
                  <span class={css.itemText}>{item.text}</span>
                  <span class={css.itemDate}>{item.date}</span>
                </div>
                <button class={css.deleteBtn} onClick={() => deleteItem(item.id)}>×</button>
              </div>
            ))}
          </div>
          <div class={css.addArea}>
            <input
              type="text"
              placeholder="Add a reminder..."
              value={newText}
              onInput={(e) => setNewText((e.target as HTMLInputElement).value)}
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
            />
            <button class={css.addBtn} onClick={addItem}>＋</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reminders;
