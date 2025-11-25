class MoveHandler {
    constructor(game) {
        this.game = game;
    }

    handleSquareClick(row, col) {
        if (!this.game.gameActive || this.game.pendingEvolution) return;
    
        const piece = this.game.boardState[row][col];
        const square = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
    
        // Снятие выделения
        if (this.game.selectedSquare?.row === row && this.game.selectedSquare?.col === col) {
            this.game.selectedSquare = null;
            this.game.selectedPieceDisplay.textContent = 'нет';
            this.game.renderer.renderBoard();
            return;
        }

        if (piece?.type === 'king' && piece.color === this.game.currentPlayer && piece.moves === 0) {
            this.game.selectedSquare = { row, col };
            this.game.selectedPieceDisplay.textContent = 
                `${piece.color === 'white' ? 'белый' : 'чёрный'} ${this.game.getPieceName(piece.type)}`;
            
            // Подсвечиваем возможные рокировки
            if (this.game.canCastle(piece.color, 'king')) {
                const targetCol = piece.color === 'white' ? 6 : 6;
                this.game.renderer.highlightSquare(row, targetCol, 'castle');
            }
            if (this.game.canCastle(piece.color, 'queen')) {
                const targetCol = piece.color === 'white' ? 2 : 2;
                this.game.renderer.highlightSquare(row, targetCol, 'castle');
            }
            
            return;
        }

        if (this.game.selectedSquare && this.game.boardState[this.game.selectedSquare.row][this.game.selectedSquare.col]?.type === 'king') {
            const { row: kingRow, col: kingCol } = this.game.selectedSquare;
            
            // Проверяем, что кликнули на клетку рокировки (на 2 клетки в сторону)
            if (row === kingRow && Math.abs(col - kingCol) === 2) {
                this.game.movePiece(kingRow, kingCol, row, col);
                return;
            }
        }
    
        // Выбор фигуры
        if (piece?.color === this.game.currentPlayer) {
            this.game.selectedSquare = { row, col };
            this.game.selectedPieceDisplay.textContent = 
                `${piece.color === 'white' ? 'белая' : 'чёрная'} ${
                    this.game.getPieceName(piece.evolved ? piece.evolutionType : piece.type)
                }`;
            this.game.renderer.renderBoard();
            this.game.moveHighlighter.highlightValidMoves(row, col);
            return;
        }
    
        // Выполнение хода
        if (this.game.selectedSquare) {
            const { row: fromRow, col: fromCol } = this.game.selectedSquare;
            
            if (this.game.moveValidator.isValidMove(fromRow, fromCol, row, col)) {
                this.game.movePiece(fromRow, fromCol, row, col);
                // Не вызываем switchPlayer здесь - он вызывается внутри movePiece
            }
        }
    }
}