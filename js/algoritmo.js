const tabuleiro = document.getElementById("tabuleiro");
const comandosEl = document.getElementById("comandos");
const msgEl = document.getElementById("mensagem");

const tamanho = 10;
const densidadeObstaculos = 0.25;
let comandos = [];
let posNave = { x: 0, y: 0 };
const objetivo = { x: tamanho - 1, y: tamanho - 1 };

let obstaculos = new Set();

let caminho = [{ ...posNave }];
let execIndex = 0;
let animTimer = null;

let dirSelecionada = null;

function setMsg(texto = "", tipo = "") {
  msgEl.textContent = texto;
  msgEl.classList.remove("err", "ok");
  if (tipo) msgEl.classList.add(tipo);
}

function celKey(x, y) { return `${x}-${y}`; }
function vizinhos(x, y) {
  return [
    [x, y - 1], [x, y + 1], [x - 1, y], [x + 1, y]
  ].filter(([cx, cy]) => cx >= 0 && cy >= 0 && cx < tamanho && cy < tamanho);
}

function existeCaminhoLivre() {
  const fila = [[0, 0]];
  const vis = new Set([celKey(0, 0)]);

  while (fila.length) {
    const [x, y] = fila.shift();
    if (x === objetivo.x && y === objetivo.y) return true;
    for (const [nx, ny] of vizinhos(x, y)) {
      const k = celKey(nx, ny);
      if (!vis.has(k) && !obstaculos.has(k)) {
        vis.add(k);
        fila.push([nx, ny]);
      }
    }
  }
  return false;
}

function gerarObstaculosAleatorios() {
  const totalCells = tamanho * tamanho;
  const alvoQtd = Math.floor(totalCells * densidadeObstaculos);

  const blacklist = new Set([
    celKey(0, 0),
    celKey(objetivo.x, objetivo.y),
    celKey(0, 1), celKey(1, 0) // alivia saída
  ]);

  let tentativas = 0;
  while (tentativas < 200) {
    tentativas++;
    const set = new Set();

    while (set.size < alvoQtd) {
      const x = Math.floor(Math.random() * tamanho);
      const y = Math.floor(Math.random() * tamanho);
      const k = celKey(x, y);
      if (!blacklist.has(k)) set.add(k);
    }

    obstaculos = set;
    if (existeCaminhoLivre()) return;
  }

  obstaculos.clear();
}

// ===== Tabuleiro =====
function criarTabuleiro() {
  tabuleiro.style.display = "grid";
  tabuleiro.style.gridTemplateColumns = `repeat(${tamanho}, 56px)`;
  tabuleiro.innerHTML = "";

  for (let y = 0; y < tamanho; y++) {
    for (let x = 0; x < tamanho; x++) {
      const cel = document.createElement("div");
      cel.className = "celula";
      cel.id = `cel-${x}-${y}`;

      if (x === objetivo.x && y === objetivo.y) {
        cel.classList.add("objetivo");
        cel.textContent = "🌍";
      }
      if (obstaculos.has(celKey(x, y))) {
        cel.classList.add("obstaculo");
        cel.textContent = "🪨";
      }

      tabuleiro.appendChild(cel);
    }
  }
  desenharTrilha();
  desenharNave(posNave.x, posNave.y);
}

function desenharNave(x, y) {
  const cel = document.getElementById(`cel-${x}-${y}`);
  if (!cel) return;
  const img = document.createElement("img");
  img.src = "../images/algoritmos/nave.png"; // imagem da nave
  img.alt = "Nave espacial";
  img.className = "nave-img";
  cel.appendChild(img);
}

function desenharTrilha() {
  document.querySelectorAll(".celula.trilha").forEach(c => c.classList.remove("trilha"));
  caminho.forEach(p => {
    const cel = document.getElementById(`cel-${p.x}-${p.y}`);
    cel?.classList.add("trilha");
  });
}


function selecionarDirecao(dir) {
  dirSelecionada = dir;

  document.querySelectorAll(".btn-dir").forEach(btn => {
    if (btn.dataset.dir === dir) btn.classList.add("ativo");
    else btn.classList.remove("ativo");
  });

  setMsg(`Direção selecionada: ${dir.toUpperCase()}. Defina a Qtd e clique em "Adicionar".`, "");
}


