(() => {
  const form = document.getElementById('event-form');
  const list = document.getElementById('event-list');
  const filterInput = document.getElementById('filter');

  const STORAGE_KEY = 'recycledrop-events';

  function loadEvents(){
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  function saveEvents(events){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }

  function render(events){
    list.innerHTML = '';
    if(events.length===0){
      const li = document.createElement('li');
      li.textContent = 'No events scheduled.';
      list.appendChild(li);
      return;
    }
    events.forEach((e,index)=>{
      const li = document.createElement('li');
      li.className='event-item';
      const title = document.createElement('span');
      title.className='event-title';
      title.textContent = e.title + ' – ' + e.date + ' ' + e.time;
      li.appendChild(title);
      const details = document.createElement('div');
      details.textContent = `${e.location} | Categories: ${e.categories.join(', ')}`;
      li.appendChild(details);
      const rsvpBtn = document.createElement('button');
      rsvpBtn.className='rsvp-btn';
      rsvpBtn.textContent = `RSVP (${e.attendees})`;
      rsvpBtn.addEventListener('click',()=>{
        e.attendees+=1;
        saveEvents(allEvents);
        render(filteredEvents());
      });
      li.appendChild(rsvpBtn);
      list.appendChild(li);
    });
  }

  function addEvent(e){
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const location = document.getElementById('location').value.trim();
    const categories = document.getElementById('categories').value.split(',').map(s=>s.trim()).filter(Boolean);
    if(!title||!date||!time||!location){
      alert('Please fill in all required fields.');
      return;
    }
    const newEvent = {title, date, time, location, categories, attendees:0};
    allEvents.push(newEvent);
    saveEvents(allEvents);
    form.reset();
    render(filteredEvents());
  }

  function filteredEvents(){
    const term = filterInput.value.trim().toLowerCase();
    if(!term) return allEvents;
    return allEvents.filter(ev=> ev.categories.some(cat=>cat.toLowerCase().includes(term)));
  }

  const allEvents = loadEvents();
  render(allEvents);

  form.addEventListener('submit',addEvent);
  filterInput.addEventListener('input',()=>render(filteredEvents()));
})();