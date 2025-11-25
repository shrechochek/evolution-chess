(function() {
    window.modRegistration = {
        name: "Дальнобойные пешки",
        description: "Пешки всегда ходят на 2 клетки вперёд",
        
        data: {
            pieces: {
                pawn: {
                    getMoves: function(game, x, y, piece) {
                        const moves = [];
                        const direction = piece.color === 'white' ? -1 : 1;
                        
                        // Всегда может ходить на 2 клетки вперёд (если путь свободен)
                        for (let i = 1; i <= 2; i++) {
                            const nx = x + (direction * i);
                            if (game.isValidSquare(nx, y)) {
                                if (!game.boardState[nx][y]) {
                                    moves.push({x: nx, y, type: 'move'});
                                } else {
                                    break; // Прекращаем если встретили препятствие
                                }
                            }
                        }
                        
                        // Стандартное взятие по диагонали
                        [-1, 1].forEach(dy => {
                            const nx = x + direction;
                            const ny = y + dy;
                            if (game.isValidSquare(nx, ny)) {
                                const target = game.boardState[nx][ny];
                                if (target && target.color !== piece.color) {
                                    moves.push({x: nx, y: ny, type: 'capture'});
                                }
                            }
                        });
                        
                        return moves;
                    },
                    
                    // Явно указываем сохранить все остальные свойства оригинальной пешки
                    evolutionOptions: Piece.pieces.pawn.evolutionOptions,
                    evolutionRequirement: Piece.pieces.pawn.evolutionRequirement,
                    texture: Piece.pieces.pawn.texture,
                    name: Piece.pieces.pawn.name
                }
            },
            
            // Переопределяем стандартные эволюции пешки, чтобы они учитывали новое движение
            overrides: {
                'spearmen': {
                    getMoves: function(game, x, y, piece) {
                        const moves = [];
                        const direction = piece.color === 'white' ? -1 : 1;
                        
                        // Может ходить на 2 клетки вперёд
                        for (let i = 1; i <= 2; i++) {
                            const nx = x + (direction * i);
                            if (game.isValidSquare(nx, y) && !game.boardState[nx][y]) {
                                moves.push({x: nx, y, type: 'move'});
                            } else {
                                break;
                            }
                        }
                        
                        // Может бить прямо и по диагонали
                        [-1, 0, 1].forEach(dy => {
                            const nx = x + direction;
                            const ny = y + dy;
                            if (game.isValidSquare(nx, ny)) {
                                const target = game.boardState[nx][ny];
                                if (target && target.color !== piece.color) {
                                    moves.push({x: nx, y: ny, type: 'capture'});
                                }
                            }
                        });
                        
                        return moves;
                    }
                },
                
                'move+ pawn': {
                    getMoves: function(game, x, y, piece) {
                        const moves = [];
                        const direction = piece.color === 'white' ? -1 : 1;
                        
                        // Может ходить на 2 клетки в любом направлении (кроме назад)
                        for (let dx = -2; dx <= 2; dx++) {
                            for (let dy = -2; dy <= 2; dy++) {
                                if (dx === 0 && dy === 0) continue; // Пропускаем текущую клетку
                                
                                const nx = x + dx;
                                const ny = y + dy;
                                
                                if (game.isValidSquare(nx, ny)) {
                                    // Вперёд - обычный ход
                                    if (dx === direction && dy === 0 && !game.boardState[nx][ny]) {
                                        moves.push({x: nx, y: ny, type: 'move'});
                                    }
                                    // Диагональ - взятие
                                    else if (Math.abs(dx) === 1 && Math.abs(dy) === 1) {
                                        const target = game.boardState[nx][ny];
                                        if (target && target.color !== piece.color) {
                                            moves.push({x: nx, y: ny, type: 'capture'});
                                        }
                                    }
                                }
                            }
                        }
                        
                        return moves;
                    }
                }
            }
        }
    };
})();