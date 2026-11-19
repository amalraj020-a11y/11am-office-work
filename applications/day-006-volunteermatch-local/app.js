(() => {
  const slotForm = document.getElementById('slot-form');
  const slotList = document.getElementById('slot-list');
  const claimList = document.getElementById('claim-list');
  const filterSkill = document.getElementById('filter-skill');
  const filterDate = document.getElementById('filter-date');
  const applyFiltersBtn = document.getElementById('apply-filters');
  const clearFiltersBtn = document.getElementById('clear-filters');
  const exportBtn = document.getElementById('export-csv');

  const STORAGE_KEY = 'volunteerSlots';
  const CLAIMS_KEY = 'volunteerClaims';

  function loadSlots(){
    return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
  }
  function saveSlots(slots){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slots));
  }
  function loadClaims(){
    return JSON.parse(localStorage.getItem(CLAIMS_KEY)||'[]');
  }
  function saveClaims(claims){
    localStorage.setItem(CLAIMS_KEY, JSON.stringify(claims));
  }
  function renderSlots(){
    const slots = loadSlots();
    const skillFilter = filterSkill.value.trim().toLowerCase();
    const dateFilter = filterDate.value;
    slotList.innerHTML='';
    slots.forEach((s,i)=>{
      if(skillFilter && !s.skills.some(sk=>sk.includes(skillFilter))) return;
      if(dateFilter && s.date!==dateFilter) return;
      const li=document.createElement('li');
      li.innerHTML=`<strong>${s.title}</strong> (${s.date} ${s.time})<br>${s.desc}<br>Skills: ${s.skills.join(', ')}<br>Needed: ${s.need}<button data-index="${i}">Claim</button>`;
      slotList.appendChild(li);
    });
  }
  function renderClaims(){
    const claims = loadClaims();
    claimList.innerHTML='';
    claims.forEach((c,i)=>{
      const li=document.createElement('li');
      li.textContent=`${c.title} on ${c.date} ${c.time}`;
      claimList.appendChild(li);
    });
  }
  slotForm.addEventListener('submit',e=>{
    e.preventDefault();
    const title=document.getElementById('title').value.trim();
    const desc=document.getElementById('desc').value.trim();
    const skill=document.getElementById('skill').value.trim();
    const date=document.getElementById('date').value;
    const time=document.getElementById('time').value;
    const need=parseInt(document.getElementById('need').value,10);
    if(!title||!desc||!skill||!date||!time||isNaN(need)) return alert('Please fill all fields');
    const slot={title,desc,skills:skill.split(',').map(s=>s.trim().toLowerCase()),date,time,need};
    const slots=loadSlots();
    slots.push(slot);
    saveSlots(slots);
    slotForm.reset();
    renderSlots();
  });
  slotList.addEventListener('click',e=>{
    if(e.target.tagName==='BUTTON'){
      const idx=e.target.dataset.index;
      const slots=loadSlots();
      const slot=slots[idx];
      const claims=loadClaims();
      claims.push(slot);
      saveClaims(claims);
      alert('Slot claimed!');
      renderClaims();
    }
  });
  applyFiltersBtn.addEventListener('click',renderSlots);
  clearFiltersBtn.addEventListener('click',()=>{filterSkill.value='';filterDate.value='';renderSlots();});
  exportBtn.addEventListener('click',()=>{
    const claims=loadClaims();
    if(claims.length===0){alert('No claims to export');return;}
    const csv='Title,Date,Time,Description,Skills\n'+claims.map(c=>`"${c.title}","${c.date}","${c.time}","${c.desc}","${c.skills.join(' | ')}"`).join('\n');
    const blob=new Blob([csv],{type:'text/csv'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download='my_volunteer_claims.csv';document.body.appendChild(a);a.click();document.body.removeChild(a);
  });
  // Initial render
  renderSlots();
  renderClaims();
})();