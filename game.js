// =============================================
//  GAME STATE
// =============================================
let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;
let mode = 'pvp'; // 'pvp' | 'ai'
let scores = { X: 0, O: 0, draw: 0 };
let aiThinking = false;

const WIN_PATTERNS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],             // diagonals
];

// Win line coords for SVG (col, row) in 3x3 grid space
const WIN_LINE_COORDS = {
  '0,1,2': { x1: 0.5, y1: 0.5, x2: 2.5, y2: 0.5 },
  '3,4,5': { x1: 0.5, y1: 1.5, x2: 2.5, y2: 1.5 },
  '6,7,8': { x1: 0.5, y1: 2.5, x2: 2.5, y2: 2.5 },
  '0,3,6': { x1: 0.5, y1: 0.5, x2: 0.5, y2: 2.5 },
  '1,4,7': { x1: 1.5, y1: 0.5, x2: 1.5, y2: 2.5 },
  '2,5,8': { x1: 2.5, y1: 0.5, x2: 2.5, y2: 2.5 },
  '0,4,8': { x1: 0.5, y1: 0.5, x2: 2.5, y2: 2.5 },
  '2,4,6': { x1: 2.5, y1: 0.5, x2: 0.5, y2: 2.5 },
};

// =============================================
//  INIT SVG GRADIENT
// =============================================
function initSVG() {
  const svg = document.getElementById('win-line-svg');
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  grad.setAttribute('id', 'win-gradient');
  grad.setAttribute('gradientUnits', 'userSpaceOnUse');

  const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('stop-color', '#a78bfa');

  const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop2.setAttribute('offset', '100%');
  stop2.setAttribute('stop-color', '#f472b6');

  grad.appendChild(stop1);
  grad.appendChild(stop2);
  defs.appendChild(grad);
  svg.appendChild(defs);
}

// =============================================
//  MODE SELECTION
// =============================================
function setMode(newMode) {
  mode = newMode;
  document.getElementById('btn-pvp').classList.toggle('active', mode === 'pvp');
  document.getElementById('btn-ai').classList.toggle('active', mode === 'ai');

  const labelO = document.getElementById('label-o');
  labelO.textContent = mode === 'ai' ? 'Máy (AI)' : 'Người Chơi 2';

  restartGame();
}

// =============================================
//  CLICK HANDLER
// =============================================
function handleClick(index) {
  if (gameOver || board[index] || aiThinking) return;
  placeMove(index, currentPlayer);
}

function placeMove(index, player) {
  board[index] = player;
  const cell = document.getElementById(`cell-${index}`);
  cell.setAttribute('data-mark', player);
  cell.textContent = player;
  cell.classList.add('pop-in');
  cell.disabled = true;

  const result = checkWinner();
  if (result) {
    handleGameEnd(result);
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateStatus();

  if (mode === 'ai' && currentPlayer === 'O' && !gameOver) {
    triggerAI();
  }
}

// =============================================
//  AI (MINIMAX)
// =============================================
function triggerAI() {
  aiThinking = true;
  setAllCellsDisabled(true);
  showAIThinking();

  setTimeout(() => {
    const bestMove = getBestMove();
    aiThinking = false;
    setAllCellsDisabled(false);
    placeMove(bestMove, 'O');
  }, 600);
}

function showAIThinking() {
  const turnText = document.getElementById('turn-text');
  turnText.innerHTML = 'Máy đang suy nghĩ <span class="thinking-dots"><span></span><span></span><span></span></span>';
}

function getBestMove() {
  // Try to win
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = 'O';
      if (checkWinnerForPlayer('O')) { board[i] = null; return i; }
      board[i] = null;
    }
  }
  // Block X from winning
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = 'X';
      if (checkWinnerForPlayer('X')) { board[i] = null; return i; }
      board[i] = null;
    }
  }
  // Minimax for best move
  let bestVal = -Infinity;
  let bestMove = -1;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = 'O';
      const val = minimax(board, 0, false);
      board[i] = null;
      if (val > bestVal) { bestVal = val; bestMove = i; }
    }
  }
  return bestMove;
}

function minimax(b, depth, isMaximizing) {
  if (checkWinnerForPlayer('O')) return 10 - depth;
  if (checkWinnerForPlayer('X')) return depth - 10;
  if (b.every(c => c)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = 'O';
        best = Math.max(best, minimax(b, depth + 1, false));
        b[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = 'X';
        best = Math.min(best, minimax(b, depth + 1, true));
        b[i] = null;
      }
    }
    return best;
  }
}

function checkWinnerForPlayer(player) {
  return WIN_PATTERNS.some(([a, b, c]) =>
    board[a] === player && board[b] === player && board[c] === player
  );
}

// =============================================
//  GAME LOGIC
// =============================================
function checkWinner() {
  for (const pattern of WIN_PATTERNS) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], pattern };
    }
  }
  if (board.every(c => c)) return { winner: null, pattern: null }; // draw
  return null;
}

