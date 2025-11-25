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

    performCastle(row, kingCol, targetCol) {
        const isKingSide = targetCol > kingCol;
        const rookCol = isKingSide ? 7 : 0;
        const newKingCol = isKingSide ? 6 : 2;
        const newRookCol = isKingSide ? 5 : 3;

        // Перемещаем короля
        this.boardState[row][newKingCol] = {
            ...this.boardState[row][kingCol],
            moves: this.boardState[row][kingCol].moves + 1
        };
        this.boardState[row][kingCol] = null;

        // Перемещаем ладью
        this.boardState[row][newRookCol] = {
            ...this.boardState[row][rookCol],
            moves: this.boardState[row][rookCol].moves + 1
        };
        this.boardState[row][rookCol] = null;

        this.renderer.renderBoard();
        this.switchPlayer();
    }

    movePiece(fromRow, fromCol, toRow, toCol) {
        const movingPiece = this.boardState[fromRow][fromCol];
        const targetPiece = this.boardState[toRow][toCol];

        // Проверка на рокировку
        if (movingPiece.type === 'king' && Math.abs(fromCol - toCol) === 2) {
            this.performCastle(fromRow, fromCol, toCol);
            return;
        }

        // Проверяем, достигла ли пешка последней горизонтали
        const isPawnPromotion = movingPiece.type === 'pawn' && 
                            (toRow === 0 || toRow === 7);

        // Событие beforeMove (изменено с on_move на onMove)
        this.boardState = Piece.triggerEvent('onMove', this, 
            { ...movingPiece }, fromRow, fromCol, toRow, toCol, this.boardState);

        // Проверка на взятие короля
        if (targetPiece && targetPiece.type === 'king') {
            this.endGame(this.currentPlayer === 'white' ? 'Белые' : 'Чёрные');
            return;
        }

        // Если есть цель - обрабатываем захват
        if (targetPiece) {
            const movingPieceType = movingPiece.evolved ? movingPiece.evolutionType : movingPiece.type;
            const targetPieceType = targetPiece.evolved ? targetPiece.evolutionType : targetPiece.type;
            
            // Создаем копию текущего состояния доски перед событием onCapture
            const boardBeforeCapture = JSON.parse(JSON.stringify(this.boardState));
            
            // Событие onCapture для атакующей фигуры
            this.boardState = Piece.triggerEvent('onCapture', this, 
                { ...movingPiece }, toRow, toCol, { ...targetPiece }, boardBeforeCapture);
            
            // Создаем копию текущего состояния доски перед событием onCaptured
            const boardBeforeCaptured = JSON.parse(JSON.stringify(this.boardState));
            
            // Событие onCaptured для защищающейся фигуры
            this.boardState = Piece.triggerEvent('onCaptured', this, 
                { ...targetPiece }, toRow, toCol, { ...movingPiece }, boardBeforeCaptured);
        }

        // Перемещаем фигуру
        this.boardState[toRow][toCol] = {
            ...movingPiece,
            moves: movingPiece.moves + 1
        };
        this.boardState[fromRow][fromCol] = null;

        // Событие afterMove
        this.boardState = Piece.triggerEvent('afterMove', this, 
            { ...this.boardState[toRow][toCol] }, fromRow, fromCol, toRow, toCol, this.boardState);

        // Проверка на превращение пешки
        if (isPawnPromotion) {
            this.showPromotionOptions(toRow, toCol, movingPiece.color);
            return; // Не переключаем игрока здесь - переключится после выбора фигуры
        }

        // Проверка на эволюцию
        if (!movingPiece.evolved && this.checkEvolutionCondition(movingPiece)) {
            const options = Piece.getEvolutionOptions(movingPiece);
            if (options.length > 0) {
                this.pendingEvolution = { row: toRow, col: toCol };
                this.showEvolutionOptions(movingPiece, toRow, toCol);
                return;
            }
        }

        this.renderer.renderBoard();
        this.switchPlayer();
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
        // Вызываем событие onTurnEnd для всех фигур текущего игрока перед сменой хода
        this.triggerTurnEnd();
        
        // Меняем текущего игрока
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.currentPlayerDisplay.textContent = this.currentPlayer === 'white' ? 'белых' : 'чёрных';
        this.selectedSquare = null;
        this.selectedPieceDisplay.textContent = 'нет';
        
        // Вызываем событие onTurnStart для всех фигур нового игрока
        this.triggerTurnStart();
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

    // Метод для создания взрыва от bomb-bishop
    triggerExplosion(explosionRow, explosionCol) {
        // Определяем область взрыва 3x3
        const startRow = Math.max(0, explosionRow - 1);
        const endRow = Math.min(7, explosionRow + 1);
        const startCol = Math.max(0, explosionCol - 1);
        const endCol = Math.min(7, explosionCol + 1);

        // Уничтожаем фигуры в области взрыва
        for (let r = startRow; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                // Проверяем условия для уничтожения
                // - Клетка не должна быть пустой
                // - Не уничтожаем пешек и королей
                if (this.boardState[r][c] && 
                    this.boardState[r][c].type !== 'pawn' && 
                    this.boardState[r][c].type !== 'king') {
                    
                    // Создаем мини-взрыв на месте уничтоженной фигуры
                    try {
                        const targetSquare = document.querySelector(`.square[data-row="${r}"][data-col="${c}"]`);
                        if (targetSquare) {
                            const miniExplosion = document.createElement('div');
                            miniExplosion.className = 'explosion-effect mini';
                            miniExplosion.style.transform = 'scale(0.7)';
                            miniExplosion.style.opacity = '0.7';
                            targetSquare.appendChild(miniExplosion);
                            
                            setTimeout(() => {
                                miniExplosion.remove();
                            }, 300);
                        }
                    } catch (e) {
                        console.error(`Ошибка при создании эффекта: ${e.message}`);
                    }
                    
                    // Уничтожаем фигуру
                    this.boardState[r][c] = null;
                }
            }
        }
        
        // Обновляем доску сразу, без задержки
        this.renderer.renderBoard();
        
        // Проверяем условие завершения игры
        this.checkGameEnd();
    }

    // Метод для обработки взрыва от boom-king
    handleBoomKingDeath(kingRow, kingCol) {
        // Уничтожаем ВСЕХ фигур в радиусе 2 клеток, включая пешек
        const startRow = Math.max(0, kingRow - 2);
        const endRow = Math.min(7, kingRow + 2);
        const startCol = Math.max(0, kingCol - 2);
        const endCol = Math.min(7, kingCol + 2);
        
        for (let r = startRow; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                // Пропускаем пустые клетки
                if (!this.boardState[r][c]) continue;
                
                // Пропускаем самого короля (он уже удален при захвате)
                if (r === kingRow && c === kingCol) continue;
                
                // Рассчитываем расстояние от центра взрыва
                const distance = Math.max(Math.abs(r - kingRow), Math.abs(c - kingCol));
                
                // Фигуры на расстоянии 1 уничтожаются всегда
                // Фигуры на расстоянии 2 уничтожаются с вероятностью 50%
                const shouldDestroy = distance === 1 || (distance === 2 && Math.random() > 0.5);
                
                if (shouldDestroy) {
                    // Защищаем только королей от взрыва (иначе игра может завершиться преждевременно)
                    // Теперь взрыв уничтожает пешек!
                    if (this.boardState[r][c].type === 'king') continue;
                    
                    // Создаем мини-взрыв на месте уничтоженной фигуры
                    try {
                        const targetSquare = document.querySelector(`.square[data-row="${r}"][data-col="${c}"]`);
                        if (targetSquare) {
                            const miniExplosion = document.createElement('div');
                            miniExplosion.className = 'explosion-effect mini';
                            miniExplosion.style.transform = 'scale(0.7)';
                            miniExplosion.style.opacity = '0.7';
                            targetSquare.appendChild(miniExplosion);
                            
                            setTimeout(() => {
                                miniExplosion.remove();
                            }, 300);
                        }
                    } catch (e) {
                        console.error(`Ошибка при создании эффекта: ${e.message}`);
                    }
                    
                    // Уничтожаем фигуру
                    this.boardState[r][c] = null;
                }
            }
        }
        
        // Обновляем доску
        this.renderer.renderBoard();
        
        // Проверяем условие завершения игры
        this.checkGameEnd();
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
    
    // Метод для вызова события onTurnStart для всех фигур текущего игрока
    triggerTurnStart() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.boardState[row][col];
                if (piece && piece.color === this.currentPlayer) {
                    // Изменено с on_turn_start на onTurnStart
                    this.boardState = Piece.triggerEvent('onTurnStart', this, 
                        { ...piece }, row, col, this.boardState, this.currentPlayer);
                }
            }
        }
    }
    
    // Метод для вызова события onTurnEnd для всех фигур текущего игрока
    triggerTurnEnd() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.boardState[row][col];
                if (piece && piece.color === this.currentPlayer) {
                    // Изменено с on_turn_end на onTurnEnd
                    this.boardState = Piece.triggerEvent('onTurnEnd', this, 
                        { ...piece }, row, col, this.boardState, this.currentPlayer);
                }
            }
        }
    }

    canCastle(color, side) {
        const row = color === 'white' ? 7 : 0;
        const kingCol = 4;
        const rookCol = side === 'king' ? 7 : 0;
        
        // Проверяем, что король и ладья на своих местах и не ходили
        const king = this.boardState[row][kingCol];
        const rook = this.boardState[row][rookCol];
        
        if (!king || king.type !== 'king' || king.moves !== 0 || king.color !== color) return false;
        if (!rook || rook.type !== 'rook' || rook.moves !== 0 || rook.color !== color) return false;
        
        // Проверяем, что между королем и ладьей нет фигур
        const startCol = Math.min(kingCol, rookCol) + 1;
        const endCol = Math.max(kingCol, rookCol);
        
        for (let col = startCol; col < endCol; col++) {
            if (this.boardState[row][col]) return false;
        }
        
        // Проверяем, что король не под шахом и не проходит через атакованные поля
        const passingCols = side === 'king' ? [4, 5, 6] : [2, 3, 4];
        for (const col of passingCols) {
            if (this.isSquareUnderAttack(row, col, color === 'white' ? 'black' : 'white')) {
                return false;
            }
        }
        
        return true;
    }
    
    isSquareUnderAttack(row, col, byColor) {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = this.boardState[r][c];
                if (piece && piece.color === byColor) {
                    const moves = Piece.getMoves(this, r, c, piece);
                    if (moves.some(move => move.x === row && move.y === col && move.type === 'capture')) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // В классе ChessGame добавляем новый метод для превращения пешки
    showPromotionOptions(row, col, color) {
        // Создаем панель превращения
        const promotionPanel = document.createElement('div');
        promotionPanel.className = 'promotion-panel';
        promotionPanel.innerHTML = `
            <h3>Превращение пешки</h3>
            <p>Выберите фигуру:</p>
            <div class="promotion-options">
                <div data-type="queen">Ферзь</div>
                <div data-type="rook">Ладья</div>
                <div data-type="bishop">Слон</div>
                <div data-type="knight">Конь</div>
            </div>
        `;
        
        document.body.appendChild(promotionPanel);

        // Обработчики выбора фигуры
        promotionPanel.querySelectorAll('.promotion-options div').forEach(option => {
            option.addEventListener('click', () => {
                const newType = option.dataset.type;
                this.boardState[row][col] = { 
                    type: newType, 
                    color: color,
                    moves: this.boardState[row][col].moves, // Сохраняем количество ходов
                    evolved: false
                };
                
                // Удаляем панель и перерисовываем доску
                document.body.removeChild(promotionPanel);
                this.renderer.renderBoard();
                
                // Передаем ход другому игроку
                this.switchPlayer();
            });
        });
    }
}