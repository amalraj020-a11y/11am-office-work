(() => {
  const listingsContainer = document.getElementById('listings');
  const addBtn = document.getElementById('addBtn');
  const modal = document.getElementById('modal');
  const form = document.getElementById('listingForm');
  const cancelBtn = document.getElementById('cancelBtn');
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');

  const STORAGE_KEY = 'skillswap-listings';

  function loadListings() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  function saveListings(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function render(list) {
    listingsContainer.innerHTML = '';
    if (list.length === 0) {
      listingsContainer.innerHTML = '<p class="empty">No listings yet. Click "Add Listing" to start.</p>';
      return;
    }
    list.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3>${item.title}</h3>
        <p class="type">${item.type}: ${item.category}</p>
        <p>${item.description}</p>
        ${item.price ? `<p>Price: $${parseFloat(item.price).toFixed(2)}</p>` : ''}
        ${item.date ? `<p class="date">Proposed: ${item.date}</p>` : ''}
      `;
      listingsContainer.appendChild(card);
    });
  }

  function openModal() {
    modal.classList.remove('hidden');
    form.reset();
    document.getElementById('typeSelect').focus();
  }

  function closeModal() {
    modal.classList.add('hidden');
  }

  function addListing(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const newItem = {
      type: formData.get('type'),
      title: formData.get('title').trim(),
      category: formData.get('category'),
      description: formData.get('description').trim(),
      price: formData.get('price'),
      date: formData.get('date')
    };
    const listings = loadListings();
    listings.unshift(newItem);
    saveListings(listings);
    render(filterAndSearch(listings));
    closeModal();
  }

  function filterAndSearch(list) {
    const query = searchInput.value.toLowerCase();
    const cat = categoryFilter.value;
    return list.filter(item => {
      const matchesText = item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query);
      const matchesCat = cat === '' || item.category === cat;
      return matchesText && matchesCat;
    });
  }

  // Event listeners
  addBtn.addEventListener('click', openModal);
  cancelBtn.addEventListener('click', closeModal);
  form.addEventListener('submit', addListing);
  searchInput.addEventListener('input', () => render(filterAndSearch(loadListings())));
  categoryFilter.addEventListener('change', () => render(filterAndSearch(loadListings())));

  // Initial render
  render(loadListings());
})();