function handleGameEnd(result) {
  gameOver = true;
  setAllCellsDisabled(true);

  if (result.winner) {
    scores[result.winner]++;
    updateScoreDisplay();
    highlightWinningCells(result.pattern);
    drawWinLine(result.pattern);

    const name = getPlayerName(result.winner);
    setTimeout(() => showModal(
      result.winner === 'X' ? '🏆' : (mode === 'ai' ? '🤖' : '🏆'),
      `${name} Thắng!`,
      result.winner === 'X' ? 'Xuất sắc! Tiếp tục phát huy!' : (mode === 'ai' ? 'Máy thắng lần này rồi!' : 'Chúc mừng chiến thắng!')
    ), 700);

    const banner = document.getElementById('status-banner');
    const turnText = document.getElementById('turn-text');
    const turnSymbol = document.getElementById('turn-symbol');
    turnSymbol.textContent = result.winner;
    turnSymbol.className = `turn-symbol is-${result.winner.toLowerCase()}`;
    turnText.textContent = `${name} Thắng! 🎉`;
  } else {
    scores.draw++;
    updateScoreDisplay();
    setTimeout(() => showModal('🤝', 'Hòa!', 'Cân tài cân sức! Chơi lại nào!'), 400);

    const turnText = document.getElementById('turn-text');
    const turnSymbol = document.getElementById('turn-symbol');
    turnSymbol.textContent = '✦';
    turnSymbol.className = 'turn-symbol';
    turnSymbol.style.color = '#64748b';
    turnText.textContent = 'Ván này hòa!';
  }
}

function highlightWinningCells(pattern) {
  pattern.forEach(idx => {
    document.getElementById(`cell-${idx}`).classList.add('winning');
  });
}

function drawWinLine(pattern) {
  const key = pattern.join(',');
  const coords = WIN_LINE_COORDS[key];
  if (!coords) return;

  const svg = document.getElementById('win-line-svg');
  const line = document.getElementById('win-line');

  line.setAttribute('x1', coords.x1);
  line.setAttribute('y1', coords.y1);
  line.setAttribute('x2', coords.x2);
  line.setAttribute('y2', coords.y2);

  const len = Math.hypot(coords.x2 - coords.x1, coords.y2 - coords.y1);
  line.style.strokeDasharray = len;
  line.style.strokeDashoffset = len;

  svg.classList.add('show-line');

  // Animate dash
  requestAnimationFrame(() => {
    line.style.transition = 'stroke-dashoffset 0.45s ease-out, opacity 0.2s';
    line.style.opacity = '1';
    line.style.strokeDashoffset = '0';
  });
}

function setAllCellsDisabled(disabled) {
  for (let i = 0; i < 9; i++) {
    const cell = document.getElementById(`cell-${i}`);
    if (disabled) {
      cell.style.pointerEvents = 'none';
    } else {
      cell.style.pointerEvents = '';
    }
  }
}

// =============================================
//  STATUS UPDATE
// =============================================
function updateStatus() {
  const turnSymbol = document.getElementById('turn-symbol');
  const turnText = document.getElementById('turn-text');

  turnSymbol.textContent = currentPlayer;
  turnSymbol.className = `turn-symbol is-${currentPlayer.toLowerCase()}`;
  turnSymbol.style.color = '';

  const name = getPlayerName(currentPlayer);
  turnText.textContent = `Lượt của ${name}`;

  // Highlight active score card
  document.querySelector('.score-x').classList.toggle('active-turn', currentPlayer === 'X');
  document.querySelector('.score-o').classList.toggle('active-turn', currentPlayer === 'O');
}

function getPlayerName(player) {
  if (player === 'X') return 'Người Chơi 1';
  if (player === 'O') return mode === 'ai' ? 'Máy (AI)' : 'Người Chơi 2';
  return '';
}

// =============================================
//  SCORE DISPLAY
// =============================================
function updateScoreDisplay() {
  animateScore('score-x', scores.X);
  animateScore('score-o', scores.O);
  animateScore('score-draw', scores.draw);
}

function animateScore(id, val) {
  const el = document.getElementById(id);
  el.style.transform = 'scale(1.4)';
  el.textContent = val;
  setTimeout(() => { el.style.transition = 'transform 0.3s'; el.style.transform = 'scale(1)'; }, 50);
}

// =============================================
//  MODAL
// =============================================
function showModal(emoji, title, sub) {
  document.getElementById('modal-emoji').textContent = emoji;
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-sub').textContent = sub;
  document.getElementById('modal-overlay').classList.add('show');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('show');
}

function closeModalAndRestart() {
  closeModal();
  setTimeout(restartGame, 200);
}

// =============================================
//  RESTART / RESET
// =============================================
function restartGame() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;
  aiThinking = false;

  for (let i = 0; i < 9; i++) {
    const cell = document.getElementById(`cell-${i}`);
    cell.removeAttribute('data-mark');
    cell.textContent = '';
    cell.disabled = false;
    cell.style.pointerEvents = '';
    cell.classList.remove('winning', 'pop-in');
  }

  // Reset win line
  const svg = document.getElementById('win-line-svg');
  svg.classList.remove('show-line');
  const line = document.getElementById('win-line');
  line.style.transition = 'none';
  line.style.opacity = '0';
  line.style.strokeDashoffset = '0';

  // Reset score card highlights
  document.querySelector('.score-x').classList.add('active-turn');
  document.querySelector('.score-o').classList.remove('active-turn');

  updateStatus();
}

function resetScore() {
  scores = { X: 0, O: 0, draw: 0 };
  document.getElementById('score-x').textContent = '0';
  document.getElementById('score-o').textContent = '0';
  document.getElementById('score-draw').textContent = '0';
  restartGame();
}

// =============================================
//  KEYBOARD SUPPORT
// =============================================
document.addEventListener('keydown', (e) => {
  if (e.key >= '1' && e.key <= '9') {
    const idx = parseInt(e.key) - 1;
    handleClick(idx);
  }
  if (e.key === 'r' || e.key === 'R') restartGame();
  if (e.key === 'Escape') closeModal();
});

// =============================================
//  STARTUP
// =============================================
initSVG();
updateStatus();
document.querySelector('.score-x').classList.add('active-turn');
