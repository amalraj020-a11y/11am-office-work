// Data structures
let meals = [];
const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const slots = ['Breakfast','Lunch','Dinner'];
// Load from localStorage
function loadData(){
  const saved = localStorage.getItem('familymeal-data');
  if(saved){meals=JSON.parse(saved);} else {initializeDefault();}
}
function saveData(){localStorage.setItem('familymeal-data',JSON.stringify(meals));}
function initializeDefault(){
  days.forEach(d=>{
    slots.forEach(s=>{meals.push({day:d,slot:s,meal:'',cook:''});});
  });
}
function renderGrid(){
  const grid=document.getElementById('meal-grid');
  grid.innerHTML='';
  // Header row
  grid.appendChild(document.createElement('div')); // empty top‑left
  days.forEach(d=>{const h=document.createElement('div');h.textContent=d;grid.appendChild(h);});
  // Rows per slot
  slots.forEach(slot=>{
    const slotLabel=document.createElement('div');slotLabel.textContent=slot;grid.appendChild(slotLabel);
    days.forEach(day=>{
      const cell=document.createElement('div');
      const entry=meals.find(m=>m.day===day && m.slot===slot);
      cell.dataset.day=day;cell.dataset.slot=slot;
      cell.tabIndex=0;
      cell.innerHTML=`<strong>${entry.meal||'—'}</strong><br><em>${entry.cook||''}</em>`;
      cell.addEventListener('click',()=>openEditModal(entry));
      cell.addEventListener('keypress',e=>{if(e.key==='Enter')openEditModal(entry);});
      grid.appendChild(cell);
    });
  });
}
function openEditModal(entry){
  const meal=prompt('Meal name (e.g., Spaghetti)',entry.meal);
  if(meal===null) return; // cancel
  const cook=prompt('Who will cook?',entry.cook);
  if(cook===null) return;
  entry.meal=meal.trim();
  entry.cook=cook.trim();
  saveData();
  renderGrid();
}
function generateGrocery(){
  // Simple heuristic: split meal name into words as ingredients
  const ingredients={};
  meals.filter(m=>m.meal).forEach(m=>{
    const words=m.meal.split(/\s+/);
    words.forEach(w=>{const key=w.toLowerCase();ingredients[key]=(ingredients[key]||0)+1;});
  });
  const list=document.getElementById('grocery-list');
  list.innerHTML='';
  Object.entries(ingredients).forEach(([ing,count])=>{
    const li=document.createElement('li');
    li.textContent=`${ing} x ${count}`;
    list.appendChild(li);
  });
  document.getElementById('grocery').classList.remove('hidden');
}
function setup(){
  loadData();
  renderGrid();
  document.getElementById('add-meal-btn').addEventListener('click',()=>{
    alert('Click any cell to edit a meal.');
  });
  const groceryBtn=document.createElement('button');
  groceryBtn.textContent='Generate Grocery List';
  groceryBtn.addEventListener('click',generateGrocery);
  document.getElementById('planner').appendChild(groceryBtn);
}
window.addEventListener('DOMContentLoaded',setup);