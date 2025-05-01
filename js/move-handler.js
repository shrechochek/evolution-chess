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
                if (!this.game.pendingEvolution) this.game.switchPlayer();
            }
        }
    }
}