import clsx from 'clsx';
import { useState } from 'preact/hooks';
import css from './Mail.module.scss';

const emails = [
  { id: 1, from: 'Apple', subject: 'Your Apple ID was used to sign in to iCloud', preview: 'Your Apple ID (nawfal@icloud.com) was used to sign in to iCloud via a web browser.', time: '10:30 AM', read: false },
  { id: 2, from: 'GitHub', subject: 'You have a new pull request', preview: 'xFalzz opened a pull request in macos-clone: "feat: add Finder app with file system simulation"', time: '9:15 AM', read: false },
  { id: 3, from: 'Vercel', subject: 'Deployment successful', preview: 'Your project macos-cloning has been deployed successfully. Visit https://macos-cloning.vercel.app', time: 'Yesterday', read: true },
  { id: 4, from: 'App Store Connect', subject: 'Your app has been approved', preview: 'Your latest build has passed review and is now available on the App Store.', time: 'Yesterday', read: true },
  { id: 5, from: 'npm', subject: 'New security advisory for your project', preview: '50 vulnerabilities found in macos-clone-master. Run npm audit fix to resolve.', time: 'Mon', read: true },
  { id: 6, from: 'Stack Overflow', subject: 'Your answer was accepted', preview: 'Your answer to "How to fix framer-motion animations in Preact?" has been accepted.', time: 'Mon', read: true },
];

const Mail = () => {
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const selectedEmail = emails.find((e) => e.id === selectedId);

  return (
    <section class={css.container}>
      <header class={clsx(css.toolbar, 'app-window-drag-handle')}>
        <span class={css.toolbarTitle}>Mail</span>
      </header>
      <div class={css.body}>
        {/* Sidebar */}
        <aside class={css.sidebar}>
          <div class={css.mailboxes}>
            <span class={css.sidebarLabel}>Mailboxes</span>
            {['Inbox', 'Drafts', 'Sent', 'Junk', 'Trash', 'All Mail'].map((box) => (
              <button key={box} class={clsx(css.mailboxItem, box === 'Inbox' && css.activeMailbox)}>
                <span class={css.mailboxIcon}>{box === 'Inbox' ? '📥' : box === 'Sent' ? '📤' : box === 'Drafts' ? '📝' : box === 'Junk' ? '⚠️' : box === 'Trash' ? '🗑️' : '📬'}</span>
                {box}
                {box === 'Inbox' && <span class={css.badge}>2</span>}
              </button>
            ))}
          </div>
        </aside>

        {/* Email list */}
        <div class={css.emailList}>
          {emails.map((email) => (
            <button
              key={email.id}
              class={clsx(css.emailItem, selectedId === email.id && css.selectedEmail, !email.read && css.unread)}
              onClick={() => setSelectedId(email.id)}
            >
              <div class={css.emailHeader}>
                <span class={css.emailFrom}>{email.from}</span>
                <span class={css.emailTime}>{email.time}</span>
              </div>
              <div class={css.emailSubject}>{email.subject}</div>
              <div class={css.emailPreview}>{email.preview}</div>
            </button>
          ))}
        </div>

        {/* Email detail */}
        <div class={css.emailDetail}>
          {selectedEmail ? (
            <>
              <div class={css.detailHeader}>
                <h2 class={css.detailSubject}>{selectedEmail.subject}</h2>
                <div class={css.detailMeta}>
                  <span class={css.detailFrom}>{selectedEmail.from}</span>
                  <span class={css.detailTime}>{selectedEmail.time}</span>
                </div>
              </div>
              <div class={css.detailBody}>{selectedEmail.preview}</div>
            </>
          ) : (
            <div class={css.noSelection}>No Message Selected</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Mail;
