(() => {
  const form = document.getElementById('listing-form');
  const listEl = document.getElementById('listing-list');
  const filterCat = document.getElementById('filter-category');
  const filterZip = document.getElementById('filter-zip');

  const STORAGE_KEY = 'artswap-listings';

  function loadListings(){
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
  function saveListings(list){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
  function render(){
    const all = loadListings();
    const cat = filterCat.value;
    const zip = filterZip.value.trim();
    const filtered = all.filter(l=>{
      const catMatch = cat===''||l.category===cat;
      const zipMatch = zip===''||l.zip===zip;
      return catMatch && zipMatch;
    });
    listEl.innerHTML='';
    if(filtered.length===0){
      listEl.innerHTML='<li>No listings found.</li>';
      return;
    }
    filtered.forEach(l=>{
      const li=document.createElement('li');
      li.className='listing-item clearfix';
      let img='';
      if(l.imageUrl){
        img=`<img src="${l.imageUrl}" alt="${l.title}" onerror="this.style.display='none'"/>`;
      }
      li.innerHTML=`${img}<h3>${l.title}</h3>`+
        `<p><strong>Category:</strong> ${l.category}</p>`+
        `<p><strong>Zip:</strong> ${l.zip}***</p>`+
        `<p>${l.description}</p>`+
        `<a href="mailto:?subject=ArtSwap%20Inquiry%20-%20${encodeURIComponent(l.title)}&body=${encodeURIComponent('Hi, I am interested in your listing: '+l.title)}">Contact</a>`;
      listEl.appendChild(li);
    });
  }

  form.addEventListener('submit',e=>{
    e.preventDefault();
    const title=document.getElementById('title');
    const description=document.getElementById('description');
    const category=document.getElementById('category');
    const imageUrl=document.getElementById('imageUrl');
    const zip=document.getElementById('zip');
    if(!form.checkValidity()){
      form.reportValidity();
      return;
    }
    const newListing={
      id:Date.now(),
      title:title.value.trim(),
      description:description.value.trim(),
      category:category.value,
      imageUrl:imageUrl.value.trim(),
      zip:zip.value.trim()
    };
    const listings=loadListings();
    listings.unshift(newListing);
    saveListings(listings);
    form.reset();
    render();
  });

  filterCat.addEventListener('change',render);
  filterZip.addEventListener('input',render);

  // Initial render
  render();
})();