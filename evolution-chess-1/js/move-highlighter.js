class MoveHighlighter {
    constructor(game) {
        this.game = game;
    }

    highlightValidMoves(row, col) {
        const piece = this.game.boardState[row][col];
        if (!piece) return;

        // Очистка предыдущих подсветок
        document.querySelectorAll('.highlight, .capture, .move-after-jump, .jump, .capture-ally, .castle').forEach(el => {
            el.classList.remove('highlight', 'capture', 'move-after-jump', 'jump', 'capture-ally', 'castle');
        });

        // Получаем ходы через Piece.getMoves (учитывает моды!)
        const moves = Piece.getMoves(this.game, row, col, piece);
        console.log(`Доступные ходы для ${piece.type}:`, moves);

        // Подсвечиваем клетки
        moves.forEach(({x, y, type}) => {
            // Определяем класс подсветки в зависимости от типа хода
            let highlightClass = 'highlight'; // Обычный ход по умолчанию
            
            if (type.includes('capture')) {
                highlightClass = 'capture';  // Взятие
            } else if (type === 'move-after-jump') {
                highlightClass = 'move-after-jump';  // Ход после прыжка
            } else if (type === 'jump') {
                highlightClass = 'jump';  // Прыжок
            }
            
            this.game.renderer.highlightSquare(x, y, highlightClass);
        });
    }
}