(() => {
  const clientForm = document.getElementById('client-form');
  const clientNameInput = document.getElementById('client-name');
  const clientRateInput = document.getElementById('client-rate');
  const clientList = document.getElementById('client-list');
  const jobForm = document.getElementById('job-form');
  const jobClientSelect = document.getElementById('job-client');
  const jobNameInput = document.getElementById('job-name');
  const jobList = document.getElementById('job-list');
  const summaryEl = document.getElementById('summary');
  const exportBtn = document.getElementById('export-csv');

  let data = JSON.parse(localStorage.getItem('gigtime-data')) || {clients: [], jobs: []};

  function save(){localStorage.setItem('gigtime-data', JSON.stringify(data));}

  function renderClients(){
    clientList.innerHTML='';
    jobClientSelect.innerHTML='';
    data.clients.forEach((c,i)=>{
      const li=document.createElement('li');
      li.textContent=`${c.name} ($${c.rate}/hr)`;
      const del=document.createElement('button');
      del.textContent='✕';
      del.onclick=()=>{data.clients.splice(i,1);save();renderClients();renderJobs();};
      li.appendChild(del);
      clientList.appendChild(li);
      const opt=document.createElement('option');
      opt.value=i;opt.textContent=c.name;jobClientSelect.appendChild(opt);
    });
  }

  function renderJobs(){
    jobList.innerHTML='';
    data.jobs.forEach((j,i)=>{
      const li=document.createElement('li');
      const client=data.clients[j.clientIdx];
      li.textContent=`${client?client.name:'[deleted]'} – ${j.name} – ${j.hours.toFixed(2)}h ($${(j.hours*client.rate).toFixed(2)})`;
      const btn=document.createElement('button');
      btn.textContent=j.timerRunning? 'Stop' : 'Start';
      btn.onclick=()=>{toggleTimer(i);};
      const del=document.createElement('button');
      del.textContent='✕';
      del.onclick=()=>{data.jobs.splice(i,1);save();renderJobs();renderSummary();};
      li.appendChild(btn);
      li.appendChild(del);
      jobList.appendChild(li);
    });
  }

  function renderSummary(){
    const lines=[];
    const totals={};
    data.jobs.forEach(j=>{
      const client=data.clients[j.clientIdx];
      if(!client) return;
      const earn=j.hours*client.rate;
      if(!totals[client.name]) totals[client.name]={hours:0,earn:0};
      totals[client.name].hours+=j.hours;
      totals[client.name].earn+=earn;
    });
    lines.push('Earnings by Client:');
    for(const [name,info] of Object.entries(totals)){
      lines.push(`${name}: ${info.hours.toFixed(2)}h → $${info.earn.toFixed(2)}`);
    }
    summaryEl.textContent=lines.join('\n');
  }

  let timerIntervals={};
  function toggleTimer(jobIdx){
    const job=data.jobs[jobIdx];
    if(job.timerRunning){
      clearInterval(timerIntervals[jobIdx]);
      job.timerRunning=false;
    } else {
      job.startTime=Date.now();
      job.timerRunning=true;
      timerIntervals[jobIdx]=setInterval(()=>{
        const now=Date.now();
        const diff=(now-job.startTime)/3600000; // hours
        job.hours+=diff;
        job.startTime=now;
        save();
        renderJobs();
        renderSummary();
      },1000);
    }
    save();
    renderJobs();
    renderSummary();
  }

  clientForm.addEventListener('submit',e=>{
    e.preventDefault();
    const name=clientNameInput.value.trim();
    const rate=parseFloat(clientRateInput.value);
    if(name && !isNaN(rate)){
      data.clients.push({name,rate});
      save();
      clientNameInput.value='';clientRateInput.value='';
      renderClients();
    }
  });

  jobForm.addEventListener('submit',e=>{
    e.preventDefault();
    const clientIdx=parseInt(jobClientSelect.value);
    const name=jobNameInput.value.trim();
    if(!isNaN(clientIdx) && name){
      data.jobs.push({clientIdx,name,hours:0, timerRunning:false});
      save();
      jobNameInput.value='';
      renderJobs();
      renderSummary();
    }
  });

  exportBtn.addEventListener('click',()=>{
    const rows=[['Date','Client','Job','Hours','Rate','Earnings']];
    data.jobs.forEach(j=>{
      const client=data.clients[j.clientIdx];
      if(!client) return;
      const date=new Date().toLocaleDateString();
      const earn=(j.hours*client.rate).toFixed(2);
      rows.push([date,client.name,j.name,j.hours.toFixed(2),client.rate.toFixed(2),earn]);
    });
    const csv=rows.map(r=>r.join(',')).join('\n');
    const blob=new Blob([csv],{type:'text/csv'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download='gigtime.csv';a.click();URL.revokeObjectURL(url);
  });

  // Initial render
  renderClients();
  renderJobs();
  renderSummary();
})();