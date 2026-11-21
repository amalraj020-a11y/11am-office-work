(() => {
  const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const START_HOUR = 8; // 8 AM
  const END_HOUR = 20; // 8 PM
  const SLOT_MINUTES = 30;
  const calendarEl = document.getElementById('calendar');
  const modal = document.getElementById('modal');
  const form = document.getElementById('slotForm');
  const dishInput = document.getElementById('dishInput');
  const noteInput = document.getElementById('noteInput');
  const closeModalBtn = document.getElementById('closeModal');
  const exportBtn = document.getElementById('exportBtn');
  const importInput = document.getElementById('importInput');
  let selectedSlotId = null;

  function loadData(){
    const raw = localStorage.getItem('kitchenData');
    return raw ? JSON.parse(raw) : {};
  }
  function saveData(data){
    localStorage.setItem('kitchenData', JSON.stringify(data));
  }
  function render(){
    calendarEl.innerHTML='';
    const data = loadData();
    for(let day=0; day<7; day++){
      for(let hour=START_HOUR; hour<END_HOUR; hour++){
        for(let min=0; min<60; min+=SLOT_MINUTES){
          const slotId = `${day}-${hour}-${min}`;
          const slotDiv = document.createElement('div');
          slotDiv.className='slot';
          slotDiv.tabIndex=0;
          slotDiv.setAttribute('role','button');
          slotDiv.setAttribute('aria-label',`Slot ${DAYS[day]} ${hour}:${min===0?'00':'30'}`);
          slotDiv.dataset.id=slotId;
          const booked = data[slotId];
          if(booked){
            slotDiv.dataset.booked='true';
            const dishSpan = document.createElement('span');
            dishSpan.className='dish';
            dishSpan.textContent=booked.dish;
            const noteP = document.createElement('p');
            noteP.textContent=booked.note||'';
            slotDiv.appendChild(dishSpan);
            slotDiv.appendChild(noteP);
          }
          slotDiv.addEventListener('click', openModal);
          slotDiv.addEventListener('keydown', e=>{if(e.key==='Enter') openModal(e);});
          calendarEl.appendChild(slotDiv);
        }
      }
    }
  }
  function openModal(e){
    selectedSlotId = e.currentTarget.dataset.id;
    const data = loadData();
    const booked = data[selectedSlotId];
    dishInput.value = booked?.dish||'';
    noteInput.value = booked?.note||'';
    modal.setAttribute('aria-hidden','false');
    dishInput.focus();
  }
  function closeModal(){
    modal.setAttribute('aria-hidden','true');
    selectedSlotId=null;
  }
  form.addEventListener('submit', e=>{
    e.preventDefault();
    if(!selectedSlotId) return;
    const dish = dishInput.value.trim();
    const note = noteInput.value.trim();
    const data = loadData();
    data[selectedSlotId] = {dish, note};
    saveData(data);
    render();
    closeModal();
  });
  closeModalBtn.addEventListener('click', closeModal);
  exportBtn.addEventListener('click',()=>{
    const data = loadData();
    const blob = new Blob([JSON.stringify(data, null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;a.download='kitchen-data.json';
    a.click();
    URL.revokeObjectURL(url);
  });
  importInput.addEventListener('change', e=>{
    const file=e.target.files[0];
    if(!file) return;
    const reader=new FileReader();
    reader.onload=ev=>{
      try{const obj=JSON.parse(ev.target.result);saveData(obj);render();}
      catch{alert('Invalid JSON file');}
    };
    reader.readAsText(file);
  });
  // Initial render
  render();
})();