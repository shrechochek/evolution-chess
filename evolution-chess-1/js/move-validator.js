class MoveValidator {
    constructor(game) {
        this.game = game;
    }

    isValidSquare(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    isValidMove(fromRow, fromCol, toRow, toCol) {
        const fromPiece = this.game.boardState[fromRow][fromCol];
        const toPiece = this.game.boardState[toRow][toCol];
        
        if (!fromPiece) return false;

        // Получаем все возможные ходы для фигуры
        const moves = Piece.getMoves(this.game, fromRow, fromCol, fromPiece);
        
        // Проверяем есть ли среди них нужный ход
        return moves.some(move => {
            if (move.x !== toRow || move.y !== toCol) return false;
            
            // Проверяем соответствие типа хода
            if (move.type.includes('capture')) {
                // Для любого типа взятия должна быть фигура в месте назначения
                return !!toPiece && (move.type !== 'capture-ally' || toPiece.color === fromPiece.color);
            } else {
                // Для обычного хода клетка должна быть пустой
                return !toPiece;
            }
        });
    }

    hasPiecesBetween(fromRow, fromCol, toRow, toCol) {
        const dr = Math.sign(toRow - fromRow);
        const dc = Math.sign(toCol - fromCol);
        let r = fromRow + dr;
        let c = fromCol + dc;
        
        while (r !== toRow || c !== toCol) {
            if (this.game.boardState[r][c]) return true;
            r += dr;
            c += dc;
        }
        return false;
    }
}