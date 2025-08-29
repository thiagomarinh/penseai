const cena = document.getElementById("scene");
const feedback = document.getElementById("feedback");

const itens = [
  // Itens essenciais
  { nome: "Painel de controle", essencial: true },
  { nome: "Turbina", essencial: true },
  { nome: "Parafusos", essencial: true },
  { nome: "Radar", essencial: true },
  { nome: "Circuito Elétrico", essencial: true },
  { nome: "Caixa de Ferramentas", essencial: true },
  { nome: "Combustivel", essencial: true },
  { nome: "Fuselagem", essencial: true},
  

  //Não essenciais 
  { nome: "Alien", essencial: false },
  { nome: "Buraco Negro", essencial: false },
  { nome: "Gelo", essencial: false },
  { nome: "Meteoro", essencial: false },
  { nome: "Areia", essencial: false },
  { nome: "Cratera", essencial: false },
  { nome: "Pedra", essencial: false }
];

let acertos = 0;
let bloqueado = false; 
const TOTAL_CERTOS = itens.filter(i => i.essencial).length;

function embaralhar(array) {
  return array.sort(() => Math.random() - 0.5);
}

function criarCena() {
  cena.innerHTML = "";
  feedback.textContent = "";
  acertos = 0;
  bloqueado = false;

  const embaralhados = embaralhar([...itens]);

  embaralhados.forEach(item => {
    const div = document.createElement("div");
    div.className = "item";

    const img = document.createElement("img");
    img.src = `../images/abstracao/${item.nome}.png`;
    img.alt = item.nome;
    img.dataset.essencial = item.essencial;
    img.addEventListener("click", () => avaliar(item, img));

    const label = document.createElement("p");
    label.textContent = item.nome;

    div.appendChild(img);
    div.appendChild(label);
    cena.appendChild(div);
  });
}

function mostrarVitoria() {
  feedback.innerHTML = `
    Parabéns, você reconstruiu sua nave!
    <button id="btnMenu" class="btn-menu">Ir ao menu</button>
  `;
  
  document.getElementById("btnMenu").onclick = () => {
    sessionStorage.setItem("fase_abstracao_completada", "true");
    window.location.href = "../index.html";
  };
}

function avaliar(item, el) {
  if (bloqueado || el.classList.contains("clicado")) return;
  el.classList.add("clicado");

  if (item.essencial) {
    el.style.border = "4px solid #00c853";
    acertos++;

    if (acertos === TOTAL_CERTOS) {
      mostrarVitoria();
    }
  } else {
 
    el.style.border = "4px solid #ff5252"; 
    feedback.textContent = "Você errou! Os itens foram embaralhados. Tente novamente.";
    bloqueado = true;

    setTimeout(() => {
      criarCena(); 
    }, 800);
  }
}

criarCena();
