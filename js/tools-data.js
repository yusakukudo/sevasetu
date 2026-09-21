/**
 * SevaSetu — Tools Database
 * 
 * To add a new tool, simply add a new object to the TOOLS array below.
 * The website will automatically render it with the correct category, 
 * platform buttons, and styling.
 */

const CATEGORIES = {
  productivity: { label: 'Productivity', icon: '📋', color: '#4ecdc4' },
  media:        { label: 'Media',        icon: '🎬', color: '#ff6b6b' },
  utilities:    { label: 'Utilities',    icon: '⚙️', color: '#a78bfa' },
  spiritual:    { label: 'Spiritual',    icon: '🙏', color: '#f59e0b' },
};

const TOOLS = [
  // ──────────────────────────────────────────────
  // YOUR APPS
  // ──────────────────────────────────────────────
  {
    id: 'idt-folder-downloader',
    name: 'IDT Folder Downloader',
    description: 'Batch download audio & content folders from the IDT website. Supports full folder downloads with progress tracking.',
    category: 'productivity',
    type: 'own',
    icon: '📥',
    platforms: {
      windows: 'https://github.com/yusakukudo/idt-folder-downloader/releases/download/v1.2.0/idt-dlp-windows.zip',
      mac:     'https://github.com/yusakukudo/idt-folder-downloader/releases/download/v1.2.0/idt-dlp-macos.zip',
      android: 'https://github.com/yusakukudo/idt-folder-downloader/releases/download/v1.2.0/idt-dlp-android.apk',
    },
    website: 'https://github.com/yusakukudo/idt-folder-downloader',
    tags: ['download', 'audio', 'idt', 'batch', 'folder'],
    featured: true,
  },
  {
    id: 'audio2tube',
    name: 'Audio2Tube',
    description: 'Convert and upload audio files to YouTube with custom thumbnail images. Simple web-based interface.',
    category: 'media',
    type: 'own',
    icon: '🎵',
    platforms: {
      web: 'https://github.com/yusakukudo/audio2tube',
    },
    website: 'https://github.com/yusakukudo/audio2tube',
    tags: ['audio', 'youtube', 'upload', 'converter', 'video'],
    featured: true,
  },
  {
    id: 'sadhana-card-tracker',
    name: 'Sadhana Card Tracker',
    description: 'Devotee spiritual practice tracking with daily card entries, scoring engine, weekly counsellor reporting & temple admin.',
    category: 'spiritual',
    type: 'own',
    icon: '🔥',
    platforms: {
      web: 'https://sadhana-card-tracker-web.vercel.app/',
    },
    website: 'https://sadhana-card-tracker-web.vercel.app/',
    tags: ['sadhana', 'spiritual', 'tracker', 'devotee', 'japa', 'card'],
    featured: true,
  },
  {
    id: 'displaytoggle',
    name: 'DisplayToggle',
    description: 'Win + P style display switching shortcut for macOS. Quickly toggle between display modes with a keyboard shortcut.',
    category: 'utilities',
    type: 'own',
    icon: '🖥️',
    platforms: {
      mac: 'https://displaytoggle.vercel.app/',
    },
    website: 'https://displaytoggle.vercel.app/',
    tags: ['display', 'monitor', 'shortcut', 'mac', 'toggle', 'screen'],
    featured: false,
  },

  // ──────────────────────────────────────────────
  // THIRD-PARTY TOOLS
  // ──────────────────────────────────────────────
  {
    id: 'qrcode-monkey',
    name: 'QR Code Monkey',
    description: 'Free QR code generator with custom colors, logos, and design options. Create beautiful QR codes instantly.',
    category: 'utilities',
    type: 'third-party',
    icon: '📱',
    platforms: {
      web: 'https://www.qrcode-monkey.com/',
    },
    website: 'https://www.qrcode-monkey.com/',
    tags: ['qr', 'code', 'generator', 'barcode', 'scan'],
    featured: false,
  },
];
