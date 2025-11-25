window.modRegistration = {
    name: "All Evolutions Mod",
    author: "Serebr1k, Shrechochek",
    version: "1.0",
    description: "Добавляет все возможные эволюции фигур с новыми способностями",
    texturePaths: {
        // Пешки
        'spearmen': 'assets/spearmen.png',
    },
    pieces: {
        pawn: {
            evolutionOptions: (piece) => [
                {
                    type: 'spearmen',
                    name: 'Копейщик',
                    description: 'Может бить клетку прямо перед собой',
                    texture: 'spearmen'
                }
            ]
        }
    },
    overrides: {
        // Полные определения для всех новых типов фигур
        'spearmen': {
            name: 'Копейщик',
            texture: 'spearmen',
            getMoves: (game, x, y, piece) => {
                const moves = [];
                const direction = piece.color === 'white' ? -1 : 1;
                
                if (game.isValidSquare(x + direction, y) && !game.boardState[x + direction][y]) {
                    moves.push({x: x + direction, y, type: 'move'});
                }
                
                [-1, 0, 1].forEach(dy => {
                    if (game.isValidSquare(x + direction, y + dy) && 
                        game.boardState[x + direction][y + dy] && 
                        game.boardState[x + direction][y + dy].color !== piece.color) {
                        moves.push({x: x + direction, y: y + dy, type: 'capture'});
                    }
                });
                
                return moves;
            }
        }
    }
}