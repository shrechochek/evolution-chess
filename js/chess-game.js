class ChessGame {
    constructor() {
        this.boardElement = document.getElementById('chessboard');
        this.currentPlayerDisplay = document.getElementById('current-player');
        this.selectedPieceDisplay = document.getElementById('selected-piece');
        this.evolutionPanel = document.getElementById('evolution-panel');
        this.evolutionOptions = document.getElementById('evolution-options');
        this.gameOverPanel = document.getElementById('game-over');
        this.gameResult = document.getElementById('game-result');
        this.restartButton = document.getElementById('restart-button');
        this.toggleModsBtn = document.getElementById('toggle-mods-btn');
        this.modsPanel = document.getElementById('mods-panel');
        this.modFileInput = document.getElementById('mod-file-input');
        this.loadModBtn = document.getElementById('load-mod-btn');
        this.applyModsBtn = document.getElementById('apply-mods-btn');
        this.modsList = document.getElementById('mods-list');
        this.modDropArea = document.getElementById('mod-drop-area');

        this.selectedSquare = null;
        this.currentPlayer = 'white';
        this.boardState = this.createInitialBoard();
        this.gameActive = true;
        this.pendingEvolution = null;

        this.modManager = new ModManager(this);
        this.renderer = new BoardRenderer(this);
        this.moveHandler = new MoveHandler(this);
        this.moveValidator = new MoveValidator(this);
        this.moveHighlighter = new MoveHighlighter(this);

        this.initEventListeners();
        this.initGame();
    }

    movePiece(fromRow, fromCol, toRow, toCol) {
        const movingPiece = this.boardState[fromRow][fromCol];
        const targetPiece = this.boardState[toRow][toCol];

        // Проверка на взятие короля
        if (targetPiece && targetPiece.type === 'king') {
            this.endGame(this.currentPlayer === 'white' ? 'Белые' : 'Чёрные');
            return;
        }

        // Увеличение счетчика ходов для фигуры
        this.boardState[toRow][toCol] = {
            ...movingPiece,
            moves: movingPiece.moves + 1
        };
        this.boardState[fromRow][fromCol] = null;

        // Проверка на эволюцию
        if (!movingPiece.evolved && this.checkEvolutionCondition(movingPiece)) {
            this.pendingEvolution = { row: toRow, col: toCol };
            this.showEvolutionOptions(movingPiece, toRow, toCol);
            return;
        }

        this.renderer.renderBoard();
    }

    checkEvolutionCondition(piece) {
        return (
            (piece.type === 'pawn' && piece.moves === 0) ||
            (piece.type === 'knight' && piece.moves === 1) ||
            (piece.type === 'bishop' && piece.moves === 1) ||
            (piece.type === 'rook' && piece.moves === 1) ||
            (piece.type === 'queen' && piece.moves === 2) ||
            (piece.type === 'king' && piece.moves === 1)
        );
    }

    initEventListeners() {
        this.restartButton.addEventListener('click', () => this.initGame());
        window.addEventListener('resize', () => this.handleResize());
    }

    initGame() {
        this.boardState = this.createInitialBoard();
        this.currentPlayer = 'white';
        this.selectedSquare = null;
        this.gameActive = true;
        this.pendingEvolution = null;
        this.currentPlayerDisplay.textContent = 'белых';
        this.selectedPieceDisplay.textContent = 'нет';
        this.gameOverPanel.classList.add('hidden');
        this.evolutionPanel.classList.add('hidden');
        this.renderer.renderBoard();
        this.handleResize();
    }

    createInitialBoard() {
        const board = Array(8).fill().map(() => Array(8).fill(null));
        
        // Проверяем есть ли кастомная настройка доски из модов
        if (Piece.initialBoardSetup) {
            Piece.initialBoardSetup(board);
            return board;
        }
        
        // Стандартная расстановка
        for (let i = 0; i < 8; i++) {
            board[1][i] = { type: 'pawn', color: 'black', moves: 0, evolved: false };
            board[6][i] = { type: 'pawn', color: 'white', moves: 0, evolved: false };
        }
        
        const pieces = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
        for (let i = 0; i < 8; i++) {
            board[0][i] = { type: pieces[i], color: 'black', moves: 0, evolved: false };
            board[7][i] = { type: pieces[i], color: 'white', moves: 0, evolved: false };
        }
        
        return board;
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.currentPlayerDisplay.textContent = this.currentPlayer === 'white' ? 'белых' : 'чёрных';
        this.selectedSquare = null;
        this.selectedPieceDisplay.textContent = 'нет';
    }

    endGame(winner) {
        this.gameActive = false;
        this.gameResult.textContent = `${winner} победили!`;
        this.gameOverPanel.classList.remove('hidden');
    }

    handleResize() {
        const boardSize = Math.min(
            window.innerHeight - 200,
            window.innerWidth - 320
        );
        this.boardElement.style.width = `${boardSize}px`;
        this.boardElement.style.height = `${boardSize}px`;
    }

    getPieceName(type) {
        const names = {
            'pawn': 'пешка',
            'rook': 'ладья',
            'knight': 'конь',
            'bishop': 'слон',
            'queen': 'ферзь',
            'king': 'король',
            'spearmen': 'копейщик',
            'move+ pawn': 'пешка+',
            'torpedo pawn': 'торпедная пешка',
            'camel': 'верблюд',
            'move+ knight': 'конь+',
            '2color-bishop': 'двуцветный слон',
            'x-ray-bishop': 'рентген-слон',
            'cannibal-bishop': 'каннибал-слон',
            'x-ray-rook': 'рентген-ладья',
            'move+-rook': 'ладья+',
            'queen-of-horses': 'королева коней',
            'queen-of-camels': 'королева верблюдов',
            'boom-king': 'король-бомба',
            'move+-king': 'король+'
        };
        return names[type] || type;
    }

    showEvolutionOptions(piece, row, col) {
        this.evolutionPanel.classList.remove('hidden');
        this.evolutionOptions.innerHTML = '';
        
        const options = Piece.getEvolutionOptions(piece);
        
        options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'evolution-option';
            optionElement.innerHTML = `
                <h4>${option.name}</h4>
                <p>${option.description}</p>
            `;
            optionElement.addEventListener('click', () => {
                this.evolvePiece(row, col, option.type);
                this.evolutionPanel.classList.add('hidden');
                this.pendingEvolution = null;
                this.switchPlayer();
            });
            this.evolutionOptions.appendChild(optionElement);
        });
    }

    evolvePiece(row, col, evolutionType) {
        const piece = this.boardState[row][col];
        this.boardState[row][col] = {
            ...piece,
            evolved: true,
            evolutionType: evolutionType
        };
        this.renderer.renderBoard();
    }

    triggerExplosion(explosionRow, explosionCol) {
        const startRow = Math.max(0, explosionRow - 1);
        const endRow = Math.min(7, explosionRow + 1);
        const startCol = Math.max(0, explosionCol - 1);
        const endCol = Math.min(7, explosionCol + 1);

        for (let r = startRow; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                if (this.boardState[r][c] && this.boardState[r][c].type !== 'pawn' && this.boardState[r][c].type !== 'king') {
                    const square = document.querySelector(`.square[data-row="${r}"][data-col="${c}"]`);
                    if (square) {
                        const explosion = document.createElement('div');
                        explosion.className = 'explosion-effect';
                        square.appendChild(explosion);
                        
                        setTimeout(() => {
                            explosion.remove();
                        }, 500);
                    }
                    
                    this.boardState[r][c] = null;
                }
            }
        }
        
        setTimeout(() => {
            this.renderer.renderBoard();
            this.checkGameEnd();
        }, 100);
    }

    handleBoomKingDeath(row, col) {
        setTimeout(() => {
            this.explodeBoomKing(row, col);
            this.boardState[row][col] = null;
            this.renderer.renderBoard();
            this.checkGameEnd();
        }, 300);
    }

    explodeBoomKing(row, col) {
        for (let r = Math.max(0, row-1); r <= Math.min(7, row+1); r++) {
            for (let c = Math.max(0, col-1); c <= Math.min(7, col+1); c++) {
                if (!(r === row && c === col) && this.boardState[r][c]) {
                    const square = document.querySelector(`.square[data-row="${r}"][data-col="${c}"]`);
                    if (square) {
                        const explosion = document.createElement('div');
                        explosion.className = 'explosion-effect';
                        square.appendChild(explosion);
                        
                        setTimeout(() => explosion.remove(), 500);
                    }
                    this.boardState[r][c] = null;
                }
            }
        }
    }

    checkGameEnd() {
        let whiteKing = false;
        let blackKing = false;
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.boardState[row][col];
                if (piece && piece.type === 'king') {
                    if (piece.color === 'white') whiteKing = true;
                    else blackKing = true;
                }
            }
        }
        
        if (!whiteKing) this.endGame('Чёрные');
        if (!blackKing) this.endGame('Белые');
    }

    isValidSquare(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }
}