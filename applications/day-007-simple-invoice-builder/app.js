document.addEventListener('DOMContentLoaded',()=>{
const form=document.getElementById('invoice-form');
const addItemBtn=document.getElementById('add-item-btn');
const itemsContainer=document.getElementById('items-container');
const previewSection=document.getElementById('preview-section');
const formSection=document.getElementById('form-section');
const previewDiv=document.getElementById('invoice-preview');
const editBtn=document.getElementById('edit-btn');
const printBtn=document.getElementById('print-btn');
const savedList=document.getElementById('saved-list');
let itemCount=0;
function createItemRow(){
  const div=document.createElement('div');
  div.className='item-row';
  div.innerHTML=`
    <div class="field-group">
      <label>Description *</label>
      <input type="text" class="desc" required>
      <span class="error" aria-live="polite"></span>
    </div>
    <div class="field-group">
      <label>Quantity *</label>
      <input type="number" class="qty" min="1" value="1" required>
      <span class="error" aria-live="polite"></span>
    </div>
    <div class="field-group">
      <label>Rate *</label>
      <input type="number" class="rate" min="0" step="0.01" value="0" required>
      <span class="error" aria-live="polite"></span>
    </div>
    <button type="button" class="remove-item">Remove</button>
  `;
  const removeBtn=div.querySelector('.remove-item');
  removeBtn.addEventListener('click',()=>{div.remove();});
  itemsContainer.appendChild(div);
  itemCount++;
}
addItemBtn.addEventListener('click',e=>{e.preventDefault();createItemRow();});
// initialize with one item
createItemRow();
function validateForm(){
  let valid=true;
  // simple required validation
  form.querySelectorAll('input[required]').forEach(inp=>{
    const errorSpan=inp.parentElement.querySelector('.error');
    if(!inp.value.trim()){
      errorSpan.textContent='Required';
      valid=false;
    } else {
      errorSpan.textContent='';
    }
  });
  // validate each item row
  itemsContainer.querySelectorAll('.item-row').forEach(row=>{
    const desc=row.querySelector('.desc');
    const qty=row.querySelector('.qty');
    const rate=row.querySelector('.rate');
    if(!desc.value.trim()){
      row.querySelector('.desc').parentElement.querySelector('.error').textContent='Required';
      valid=false;
    }
    if(qty.value<=0){
      row.querySelector('.qty').parentElement.querySelector('.error').textContent='Must be >0';
      valid=false;
    }
    if(rate.value<0){
      row.querySelector('.rate').parentElement.querySelector('.error').textContent='Cannot be negative';
      valid=false;
    }
  });
  return valid;
}
function generateInvoice(data){
  const {clientName,clientEmail,invoiceDate,taxRate,items}=data;
  const subtotal=items.reduce((sum,i)=>sum+i.qty*i.rate,0);
  const tax=subtotal* (taxRate/100);
  const total=subtotal+tax;
  const html=`
    <div class="invoice-header">
      <div><strong>Bill To:</strong><br>${clientName}<br>${clientEmail}</div>
      <div><strong>Date:</strong> ${invoiceDate}</div>
    </div>
    <div class="invoice-items">
      <table>
        <thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
        <tbody>
          ${items.map(i=>`<tr><td>${i.desc}</td><td>${i.qty}</td><td>${i.rate.toFixed(2)}</td><td>${(i.qty*i.rate).toFixed(2)}</td></tr>`).join('')}
        </tbody>
        <tfoot>
          <tr><td colspan="3" style="text-align:right;">Subtotal</td><td>${subtotal.toFixed(2)}</td></tr>
          <tr><td colspan="3" style="text-align:right;">Tax (${taxRate}%)</td><td>${tax.toFixed(2)}</td></tr>
          <tr><td colspan="3" style="text-align:right;font-weight:bold;">Total</td><td>${total.toFixed(2)}</td></tr>
        </tfoot>
      </table>
    </div>
  `;
  return html;
}
function collectFormData(){
  const clientName=document.getElementById('client-name').value.trim();
  const clientEmail=document.getElementById('client-email').value.trim();
  const invoiceDate=document.getElementById('invoice-date').value;
  const taxRate=parseFloat(document.getElementById('tax-rate').value)||0;
  const items=[];
  itemsContainer.querySelectorAll('.item-row').forEach(row=>{
    const desc=row.querySelector('.desc').value.trim();
    const qty=parseInt(row.querySelector('.qty').value,10);
    const rate=parseFloat(row.querySelector('.rate').value);
    items.push({desc,qty,rate});
  });
  return {clientName,clientEmail,invoiceDate,taxRate,items};
}
form.addEventListener('submit',e=>{
  e.preventDefault();
  if(!validateForm())return;
  const data=collectFormData();
  const html=generateInvoice(data);
  previewDiv.innerHTML=html;
  formSection.classList.add('hidden');
  previewSection.classList.remove('hidden');
  saveInvoice(data,html);
  renderSaved();
});
editBtn.addEventListener('click',()=>{
  previewSection.classList.add('hidden');
  formSection.classList.remove('hidden');
});
printBtn.addEventListener('click',()=>{window.print();});
function saveInvoice(data,html){
  const invoices=JSON.parse(localStorage.getItem('invoices')||'[]');
  invoices.push({id:Date.now(),data,html});
  localStorage.setItem('invoices',JSON.stringify(invoices));
}
function renderSaved(){
  const invoices=JSON.parse(localStorage.getItem('invoices')||'[]');
  savedList.innerHTML='';
  if(invoices.length===0){
    savedList.innerHTML='<li>No saved invoices.</li>';
    return;
  }
  invoices.forEach(inv=>{
    const li=document.createElement('li');
    li.innerHTML=`<button class="load-inv" data-id="${inv.id}">Load</button> Invoice #${inv.id}`;
    savedList.appendChild(li);
  });
  savedList.querySelectorAll('.load-inv').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id=btn.getAttribute('data-id');
      const inv=JSON.parse(localStorage.getItem('invoices')||'[]').find(i=>i.id==id);
      if(inv){
        previewDiv.innerHTML=inv.html;
        formSection.classList.add('hidden');
        previewSection.classList.remove('hidden');
      }
    });
  });
}
// initial render of saved invoices
renderSaved();
});