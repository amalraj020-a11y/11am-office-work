(()=>{
  const form=document.getElementById('form');
  const titleInput=document.getElementById('title');
  const assigneeInput=document.getElementById('assignee');
  const recurrenceSelect=document.getElementById('recurrence');
  const cancelBtn=document.getElementById('cancel-edit');
  const activeList=document.getElementById('active-list');
  const completedList=document.getElementById('completed');
  const exportBtn=document.getElementById('export');
  const importBtn=document.getElementById('import');
  const importFile=document.getElementById('import-file');

  let chores=[]; // {id,title,assignee,recurrence,completedAt}
  let editId=null;

  const saveToStorage=()=>localStorage.setItem('chores',JSON.stringify(chores));
  const loadFromStorage=()=>{const data=localStorage.getItem('chores');if(data){chores=JSON.parse(data);}render();};

  const render=()=>{
    activeList.innerHTML='';
    completedList.innerHTML='';
    chores.forEach(ch=>{
      const li=document.createElement('li');
      li.textContent=`${ch.title} ( ${ch.assignee} )`;
      const actions=document.createElement('span');
      actions.className='actions';
      if(!ch.completedAt){
        const edit=document.createElement('button');
        edit.textContent='Edit';
        edit.onclick=()=>startEdit(ch.id);
        const del=document.createElement('button');
        del.textContent='Delete';
        del.onclick=()=>deleteChore(ch.id);
        const complete=document.createElement('button');
        complete.textContent='Done';
        complete.onclick=()=>completeChore(ch.id);
        actions.append(edit,del,complete);
        li.appendChild(actions);
        activeList.appendChild(li);
      } else {
        li.textContent+=` – completed ${new Date(ch.completedAt).toLocaleDateString()}`;
        completedList.appendChild(li);
      }
    });
  };

  const startEdit=id=>{
    const ch=chores.find(c=>c.id===id);
    if(!ch) return;
    editId=id;
    titleInput.value=ch.title;
    assigneeInput.value=ch.assignee;
    recurrenceSelect.value=ch.recurrence;
    cancelBtn.classList.remove('hidden');
  };

  const deleteChore=id=>{chores=chores.filter(c=>c.id!==id);saveToStorage();render();};

  const completeChore=id=>{
    const ch=chores.find(c=>c.id===id);
    if(ch){ch.completedAt=Date.now();
      // handle recurrence
      if(ch.recurrence!=='none'){
        const newCh={...ch,id:Date.now(),completedAt:null};
        // calculate next due date (not stored, just recreate)
        chores.push(newCh);
      }
    }
    saveToStorage();render();
  };

  form.onsubmit=e=>{
    e.preventDefault();
    const title=titleInput.value.trim();
    const assignee=assigneeInput.value.trim();
    const recurrence=recurrenceSelect.value;
    if(editId!==null){
      const ch=chores.find(c=>c.id===editId);
      if(ch){ch.title=title;ch.assignee=assignee;ch.recurrence=recurrence;}
      editId=null;
    } else {
      chores.push({id:Date.now(),title,assignee,recurrence,completedAt:null});
    }
    form.reset();
    cancelBtn.classList.add('hidden');
    saveToStorage();
    render();
  };

  cancelBtn.onclick=()=>{editId=null;form.reset();cancelBtn.classList.add('hidden');};

  exportBtn.onclick=()=>{
    const data=JSON.stringify(chores,null,2);
    const blob=new Blob([data],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;a.download='chores.json';a.click();
    URL.revokeObjectURL(url);
  };

  importBtn.onclick=()=>{importFile.click();};
  importFile.onchange=e=>{
    const file=e.target.files[0];
    if(!file) return;
    const reader=new FileReader();
    reader.onload=ev=>{
      try{chores=JSON.parse(ev.target.result);saveToStorage();render();}catch(err){alert('Invalid JSON');}
    };
    reader.readAsText(file);
    importFile.value='';
  };

  loadFromStorage();
})();