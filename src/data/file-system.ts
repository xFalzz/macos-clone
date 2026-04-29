import { atomWithStorage } from 'jotai/utils';

export type FileSystemItem = {
  name: string;
  type: 'folder' | 'file';
  icon?: string;
  size?: string;
  modified?: string;
  children?: FileSystemItem[];
};

export const initialFileSystem: FileSystemItem[] = [
  {
    name: 'Desktop',
    type: 'folder',
    modified: 'Apr 29, 2026',
    children: [
      { name: 'Screenshot 2026-04-15.png', type: 'file', size: '2.4 MB', modified: 'Apr 15, 2026' },
      { name: 'Notes.txt', type: 'file', size: '1 KB', modified: 'Apr 20, 2026' },
      { name: 'Project Files', type: 'folder', modified: 'Apr 28, 2026', children: [
        { name: 'index.html', type: 'file', size: '4 KB', modified: 'Apr 28, 2026' },
        { name: 'styles.css', type: 'file', size: '8 KB', modified: 'Apr 28, 2026' },
        { name: 'app.js', type: 'file', size: '12 KB', modified: 'Apr 28, 2026' },
      ]},
    ],
  },
  {
    name: 'Documents',
    type: 'folder',
    modified: 'Apr 28, 2026',
    children: [
      { name: 'Resume.pdf', type: 'file', size: '245 KB', modified: 'Mar 15, 2026' },
      { name: 'Cover Letter.docx', type: 'file', size: '32 KB', modified: 'Mar 20, 2026' },
      { name: 'Budget 2026.xlsx', type: 'file', size: '56 KB', modified: 'Jan 10, 2026' },
      { name: 'University', type: 'folder', modified: 'Apr 10, 2026', children: [
        { name: 'Thesis Draft.pdf', type: 'file', size: '3.2 MB', modified: 'Apr 10, 2026' },
        { name: 'References.bib', type: 'file', size: '18 KB', modified: 'Apr 5, 2026' },
        { name: 'Presentations', type: 'folder', modified: 'Mar 28, 2026', children: [
          { name: 'Final Presentation.pptx', type: 'file', size: '8.5 MB', modified: 'Mar 28, 2026' },
        ]},
      ]},
    ],
  },
  {
    name: 'Downloads',
    type: 'folder',
    modified: 'Apr 29, 2026',
    children: [
      { name: 'node-v20.11.0.pkg', type: 'file', size: '45 MB', modified: 'Apr 29, 2026' },
      { name: 'VS Code.dmg', type: 'file', size: '125 MB', modified: 'Apr 25, 2026' },
      { name: 'wallpaper-collection.zip', type: 'file', size: '89 MB', modified: 'Apr 20, 2026' },
      { name: 'meeting-recording.mp4', type: 'file', size: '256 MB', modified: 'Apr 18, 2026' },
    ],
  },
  {
    name: 'Applications',
    type: 'folder',
    modified: 'Apr 15, 2026',
    children: [
      { name: 'Calculator.app', type: 'file', size: '4.2 MB', modified: 'Jan 1, 2026' },
      { name: 'Calendar.app', type: 'file', size: '12 MB', modified: 'Jan 1, 2026' },
      { name: 'Safari.app', type: 'file', size: '45 MB', modified: 'Jan 1, 2026' },
      { name: 'Messages.app', type: 'file', size: '28 MB', modified: 'Jan 1, 2026' },
      { name: 'Mail.app', type: 'file', size: '38 MB', modified: 'Jan 1, 2026' },
      { name: 'Photos.app', type: 'file', size: '52 MB', modified: 'Jan 1, 2026' },
      { name: 'FaceTime.app', type: 'file', size: '18 MB', modified: 'Jan 1, 2026' },
      { name: 'Visual Studio Code.app', type: 'file', size: '380 MB', modified: 'Apr 15, 2026' },
    ],
  },
  {
    name: 'Pictures',
    type: 'folder',
    modified: 'Apr 22, 2026',
    children: [
      { name: 'Vacation 2025', type: 'folder', modified: 'Dec 25, 2025', children: [
        { name: 'IMG_0001.jpg', type: 'file', size: '4.5 MB', modified: 'Dec 20, 2025' },
        { name: 'IMG_0002.jpg', type: 'file', size: '3.8 MB', modified: 'Dec 21, 2025' },
        { name: 'IMG_0003.jpg', type: 'file', size: '5.1 MB', modified: 'Dec 22, 2025' },
      ]},
      { name: 'Screenshots', type: 'folder', modified: 'Apr 22, 2026', children: [
        { name: 'Screen Shot 2026-04-22.png', type: 'file', size: '1.2 MB', modified: 'Apr 22, 2026' },
      ]},
    ],
  },
  {
    name: 'Music',
    type: 'folder',
    modified: 'Feb 10, 2026',
    children: [
      { name: 'Favorites', type: 'folder', modified: 'Feb 10, 2026', children: [
        { name: 'song1.mp3', type: 'file', size: '8 MB', modified: 'Feb 10, 2026' },
        { name: 'song2.mp3', type: 'file', size: '7.5 MB', modified: 'Feb 10, 2026' },
      ]},
    ],
  },
  {
    name: 'Trash',
    type: 'folder',
    modified: 'Apr 29, 2026',
    children: [],
  },
];

export const fileSystemStore = atomWithStorage<FileSystemItem[]>('macos:file-system', initialFileSystem);

/** Get file extension icon mapping */
export function getFileIcon(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  const iconMap: Record<string, string> = {
    pdf: '📄',
    docx: '📝',
    doc: '📝',
    xlsx: '📊',
    xls: '📊',
    pptx: '📑',
    ppt: '📑',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    webp: '🖼️',
    svg: '🖼️',
    mp4: '🎬',
    mov: '🎬',
    avi: '🎬',
    mp3: '🎵',
    wav: '🎵',
    flac: '🎵',
    zip: '🗜️',
    rar: '🗜️',
    '7z': '🗜️',
    dmg: '💿',
    pkg: '📦',
    app: '⚙️',
    html: '🌐',
    css: '🎨',
    js: '📜',
    ts: '📜',
    tsx: '📜',
    jsx: '📜',
    json: '📋',
    txt: '📝',
    md: '📝',
    bib: '📚',
  };
  return iconMap[ext] || '📄';
}
