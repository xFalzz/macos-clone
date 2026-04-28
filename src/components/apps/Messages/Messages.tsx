import clsx from 'clsx';
import { useState } from 'preact/hooks';
import css from './Messages.module.scss';

const conversations = [
  { id: 1, name: 'Tim Cook', avatar: '👨‍💼', lastMessage: 'Welcome to Apple!', time: '10:30 AM', unread: true },
  { id: 2, name: 'Craig Federighi', avatar: '🧑‍💻', lastMessage: 'Did you see the new macOS update?', time: '9:15 AM', unread: false },
  { id: 3, name: 'Jony Ive', avatar: '🎨', lastMessage: 'The design looks beautiful', time: 'Yesterday', unread: false },
  { id: 4, name: 'Developer Team', avatar: '👥', lastMessage: 'PR merged successfully!', time: 'Monday', unread: false },
];

const chatMessages: Record<number, Array<{ text: string; sent: boolean; time: string }>> = {
  1: [
    { text: 'Hi Nawfal! Welcome to the team.', sent: false, time: '10:28 AM' },
    { text: 'Thank you so much, Tim! Really excited to be here.', sent: true, time: '10:29 AM' },
    { text: 'Welcome to Apple!', sent: false, time: '10:30 AM' },
  ],
  2: [
    { text: 'Hey! Have you checked out the latest macOS Sequoia features?', sent: false, time: '9:10 AM' },
    { text: 'Yes! The new window tiling is amazing!', sent: true, time: '9:12 AM' },
    { text: 'Did you see the new macOS update?', sent: false, time: '9:15 AM' },
  ],
  3: [
    { text: 'I love what you did with the macOS clone', sent: false, time: 'Yesterday' },
    { text: 'Thanks Jony! Your design principles inspired everything', sent: true, time: 'Yesterday' },
    { text: 'The design looks beautiful', sent: false, time: 'Yesterday' },
  ],
  4: [
    { text: 'The Finder component has been merged!', sent: false, time: 'Monday' },
    { text: 'Great work everyone! 🎉', sent: true, time: 'Monday' },
    { text: 'PR merged successfully!', sent: false, time: 'Monday' },
  ],
};

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const messages = chatMessages[selectedChat] || [];
  const activeConvo = conversations.find((c) => c.id === selectedChat);

  return (
    <section class={css.container}>
      <header class={clsx(css.toolbar, 'app-window-drag-handle')}>
        <span class={css.toolbarTitle}>Messages</span>
      </header>
      <div class={css.body}>
        {/* Conversations list */}
        <aside class={css.sidebar}>
          {conversations.map((convo) => (
            <button
              key={convo.id}
              class={clsx(css.convoItem, selectedChat === convo.id && css.activeConvo)}
              onClick={() => setSelectedChat(convo.id)}
            >
              <span class={css.avatar}>{convo.avatar}</span>
              <div class={css.convoInfo}>
                <div class={css.convoHeader}>
                  <span class={css.convoName}>{convo.name}</span>
                  <span class={css.convoTime}>{convo.time}</span>
                </div>
                <span class={css.convoPreview}>{convo.lastMessage}</span>
              </div>
            </button>
          ))}
        </aside>

        {/* Chat area */}
        <div class={css.chatArea}>
          <div class={css.chatHeader}>
            <span class={css.chatAvatar}>{activeConvo?.avatar}</span>
            <span class={css.chatName}>{activeConvo?.name}</span>
          </div>
          <div class={css.messagesArea}>
            {messages.map((msg, i) => (
              <div key={i} class={clsx(css.messageBubble, msg.sent ? css.sent : css.received)}>
                <span class={css.messageText}>{msg.text}</span>
                <span class={css.messageTime}>{msg.time}</span>
              </div>
            ))}
          </div>
          <div class={css.inputArea}>
            <input
              type="text"
              class={css.messageInput}
              placeholder="iMessage"
              value={inputValue}
              onInput={(e) => setInputValue((e.target as HTMLInputElement).value)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Messages;
