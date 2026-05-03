(function () {
  const STORAGE_KEY = 'collected-edit-data-v1';
  const MAX_IMAGE_BYTES = 1_500_000;
  const ALLOWED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);
  const {
    createElement,
    loadStoredData,
    normalizeData,
    normalizeItem,
    normalizeMessengerUrl,
    safeImageSource,
    saveStoredData
  } = window.CollectedEdit;

  const loginView = document.getElementById('loginView');
  const studioView = document.getElementById('studioView');
  const toast = document.getElementById('toast');
  const data = loadStoredData(STORAGE_KEY);
  let selectedId = null;
  let uploadedImage = '';

  document.getElementById('loginButton').addEventListener('click', openStudio);
  document.getElementById('saveSettings').addEventListener('click', saveSettings);
  document.getElementById('saveItemButton').addEventListener('click', saveItem);
  document.getElementById('resetItemButton').addEventListener('click', resetForm);
  document.getElementById('generateButton').addEventListener('click', generateDraft);
  document.getElementById('exportButton').addEventListener('click', exportJson);
  document.getElementById('importFile').addEventListener('change', importJson);
  document.getElementById('itemImageUpload').addEventListener('change', handleImageUpload);

  function persist() {
    const normalized = normalizeData(data);
    data.siteSettings = normalized.siteSettings;
    data.items = normalized.items;
    saveStoredData(STORAGE_KEY, data);
  }

  function openStudio() {
    loginView.classList.add('hidden');
    studioView.classList.remove('hidden');
    populateSettings();
    renderList();
    resetForm();
  }

  function populateSettings() {
    document.getElementById('settingMessenger').value = data.siteSettings.facebookMessengerUrl || '';
    document.getElementById('settingArea').value = data.siteSettings.serviceArea || '';
    document.getElementById('settingHero').value = data.siteSettings.heroText || '';
    document.getElementById('settingStory').value = data.siteSettings.brandStory || '';
    document.getElementById('settingRecycle').value = data.siteSettings.recycleStory || '';
  }

  function saveSettings() {
    const messengerValue = document.getElementById('settingMessenger').value.trim();
    const messengerUrl = messengerValue ? normalizeMessengerUrl(messengerValue) : null;

    if (messengerValue && !messengerUrl) {
      showToast('Use a valid https://m.me/... Messenger URL');
      return;
    }

    data.siteSettings.facebookMessengerUrl = messengerUrl ? messengerUrl.toString() : '';
    data.siteSettings.serviceArea = document.getElementById('settingArea').value.trim();
    data.siteSettings.heroText = document.getElementById('settingHero').value.trim();
    data.siteSettings.brandStory = document.getElementById('settingStory').value.trim();
    data.siteSettings.recycleStory = document.getElementById('settingRecycle').value.trim();
    persist();
    showToast('Settings saved in this browser');
  }

  function renderList() {
    const list = document.getElementById('itemList');
    list.replaceChildren(...data.items.map(item => createInventoryRow(item)));
  }

  function createInventoryRow(item) {
    const row = createElement('article', { className: 'inventory-item' });
    const image = createElement('img', {
      attributes: {
        src: safeImageSource(item.image),
        alt: item.title
      }
    });

    const details = createElement('div');
    details.append(
      createElement('h3', { text: item.title }),
      createElement('p', { text: [item.category, item.price, item.status].filter(Boolean).join(' · ') })
    );

    const actions = createElement('div', { className: 'inventory-actions' });
    const editButton = createElement('button', {
      className: 'button button-light',
      text: 'Edit',
      attributes: { type: 'button' }
    });
    const duplicateButton = createElement('button', {
      className: 'button button-light',
      text: 'Duplicate',
      attributes: { type: 'button' }
    });

    editButton.addEventListener('click', () => loadItem(item.id));
    duplicateButton.addEventListener('click', () => duplicateItem(item.id));
    actions.append(editButton, duplicateButton);
    row.append(image, details, actions);
    return row;
  }

  function loadItem(id) {
    const item = data.items.find(entry => entry.id === id);
    if (!item) return;
    selectedId = id;
    uploadedImage = safeImageSource(item.image);
    document.getElementById('itemTitle').value = item.title || '';
    document.getElementById('itemCategory').value = item.category || '';
    document.getElementById('itemPrice').value = item.price || '';
    document.getElementById('itemCondition').value = item.condition || '';
    document.getElementById('itemStatus').value = item.status || 'available';
    document.getElementById('itemTags').value = (item.tags || []).join(', ');
    document.getElementById('itemDescription').value = item.description || '';
    document.getElementById('itemCircular').value = item.circularNote || '';
    showToast('Listing loaded');
  }

  function duplicateItem(id) {
    const item = data.items.find(entry => entry.id === id);
    if (!item) return;
    const clone = normalizeItem({ ...item, id: `tce-${String(Date.now()).slice(-6)}`, title: `${item.title} Copy` });
    data.items.unshift(clone);
    persist();
    renderList();
    showToast('Listing duplicated');
  }

  function saveItem() {
    const payload = collectForm();
    if (!payload.title || payload.title === 'Untitled listing') {
      showToast('Add a title first');
      return;
    }
    if (selectedId) {
      const index = data.items.findIndex(item => item.id === selectedId);
      if (index >= 0) data.items[index] = { ...data.items[index], ...payload, id: selectedId };
    } else {
      payload.id = `tce-${String(Date.now()).slice(-6)}`;
      data.items.unshift(normalizeItem(payload));
      selectedId = payload.id;
    }
    persist();
    renderList();
    showToast('Listing saved in this browser');
  }

  function collectForm() {
    return normalizeItem({
      id: selectedId || `tce-${String(Date.now()).slice(-6)}`,
      title: document.getElementById('itemTitle').value.trim(),
      category: document.getElementById('itemCategory').value.trim(),
      price: document.getElementById('itemPrice').value.trim(),
      condition: document.getElementById('itemCondition').value.trim(),
      status: document.getElementById('itemStatus').value,
      tags: document.getElementById('itemTags').value,
      description: document.getElementById('itemDescription').value.trim(),
      circularNote: document.getElementById('itemCircular').value.trim(),
      image: uploadedImage || 'assets/hero-stilllife.svg'
    });
  }

  function resetForm() {
    selectedId = null;
    uploadedImage = '';
    ['itemTitle','itemCategory','itemPrice','itemCondition','itemTags','itemDescription','itemCircular'].forEach(id => {
      document.getElementById(id).value = '';
    });
    document.getElementById('itemStatus').value = 'available';
    document.getElementById('itemImageUpload').value = '';
  }

  function generateDraft() {
    const title = document.getElementById('itemTitle').value.trim();
    const category = document.getElementById('itemCategory').value.trim() || 'Home Decor';
    const seed = title || 'Collected piece';
    const categoryDefaults = {
      'Home Decor': {
        description: 'a beautifully chosen piece with the kind of shape and finish that instantly makes a space feel more considered.',
        note: 'An elegant item kept in circulation instead of going to waste.'
      },
      'Entertaining': {
        description: 'a polished entertaining piece that feels special enough for guests and practical enough to use often.',
        note: 'Good hosting pieces deserve more than one life.'
      },
      'Travel': {
        description: 'a useful travel or storage find with style, structure, and everyday practicality.',
        note: 'Practical things can still be worth preserving.'
      },
      'Seasonal': {
        description: 'a charming seasonal accent chosen for warmth, texture, and the kind of detail that makes a home feel finished.',
        note: 'Decor that still has beauty left should stay in use.'
      },
      'Lighting': {
        description: 'a warm, character-rich lighting piece that adds softness and presence to a room.',
        note: 'Quality lighting belongs in another home, not a landfill.'
      }
    };
    const defaults = categoryDefaults[category] || categoryDefaults['Home Decor'];
    document.getElementById('itemCondition').value ||= 'Very good condition';
    document.getElementById('itemPrice').value ||= '$48';
    document.getElementById('itemDescription').value ||= `${seed} is ${defaults.description}`;
    document.getElementById('itemCircular').value ||= defaults.note;
    if (!document.getElementById('itemTags').value.trim()) {
      document.getElementById('itemTags').value = `${category.toLowerCase()}, curated, local`;
    }
    showToast('Draft generated');
  }

  function handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      showToast('Use PNG, JPG, WebP, or GIF images');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      showToast('Use an image smaller than 1.5 MB');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      uploadedImage = safeImageSource(reader.result);
      showToast('Image ready');
    };
    reader.readAsDataURL(file);
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(normalizeData(data), null, 2)], { type: 'application/json' });
    const link = createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'collected-edit-data.json';
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function importJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = normalizeData(JSON.parse(reader.result));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        window.location.reload();
      } catch {
        showToast('That JSON file does not match the Studio format');
      }
    };
    reader.readAsText(file);
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => toast.classList.remove('show'), 1800);
  }
})();