function getQtdPassos() {
  const input = document.getElementById("qtdPassos");
  if (!input) return 1;
  const n = parseInt(input.value, 10);
  if (isNaN(n) || n < 1) return 1;
  return n;
}


function adicionarSelecionado() {
  if (!dirSelecionada) {
    setMsg("Selecione uma direção antes de adicionar.", "err");
    return;
  }
  const n = getQtdPassos();
  for (let i = 0; i < n; i++) comandos.push(dirSelecionada);
  atualizarComandos();
  setMsg(`Adicionados ${n} passos para "${dirSelecionada.toUpperCase()}"`, "ok");
}

function atualizarComandos() {
  if (!comandos.length) {
    comandosEl.textContent = "Comandos: —";
    return;
  }
  
  const compact = [];
  let i = 0;
  while (i < comandos.length) {
    const dir = comandos[i];
    let count = 1;
    while (i + count < comandos.length && comandos[i + count] === dir) count++;
    compact.push(count > 1 ? `${dir}×${count}` : dir);
    i += count;
  }
  comandosEl.textContent = "Comandos: " + compact.join(" → ");
}

function limparComandos() {
  comandos = [];
  atualizarComandos();
  resetar(true);
  dirSelecionada = null;
  document.querySelectorAll(".btn-dir").forEach(btn => btn.classList.remove("ativo"));
}

function resetar(limpaMsg = false) {
  pararAnim();
  posNave = { x: 0, y: 0 };
  caminho = [{ ...posNave }];
  execIndex = 0;
  if (limpaMsg) setMsg("");
  criarTabuleiro(); 
}


function novoMapa() {
  pararAnim();
  comandos = [];
  atualizarComandos();
  gerarObstaculosAleatorios();
  resetar(true);
  setMsg("Novo mapa gerado! Comandos limpos.", "ok");

  dirSelecionada = null;
  document.querySelectorAll(".btn-dir").forEach(btn => btn.classList.remove("ativo"));
}

function executarComandos() {
  if (!comandos.length) { setMsg("Adicione comandos para executar.", "err"); return; }

  pararAnim();
  setMsg("");
  posNave = { x: 0, y: 0 };
  caminho = [{ ...posNave }];
  execIndex = 0;

  animarProximoPasso();
}

function animarProximoPasso() {
 
  if (execIndex >= comandos.length) {
    const ultima = caminho[caminho.length - 1];
    if (ultima.x === objetivo.x && ultima.y === objetivo.y) {
      setMsg("Parabéns! Você alcançou o destino 🎯", "ok");
      sessionStorage.setItem("fase_algoritmo_completada", "true");
    } else {
      setMsg("A nave não chegou ao destino. Ajuste os comandos e tente novamente.", "err");
    }
    return;
  }

  const cmd = comandos[execIndex];
  const prox = { x: posNave.x, y: posNave.y };

  switch (cmd) {
    case "cima":     prox.y = Math.max(0, prox.y - 1); break;
    case "baixo":    prox.y = Math.min(tamanho - 1, prox.y + 1); break;
    case "esquerda": prox.x = Math.max(0, prox.x - 1); break;
    case "direita":  prox.x = Math.min(tamanho - 1, prox.x + 1); break;
  }

  if (obstaculos.has(celKey(prox.x, prox.y))) {
    setMsg("Você colidiu! Jogo reiniciado.", "err");

    comandos = [];
    atualizarComandos();

    pararAnim();
    posNave = { x: 0, y: 0 };
    caminho = [{ ...posNave }];
    execIndex = 0;

    if (typeof dirSelecionada !== "undefined") {
      dirSelecionada = null;
      document.querySelectorAll(".btn-dir")?.forEach(btn => btn.classList.remove("ativo"));
    }

    criarTabuleiro();
    return;
  }

  posNave = prox;
  caminho.push({ ...posNave });
  criarTabuleiro();

  execIndex++;
  animTimer = setTimeout(animarProximoPasso, 500);
}


function pararAnim() {
  if (animTimer) {
    clearTimeout(animTimer);
    animTimer = null;
  }
}

// ===== Inicialização =====
gerarObstaculosAleatorios();
criarTabuleiro();
atualizarComandos();

window.selecionarDirecao = selecionarDirecao;
window.adicionarSelecionado = adicionarSelecionado;
window.executarComandos = executarComandos;
window.limparComandos = limparComandos;
window.novoMapa = novoMapa;
