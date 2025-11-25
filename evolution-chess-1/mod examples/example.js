(function() {
    window.modRegistration = {
        name: "Телепорт-пешки",
        description: "Пешки получают возможность телепортации",
        
        data: {
            pieces: {
                pawn: {
                    // Сохраняем оригинальные методы пешки
                    getMoves: Piece.pieces.pawn.getMoves,
                    evolutionRequirement: Piece.pieces.pawn.evolutionRequirement,
                    
                    // Используем замыкание, чтобы избежать рекурсии
                    evolutionOptions: (function() {
                        const originalEvolutionOptions = Piece.pieces.pawn.evolutionOptions;
                        
                        return function(piece) {
                            const originalOptions = originalEvolutionOptions ?
                                originalEvolutionOptions(piece) : [];
                            
                            return [
                                ...originalOptions,
                                {
                                    type: 'teleport-pawn',
                                    name: "Телепорт-пешка",
                                    description: "Может ходить на любую свободную клетку",
                                    texture: "teleport-pawn"
                                }
                            ];
                        };
                    })()
                }
            },
            
            evolutions: {
                'teleport-pawn': {
                    getMoves: function(game, x, y, piece) {
                        const moves = [];
                        
                        // Может ходить на любую свободную клетку
                        for (let row = 0; row < 8; row++) {
                            for (let col = 0; col < 8; col++) {
                                if (!game.boardState[row][col]) {
                                    moves.push({x: row, y: col, type: 'move'});
                                }
                            }
                        }
                        
                        // Может бить как обычная пешка
                        const direction = piece.color === 'white' ? -1 : 1;
                        [-1, 1].forEach(dy => {
                            const nx = x + direction;
                            const ny = y + dy;
                            if (game.isValidSquare(nx, ny) && 
                                game.boardState[nx][ny] && 
                                game.boardState[nx][ny].color !== piece.color) {
                                moves.push({x: nx, y: ny, type: 'capture'});
                            }
                        });
                        
                        return moves;
                    },
                    texture: "teleport-pawn"
                }
            },
            
            textures: {
                'teleport-pawn': 'teleport-pawn'
            }
        }
    };
})();