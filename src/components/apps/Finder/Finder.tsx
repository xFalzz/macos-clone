import clsx from 'clsx';
import { useAtom } from 'jotai';
import { useState } from 'preact/hooks';
import { fileSystemStore, FileSystemItem, getFileIcon } from '__/data/file-system';
import { selectedFileAtom } from '__/stores/selection.store';
import css from './Finder.module.scss';

const sidebarItems = [
  { label: 'AirDrop', icon: '📡', path: null },
  { label: 'Recents', icon: '🕐', path: null },
  { label: 'Applications', icon: '⚙️', path: 'Applications' },
  { label: 'Desktop', icon: '🖥️', path: 'Desktop' },
  { label: 'Documents', icon: '📁', path: 'Documents' },
  { label: 'Downloads', icon: '⬇️', path: 'Downloads' },
  { label: 'Pictures', icon: '🖼️', path: 'Pictures' },
  { label: 'Music', icon: '🎵', path: 'Music' },
  { label: 'Trash', icon: '🗑️', path: 'Trash' },
];

const Finder = () => {
  const [fileSystem, setFileSystem] = useAtom(fileSystemStore);
  const [, setSelectedFile] = useAtom(selectedFileAtom);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Navigate to a root folder from sidebar
  const navigateToRoot = (folderName: string | null) => {
    if (!folderName) return;
    setCurrentPath([folderName]);
    setSelectedItem(null);
  };

  // Get current directory items based on path
  const getCurrentItems = (): FileSystemItem[] => {
    if (currentPath.length === 0) return fileSystem;

    let items = fileSystem;
    for (const segment of currentPath) {
      const found = items.find((i) => i.name === segment);
      if (found?.type === 'folder' && found.children) {
        items = found.children;
      } else {
        return [];
      }
    }
    return items;
  };

  const handleItemDoubleClick = (item: FileSystemItem) => {
    if (item.type === 'folder') {
      setCurrentPath([...currentPath, item.name]);
      setSelectedItem(null);
    }
  };

  const goBack = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
      setSelectedItem(null);
    }
  };

  const goForward = () => {
    // No forward history in this simple implementation
  };

  const items = getCurrentItems();
  const currentFolder = currentPath[currentPath.length - 1] || 'Finder';
  const lastClickRef = { time: 0, name: '' };

  const handleClick = (item: FileSystemItem) => {
    const now = Date.now();
    if (lastClickRef.name === item.name && now - lastClickRef.time < 400) {
      handleItemDoubleClick(item);
      lastClickRef.time = 0;
      lastClickRef.name = '';
    } else {
      setSelectedItem(item.name);
      setSelectedFile(item);
      lastClickRef.time = now;
      lastClickRef.name = item.name;
    }
  };

  const handleKeyDown = (e: any) => {
    if ((e.key === 'Backspace' || e.key === 'Delete') && selectedItem) {
      setFileSystem((prev: FileSystemItem[]) => {
        const newFs = JSON.parse(JSON.stringify(prev)); // Deep clone
        let sourceFolder: FileSystemItem | null = null;
        
        // Find current folder
        if (currentPath.length === 0) {
          // Can't delete root items easily in this simple model without breaking structure
          if (['Desktop', 'Documents', 'Downloads', 'Applications', 'Pictures', 'Music', 'Trash'].includes(selectedItem)) {
            return prev; // Protect root folders
          }
        } else {
          let current = newFs;
          for (let i = 0; i < currentPath.length; i++) {
            const found = current.find((item: any) => item.name === currentPath[i]);
            if (found && found.children) {
              if (i === currentPath.length - 1) {
                sourceFolder = found;
              }
              current = found.children;
            }
          }
        }
        
        if (sourceFolder && sourceFolder.children) {
          const itemIndex = sourceFolder.children.findIndex((i: any) => i.name === selectedItem);
          if (itemIndex >= 0) {
            const itemToMove = sourceFolder.children[itemIndex];
            sourceFolder.children.splice(itemIndex, 1);
            
            // Add to Trash
            const trashFolder = newFs.find((i: any) => i.name === 'Trash');
            if (trashFolder && trashFolder.children) {
              trashFolder.children.push(itemToMove);
            }
          }
        }
        
        return newFs;
      });
      setSelectedItem(null);
    }
  };

  return (
    <section class={css.container}>
      {/* Toolbar */}
      <header class={clsx(css.toolbar, 'app-window-drag-handle')}>
        <div class={css.navButtons}>
          <button
            class={css.navBtn}
            onClick={goBack}
            disabled={currentPath.length === 0}
            title="Back"
          >
            ‹
          </button>
          <button class={css.navBtn} onClick={goForward} disabled title="Forward">
            ›
          </button>
        </div>
        <span class={css.folderTitle}>{currentFolder}</span>
        <div class={css.viewButtons}>
          {currentFolder === 'Trash' && (
            <button
              class={css.emptyTrashBtn}
              onClick={() => {
                setFileSystem((prev: FileSystemItem[]) => {
                  const newFs = JSON.parse(JSON.stringify(prev));
                  const trashFolder = newFs.find((i: any) => i.name === 'Trash');
                  if (trashFolder) {
                    trashFolder.children = [];
                  }
                  return newFs;
                });
                setSelectedItem(null);
              }}
              title="Empty Trash"
            >
              Empty
            </button>
          )}
          <button
            class={clsx(css.viewBtn, viewMode === 'grid' && css.active)}
            onClick={() => setViewMode('grid')}
            title="Grid view"
          >
            ⊞
          </button>
          <button
            class={clsx(css.viewBtn, viewMode === 'list' && css.active)}
            onClick={() => setViewMode('list')}
            title="List view"
          >
            ☰
          </button>
        </div>
      </header>

      <div class={css.body}>
        {/* Sidebar */}
        <aside class={css.sidebar}>
          <div class={css.sidebarSection}>
            <span class={css.sidebarLabel}>Favorites</span>
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                class={clsx(
                  css.sidebarItem,
                  currentPath.length === 1 && currentPath[0] === item.path && css.activeSidebar,
                )}
                onClick={() => navigateToRoot(item.path)}
              >
                <span class={css.sidebarIcon}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main class={css.main} tabIndex={0} onKeyDown={handleKeyDown}>
          {items.length === 0 ? (
            <div class={css.emptyState}>
              <span class={css.emptyIcon}>📂</span>
              <p>This folder is empty</p>
            </div>
          ) : viewMode === 'list' ? (
            <table class={css.listView}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date Modified</th>
                  <th>Size</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.name}
                    class={clsx(css.listRow, selectedItem === item.name && css.selected)}
                    onClick={() => handleClick(item)}
                  >
                    <td class={css.nameCell}>
                      <span class={css.fileIcon}>
                        {item.type === 'folder' ? '📁' : getFileIcon(item.name)}
                      </span>
                      {item.name}
                    </td>
                    <td class={css.metaCell}>{item.modified || '—'}</td>
                    <td class={css.metaCell}>{item.size || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div class={css.gridView}>
              {items.map((item) => (
                <button
                  key={item.name}
                  class={clsx(css.gridItem, selectedItem === item.name && css.selected)}
                  onClick={() => handleClick(item)}
                >
                  <span class={css.gridIcon}>
                    {item.type === 'folder' ? '📁' : getFileIcon(item.name)}
                  </span>
                  <span class={css.gridName}>{item.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Status bar */}
          <footer class={css.statusBar}>
            {items.length} item{items.length !== 1 ? 's' : ''}
          </footer>
        </main>
      </div>
    </section>
  );
};

export default Finder;
