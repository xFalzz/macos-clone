# macOS Sequoia Web Clone - Preact Edition

A beautiful, interactive macOS Sequoia desktop experience built with modern web technologies. This project recreates the latest macOS interface using Preact, TypeScript, and SCSS, featuring dynamic system behaviors and Apple Intelligence aesthetics.

## ✨ Features

### 🌟 Sequoia Exclusive Features
- **Dynamic Lock Screen**: Authentic Sequoia lock screen with a dynamic Math Password verification system on startup and sleep.
- **Apple Intelligence (Siri Glow)**: Stunning rainbow edge-glow animations when activating Spotlight search.
- **Math Notes**: Integrated auto-calculating math engine inside the Notes app (type `expression =` to calculate).
- **Quick Look**: Native file preview overlay in Finder by pressing the `Spacebar`.

### 🖥️ Desktop Experience
- **Authentic macOS UI**: Faithful recreation of macOS Sequoia's desktop interface
- **Window Snapping & Tiling**: Advanced window management with Sequoia-style edge snapping and tiling menus
- **Interactive Dock**: Animated dock with hover effects and app indicators
- **Menu Bar**: Functional menu bar with Apple menu, sleep controls, and app-specific menus
- **Action Center**: Quick access to system controls (Wi-Fi, Bluetooth, AirDrop, theme switching)

### 📱 Available Apps
- **Calculator**: Fully functional calculator with macOS design
- **Calendar**: Interactive calendar with month/week/day views
- **VSCode**: Code editor interface (placeholder)
- **Finder**: File manager interface
- **Safari**: Web browser interface
- **Messages**: Messaging app interface
- **Mail**: Email client interface
- **Photos**: Photo management interface
- **FaceTime**: Video calling interface
- **System Preferences**: Settings interface
- **Purus Twitter**: Twitter client interface
- **View Source**: Source code viewer

### 🎨 Design Features
- **Light/Dark Theme**: Toggle between light and dark modes
- **Responsive Design**: Works on various screen sizes
- **Glassmorphism**: Beautiful blurred backgrounds and authentic translucent panels
- **Smooth Animations**: Framer Motion powered animations for seamless transitions
- **High-Quality Assets**: Authentic macOS icons and wallpapers
- **Startup Chime**: Classic Mac startup sound

## 🚀 Tech Stack

- **Framework**: [Preact](https://preactjs.com/) - Fast 3kB alternative to React
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Bundler**: [Vite](https://vitejs.dev/) - Lightning fast build tool
- **Styling**: [SCSS](https://sass-lang.com/) + CSS Modules
- **State Management**: [Jotai](https://jotai.org/) - Atomic state management
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Material Design Icons](https://materialdesignicons.com/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **PWA Support**: [Workbox](https://developers.google.com/web/tools/workbox)

## 🛠️ Development

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/xFalzz/macos-clone.git
cd macos-clone

# Install dependencies
npm install

# Start development server
npm start
```

### Available Scripts

```bash
npm start          # Start development server
npm run build      # Build for production
npm run serve      # Preview production build
npm test           # Run tests
npm run type-check # TypeScript type checking
```

## 🎯 Key Features

### Window Management & Tiling
- Advanced Sequoia-style window snapping to screen edges
- Hover over the maximize button for intelligent tiling options
- Drag and drop windows seamlessly
- Traffic light controls (close, minimize, maximize)
- Window focus management & Z-index layering

### Dock Functionality
- Hover animations
- App launch indicators
- Running app indicators
- Smooth transitions

### Menu System
- Context-aware menus
- Keyboard navigation
- Dropdown animations
- App-specific menu items

### Theme System
- Light and dark mode support
- Smooth theme transitions
- Persistent theme preference
- System-like appearance

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── apps/           # App-specific components
│   ├── Desktop/        # Desktop and window components
│   ├── dock/           # Dock components
│   └── topbar/         # Menu bar and action center
├── data/               # App configurations and data
├── stores/             # State management
├── hooks/              # Custom React hooks
├── assets/             # Icons and static assets
└── css/                # Global styles and themes
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use CSS Modules for styling
- Write meaningful commit messages
- Test your changes thoroughly
- Follow the existing code style

## 🐛 Known Issues

- Some apps are currently placeholders
- Some system preferences are view-only

## 📝 Roadmap

- [x] Implement macOS Sequoia Siri Glow effect
- [x] Add Math Notes integration
- [x] Create authentic Lock Screen with verification
- [x] Add Spacebar Quick Look feature
- [x] Fix Window Snapping and Tiling menus
- [ ] Add more functional apps (Terminal, Safari web view)
- [ ] Enhance file system simulation
- [ ] Add push notifications system
- [ ] Mobile responsiveness improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the original [macOS Web](https://github.com/puruvj/macos-preact) project by PuruVJ
- Icons and assets from Apple's design system
- Community contributors and feedback

## 🔗 Links

- **Live Demo**: [macos-cloning.vercel.app](https://macos-cloning.vercel.app)
- **Repository**: [xFalzz/macos-clone](https://github.com/xFalzz/macos-clone)
- **Developer**: [xFalzz (Nawfal)](https://github.com/xFalzz)
- **Issues**: [GitHub Issues](https://github.com/xFalzz/macos-clone/issues)
- **Discussions**: [GitHub Discussions](https://github.com/xFalzz/macos-clone/discussions)

---

⭐ **Star this repository if you find it helpful!**
