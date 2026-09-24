/**
 * SevaSetu — Application Logic
 * Handles rendering, filtering, search, and interactions
 */

(function () {
  'use strict';

  // ── Platform icon map ──
  const PLATFORM_ICONS = {
    windows: { icon: '🪟', label: 'Windows' },
    mac:     { icon: '🍎', label: 'Mac' },
    android: { icon: '🤖', label: 'Android' },
    web:     { icon: '🌐', label: 'Web' },
  };

  // ── State ──
  let activeCategory = 'all';
  let searchQuery = '';

  // ── DOM refs ──
  const filtersEl = document.getElementById('category-filters');
  const gridEl    = document.getElementById('tools-grid');
  const searchEl  = document.getElementById('search-input');
  const statTotal      = document.getElementById('stat-total');
  const statOwn        = document.getElementById('stat-own');
  const statCategories = document.getElementById('stat-categories');

  // ── Initialize ──
  function init() {
    renderStats();
    renderFilters();
    renderTools();
    bindEvents();
  }

  // ── Render stats ──
  function renderStats() {
    const total = TOOLS.length;
    const own = TOOLS.filter(t => t.type === 'own').length;
    const cats = new Set(TOOLS.map(t => t.category)).size;

    animateNumber(statTotal, total);
    animateNumber(statOwn, own);
    animateNumber(statCategories, cats);
  }

  function animateNumber(el, target) {
    let current = 0;
    const step = Math.ceil(target / 20);
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      el.textContent = current;
    }, 40);
  }

  // ── Render category filter pills ──
  function renderFilters() {
    // Count tools per category
    const counts = {};
    TOOLS.forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });

    let html = '';

    // "All" pill
    html += `
      <button class="filter-pill active" data-category="all" id="filter-all">
        <span class="pill-icon">✨</span>
        All
        <span class="pill-count">${TOOLS.length}</span>
      </button>
    `;

    // Category pills
    for (const [key, cat] of Object.entries(CATEGORIES)) {
      if (!counts[key]) continue;
      html += `
        <button class="filter-pill" data-category="${key}" id="filter-${key}">
          <span class="pill-icon">${cat.icon}</span>
          ${cat.label}
          <span class="pill-count">${counts[key]}</span>
        </button>
      `;
    }

    filtersEl.innerHTML = html;
  }

  // ── Render tool cards ──
  function renderTools() {
    const filtered = getFilteredTools();

    if (filtered.length === 0) {
      gridEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <div class="empty-title">No tools found</div>
          <div class="empty-text">Try adjusting your search or category filter.</div>
        </div>
      `;
      return;
    }

    gridEl.innerHTML = filtered.map((tool, i) => createToolCard(tool, i)).join('');
  }

  function createToolCard(tool, index) {
    const cat = CATEGORIES[tool.category] || {};
    const isOwn = tool.type === 'own';

    // Platform buttons
    const platformBtns = Object.entries(tool.platforms || {})
      .map(([platform, url]) => {
        const p = PLATFORM_ICONS[platform] || { icon: '🔗', label: platform };
        return `
          <a href="${url}" target="_blank" rel="noopener noreferrer"
             class="platform-btn" id="btn-${tool.id}-${platform}"
             title="Download for ${p.label}">
            <span class="platform-icon">${p.icon}</span>
            ${p.label}
          </a>
        `;
      })
      .join('');

    // External link (GitHub or Website)
    let externalLink = '';
    if (tool.website) {
      const isGitHub = /github\.com/i.test(tool.website);
      const linkLabel = isGitHub ? 'GitHub' : 'Website';
      const linkTitle = isGitHub ? 'View on GitHub' : 'Visit website';
      const linkIcon = isGitHub ? '🐙' : '↗';
      externalLink = `
        <a href="${tool.website}" target="_blank" rel="noopener noreferrer"
           class="website-link ${isGitHub ? 'github-link' : ''}" id="link-${tool.id}" title="${linkTitle}">
          ${linkIcon} ${linkLabel}
        </a>`;
    }

    return `
      <article class="tool-card ${isOwn ? 'own-app' : ''}"
               id="card-${tool.id}"
               style="animation-delay: ${index * 0.07}s; --card-accent: ${cat.color || 'var(--gold)'}">
        <div class="card-header">
          <div class="card-icon">${tool.icon}</div>
          <div class="card-meta">
            <h3 class="card-name">${tool.name}</h3>
            <div class="card-badges">
              <span class="badge badge-category" style="color: ${cat.color}">${cat.label || tool.category}</span>
              ${isOwn ? '<span class="badge badge-own">Our App</span>' : ''}
            </div>
          </div>
        </div>
        <p class="card-description">${tool.description}</p>
        <div class="card-footer">
          <div class="platform-buttons">${platformBtns}</div>
          ${externalLink}
        </div>
      </article>
    `;
  }

  // ── Filter logic ──
  function getFilteredTools() {
    return TOOLS.filter(tool => {
      // Category filter
      if (activeCategory !== 'all' && tool.category !== activeCategory) {
        return false;
      }
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const haystack = [
          tool.name,
          tool.description,
          ...(tool.tags || []),
          tool.category,
        ].join(' ').toLowerCase();
        return haystack.includes(q);
      }
      return true;
    });
  }

  // ── Event handlers ──
  function bindEvents() {
    // Category filter clicks
    filtersEl.addEventListener('click', (e) => {
      const pill = e.target.closest('.filter-pill');
      if (!pill) return;

      activeCategory = pill.dataset.category;

      // Update active state
      filtersEl.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      renderTools();
    });

    // Search input
    let debounceTimer;
    searchEl.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        searchQuery = e.target.value.trim();
        renderTools();
      }, 150);
    });

    // Clear search on Escape
    searchEl.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchEl.value = '';
        searchQuery = '';
        renderTools();
        searchEl.blur();
      }
    });

    // Keyboard shortcut: '/' to focus search
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchEl) {
        e.preventDefault();
        searchEl.focus();
      }
    });

    // Theme Switcher Bindings
    bindThemeSwitcher();
  }

  // ── Theme Manager ──
  const THEME_CONFIG = {
    'twilight':         { label: 'Twilight', icon: '🌙' },
    'alabaster':        { label: 'Alabaster', icon: '☀️' },
    'catppuccin-mocha': { label: 'Catppuccin Mocha', icon: '☕' },
    'catppuccin-latte': { label: 'Catppuccin Latte', icon: '🥛' },
    'tokyo-night':      { label: 'Tokyo Night', icon: '🌃' },
  };

  function applyTheme(themeId, save = true) {
    if (!THEME_CONFIG[themeId]) themeId = 'twilight';
    document.documentElement.setAttribute('data-theme', themeId);

    const btnIcon = document.getElementById('theme-icon');
    const btnLabel = document.getElementById('theme-label');
    if (btnIcon && btnLabel) {
      btnIcon.textContent = THEME_CONFIG[themeId].icon;
      btnLabel.textContent = THEME_CONFIG[themeId].label;
    }

    // Update active highlight in dropdown
    const opts = document.querySelectorAll('.theme-opt');
    opts.forEach(opt => {
      if (opt.dataset.themeId === themeId) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });

    if (save) {
      try {
        localStorage.setItem('sevasetu-theme', themeId);
      } catch (err) {
        /* ignore storage access restrictions */
      }
    }
  }

  function bindThemeSwitcher() {
    const menuContainer = document.querySelector('.theme-menu-container');
    const toggleBtn = document.getElementById('theme-toggle-btn');
    const dropdown = document.getElementById('theme-dropdown');

    if (!toggleBtn || !menuContainer) return;

    // Load saved or system preferred theme
    let initialTheme = 'twilight';
    try {
      const saved = localStorage.getItem('sevasetu-theme');
      if (saved && THEME_CONFIG[saved]) {
        initialTheme = saved;
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        initialTheme = 'alabaster';
      }
    } catch (e) {}

    applyTheme(initialTheme, false);

    // Toggle menu
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      menuContainer.classList.toggle('open');
    });

    // Option clicks
    if (dropdown) {
      dropdown.addEventListener('click', (e) => {
        const opt = e.target.closest('.theme-opt');
        if (!opt) return;
        const selectedTheme = opt.dataset.themeId;
        applyTheme(selectedTheme, true);
        menuContainer.classList.remove('open');
      });
    }

    // Close on outside click or escape
    document.addEventListener('click', (e) => {
      if (!menuContainer.contains(e.target)) {
        menuContainer.classList.remove('open');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuContainer.classList.contains('open')) {
        menuContainer.classList.remove('open');
      }
    });
  }

  // ── Boot ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
