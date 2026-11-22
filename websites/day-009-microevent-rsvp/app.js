(() => {
  const eventForm = document.getElementById('event-form');
  const rsvpForm = document.getElementById('rsvp-form');
  const eventSection = document.getElementById('create-event');
  const displaySection = document.getElementById('event-display');
  const storageKey = 'microevent-data';

  function loadData(){
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : null;
  }
  function saveData(data){
    localStorage.setItem(storageKey, JSON.stringify(data));
  }
  function renderEvent(event){
    document.getElementById('event-title').textContent = event.title;
    document.getElementById('event-details').textContent = `${event.date} ${event.time} • ${event.location} • Capacity: ${event.capacity}`;
    document.getElementById('event-description').textContent = event.description;
    updateLists(event);
    eventSection.classList.add('hidden');
    displaySection.classList.remove('hidden');
  }
  function updateLists(event){
    const confirmedList = document.getElementById('confirmed-list');
    const waitlist = document.getElementById('waitlist');
    confirmedList.innerHTML='';
    waitlist.innerHTML='';
    event.rsvps.forEach((r,i)=>{
      const li=document.createElement('li');
      li.textContent=`${r.name} (${r.email})`;
      if(i<event.capacity){
        confirmedList.appendChild(li);
      } else {
        waitlist.appendChild(li);
      }
    });
    document.getElementById('confirmed-count').textContent=Math.min(event.rsvps.length,event.capacity);
    document.getElementById('waitlist-count').textContent=Math.max(0,event.rsvps.length-event.capacity);
  }

  // Initialize
  const saved = loadData();
  if(saved){
    renderEvent(saved);
  }

  eventForm.addEventListener('submit', e=>{
    e.preventDefault();
    const event = {
      title: document.getElementById('title').value.trim(),
      date: document.getElementById('date').value,
      time: document.getElementById('time').value,
      location: document.getElementById('location').value.trim(),
      capacity: parseInt(document.getElementById('capacity').value,10),
      description: document.getElementById('description').value.trim(),
      rsvps: []
    };
    saveData(event);
    renderEvent(event);
  });

  rsvpForm.addEventListener('submit', e=>{
    e.preventDefault();
    const name=document.getElementById('rsvp-name').value.trim();
    const email=document.getElementById('rsvp-email').value.trim();
    if(!name||!email){return;}
    const data = loadData();
    data.rsvps.push({name,email});
    saveData(data);
    updateLists(data);
    rsvpForm.reset();
  });
})();