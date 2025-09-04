const grid = document.querySelector('.grid');
const spanPlayer = document.querySelector('.player');


const groups = [
  { group: 'astronauta',  variants: ['astronauta_a.png',  'astronauta_b.png'] },
  { group: 'planeta',     variants: ['planeta_a.png',     'planeta_b.png'] },
  { group: 'foguete',   variants: ['foguete_a.png',   'foguete_b.png'] },
  { group: 'sol',variants: ['sol_a.png','sol_b.png'] },
  { group: 'nave',  variants: ['nave_a.png',  'nave_b.png'] },
  { group: 'asteroide',  variants: ['asteroide_a.png',  'asteroide_b.png'] },
  { group: 'jupter', variants: ['jupter_a.png', 'jupter_b.png'] },
  { group: 'satelite',     variants: ['satelite_a.png',     'satelite_b.png'] },
  { group: 'galaxia',   variants: ['galaxia_a.png',   'galaxia_b.png'] },
  { group: 'meteoro',   variants: ['meteoro_a.png',   'meteoro_b.png'] },
  
];


const buildDeck = () => {
  const deck = [];
  groups.forEach(({ group, variants }) => {
    variants.forEach((fileName, idx) => {
      deck.push({
        id: `${group}-${idx}`,       
        group,
        img: fileName,             
      });
    });
  });
  return deck;
};

// Embaralha
const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);


const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

let firstCard = '';
let secondCard = '';
let CURRENT_DECK = []; 

const timer = document.querySelector('.timer'); 

const checkEndGame = () => {
  const disabledCards = document.querySelectorAll('.disabled-card');

  if (disabledCards.length === CURRENT_DECK.length) {
    sessionStorage.setItem('fase_reconhecimento_completada', 'true');
    clearInterval(this.loop);
    alert(`Parabéns, Você completou`);
  }
};


const isSimilarPair = (cardA, cardB) => {
  const groupA = cardA.getAttribute('data-group');
  const groupB = cardB.getAttribute('data-group');
  const idA = cardA.getAttribute('data-id');
  const idB = cardB.getAttribute('data-id');

  return groupA === groupB && idA !== idB;
};

const checkCards = () => {
  if (isSimilarPair(firstCard, secondCard)) {
    firstCard.firstChild.classList.add('disabled-card');
    secondCard.firstChild.classList.add('disabled-card');

    firstCard = '';
    secondCard = '';

    checkEndGame();
  } else {
    setTimeout(() => {
      firstCard.classList.remove('reveal-card');
      secondCard.classList.remove('reveal-card');

      firstCard = '';
      secondCard = '';
    }, 500);
  }
};

const revealCard = ({ target }) => {
  const card = target.parentNode;

  // evita clicar em carta já revelada ou já desabilitada
  if (card.className.includes('reveal-card') || target.className.includes('disabled-card')) {
    return;
  }

  if (firstCard === '') {
    card.classList.add('reveal-card');
    firstCard = card;
  } else if (secondCard === '') {
    card.classList.add('reveal-card');
    secondCard = card;
    checkCards();
  }
};


const createCard = ({ id, group, img }) => {
  const card = createElement('div', 'card');
  const front = createElement('div', 'face front');
  const back = createElement('div', 'face back');

  front.style.backgroundImage = `url('../images/reconhecimento/${img}')`;

  card.appendChild(front);
  card.appendChild(back);

  card.addEventListener('click', revealCard);

  
  card.setAttribute('data-group', group);
  card.setAttribute('data-id', id);

  return card;
};

const loadGame = () => {
 
  CURRENT_DECK = buildDeck();

  const shuffled = shuffle(CURRENT_DECK.slice());

  shuffled.forEach((cardData) => {
    const card = createCard(cardData);
    grid.appendChild(card);
  });
};

const startTimer = () => {
  if (!timer) return;
  this.loop = setInterval(() => {
    const currentTime = +timer.innerHTML || 0;
    timer.innerHTML = currentTime + 1;
  }, 1000);
};

window.onload = () => {
  spanPlayer.innerHTML = localStorage.getItem('player');
  startTimer();
  loadGame();
};
