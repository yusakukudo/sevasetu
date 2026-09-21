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

    // Website link
    const websiteLink = tool.website
      ? `<a href="${tool.website}" target="_blank" rel="noopener noreferrer"
            class="website-link" id="link-${tool.id}" title="Visit website">
           ↗ Website
         </a>`
      : '';

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
          ${websiteLink}
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
  }

  // ── Boot ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
