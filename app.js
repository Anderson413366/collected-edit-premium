(function () {
  const STORAGE_KEY = 'collected-edit-data-v1';
  const {
    createElement,
    createPill,
    loadStoredData,
    normalizeMessengerUrl,
    safeImageSource,
    safeString
  } = window.CollectedEdit;

  const data = loadStoredData(STORAGE_KEY);
  const settings = data.siteSettings;
  let activeFilter = 'All';
  let searchTerm = '';
  let archiveVisible = false;
  let currentItem = null;

  const searchInput = document.getElementById('searchInput');
  const filterBar = document.getElementById('filterBar');
  const productGrid = document.getElementById('productGrid');
  const archiveGrid = document.getElementById('archiveGrid');
  const archiveWrap = document.getElementById('archiveWrap');
  const toggleArchive = document.getElementById('toggleArchive');
  const heroMessenger = document.getElementById('heroMessenger');
  const footerMessenger = document.getElementById('footerMessenger');
  const toast = document.getElementById('toast');
  const modal = document.getElementById('productModal');
  const modalClose = document.getElementById('modalClose');
  const modalMessenger = document.getElementById('modalMessenger');
  const modalCopy = document.getElementById('modalCopy');

  applySettings();
  renderFilters();
  renderProducts();
  bindEvents();

  function applySettings() {
    document.title = settings.brandName || 'The Collected Edit';
    document.getElementById('serviceAreaText').textContent = settings.serviceArea || '';
    document.getElementById('heroText').textContent = settings.heroText || '';
    document.getElementById('brandStoryText').textContent = settings.brandStory || '';
    document.getElementById('recycleStoryText').textContent = settings.recycleStory || '';
  }

  function uniqueCategories() {
    return ['All', ...new Set(data.items.map(item => item.category).filter(Boolean))];
  }

  function renderFilters() {
    filterBar.replaceChildren();
    uniqueCategories().forEach(category => {
      const button = createElement('button', {
        className: 'filter-button' + (category === activeFilter ? ' active' : ''),
        text: category,
        attributes: { type: 'button' }
      });
      button.addEventListener('click', () => {
        activeFilter = category;
        renderFilters();
        renderProducts();
      });
      filterBar.appendChild(button);
    });
  }

  function getVisibleItems() {
    return data.items.filter(item => {
      const matchesFilter = activeFilter === 'All' || item.category === activeFilter;
      const haystack = [item.title, item.category, item.description, ...(item.tags || [])].join(' ').toLowerCase();
      const matchesSearch = !searchTerm || haystack.includes(searchTerm);
      return matchesFilter && matchesSearch;
    });
  }

  function renderProducts() {
    const visible = getVisibleItems();
    const mainItems = visible.filter(item => item.status !== 'archive');
    const archiveItems = visible.filter(item => item.status === 'archive');

    productGrid.replaceChildren(...mainItems.map((item, index) => createProductCard(item, index)));

    archiveWrap.classList.toggle('hidden', archiveItems.length === 0);
    archiveGrid.replaceChildren(...archiveItems.map((item, index) => createProductCard(item, index, true)));
    archiveGrid.classList.toggle('hidden', !archiveVisible);
    if (toggleArchive) {
      toggleArchive.textContent = archiveVisible ? 'Hide sold archive' : 'Show sold archive';
    }
  }

  function createProductCard(item, index, archive = false) {
    const article = createElement('article');
    const spanClass = index === 0 ? 'product-card--span-6' : (index === 1 || index === 2 ? 'product-card--span-3' : 'product-card--span-4');
    article.className = `product-card ${spanClass}` + (item.status === 'sold_badge' || archive ? ' product-card--sold' : '');

    const media = createElement('div', { className: 'product-media' });
    media.style.cursor = 'pointer';
    const image = createElement('img', {
      attributes: {
        src: safeImageSource(item.image),
        alt: item.title,
        loading: 'lazy'
      }
    });
    media.appendChild(image);
    if (item.status === 'sold_badge' || archive) {
      media.appendChild(createElement('span', { className: 'sold-badge', text: 'Sold' }));
    }

    const body = createElement('div', { className: 'product-body' });
    const head = createElement('div', { className: 'product-head' });
    head.append(
      createElement('h3', { className: 'product-title', text: item.title }),
      createElement('span', { className: 'product-price', text: item.price })
    );

    const meta = createElement('div', { className: 'product-submeta' });
    [item.category, item.condition, ...(item.tags || []).slice(0, 3)]
      .filter(Boolean)
      .forEach(value => meta.appendChild(createPill(value)));

    const foot = createElement('div', { className: 'product-foot' });
    foot.append(
      createElement('p', { className: 'product-note', text: item.circularNote || '' }),
      createElement('button', {
        className: 'product-link',
        text: 'View details',
        attributes: { type: 'button' }
      })
    );

    body.append(
      head,
      meta,
      createElement('p', { className: 'product-description', text: item.description }),
      foot
    );
    article.append(media, body);

    article.querySelector('.product-link').addEventListener('click', () => openModal(item));
    media.addEventListener('click', () => openModal(item));
    return article;
  }

  function bindEvents() {
    searchInput?.addEventListener('input', (event) => {
      searchTerm = event.target.value.trim().toLowerCase();
      renderProducts();
    });

    heroMessenger?.addEventListener('click', openGeneralMessenger);
    footerMessenger?.addEventListener('click', openGeneralMessenger);

    toggleArchive?.addEventListener('click', () => {
      archiveVisible = !archiveVisible;
      renderProducts();
    });

    modalClose?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (event) => {
      if (event.target.dataset.close === 'true') closeModal();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeModal();
    });

    modalMessenger?.addEventListener('click', () => {
      if (!currentItem) return;
      const message = buildItemMessage(currentItem);
      copyText(message);
      openMessenger(message, currentItem.id);
    });

    modalCopy?.addEventListener('click', () => {
      if (!currentItem) return;
      copyText(buildItemMessage(currentItem));
      showToast('Item message copied');
    });
  }

  function openModal(item) {
    currentItem = item;
    document.getElementById('modalImage').src = safeImageSource(item.image);
    document.getElementById('modalImage').alt = item.title;
    document.getElementById('modalCategory').textContent = item.category;
    document.getElementById('modalTitle').textContent = item.title;
    document.getElementById('modalPrice').textContent = item.price;
    document.getElementById('modalCondition').textContent = item.condition;
    document.getElementById('modalDescription').textContent = item.description;
    document.getElementById('modalTags').replaceChildren(
      ...(item.tags || []).map(tag => createPill(tag, 'tag'))
    );
    document.getElementById('modalCircular').textContent = item.circularNote || '';
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose?.focus();
  }

  function closeModal() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    currentItem = null;
  }

  function buildItemMessage(item) {
    return `Hi Trina, I'm interested in ${item.title} listed for ${item.price} on The Collected Edit. Is it still available? Item reference: ${item.id}.`;
  }

  function openGeneralMessenger() {
    const message = 'Hi Trina, I would love to ask about a current item on The Collected Edit.';
    copyText(message);
    openMessenger(message, 'general');
  }

  function openMessenger(message, ref) {
    const messengerUrl = normalizeMessengerUrl(settings.facebookMessengerUrl);
    if (!messengerUrl) {
      showToast('Add a valid https://m.me Messenger link in the local Studio first');
      return;
    }

    if (ref) messengerUrl.searchParams.set('ref', safeString(ref, 80));
    window.open(messengerUrl.toString(), '_blank', 'noopener,noreferrer');
    showToast('Messenger opened and message copied');
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard access may be unavailable on non-secure local origins.
    }
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => toast.classList.remove('show'), 1800);
  }
})();
