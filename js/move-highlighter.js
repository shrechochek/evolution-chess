class MoveHighlighter {
    constructor(game) {
        this.game = game;
    }

    highlightValidMoves(row, col) {
        const piece = this.game.boardState[row][col];
        if (!piece) return;

        // Очистка предыдущих подсветок
        document.querySelectorAll('.highlight, .capture, .move-after-jump, .jump, .capture-ally').forEach(el => {
            el.classList.remove('highlight', 'capture', 'move-after-jump', 'jump', 'capture-ally');
        });

        // Получаем ходы через Piece.getMoves (учитывает моды!)
        const moves = Piece.getMoves(this.game, row, col, piece);

        // Подсвечиваем клетки
        moves.forEach(({x, y, type}) => {
            this.game.renderer.highlightSquare(x, y, type === 'capture' ? 'capture' : 'move');
        });
    }
}