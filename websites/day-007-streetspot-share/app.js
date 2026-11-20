// Utility functions
function getListings(){
  const data = localStorage.getItem('streetspot_listings');
  return data ? JSON.parse(data) : [];
}
function saveListings(listings){
  localStorage.setItem('streetspot_listings', JSON.stringify(listings));
}
function renderResults(listings){
  const container = document.getElementById('results');
  container.innerHTML = '';
  if(listings.length===0){
    container.innerHTML = '<p class="empty-state">No listings found for the selected criteria.</p>';
    return;
  }
  listings.forEach(l=>{
    const div=document.createElement('div');
    div.className='listing';
    div.innerHTML = `
      <strong>Address:</strong> ${l.address}<br>
      <strong>ZIP:</strong> ${l.zip}<br>
      <strong>Available:</strong> ${l.dateFrom} to ${l.dateTo}<br>
      <strong>Price:</strong> ₹${l.price}<br>
      <button data-id="${l.id}" class="reserveBtn">Reserve</button>
    `;
    if(l.photoUrl){
      const img=document.createElement('img');
      img.src=l.photoUrl; img.alt='Parking spot photo';
      div.appendChild(img);
    }
    container.appendChild(div);
  });
  // Attach reserve handlers
  document.querySelectorAll('.reserveBtn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id=btn.getAttribute('data-id');
      const listings=getListings();
      const idx=listings.findIndex(i=>i.id===id);
      if(idx>-1){
        listings.splice(idx,1); // simple removal to simulate reservation
        saveListings(listings);
        alert('Spot reserved! Listing removed.');
        btn.parentElement.remove();
      }
    });
  });
}
// Form handlers
document.getElementById('listingForm').addEventListener('submit',e=>{
  e.preventDefault();
  const address=document.getElementById('address').value.trim();
  const zip=document.getElementById('zip').value.trim();
  const dateFrom=document.getElementById('dateFrom').value;
  const dateTo=document.getElementById('dateTo').value;
  const price=document.getElementById('price').value;
  const photoUrl=document.getElementById('photoUrl').value.trim();
  if(new Date(dateFrom)>new Date(dateTo)){
    alert('From date must be before To date');
    return;
  }
  const newListing={
    id:Date.now().toString(),
    address,zip,dateFrom,dateTo,price,photoUrl
  };
  const listings=getListings();
  listings.push(newListing);
  saveListings(listings);
  e.target.reset();
  alert('Listing added');
});
document.getElementById('searchForm').addEventListener('submit',e=>{
  e.preventDefault();
  const zip=document.getElementById('searchZip').value.trim();
  const date=document.getElementById('searchDate').value;
  const all=getListings();
  const filtered=all.filter(l=>{
    return l.zip===zip && new Date(l.dateFrom)<=new Date(date) && new Date(l.dateTo)>=new Date(date);
  });
  renderResults(filtered);
});
// Initial load – show empty state
renderResults([]);
