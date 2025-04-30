document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('chessboard');
    const currentPlayerDisplay = document.getElementById('current-player');
    const selectedPieceDisplay = document.getElementById('selected-piece');
    const evolutionPanel = document.getElementById('evolution-panel');
    const evolutionOptions = document.getElementById('evolution-options');
    const gameOverPanel = document.getElementById('game-over');
    const gameResult = document.getElementById('game-result');
    const restartButton = document.getElementById('restart-button');
    
    let selectedSquare = null;
    let currentPlayer = 'white';
    let boardState = createInitialBoard();
    let gameActive = true;
    let pendingEvolution = null;
    
    // Инициализация игры
    function initGame() {
        boardState = createInitialBoard();
        currentPlayer = 'white';
        selectedSquare = null;
        gameActive = true;
        pendingEvolution = null;
        currentPlayerDisplay.textContent = 'белых';
        selectedPieceDisplay.textContent = 'нет';
        gameOverPanel.classList.add('hidden');
        evolutionPanel.classList.add('hidden');
        renderBoard();
        handleResize();
    }
    
    // Создание начальной доски
    function createInitialBoard() {
        const board = Array(8).fill().map(() => Array(8).fill(null));
        
        // Расстановка пешек
        for (let i = 0; i < 8; i++) {
            board[1][i] = { type: 'pawn', color: 'black', moves: 0, evolved: false };
            board[6][i] = { type: 'pawn', color: 'white', moves: 0, evolved: false };
        }
        
        // Расстановка остальных фигур
        const pieces = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
        for (let i = 0; i < 8; i++) {
            board[0][i] = { type: pieces[i], color: 'black', moves: 0, evolved: false };
            board[7][i] = { type: pieces[i], color: 'white', moves: 0, evolved: false };
        }
        
        return board;
    }
    
    // Отрисовка доски
    function renderBoard() {
        boardElement.innerHTML = '';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                
                if (selectedSquare && selectedSquare.row === row && selectedSquare.col === col) {
                    square.classList.add('selected');
                }
                
                const piece = boardState[row][col];
                if (piece) {
                    const pieceElement = document.createElement('div');
                    pieceElement.className = 'piece';
                    let pieceType = piece.type;
                    
                    // Для эволюционировавших фигур используем специальные изображения
                    if (piece.evolved) {
                        switch(piece.evolutionType) {
                            case 'camel':
                                pieceType = 'camel';
                                break;
                            case 'move+ knight':
                                pieceType = 'knight-plus';
                                break;
                            case 'knight-with-next-evolution':
                                pieceType = 'knight-evolvable';
                                break;
                            default:
                                pieceType = piece.evolutionType;
                        }
                    }
                    
                    pieceElement.style.backgroundImage = `url('pieces/${piece.color}-${pieceType}.png')`;
                    square.appendChild(pieceElement);
                }
                
                square.addEventListener('click', () => handleSquareClick(row, col));
                boardElement.appendChild(square);
            }
        }
    }
    
    // Обработка клика по клетке
    function handleSquareClick(row, col) {
        if (!gameActive || pendingEvolution) return;
    
        const piece = boardState[row][col];
        const square = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
    
        // Если клетка уже выбрана
        if (selectedSquare && selectedSquare.row === row && selectedSquare.col === col) {
            selectedSquare = null;
            renderBoard();
            selectedPieceDisplay.textContent = 'нет';
            return;
        }
    
        // Если выбрана фигура текущего игрока
        if (piece && piece.color === currentPlayer) {
            // Особый случай: если уже выбран каннибал-слон и кликаем на свою фигуру
            if (selectedSquare) {
                const fromPiece = boardState[selectedSquare.row][selectedSquare.col];
                if (fromPiece.evolved && fromPiece.evolutionType === 'cannibal-bishop' && 
                    (square.classList.contains('capture') || square.classList.contains('capture-ally'))) {
                    // Съедаем свою фигуру
                    movePiece(selectedSquare.row, selectedSquare.col, row, col);
                    switchPlayer();
                    return;
                }
            }
            
            // Обычный выбор фигуры
            selectedSquare = { row, col };
            selectedPieceDisplay.textContent = `${piece.color === 'white' ? 'белая' : 'чёрная'} ${getPieceName(piece.evolved ? piece.evolutionType : piece.type)}`;
            renderBoard();
            highlightValidMoves(row, col);
            return;
        }
    
        // Если пытаемся сделать ход
        if (selectedSquare) {
            const fromRow = selectedSquare.row;
            const fromCol = selectedSquare.col;
            const fromPiece = boardState[fromRow][fromCol];
    
            if (isValidMove(fromRow, fromCol, row, col)) {
                // Проверяем, съели ли короля
                const targetPiece = boardState[row][col];
                if (targetPiece && targetPiece.type === 'king') {
                    endGame(currentPlayer === 'white' ? 'Белые' : 'Чёрные');
                    return;
                }
    
                // Для x-ray слона - нельзя есть, если на пути есть фигуры
                if (fromPiece.evolved && fromPiece.evolutionType === 'x-ray-bishop' && 
                    targetPiece && hasPiecesBetween(fromRow, fromCol, row, col)) {
                    return;
                }
    
                movePiece(fromRow, fromCol, row, col);
    
                // Проверка на эволюцию
                if (!fromPiece.evolved && (
                    (fromPiece.type === 'pawn' && fromPiece.moves === 0) ||
                    (fromPiece.type === 'knight' && fromPiece.moves === 1) ||
                    (fromPiece.type === 'bishop' && fromPiece.moves === 1) ||
                    (fromPiece.type === 'rook' && fromPiece.moves === 1) ||
                    (fromPiece.type === 'queen' && fromPiece.moves === 1) ||
                    (fromPiece.type === 'king' && fromPiece.moves === 1)
                )) {
                    pendingEvolution = { row, col };
                    showEvolutionOptions(fromPiece, row, col);
                    return;
                }
    
                switchPlayer();
            }
        }
    }
    
    // Вспомогательная функция для проверки фигур между клетками
    function hasPiecesBetween(fromRow, fromCol, toRow, toCol) {
        const dr = Math.sign(toRow - fromRow);
        const dc = Math.sign(toCol - fromCol);
        
        // Для диагональных движений
        if (Math.abs(dr) === 1 && Math.abs(dc) === 1) {
            let r = fromRow + dr;
            let c = fromCol + dc;
            
            while (r !== toRow && c !== toCol) {
                if (boardState[r][c]) return true;
                r += dr;
                c += dc;
            }
        }
        return false;
    }
    
    // Новая функция для обработки взрыва
    function triggerExplosion(explosionRow, explosionCol) {
        // Определяем границы взрыва (3x3 область)
        const startRow = Math.max(0, explosionRow - 1);
        const endRow = Math.min(7, explosionRow + 1);
        const startCol = Math.max(0, explosionCol - 1);
        const endCol = Math.min(7, explosionCol + 1);

        // Создаем эффект взрыва
        for (let r = startRow; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                // Пропускаем пешки и пустые клетки
                if (boardState[r][c] && boardState[r][c].type !== 'pawn' && boardState[r][c].type !== 'king') {
                    // Анимация взрыва
                    const square = document.querySelector(`.square[data-row="${r}"][data-col="${c}"]`);
                    if (square) {
                        const explosion = document.createElement('div');
                        explosion.className = 'explosion-effect';
                        square.appendChild(explosion);
                        
                        // Удаляем эффект после анимации
                        setTimeout(() => {
                            explosion.remove();
                        }, 500);
                    }
                    
                    // Удаляем фигуру (кроме пешек)
                    boardState[r][c] = null;
                }
            }
        }
        
        // Перерисовываем доску после взрыва
        setTimeout(() => {
            renderBoard();
        }, 100);
    }

    // Обновленная функция movePiece
    function movePiece(fromRow, fromCol, toRow, toCol) {
        const movingPiece = boardState[fromRow][fromCol];
        const targetPiece = boardState[toRow][toCol];

        // Если съели Bomb Bishop - сначала перемещаем фигуру, потом взрываем
        if (targetPiece && targetPiece.evolved && targetPiece.evolutionType === 'bomb-bishop') {
            // 1. Перемещаем атакующую фигуру
            boardState[toRow][toCol] = {...movingPiece, moves: movingPiece.moves + 1};
            boardState[fromRow][fromCol] = null;
            renderBoard();
            
            // 2. Запускаем взрыв с задержкой
            setTimeout(() => {
                triggerExplosion(toRow, toCol);
            }, 300);
            return;
        }

        if (targetPiece?.evolutionType === 'boom-king') {
            boardState[fromRow][fromCol] = null;
            boardState[toRow][toCol] = {...piece, moves: piece.moves + 1};
            renderBoard();
            handleBoomKingDeath(toRow, toCol);
            return;
        }

        // Обычный ход
        boardState[toRow][toCol] = {...movingPiece, moves: movingPiece.moves + 1};
        boardState[fromRow][fromCol] = null;
        renderBoard();
    }
    
    function switchPlayer() {
        currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
        currentPlayerDisplay.textContent = currentPlayer === 'white' ? 'белых' : 'чёрных';
        selectedSquare = null;
        selectedPieceDisplay.textContent = 'нет';
    }
    
    // Завершение игры
    function endGame(winner) {
        gameActive = false;
        gameResult.textContent = `${winner} победили!`;
        gameOverPanel.classList.remove('hidden');
    }
    
    // Подсветка допустимых ходов
    function highlightValidMoves(row, col) {
        const piece = boardState[row][col];
        if (!piece) return;
        
        // Очищаем предыдущие подсветки
        document.querySelectorAll('.highlight, .capture').forEach(el => {
            el.classList.remove('highlight', 'capture');
        });
        
        // Получаем актуальный тип фигуры (учитываем эволюцию)
        const pieceType = piece.evolved ? piece.evolutionType : piece.type;
    
        // Обрабатываем все возможные типы фигур
        switch(pieceType) {
            case 'pawn':
                highlightPawnMoves(row, col, piece);
                break;
            case 'spearmen':
                highlightSpearmenMoves(row, col, piece);
                break;
            case 'move+ pawn':
                highlightMovePlusPawnMoves(row, col, piece);
                break;
            case 'torpedo pawn':
                highlightTorpedoPawnMoves(row, col, piece);
                break;
            case 'knight':
                highlightKnightMoves(row, col, piece);
                break;
            case 'camel':
                highlightCamelMoves(row, col, piece);
                break;
            case 'move+ knight':
                highlightMovePlusKnightMoves(row, col, piece);
                break;
            case 'knight-with-next-evolution':
                highlightKnightMoves(row, col, piece); // Пока ходит как обычный конь
                break;
            case 'bishop':
                highlightStandardMoves(row, col, piece);
                break;
            case '2color-bishop':
                highlight2ColorBishopMoves(row, col, piece);
                break;
            case 'x-ray-bishop':
                highlightXRaysBishopMoves(row, col, piece);
                break;
            case 'cannibal-bishop':
                highlightCannibalBishopMoves(row, col, piece);
                break;
            case 'bomb-bishop':
                highlightStandardMoves(row, col, piece);
                break;
            case 'x-ray-rook':
                highlightXRaysRookMoves(row, col, piece);
                break;
            case 'move+-rook':
                highlightMovePlusRookMoves(row, col, piece);
                break;
            case 'horizontal-rook':
                highlightHorizontalRookMoves(row, col, piece);
                break;
            case 'queen-of-horses':
                highlightQueenOfHorsesMoves(row, col, piece);
                break;
            case 'queen-of-camels':
                highlightQueenOfCamelsMoves(row, col, piece);
                break;
            case 'queen-with-evolution':
                highlightQueenWithEvolutionMoves(row, col, piece);
                break;
            case 'boom-king':
                highlightKingWithPotentialMoves(row, col, piece); // Ходит как обычный король
                break;
            case 'king-with-potential':
                highlightKingWithPotentialMoves(row, col, piece);
                break;
            case 'move+-king':
                highlightMovePlusKingMoves(row, col, piece);
                break;
            case 'move++ pawn':
                highlightMovePlusPlusPawnMoves(row, col, piece);
                break;
            case 'move-and-attack pawn':
                highlightMoveAndAttackPawnMoves(row, col, piece);
                break;
            case 'torpedo+ pawn':
                highlightTorpedoPlusPawnMoves(row, col, piece);
                break;
            default:
                highlightStandardMoves(row, col, piece);
        }
    }

    function highlightKnightMoves(row, col, piece) {
        const knightMoves = [
            [2, 1], [2, -1], [-2, 1], [-2, -1],
            [1, 2], [1, -2], [-1, 2], [-1, -2]
        ];
        processSingleMoves(row, col, knightMoves, piece.color);
    }
    
    
    function highlightPawnMoves(row, col, piece) {
        const direction = piece.color === 'white' ? -1 : 1;
        
        // Ход на одну клетку вперед
        if (isValidSquare(row + direction, col) && !boardState[row + direction][col]) {
            highlightSquare(row + direction, col, 'move');
            
            // Ход на две клетки из начальной позиции
            if ((piece.color === 'white' && row === 6) || (piece.color === 'black' && row === 1)) {
                if (!boardState[row + 2 * direction][col]) {
                    highlightSquare(row + 2 * direction, col, 'move');
                }
            }
        }
        
        // Взятие по диагонали
        [-1, 1].forEach(dc => {
            if (isValidSquare(row + direction, col + dc) && 
                boardState[row + direction][col + dc] && 
                boardState[row + direction][col + dc].color !== piece.color) {
                highlightSquare(row + direction, col + dc, 'capture');
            }
        });
    }
    
    function highlightSpearmenMoves(row, col, piece) {
        const direction = piece.color === 'white' ? -1 : 1;
        
        // Стандартные ходы пешки
        if (isValidSquare(row + direction, col) && !boardState[row + direction][col]) {
            highlightSquare(row + direction, col, 'move');
        }
        
        // Взятие по диагонали и прямо
        [-1, 0, 1].forEach(dc => {
            if (isValidSquare(row + direction, col + dc) && 
                boardState[row + direction][col + dc] && 
                boardState[row + direction][col + dc].color !== piece.color) {
                highlightSquare(row + direction, col + dc, 'capture');
            }
        });
    }

    function highlightMovePlusPawnMoves(row, col, piece) {
        const direction = piece.color === 'white' ? -1 : 1;
        
        // Ход вперед
        if (isValidSquare(row + direction, col) && !boardState[row + direction][col]) {
            highlightSquare(row + direction, col, 'move');
        }
        
        // Ходы по диагонали вперед (оба направления)
        [-1, 1].forEach(dc => {
            if (isValidSquare(row + direction, col + dc)) {
                if (!boardState[row + direction][col + dc]) {
                    highlightSquare(row + direction, col + dc, 'move');
                }
                // Взятие остается как у обычной пешки
                if (boardState[row + direction][col + dc] && 
                    boardState[row + direction][col + dc].color !== piece.color) {
                    highlightSquare(row + direction, col + dc, 'capture');
                }
            }
        });
    }

    
    function highlightTorpedoPawnMoves(row, col, piece) {
        const direction = piece.color === 'white' ? -1 : 1;
        
        // Ход на одну или две клетки вперед
        [1, 2].forEach(steps => {
            if (isValidSquare(row + steps * direction, col) && 
                !boardState[row + steps * direction][col]) {
                highlightSquare(row + steps * direction, col, 'move');
            }
        });
        
        // Взятие по диагонали
        [-1, 1].forEach(dc => {
            if (isValidSquare(row + direction, col + dc) && 
                boardState[row + direction][col + dc] && 
                boardState[row + direction][col + dc].color !== piece.color) {
                highlightSquare(row + direction, col + dc, 'capture');
            }
        });
    }
    
    function highlightStandardMoves(row, col, piece) {
        const directions = [];
        
        switch (piece.type) {
            case 'rook':
                directions.push([0, 1], [1, 0], [0, -1], [-1, 0]);
                break;
            case 'knight':
                const knightMoves = [
                    [2, 1], [2, -1], [-2, 1], [-2, -1],
                    [1, 2], [1, -2], [-1, 2], [-1, -2]
                ];
                processSingleMoves(row, col, knightMoves, piece.color);
                return;
            case 'bishop':
                directions.push([1, 1], [1, -1], [-1, 1], [-1, -1]);
                break;
            case 'queen':
                directions.push([0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]);
                break;
            case 'king':
                const kingMoves = [
                    [0, 1], [1, 0], [0, -1], [-1, 0],
                    [1, 1], [1, -1], [-1, 1], [-1, -1]
                ];
                processSingleMoves(row, col, kingMoves, piece.color);
                return;
        }
        
        processSlidingMoves(row, col, directions, piece.color);
    }

    function highlightCamelMoves(row, col, piece) {
        const camelMoves = [
            [3, 1], [3, -1], [-3, 1], [-3, -1],
            [1, 3], [1, -3], [-1, 3], [-1, -3]
        ];
        processSingleMoves(row, col, camelMoves, piece.color);
    }
    
    function highlightMovePlusKnightMoves(row, col, piece) {
        // Стандартные ходы коня
        const knightMoves = [
        [2, 1], [2, -1], [-2, 1], [-2, -1],
        [1, 2], [1, -2], [-1, 2], [-1, -2]
        ];
        processSingleMoves(row, col, knightMoves, piece.color);
        
        // Дополнительные ходы на 1 клетку во все стороны
        const plusMoves = [
            [1, 0], [-1, 0], [0, 1], [0, -1]
            // [1, 1], [1, -1], [-1, 1], [-1, -1]
        ];
        processSingleMoves(row, col, plusMoves, piece.color);
    }

    function highlight2ColorBishopMoves(row, col, piece) {
        // Стандартные ходы слона
        const bishopDirections = [
            [1, 1], [1, -1], [-1, 1], [-1, -1]
        ];
        processSlidingMoves(row, col, bishopDirections, piece.color);
        
        // Ходы короля (на 1 клетку)
        const kingMoves = [
            [0, 1], [1, 0], [0, -1], [-1, 0],
            [1, 1], [1, -1], [-1, 1], [-1, -1]
        ];
        processSingleMoves(row, col, kingMoves, piece.color);
    }
    
    function highlightXRaysBishopMoves(row, col, piece) {
        const directions = [
            [1, 1], [1, -1], [-1, 1], [-1, -1]
        ];
        
        directions.forEach(([dr, dc]) => {
            let r = row + dr;
            let c = col + dc;
            let hasJumped = false;
            
            while (isValidSquare(r, c)) {
                if (!boardState[r][c]) {
                    // Пустая клетка - можно ходить
                    highlightSquare(r, c, hasJumped ? 'move-after-jump' : 'move');
                } else {
                    if (!hasJumped) {
                        // Первая встреченная фигура - можно перепрыгнуть
                        highlightSquare(r, c, 'jump');
                        hasJumped = true;
                        
                        // Продолжаем проверять клетки после прыжка
                        let nextR = r + dr;
                        let nextC = c + dc;
                        while (isValidSquare(nextR, nextC)) {
                            if (!boardState[nextR][nextC]) {
                                highlightSquare(nextR, nextC, 'move-after-jump');
                            } else {
                                break; // Нельзя прыгать через вторую фигуру
                            }
                            nextR += dr;
                            nextC += dc;
                        }
                    }
                    break; // Прекращаем движение после первой фигуры (уже перепрыгнули)
                }
                r += dr;
                c += dc;
            }
            
            // Отдельно проверяем возможность взятия (без прыжка)
            if (!hasJumped) {
                r = row + dr;
                c = col + dc;
                while (isValidSquare(r, c)) {
                    if (boardState[r][c]) {
                        if (boardState[r][c].color !== piece.color) {
                            highlightSquare(r, c, 'capture');
                        }
                        break;
                    }
                    r += dr;
                    c += dc;
                }
            }
        });
    }
    
    function isValidMove(fromRow, fromCol, toRow, toCol) {
        const square = document.querySelector(`.square[data-row="${toRow}"][data-col="${toCol}"]`);
        if (!square) return false;
        
        const fromPiece = boardState[fromRow][fromCol];
        const toPiece = boardState[toRow][toCol];
        
        // Для X-Ray Bishop
        if (fromPiece.evolved && fromPiece.evolutionType === 'x-ray-bishop') {
            // Проверяем был ли прыжок
            const dr = Math.sign(toRow - fromRow);
            const dc = Math.sign(toCol - fromCol);
            let r = fromRow + dr;
            let c = fromCol + dc;
            let jumpedPiece = null;
            
            while (r !== toRow || c !== toCol) {
                if (boardState[r][c]) {
                    if (jumpedPiece) {
                        // Уже была фигура на пути - нельзя
                        return false;
                    }
                    jumpedPiece = boardState[r][c];
                }
                r += dr;
                c += dc;
            }
            
            // Если был прыжок, можно только ходить (не есть)
            if (jumpedPiece && toPiece) {
                return false;
            }
        }
        
        return square.classList.contains('highlight') || 
               square.classList.contains('capture') ||
               square.classList.contains('move-after-jump');
    }
    
    function highlightCannibalBishopMoves(row, col, piece) {
        const directions = [
            [1, 1], [1, -1], [-1, 1], [-1, -1]
        ];
        
        directions.forEach(([dr, dc]) => {
            let r = row + dr;
            let c = col + dc;
            
            while (isValidSquare(r, c)) {
                if (!boardState[r][c]) {
                    highlightSquare(r, c, 'move');
                } else {
                    // Подсвечиваем ВСЕ фигуры как возможные для взятия
                    highlightSquare(r, c, boardState[r][c].color === piece.color ? 'capture-ally' : 'capture');
                    break;
                }
                r += dr;
                c += dc;
            }
        });
    }
    
    function processSlidingMoves(row, col, directions, color) {
        for (const [dr, dc] of directions) {
            let r = row + dr;
            let c = col + dc;
            
            while (isValidSquare(r, c)) {
                if (!boardState[r][c]) {
                    highlightSquare(r, c, 'move');
                } else {
                    if (boardState[r][c].color !== color) {
                        highlightSquare(r, c, 'capture');
                    }
                    break;
                }
                r += dr;
                c += dc;
            }
        }
    }
    
    function processSingleMoves(row, col, moves, color) {
        for (const [dr, dc] of moves) {
            const r = row + dr;
            const c = col + dc;
            
            if (isValidSquare(r, c)) {
                if (!boardState[r][c]) {
                    highlightSquare(r, c, 'move');
                } else if (boardState[r][c].color !== color) {
                    highlightSquare(r, c, 'capture');
                }
            }
        }
    }
    
    function highlightSquare(row, col, type) {
        const square = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
        if (square) {
            square.classList.add(type === 'capture' ? 'capture' : 'highlight');
        }
    }

    function explodeBombBishop(row, col) {
        const centerPiece = boardState[row][col];
        if (!centerPiece || !centerPiece.evolved || centerPiece.evolutionType !== 'bomb-bishop') {
            return;
        }
    
        // Создаем эффект взрыва
        const centerSquare = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
        const explosion = document.createElement('div');
        explosion.className = 'explosion-effect';
        centerSquare.appendChild(explosion);
        
        setTimeout(() => {
            // Взрываем область 3x3 вокруг слона
            for (let r = Math.max(0, row-1); r <= Math.min(7, row+1); r++) {
                for (let c = Math.max(0, col-1); c <= Math.min(7, col+1); c++) {
                    const piece = boardState[r][c];
                    if (piece && piece.type !== 'pawn'&& piece.type !== 'king' && !(r === row && c === col)) {
                        const square = document.querySelector(`.square[data-row="${r}"][data-col="${c}"]`);
                        if (square) {
                            const miniExplosion = explosion.cloneNode();
                            square.appendChild(miniExplosion);
                        }
                        boardState[r][c] = null;
                    }
                }
            }
            
            // Удаляем самого слона после взрыва
            boardState[row][col] = null;
            renderBoard();
        }, 100);
    }
    
    function isValidSquare(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }
    
    function isValidMove(fromRow, fromCol, toRow, toCol) {
        const square = document.querySelector(`.square[data-row="${toRow}"][data-col="${toCol}"]`);
        return square && (square.classList.contains('highlight') || square.classList.contains('capture'));
    }
    
    function getPieceName(type) {
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
            'knight-with-next-evolution': 'конь с эволюцией',
            'move+ knight': 'конь+',
            '2color-bishop': 'двуцветный слон',
            'x-ray-bishop': 'рентген-слон',
            'cannibal-bishop': 'каннибал-слон',
            'x-ray-rook': 'рентген-ладья',
            'move+-rook': 'ладья+',
            'horizontal-rook': 'горизонтальная ладья',
            'queen-of-horses': 'королева коней',
            'queen-of-camels': 'королева верблюдов',
            'queen-with-evolution': 'королева с потенциалом',
            'boom-king': 'король-бомба',
            'king-with-potential': 'король с потенциалом',
            'move+-king': 'король+',
            'move++ pawn': 'пешка++',
            'move-and-attack pawn': 'атакующая пешка',
            'torpedo+ pawn': 'торпеда+'
        };
        return names[type] || type;
    }

    function highlightKingWithPotentialMoves(row, col, piece) {
        // Стандартные ходы короля
        const kingMoves = [
            [1, 0], [-1, 0], [0, 1], [0, -1],
            [1, 1], [1, -1], [-1, 1], [-1, -1]
        ];
        processSingleMoves(row, col, kingMoves, piece.color);
    }
    

    function highlightMovePlusKingMoves(row, col, piece) {
        // Стандартные ходы короля
        const kingMoves = [
            [1, 0], [-1, 0], [0, 1], [0, -1],
            [1, 1], [1, -1], [-1, 1], [-1, -1]
        ];
        processSingleMoves(row, col, kingMoves, piece.color);
        
        // Дополнительные ходы на 2 клетки
        const plusMoves = [
            [2, 0], [-2, 0], [0, 2], [0, -2]
        ];
        processSingleMoves(row, col, plusMoves, piece.color);
    }

    function explodeBoomKing(row, col) {
        // Взрываем область 3x3 вокруг короля
        for (let r = Math.max(0, row-1); r <= Math.min(7, row+1); r++) {
            for (let c = Math.max(0, col-1); c <= Math.min(7, col+1); c++) {
                // Уничтожаем все фигуры кроме самого короля
                if (!(r === row && c === col) && boardState[r][c]) {
                    // Создаем эффект взрыва
                    const square = document.querySelector(`.square[data-row="${r}"][data-col="${c}"]`);
                    if (square) {
                        const explosion = document.createElement('div');
                        explosion.className = 'explosion-effect';
                        square.appendChild(explosion);
                        
                        setTimeout(() => explosion.remove(), 500);
                    }
                    boardState[r][c] = null;
                }
            }
        }
        renderBoard();
    }
    
    function handleBoomKingDeath(row, col) {
        if (boardState[row][col]?.evolutionType === 'boom-king') {
            setTimeout(() => {
                explodeBoomKing(row, col);
                boardState[row][col] = null;
                renderBoard();
                checkGameEnd(); // Проверяем конец игры после взрыва
            }, 300);
        }
    }

    function highlightMovePlusPlusPawnMoves(row, col, piece) {
        const direction = piece.color === 'white' ? -1 : 1;
        
        // Ход вперёд
        if (isValidSquare(row + direction, col) && !boardState[row + direction][col]) {
            highlightSquare(row + direction, col, 'move');
        }
        
        // Ходы по диагонали вперёд
        [-1, 1].forEach(dc => {
            const r = row + direction;
            const c = col + dc;
            if (isValidSquare(r, c)) {
                if (!boardState[r][c]) {
                    highlightSquare(r, c, 'move');
                }
                if (boardState[r][c] && boardState[r][c].color !== piece.color) {
                    highlightSquare(r, c, 'capture');
                }
            }
        });
        
        // Ходы в стороны
        [-1, 1].forEach(dc => {
            const c = col + dc;
            if (isValidSquare(row, c) && !boardState[row][c]) {
                highlightSquare(row, c, 'move');
            }
        });
    }
    
    function highlightMoveAndAttackPawnMoves(row, col, piece) {
        const direction = piece.color === 'white' ? -1 : 1;
        
        // Ходы как move+ pawn
        if (isValidSquare(row + direction, col) && !boardState[row + direction][col]) {
            highlightSquare(row + direction, col, 'move');
        }
        
        // Взятие как move+ pawn и spearmen
        [-1, 0, 1].forEach(dc => {
            const r = row + direction;
            const c = col + dc;
            if (isValidSquare(r, c) && boardState[r][c] && boardState[r][c].color !== piece.color) {
                highlightSquare(r, c, 'capture');
            }
        });
    }
    
    function highlightTorpedoPlusPawnMoves(row, col, piece) {
        const direction = piece.color === 'white' ? -1 : 1;
        
        // Ходы как torpedo pawn с прыжком
        [1, 2].forEach(steps => {
            const r = row + steps * direction;
            if (isValidSquare(r, col)) {
                if (steps === 1 || !boardState[row + direction][col]) { // Может перепрыгивать
                    if (!boardState[r][col]) {
                        highlightSquare(r, col, 'move');
                    }
                }
            }
        });
        
        // Взятие по диагонали
        [-1, 1].forEach(dc => {
            const r = row + direction;
            const c = col + dc;
            if (isValidSquare(r, c) && boardState[r][c] && boardState[r][c].color !== piece.color) {
                highlightSquare(r, c, 'capture');
            }
        });
    }

    
    // Показ панели эволюции
    function showEvolutionOptions(piece, row, col) {
        evolutionPanel.classList.remove('hidden');
        evolutionOptions.innerHTML = '';
        
        let options = [];
        
        if (piece.type === 'pawn') {
            options = [
                {
                    type: 'spearmen',
                    name: 'Копейщик',
                    description: 'Может бить клетку прямо перед собой'
                },
                {
                    type: 'move+ pawn',
                    name: 'Пешка+',
                    description: 'Может ходить по диагонали вперёд'
                },
                {
                    type: 'torpedo pawn',
                    name: 'Торпедная пешка',
                    description: 'Может продвинуться сразу на две клетки вперёд'
                }
            ];
        } else if (piece.type === 'knight') {
            options = [
                {
                    type: 'camel',
                    name: 'Верблюд',
                    description: 'Ходит на 3 клетки в одну сторону и 1 в другую (3+1)'
                },
                {
                    type: 'knight-with-next-evolution',
                    name: 'Конь+',
                    description: 'Может эволюционировать дальше'
                },
                {
                    type: 'move+ knight',
                    name: 'Улучшенный конь',
                    description: 'Может ходить как конь + по горизонтали и вертикали на 1 клетку'
                }
            ];
        } else if (piece.type === 'bishop') {
            options = [
                {
                    type: '2color-bishop',
                    name: 'Двуцветный слон',
                    description: 'Ходит как слон + может ходить на 1 клетку в любую сторону'
                },
                {
                    type: 'x-ray-bishop',
                    name: 'Рентген-слон',
                    description: 'Может перепрыгивать через фигуры (1 за ход)'
                },
                {
                    type: 'bomb-bishop',
                    name: 'Бомба-Слон',
                    description: 'Взрывает все вокруг (3x3) при съедении (кроме пешек)'
                }
            ];
        } else if (piece.type === 'rook') {
            options = [
                {
                    type: 'x-ray-rook',
                    name: 'Рентген-ладья',
                    description: 'Может перепрыгивать через фигуры (1 за ход)'
                },
                {
                    type: 'move+-rook',
                    name: 'Ладья+',
                    description: 'Ходит как ладья + может ходить на 1 клетку в любую сторону'
                },
                {
                    type: 'horizontal-rook',
                    name: 'Горизонтальная ладья',
                    description: 'Доска зациклена по горизонтали (из 8 клетки можно пойти в 1)'
                }
            ];
        } else if (piece.type === 'queen') {
            options = [
                {
                    type: 'queen-of-horses',
                    name: 'Королева коней',
                    description: 'Ходит как ферзь + ходы коня'
                },
                {
                    type: 'queen-of-camels',
                    name: 'Королева верблюдов',
                    description: 'Ходит как ферзь + ходы верблюда (3+1)'
                },
                {
                    type: 'queen-with-evolution',
                    name: 'Королева с потенциалом',
                    description: 'Ходит как обычная королева, но может эволюционировать дальше'
                }
            ];
        } else if (piece.type === 'king') {
            options = [
                {
                    type: 'boom-king',
                    name: 'Король-бомба',
                    description: 'При смерти взрывает всё вокруг (3x3, включая пешек)'
                },
                {
                    type: 'king-with-potential',
                    name: 'Король с потенциалом',
                    description: 'Обычный король с будущими эволюциями'
                },
                {
                    type: 'move+-king',
                    name: 'Король+',
                    description: 'Может ходить на 2 клетки по вертикали/горизонтали'
                }
            ];
        }
        
        options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'evolution-option';
            optionElement.innerHTML = `
                <h4>${option.name}</h4>
                <p>${option.description}</p>
            `;
            optionElement.addEventListener('click', () => {
                evolvePiece(row, col, option.type);
                evolutionPanel.classList.add('hidden');
                pendingEvolution = null;
                switchPlayer();
            });
            evolutionOptions.appendChild(optionElement);
        });
    }


    function highlightQueenWithEvolutionMoves(row, col, piece) {
        // Стандартные ходы ферзя
        const directions = [
            [1, 0], [-1, 0], [0, 1], [0, -1],
            [1, 1], [1, -1], [-1, 1], [-1, -1]
        ];
        processSlidingMoves(row, col, directions, piece.color);
    }


    function highlightQueenOfCamelsMoves(row, col, piece) {
        // Стандартные ходы ферзя
        const queenDirections = [
            [1, 0], [-1, 0], [0, 1], [0, -1],
            [1, 1], [1, -1], [-1, 1], [-1, -1]
        ];
        processSlidingMoves(row, col, queenDirections, piece.color);
        
        // Ходы верблюда (3+1)
        const camelMoves = [
            [3, 1], [3, -1], [-3, 1], [-3, -1],
            [1, 3], [1, -3], [-1, 3], [-1, -3]
        ];
        processSingleMoves(row, col, camelMoves, piece.color);
    }


    function highlightQueenOfHorsesMoves(row, col, piece) {
        // Стандартные ходы ферзя
        const queenDirections = [
            [1, 0], [-1, 0], [0, 1], [0, -1],
            [1, 1], [1, -1], [-1, 1], [-1, -1]
        ];
        processSlidingMoves(row, col, queenDirections, piece.color);
        
        // Ходы коня
        const knightMoves = [
            [2, 1], [2, -1], [-2, 1], [-2, -1],
            [1, 2], [1, -2], [-1, 2], [-1, -2]
        ];
        processSingleMoves(row, col, knightMoves, piece.color);
    }

    function highlightHorizontalRookMoves(row, col, piece) {
        // Вертикальные ходы (обычные)
        for (let r = row + 1; r < 8; r++) {
            if (!boardState[r][col]) {
                highlightSquare(r, col, 'move');
            } else {
                if (boardState[r][col].color !== piece.color) {
                    highlightSquare(r, col, 'capture');
                }
                break;
            }
        }
        for (let r = row - 1; r >= 0; r--) {
            if (!boardState[r][col]) {
                highlightSquare(r, col, 'move');
            } else {
                if (boardState[r][col].color !== piece.color) {
                    highlightSquare(r, col, 'capture');
                }
                break;
            }
        }
        
        // Горизонтальные ходы (зацикленные)
        for (let step = 1; step < 8; step++) {
            const c = (col + step) % 8;
            if (!boardState[row][c]) {
                highlightSquare(row, c, 'move');
            } else {
                if (boardState[row][c].color !== piece.color) {
                    highlightSquare(row, c, 'capture');
                }
                break;
            }
        }
        for (let step = 1; step < 8; step++) {
            const c = (col - step + 8) % 8;
            if (!boardState[row][c]) {
                highlightSquare(row, c, 'move');
            } else {
                if (boardState[row][c].color !== piece.color) {
                    highlightSquare(row, c, 'capture');
                }
                break;
            }
        }
    }

    function highlightMovePlusRookMoves(row, col, piece) {
        // Стандартные ходы ладьи
        const rookDirections = [
            [1, 0], [-1, 0], [0, 1], [0, -1]
        ];
        processSlidingMoves(row, col, rookDirections, piece.color);
        
        // Ходы короля (на 1 клетку)
        const kingMoves = [
            [1, 1], [1, -1], [-1, 1], [-1, -1]
        ];
        processSingleMoves(row, col, kingMoves, piece.color);
    }
    

    function highlightXRaysRookMoves(row, col, piece) {
        const directions = [
            [1, 0], [-1, 0], [0, 1], [0, -1]
        ];
        
        directions.forEach(([dr, dc]) => {
            let r = row + dr;
            let c = col + dc;
            let hasJumped = false;
            
            while (isValidSquare(r, c)) {
                if (!boardState[r][c]) {
                    highlightSquare(r, c, hasJumped ? 'move-after-jump' : 'move');
                } else {
                    if (!hasJumped) {
                        highlightSquare(r, c, 'jump');
                        hasJumped = true;
                        
                        // Продолжаем после прыжка
                        let nextR = r + dr;
                        let nextC = c + dc;
                        while (isValidSquare(nextR, nextC)) {
                            if (!boardState[nextR][nextC]) {
                                highlightSquare(nextR, nextC, 'move-after-jump');
                            } else {
                                break;
                            }
                            nextR += dr;
                            nextC += dc;
                        }
                    }
                    break;
                }
                r += dr;
                c += dc;
            }
            
            // Проверка взятия без прыжка
            if (!hasJumped) {
                r = row + dr;
                c = col + dc;
                while (isValidSquare(r, c)) {
                    if (boardState[r][c]) {
                        if (boardState[r][c].color !== piece.color) {
                            highlightSquare(r, c, 'capture');
                        }
                        break;
                    }
                    r += dr;
                    c += dc;
                }
            }
        });
    }
    
    // Эволюция фигуры
    function evolvePiece(row, col, evolutionType) {
        const piece = boardState[row][col];
        boardState[row][col] = {
            ...piece,
            evolved: true,
            evolutionType: evolutionType
        };
        renderBoard();
    }
    
    // Обработка изменения размера окна
    function handleResize() {
        const boardSize = Math.min(
            window.innerHeight - 20,
            window.innerWidth - 320
        );
        
        boardElement.style.width = `${boardSize}px`;
        boardElement.style.height = `${boardSize}px`;
    }
    
    // Кнопка новой игры
    restartButton.addEventListener('click', initGame);
    
    // Начальная инициализация
    initGame();
    window.addEventListener('resize', handleResize);
});