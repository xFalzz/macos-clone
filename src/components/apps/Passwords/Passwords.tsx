import clsx from 'clsx';
import { useState } from 'preact/hooks';
import css from './Passwords.module.scss';

const mockPasswords = [
  { id: 1, site: 'apple.com', username: 'steve@apple.com', type: 'password' },
  { id: 2, site: 'github.com', username: 'dev123', type: 'passkey' },
  { id: 3, site: 'twitter.com', username: '@user', type: 'password' },
  { id: 4, site: 'Home Network', username: 'Home_5G', type: 'wifi' },
  { id: 5, site: 'netflix.com', username: 'movie_fan', type: 'password' },
  { id: 6, site: 'google.com', username: 'test@gmail.com', type: 'passkey' },
  { id: 7, site: 'amazon.com', username: 'shopper', type: 'password' },
  { id: 8, site: 'Cafe Wi-Fi', username: 'Guest_Network', type: 'wifi' },
];

export const Passwords = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filtered = mockPasswords.filter(p => {
    if (activeTab === 'all') return true;
    if (activeTab === 'passkeys') return p.type === 'passkey';
    if (activeTab === 'wifi') return p.type === 'wifi';
    return true;
  });

  return (
    <div class={css.container}>
      <div class={css.sidebar}>
        <div class={css.searchBar}>
          <span class={css.searchIcon}>🔍</span>
          <input type="text" placeholder="Search" />
        </div>
        <div class={css.navGroup}>
          <div 
            class={clsx(css.navItem, activeTab === 'all' && css.active)}
            onClick={() => setActiveTab('all')}
          >
            <span class={css.icon}>🔑</span> All
          </div>
          <div 
            class={clsx(css.navItem, activeTab === 'passkeys' && css.active)}
            onClick={() => setActiveTab('passkeys')}
          >
            <span class={css.icon}>🛡️</span> Passkeys
          </div>
          <div 
            class={clsx(css.navItem, activeTab === 'wifi' && css.active)}
            onClick={() => setActiveTab('wifi')}
          >
            <span class={css.icon}>📶</span> Wi-Fi
          </div>
        </div>
      </div>
      
      <div class={css.content}>
        <div class={css.listHeader}>
          <span>Title</span>
          <span>User Name</span>
        </div>
        <div class={css.list}>
          {filtered.map(p => (
            <div 
              key={p.id} 
              class={clsx(css.listItem, selectedId === p.id && css.selected)}
              onClick={() => setSelectedId(p.id)}
            >
              <div class={css.siteName}>
                <div class={css.favicon}>{p.site.charAt(0).toUpperCase()}</div>
                {p.site}
              </div>
              <div class={css.username}>{p.username}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
