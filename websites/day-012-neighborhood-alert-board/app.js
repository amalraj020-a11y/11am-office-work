(() => {
  const form = document.getElementById('newAlertForm');
  const alertsUl = document.getElementById('alerts');
  const emptyState = document.getElementById('emptyState');
  const filterSelect = document.getElementById('categoryFilter');
  const shareBtn = document.getElementById('shareBtn');

  const STORAGE_KEY = 'nab_alerts';

  function loadAlerts() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  function saveAlerts(alerts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
  }

  function renderAlerts() {
    const alerts = loadAlerts().filter(isNotExpired);
    const filter = filterSelect.value;
    const filtered = filter === 'All' ? alerts : alerts.filter(a => a.category === filter);
    alertsUl.innerHTML = '';
    if (filtered.length === 0) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
      filtered.forEach(alert => {
        const li = document.createElement('li');
        li.className = 'alert-item';
        li.dataset.id = alert.id;
        li.dataset.category = alert.category;
        li.innerHTML = `
          <div class="alert-header">
            <span class="alert-title">${escapeHtml(alert.title)}</span>
            <div class="alert-actions">
              <button aria-label="Delete" data-action="delete">✖</button>
            </div>
          </div>
          <p class="alert-desc">${escapeHtml(alert.description)}</p>
          <small class="alert-meta">Category: ${alert.category}${alert.expires ? ' | Expires: ' + alert.expires : ''}</small>
        `;
        alertsUl.appendChild(li);
      });
    }
  }

  function isNotExpired(alert) {
    if (!alert.expires) return true;
    const today = new Date().toISOString().split('T')[0];
    return alert.expires >= today;
  }

  function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(text).replace(/[&<>\"']/g, m => map[m]);
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const title = form.title.value.trim();
    const description = form.description.value.trim();
    const category = form.category.value;
    const expires = form.expires.value;
    if (title.length < 3 || description.length < 5) {
      alert('Please provide a valid title and description.');
      return;
    }
    const alerts = loadAlerts();
    alerts.push({
      id: Date.now().toString(),
      title,
      description,
      category,
      expires: expires || null,
      created: new Date().toISOString()
    });
    saveAlerts(alerts);
    form.reset();
    renderAlerts();
  });

  alertsUl.addEventListener('click', e => {
    if (e.target.dataset.action === 'delete') {
      const id = e.target.closest('.alert-item').dataset.id;
      const alerts = loadAlerts().filter(a => a.id !== id);
      saveAlerts(alerts);
      renderAlerts();
    }
  });

  filterSelect.addEventListener('change', renderAlerts);

  shareBtn.addEventListener('click', () => {
    const alerts = loadAlerts().filter(isNotExpired);
    const data = encodeURIComponent(JSON.stringify(alerts));
    const url = `${window.location.origin}${window.location.pathname}?data=${data}`;
    navigator.clipboard.writeText(url).then(() => alert('Shareable link copied to clipboard!'));
  });

  // Load from URL if present
  function loadFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    if (data) {
      try {
        const alerts = JSON.parse(decodeURIComponent(data));
        saveAlerts(alerts);
        // Remove query to keep clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {
        console.error('Failed to parse shared data');
      }
    }
  }

  loadFromUrl();
  renderAlerts();
})();