window.onload = () => {
  const fases = [
    { id: 'link-reconhecimento', storageKey: 'fase_reconhecimento_completada' },
    { id: 'link-decomposicao', storageKey: 'fase_decomposicao_completada' },
    { id: 'link-abstracao', storageKey: 'fase_abstracao_completada' },
    { id: 'link-algoritmo', storageKey: 'fase_algoritmo_completada' }
  ];

  fases.forEach(fase => {
    const link = document.getElementById(fase.id);
    if (link && (sessionStorage.getItem(fase.storageKey) === 'true')) {
      link.innerHTML += ' <span style="color: gold; font-weight: bold;">(Completado)</span>';
    }
  });
};

(function(){
  const card = document.getElementById('missionFloat');
  const btnClose = document.getElementById('missionClose');
  const btnOk = document.getElementById('missionOk');
  const btnToggle = document.getElementById('missionToggle');
  const KEY = 'mission_float_visto';

  function openCard(){
    card.classList.add('is-open');
    btnToggle.setAttribute('aria-expanded','true');
  }
  function closeCard(){
    card.classList.remove('is-open');
    btnToggle.setAttribute('aria-expanded','false');
  }

  // Primeira visita: mostra
  if(!localStorage.getItem(KEY)){
    setTimeout(openCard, 200);
  }

  btnClose?.addEventListener('click', ()=>{ 
    localStorage.setItem(KEY,'1'); 
    closeCard(); 
  });
  btnOk?.addEventListener('click', ()=>{ 
    localStorage.setItem(KEY,'1'); 
    closeCard(); 
  });
  btnToggle?.addEventListener('click', ()=> openCard());

  // Fecha com ESC
  document.addEventListener('keydown', (e)=>{
    if(e.key==='Escape' && card.classList.contains('is-open')){
      localStorage.setItem(KEY,'1');
      closeCard();
    }
  });
})();


