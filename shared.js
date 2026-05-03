(function () {
  const DEFAULT_IMAGE = 'assets/hero-stilllife.svg';
  const IMAGE_ASSET_PATTERN = /^assets\/[a-z0-9-]+\.svg$/i;
  const DATA_IMAGE_PATTERN = /^data:image\/(?:png|jpeg|jpg|webp|gif);base64,[a-z0-9+/=\s]+$/i;
  const VALID_STATUSES = new Set(['available', 'sold_badge', 'archive']);

  function safeString(value, maxLength = 500) {
    return String(value ?? '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, maxLength);
  }

  function safeId(value, fallback) {
    const raw = safeString(value, 80);
    return /^[a-z0-9][a-z0-9-]{2,79}$/i.test(raw) ? raw : fallback;
  }

  function safeImageSource(value) {
    const source = safeString(value, 2_500_000);
    if (IMAGE_ASSET_PATTERN.test(source) || DATA_IMAGE_PATTERN.test(source)) {
      return source;
    }
    return DEFAULT_IMAGE;
  }

  function normalizeTags(tags) {
    const values = Array.isArray(tags) ? tags : String(tags ?? '').split(',');
    return values
      .map(tag => safeString(tag, 36))
      .filter(Boolean)
      .slice(0, 8);
  }

  function normalizeMessengerUrl(value) {
    const raw = safeString(value, 500);
    if (!raw || raw.includes('YOUR_FACEBOOK_PAGE_USERNAME')) return null;

    try {
      const url = new URL(raw);
      const host = url.hostname.toLowerCase();
      const isMessengerShortlink = host === 'm.me' && url.pathname.length > 1;
      const isFacebookMessageUrl =
        (host === 'facebook.com' || host === 'www.facebook.com') &&
        url.pathname.startsWith('/messages/t/');

      if (url.protocol !== 'https:' || (!isMessengerShortlink && !isFacebookMessageUrl)) {
        return null;
      }

      return url;
    } catch {
      return null;
    }
  }

  function cloneDefaultData() {
    return JSON.parse(JSON.stringify(window.COLLECTED_EDIT_DATA || { siteSettings: {}, items: [] }));
  }

  function normalizeSiteSettings(settings = {}) {
    const messengerUrl = normalizeMessengerUrl(settings.facebookMessengerUrl);

    return {
      brandName: safeString(settings.brandName, 80) || 'The Collected Edit',
      brandTagline: safeString(settings.brandTagline, 120) || 'Beautiful things deserve another room.',
      facebookMessengerUrl: messengerUrl ? messengerUrl.toString() : '',
      facebookPageName: safeString(settings.facebookPageName, 120),
      serviceArea: safeString(settings.serviceArea, 140),
      heroText: safeString(settings.heroText, 280),
      brandStory: safeString(settings.brandStory, 520),
      recycleStory: safeString(settings.recycleStory, 520)
    };
  }

  function normalizeItem(item = {}, index = 0) {
    return {
      id: safeId(item.id, `tce-${String(index + 1).padStart(3, '0')}`),
      title: safeString(item.title, 90) || 'Untitled listing',
      category: safeString(item.category, 60) || 'Collection',
      price: safeString(item.price, 40),
      condition: safeString(item.condition, 80),
      tags: normalizeTags(item.tags),
      description: safeString(item.description, 700),
      circularNote: safeString(item.circularNote, 300),
      image: safeImageSource(item.image),
      status: VALID_STATUSES.has(item.status) ? item.status : 'available'
    };
  }

  function normalizeData(rawData) {
    const defaults = cloneDefaultData();
    const source = rawData && typeof rawData === 'object' ? rawData : defaults;
    const items = Array.isArray(source.items)
      ? source.items.map((item, index) => normalizeItem(item, index))
      : [];

    return {
      siteSettings: normalizeSiteSettings({
        ...defaults.siteSettings,
        ...(source.siteSettings || {})
      }),
      items: items.length ? items : (defaults.items || []).map((item, index) => normalizeItem(item, index))
    };
  }

  function loadStoredData(storageKey) {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) return normalizeData(JSON.parse(stored));
    } catch {
      return normalizeData(cloneDefaultData());
    }

    return normalizeData(cloneDefaultData());
  }

  function saveStoredData(storageKey, data) {
    localStorage.setItem(storageKey, JSON.stringify(normalizeData(data)));
  }

  function createElement(tagName, options = {}) {
    const element = document.createElement(tagName);

    if (options.className) element.className = options.className;
    if (options.text !== undefined) element.textContent = options.text;
    if (options.attributes) {
      Object.entries(options.attributes).forEach(([name, value]) => {
        if (value !== undefined && value !== null && value !== false) {
          element.setAttribute(name, String(value));
        }
      });
    }

    return element;
  }

  function createPill(text, className = 'meta-pill') {
    return createElement('span', { className, text: safeString(text, 60) });
  }

  window.CollectedEdit = {
    createElement,
    createPill,
    loadStoredData,
    normalizeData,
    normalizeItem,
    normalizeMessengerUrl,
    safeImageSource,
    saveStoredData,
    safeString
  };
})();
