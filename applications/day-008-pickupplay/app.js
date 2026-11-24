(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('event');
  const createView = document.getElementById('create-view');
  const eventView = document.getElementById('event-view');
  const createForm = document.getElementById('create-form');
  const rsvpForm = document.getElementById('rsvp-form');
  const linkSection = document.getElementById('link-section');
  const shareLinkInput = document.getElementById('share-link');
  const copyBtn = document.getElementById('copy-btn');
  const playerList = document.getElementById('player-list');
  const eventTitle = document.getElementById('event-title');
  const eventDetails = document.getElementById('event-details');

  const storageKey = (id) => `pickupplay_event_${id}`;

  function saveEvent(id, data) {
    localStorage.setItem(storageKey(id), JSON.stringify(data));
  }
  function loadEvent(id) {
    const raw = localStorage.getItem(storageKey(id));
    return raw ? JSON.parse(raw) : null;
  }
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2,5);
  }
  function showCreate() {
    createView.classList.add('active');
    eventView.classList.remove('active');
  }
  function showEvent(event) {
    eventTitle.textContent = `${event.sport} @ ${event.location}`;
    eventDetails.textContent = `${event.date} ${event.time}`;
    renderPlayers(event.players);
    eventView.classList.add('active');
    createView.classList.remove('active');
  }
  function renderPlayers(players) {
    playerList.innerHTML = '';
    players.forEach(p => {
      const li = document.createElement('li');
      li.textContent = p.name + (p.note ? ` – ${p.note}` : '');
      playerList.appendChild(li);
    });
  }

  // Create form handler
  createForm.addEventListener('submit', e => {
    e.preventDefault();
    const sport = document.getElementById('sport').value.trim();
    const location = document.getElementById('location').value.trim();
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    if (!sport || !location || !date || !time) {
      alert('Please fill all required fields.');
      return;
    }
    const id = generateId();
    const event = { id, sport, location, date, time, players: [] };
    saveEvent(id, event);
    const link = `${window.location.origin}${window.location.pathname}?event=${id}`;
    shareLinkInput.value = link;
    linkSection.classList.remove('hidden');
    showEvent(event);
  });

  // RSVP handler
  rsvpForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('player-name').value.trim();
    const note = document.getElementById('note').value.trim();
    if (!name) { alert('Name required'); return; }
    const event = loadEvent(eventId);
    if (!event) { alert('Event not found'); return; }
    // prevent duplicate names
    if (event.players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      alert('You have already RSVP\'d.');
      return;
    }
    event.players.push({ name, note });
    saveEvent(eventId, event);
    renderPlayers(event.players);
    rsvpForm.reset();
  });

  // Copy button
  copyBtn.addEventListener('click', () => {
    shareLinkInput.select();
    document.execCommand('copy');
    copyBtn.textContent = 'Copied!';
    setTimeout(() => copyBtn.textContent = 'Copy', 1500);
  });

  // Initialization
  if (eventId) {
    const event = loadEvent(eventId);
    if (event) {
      showEvent(event);
    } else {
      // No stored data, fallback to create view
      showCreate();
    }
  } else {
    showCreate();
  }
})();