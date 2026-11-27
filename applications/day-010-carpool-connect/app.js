// Utility functions
function $(id){return document.getElementById(id)}
function loadRides(){
  const data=localStorage.getItem('rides')
  return data?JSON.parse(data):[]
}
function saveRides(rides){localStorage.setItem('rides',JSON.stringify(rides))}
function renderRides(){
  const list=$('rides-list')
  list.innerHTML=''
  const rides=loadRides()
  if(rides.length===0){list.innerHTML='<li>No rides created yet.</li>';return}
  rides.forEach((r,i)=>{
    const li=document.createElement('li')
    li.textContent=`${r.type.toUpperCase()}: ${r.origin} → ${r.destination} at ${r.time} (${r.seats} seat${r.seats>1?'s':''})`
    const del=document.createElement('button')
    del.textContent='Delete'
    del.style.marginLeft='1rem'
    del.onclick=()=>{rides.splice(i,1);saveRides(rides);renderRides();renderMatches()}
    li.appendChild(del)
    list.appendChild(li)
  })
}
function findMatches(){
  const rides=loadRides()
  const matches=[]
  for(let i=0;i<rides.length;i++){
    for(let j=i+1;j<rides.length;j++){
      const a=rides[i],b=rides[j]
      if(a.type===b.type) continue // need opposite types
      // simple route proximity: exact match of origin and destination (case‑insensitive)
      if(a.origin.trim().toLowerCase()===b.origin.trim().toLowerCase() &&
         a.destination.trim().toLowerCase()===b.destination.trim().toLowerCase()){
        // time within 30 minutes
        const t1=a.time.split(':').map(Number)
        const t2=b.time.split(':').map(Number)
        const minutes=Math.abs(t1[0]*60+t1[1] - (t2[0]*60+t2[1]))
        if(minutes<=30){
          matches.push({offer:a.type==='offer'?a:b, request:a.type==='request'?a:b, timeDiff:minutes})
        }
      }
    }
  }
  return matches
}
function renderMatches(){
  const list=$('matches-list')
  list.innerHTML=''
  const matches=findMatches()
  if(matches.length===0){list.innerHTML='<li>No matches found.</li>';return}
  matches.forEach(m=>{
    const li=document.createElement('li')
    li.textContent=`Offer: ${m.offer.origin}→${m.offer.destination} @${m.offer.time} (${m.offer.seats} seat) ↔ Request: ${m.request.origin}→${m.request.destination} @${m.request.time}`
    const accept=document.createElement('button')
    accept.textContent='Accept'
    accept.style.marginLeft='1rem'
    accept.onclick=()=>{
      alert('Match accepted! Communicate details offline.')
    }
    li.appendChild(accept)
    list.appendChild(li)
  })
}
// Form handling
$('ride-form').addEventListener('submit',e=>{
  e.preventDefault()
  const type=$('type').value
  const origin=$('origin').value.trim()
  const destination=$('destination').value.trim()
  const time=$('time').value
  const seats=parseInt($('seats').value,10)
  if(!origin||!destination||!time||seats<1){
    alert('Please fill all fields correctly.')
    return
  }
  const rides=loadRides()
  rides.push({type,origin,destination,time,seats})
  saveRides(rides)
  $('ride-form').reset()
  renderRides()
  renderMatches()
})
// Initial render
renderRides()
renderMatches()
