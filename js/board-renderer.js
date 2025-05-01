class BoardRenderer {
    constructor(game) {
        this.game = game;
        this.errorImage = 'error'; // Базовое имя для текстуры ошибки
    }

    renderBoard() {
        this.game.boardElement.innerHTML = '';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                
                if (this.game.selectedSquare && this.game.selectedSquare.row === row && 
                    this.game.selectedSquare.col === col) {
                    square.classList.add('selected');
                }
                
                const piece = this.game.boardState[row][col];
                if (piece) {
                    this.renderPiece(square, piece);
                }
                
                square.addEventListener('click', () => this.game.moveHandler.handleSquareClick(row, col));
                this.game.boardElement.appendChild(square);
            }
        }
    }

    renderPiece(square, piece) {
        const pieceElement = document.createElement('div');
        pieceElement.className = 'piece';
        
        const pieceType = piece.evolved ? piece.evolutionType : piece.type;
        const textureName = Piece.getTexture(pieceType, piece.color);
        const img = new Image();
        
        img.onload = () => {
            pieceElement.style.backgroundImage = `url('pieces/${textureName}.png')`;
        };
        
        img.onerror = () => {
            pieceElement.classList.add('error');
            pieceElement.style.backgroundImage = `url('pieces/${this.errorImage}.png')`;
        };
        
        img.src = `pieces/${textureName}.png`;
        square.appendChild(pieceElement);
    }

    highlightSquare(row, col, type) {
        const square = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
        if (square) {
            square.classList.add(type === 'capture' ? 'capture' : 'highlight');
        }
    }
}