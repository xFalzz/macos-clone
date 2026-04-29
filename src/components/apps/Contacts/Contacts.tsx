import clsx from 'clsx';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useState } from 'preact/hooks';
import css from './Contacts.module.scss';

type Contact = {
  id: number;
  name: string;
  phone: string;
  email: string;
  company: string;
};

const defaultContacts: Contact[] = [
  { id: 1, name: 'Ahmad Rizki', phone: '+62 812-3456-7890', email: 'ahmad@mail.com', company: 'Tech Corp' },
  { id: 2, name: 'Budi Santoso', phone: '+62 813-9876-5432', email: 'budi@mail.com', company: 'Design Studio' },
  { id: 3, name: 'Clara Dewi', phone: '+62 821-1234-5678', email: 'clara@mail.com', company: 'University' },
  { id: 4, name: 'Diana Putri', phone: '+62 856-7890-1234', email: 'diana@mail.com', company: 'Startup Inc' },
  { id: 5, name: 'Evan Wijaya', phone: '+62 878-2345-6789', email: 'evan@mail.com', company: 'Freelance' },
];

const contactsAtom = atomWithStorage<Contact[]>('macos:contacts', defaultContacts);
let nextContactId = 6;

const Contacts = () => {
  const [contacts, setContacts] = useAtom(contactsAtom);
  const [selectedId, setSelectedId] = useState<number | null>(contacts[0]?.id ?? null);
  const [search, setSearch] = useState('');

  const selected = contacts.find((c) => c.id === selectedId);
  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const addContact = () => {
    const newContact: Contact = {
      id: nextContactId++,
      name: 'New Contact',
      phone: '',
      email: '',
      company: '',
    };
    setContacts([...contacts, newContact]);
    setSelectedId(newContact.id);
  };

  const deleteContact = () => {
    if (!selectedId) return;
    const updated = contacts.filter((c) => c.id !== selectedId);
    setContacts(updated);
    setSelectedId(updated.length > 0 ? updated[0].id : null);
  };

  const updateField = (field: keyof Contact, value: string) => {
    setContacts(contacts.map((c) => (c.id === selectedId ? { ...c, [field]: value } : c)));
  };

  return (
    <section class={css.container}>
      <header class={clsx(css.toolbar, 'app-window-drag-handle')}>
        <button class={css.toolBtn} onClick={addContact} title="Add Contact">＋</button>
        <span class={css.title}>Contacts</span>
        <button class={css.toolBtn} onClick={deleteContact} title="Delete Contact">🗑️</button>
      </header>
      <div class={css.body}>
        <aside class={css.sidebar}>
          <div class={css.searchBox}>
            <input
              type="text"
              placeholder="Search"
              value={search}
              onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
            />
          </div>
          {filtered.map((c) => (
            <button
              key={c.id}
              class={clsx(css.contactItem, selectedId === c.id && css.active)}
              onClick={() => setSelectedId(c.id)}
            >
              <span class={css.avatar}>{c.name.charAt(0).toUpperCase()}</span>
              {c.name}
            </button>
          ))}
        </aside>
        <div class={css.detail}>
          {selected ? (
            <>
              <div class={css.avatarLarge}>{selected.name.charAt(0).toUpperCase()}</div>
              <input
                class={css.nameInput}
                value={selected.name}
                onInput={(e) => updateField('name', (e.target as HTMLInputElement).value)}
                placeholder="Name"
              />
              <div class={css.fieldGroup}>
                <label>Phone</label>
                <input value={selected.phone} onInput={(e) => updateField('phone', (e.target as HTMLInputElement).value)} placeholder="Phone" />
              </div>
              <div class={css.fieldGroup}>
                <label>Email</label>
                <input value={selected.email} onInput={(e) => updateField('email', (e.target as HTMLInputElement).value)} placeholder="Email" />
              </div>
              <div class={css.fieldGroup}>
                <label>Company</label>
                <input value={selected.company} onInput={(e) => updateField('company', (e.target as HTMLInputElement).value)} placeholder="Company" />
              </div>
            </>
          ) : (
            <div class={css.noSelection}>No Contact Selected</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contacts;
