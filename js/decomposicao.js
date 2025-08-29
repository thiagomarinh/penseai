
const GRID = 4;
const IMAGE_SRC = "../images/puzzle/quebra.jpg";

const container = document.getElementById("puzzle");
const shuffleBtn = document.getElementById("shuffleBtn");
const statusEl = document.getElementById("status");

let dragged = null;

// Inicializa tabuleiro
init();
function init(){
  container.innerHTML = "";
  for (let r = 0; r < GRID; r++){
    for (let c = 0; c < GRID; c++){
      const index = r * GRID + c; // 0..15
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.draggable = true;
      tile.dataset.correct = String(index); 

     
      const posX = (c / (GRID - 1)) * 100;
      const posY = (r / (GRID - 1)) * 100;
      tile.style.backgroundImage = `url("${IMAGE_SRC}")`;
      tile.style.backgroundPosition = `${posX}% ${posY}%`;

      
      tile.addEventListener("dragstart", onDragStart);
      tile.addEventListener("dragend", onDragEnd);
      tile.addEventListener("dragover", onDragOver);
      tile.addEventListener("dragleave", onDragLeave);
      tile.addEventListener("drop", onDrop);

      container.appendChild(tile);
    }
  }
  shuffle(true);
  shuffleBtn?.addEventListener("click", () => shuffle(true));
}


function onDragStart(e){
  dragged = e.currentTarget;
  dragged.classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", dragged.dataset.correct); // Firefox
}
function onDragEnd(e){
  e.currentTarget.classList.remove("dragging");
  container.querySelectorAll(".over").forEach(el => el.classList.remove("over"));
  dragged = null;
}
function onDragOver(e){
  e.preventDefault();
  const t = e.currentTarget;
  if (t !== dragged) t.classList.add("over");
}
function onDragLeave(e){
  e.currentTarget.classList.remove("over");
}
function onDrop(e){
  e.preventDefault();
  const target = e.currentTarget;
  target.classList.remove("over");
  if (!dragged || dragged === target) return;

  swapNodes(dragged, target);

  if (verificarOrdem()) {
    statusEl.textContent = "✅ Completou!";
    sessionStorage.setItem("fase_decomposicao_completada", "true");
  } else {
    statusEl.textContent = "";
  }
}


function swapNodes(a, b){
  const parent = a.parentNode;
  const aNext = a.nextSibling === b ? a : a.nextSibling;
  parent.insertBefore(a, b);
  parent.insertBefore(b, aNext);
}
function verificarOrdem(){
 
  return Array.from(container.children).every((el, idx) => Number(el.dataset.correct) === idx);
}
function shuffle(resetMsg=false){
  const tiles = Array.from(container.children);
  for (let i = tiles.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    container.insertBefore(tiles[j], tiles[i]);
    tiles.splice(i, 0, tiles.splice(j,1)[0]);
  }
  if (verificarOrdem()) shuffle(false); 
  if (resetMsg) statusEl.textContent = "";
}
