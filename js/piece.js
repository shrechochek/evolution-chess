class Piece {
    static pieces = {
        pawn: {
            name: 'Пешка',
            texture: 'pawn',
            evolutionRequirement: 1,
            getMoves: (game, x, y, piece) => {
                const moves = [];
                const direction = piece.color === 'white' ? -1 : 1;
                
                if (game.isValidSquare(x + direction, y) && !game.boardState[x + direction][y]) {
                    moves.push({x: x + direction, y, type: 'move'});
                    
                    if ((piece.color === 'white' && x === 6) || (piece.color === 'black' && x === 1)) {
                        if (!game.boardState[x + 2 * direction][y]) {
                            moves.push({x: x + 2 * direction, y, type: 'move'});
                        }
                    }
                }
                
                [-1, 1].forEach(dy => {
                    if (game.isValidSquare(x + direction, y + dy) && 
                        game.boardState[x + direction][y + dy] && 
                        game.boardState[x + direction][y + dy].color !== piece.color) {
                        moves.push({x: x + direction, y: y + dy, type: 'capture'});
                    }
                });
                
                return moves;
            },
            evolutionOptions: (piece) => [
                {
                    type: 'spearmen',
                    name: 'Копейщик',
                    description: 'Может бить клетку прямо перед собой',
                    texture: 'spearmen'
                },
                {
                    type: 'movePlusPawn',
                    name: 'Пешка+',
                    description: 'Может ходить по диагонали вперёд',
                    texture: 'pawn-plus-pawn'
                },
                {
                    type: 'torpedoPawn',
                    name: 'Торпедная пешка',
                    description: 'Может продвинуться сразу на две клетки вперёд'
                },
                {
                    type: 'pawn',
                    name: 'Пешка',
                    description: 'Просто пешка'
                }
            ]
        },

        knight: {
            name: 'Конь',
            texture: 'knight',
            evolutionRequirement: 2,
            getMoves: (game, x, y, piece) => {
                const moves = [];
                const knightMoves = [
                    [2, 1], [2, -1], [-2, 1], [-2, -1],
                    [1, 2], [1, -2], [-1, 2], [-1, -2]
                ];
                
                knightMoves.forEach(([dx, dy]) => {
                    const nx = x + dx;
                    const ny = y + dy;
                    
                    if (game.isValidSquare(nx, ny)) {
                        if (!game.boardState[nx][ny]) {
                            moves.push({x: nx, y: ny, type: 'move'});
                        } else if (game.boardState[nx][ny].color !== piece.color) {
                            moves.push({x: nx, y: ny, type: 'capture'});
                        }
                    }
                });
                
                return moves;
            },
            evolutionOptions: (piece) => [
                {
                    type: 'camel',
                    name: 'Верблюд',
                    description: 'Ходит на 3 клетки в одну сторону и 1 в другую',
                    texture: 'camel'
                },
                {
                    type: 'movePlusKnight',
                    name: 'Конь+',
                    description: 'Может ходить как конь и король',
                    texture: 'knight-plus'
                },
                {
                    type: 'knightWithPotential',
                    name: 'конь с эволюциями',
                    description: 'имеет отличные от коня эволюции',
                    texture: 'knight-evolvable'
                }
            ]
        },

        bishop: {
            name: 'Слон',
            texture: 'bishop',
            evolutionRequirement: 2,
            getMoves: (game, x, y, piece) => {
                const moves = [];
                const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
                
                directions.forEach(([dx, dy]) => {
                    let nx = x + dx;
                    let ny = y + dy;
                    
                    while (game.isValidSquare(nx, ny)) {
                        if (!game.boardState[nx][ny]) {
                            moves.push({x: nx, y: ny, type: 'move'});
                        } else {
                            if (game.boardState[nx][ny].color !== piece.color) {
                                moves.push({x: nx, y: ny, type: 'capture'});
                            }
                            break;
                        }
                        nx += dx;
                        ny += dy;
                    }
                });
                
                return moves;
            },
            evolutionOptions: (piece) => [
                {
                    type: 'xRayBishop',
                    name: 'Рентген-слон',
                    description: 'Может перепрыгивать через фигуры',
                    texture: 'x-ray-bishop'
                },
                {
                    type: 'twoColorBishop',
                    name: 'Двуцветный слон',
                    description: 'Может ходить как слон и король',
                    texture: 'two-color-bishop'
                },
                {
                    type: 'bombBishop',
                    name: 'бомба слон',
                    description: 'взрывается при съедении',
                    texture: 'bomb-bishop'
                }
            ]
        },

        rook: {
            name: 'Ладья',
            texture: 'rook',
            evolutionRequirement: 2,
            getMoves: (game, x, y, piece) => {
                const moves = [];
                const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
                
                directions.forEach(([dx, dy]) => {
                    let nx = x + dx;
                    let ny = y + dy;
                    
                    while (game.isValidSquare(nx, ny)) {
                        if (!game.boardState[nx][ny]) {
                            moves.push({x: nx, y: ny, type: 'move'});
                        } else {
                            if (game.boardState[nx][ny].color !== piece.color) {
                                moves.push({x: nx, y: ny, type: 'capture'});
                            }
                            break;
                        }
                        nx += dx;
                        ny += dy;
                    }
                });
                
                return moves;
            },
            evolutionOptions: (piece) => [
                {
                    type: 'XRayRook',
                    name: 'Рентген-ладья',
                    description: 'Может перепрыгивать через фигуры',
                    texture: 'x-ray-rook'
                },
                {
                    type: 'movePlusRook',
                    name: 'Ладья+',
                    description: 'Может ходить как ладья и король',
                    texture: 'rook-plus'
                },
                {
                    type: 'horizontalRook',
                    name: 'горизонтальная ладья',
                    description: 'ходит так, как будто доска это цилиндр',
                    texture: 'horizontal-rook'
                },
                {
                    type: 'duck',
                    name: 'утка',
                    description: 'может переместиться на любую клекту, несъедобная',
                    texture: 'duck'
                }
            ]
        },

        queen: {
            name: 'Королева',
            texture: 'queen',
            evolutionRequirement: 3,
            getMoves: (game, x, y, piece) => {
                const moves = [];
                const directions = [
                    [0, 1], [1, 0], [0, -1], [-1, 0],
                    [1, 1], [1, -1], [-1, 1], [-1, -1]
                ];
                
                directions.forEach(([dx, dy]) => {
                    let nx = x + dx;
                    let ny = y + dy;
                    
                    while (game.isValidSquare(nx, ny)) {
                        if (!game.boardState[nx][ny]) {
                            moves.push({x: nx, y: ny, type: 'move'});
                        } else {
                            if (game.boardState[nx][ny].color !== piece.color) {
                                moves.push({x: nx, y: ny, type: 'capture'});
                            }
                            break;
                        }
                        nx += dx;
                        ny += dy;
                    }
                });
                
                return moves;
            },
            evolutionOptions: (piece) => [
                {
                    type: 'queenOfKnights',
                    name: 'Королева коней',
                    description: 'Может ходить как ферзь и конь',
                    texture: 'queen-of-horses'
                },
                {
                    type: 'queenOfCamels',
                    name: 'Королева верблюдов',
                    description: 'Может ходить как ферзь и верблюд',
                    texture: 'queen-camel'
                },
                {
                    type: 'queenWithPotential',
                    name: 'королева с потенциалом',
                    description: 'королева с потенциалом',
                    texture: 'queen-with-evolution'
                }
            ]
        },

        king: {
            name: 'Король',
            texture: 'king',
            evolutionRequirement: 1,
            getMoves: (game, x, y, piece) => {
                const moves = [];
                const kingMoves = [
                    [0, 1], [1, 0], [0, -1], [-1, 0],
                    [1, 1], [1, -1], [-1, 1], [-1, -1]
                ];
                
                kingMoves.forEach(([dx, dy]) => {
                    const nx = x + dx;
                    const ny = y + dy;
                    
                    if (game.isValidSquare(nx, ny)) {
                        if (!game.boardState[nx][ny]) {
                            moves.push({x: nx, y: ny, type: 'move'});
                        } else if (game.boardState[nx][ny].color !== piece.color) {
                            moves.push({x: nx, y: ny, type: 'capture'});
                        }
                    }
                });
                
                return moves;
            },
            evolutionOptions: (piece) => [
                {
                    type: 'movePlusKing',
                    name: 'Король+',
                    description: 'Может ходить на 2 клетки по вертикали/горизонтали',
                    texture: 'king-plus'
                },
                {
                    type: 'boomKing',
                    name: 'Король-бомба',
                    description: 'При смерти взрывает всё в поле 3 на 3',
                    texture: 'boom-king'
                },
                {
                    type: 'kingWithPotential',
                    name: 'король с потенциалом',
                    description: 'может эволюционировать дальше',
                    texture: 'king-with-potential'
                }
            ]
        },

        //SPECIAL FIGURES

        //PAWN EVOLUTIONS
        //---------------------------------------------------------------------------

        spearmen: {
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
        },

        movePlusPawn: {
            name: 'подвижная пешка',
            texture: 'move-plus-pawn',
            getMoves: (game, x, y, piece) => {
                const moves = [];
                const direction = piece.color === 'white' ? -1 : 1;
                
                [-1, 0, 1].forEach(dy => {
                    if (game.isValidSquare(x + direction, y + dy) && 
                        !game.boardState[x + direction][y + dy]) {
                        moves.push({x: x + direction, y: y + dy, type: 'move'});
                    }
                });

                [-1, 1].forEach(dy => {
                    if (game.isValidSquare(x + direction, y + dy) && 
                        game.boardState[x + direction][y + dy] && 
                        game.boardState[x + direction][y + dy].color !== piece.color) {
                        moves.push({x: x + direction, y: y + dy, type: 'capture'});
                    }
                })
                
                return moves;
            }
        },

        torpedoPawn: {
            name: 'торпедная пешка',
            texture: 'torpedo-pawn',
            getMoves: (game, x, y, piece) => {
                const moves = [];
                const direction = piece.color === 'white' ? -1 : 1;

                [1, 2].forEach(dy => {
                    if (game.isValidSquare(x + direction, y) && 
                        !game.boardState[x + direction][y]) {
                        moves.push({x: x + (direction*dy), y: y, type: 'move'});
                    }
                });

                [-1, 1].forEach(dy => {
                    if (game.isValidSquare(x + direction, y + dy) && 
                        game.boardState[x + direction][y + dy] && 
                        game.boardState[x + direction][y + dy].color !== piece.color) {
                        moves.push({x: x + direction, y: y + dy, type: 'capture'});
                    }
                })

                return moves;
            }
        },

        //KNIGHT EVOLUTIONS
        //---------------------------------------------------------------------------

        camel: {
            name: 'Верблюд',
            texture: 'camel',
            getMoves: (game, x, y, piece) => {
                const moves = [];
                const camelMoves = [
                    [3, 1], [3, -1], [-3, 1], [-3, -1],
                    [1, 3], [1, -3], [-1, 3], [-1, -3]
                ];
                
                camelMoves.forEach(([dx, dy]) => {
                    const nx = x + dx;
                    const ny = y + dy;
                    
                    if (game.isValidSquare(nx, ny)) {
                        if (!game.boardState[nx][ny]) {
                            moves.push({x: nx, y: ny, type: 'move'});
                        } else if (game.boardState[nx][ny].color !== piece.color) {
                            moves.push({x: nx, y: ny, type: 'capture'});
                        }
                    }
                });
                
                return moves;
            }
        },

        knightWithPotential: {
            name: 'конь с потенциалом',
            texture: 'knight-evolvable',

            getMoves: (game, x, y, piece) => {
                const moves = [];
                const knightMoves = [
                    [2, 1], [2, -1], [-2, 1], [-2, -1],
                    [1, 2], [1, -2], [-1, 2], [-1, -2]
                ];
                
                knightMoves.forEach(([dx, dy]) => {
                    const nx = x + dx;
                    const ny = y + dy;
                    
                    if (game.isValidSquare(nx, ny)) {
                        if (!game.boardState[nx][ny]) {
                            moves.push({x: nx, y: ny, type: 'move'});
                        } else if (game.boardState[nx][ny].color !== piece.color) {
                            moves.push({x: nx, y: ny, type: 'capture'});
                        }
                    }
                });
                
                return moves;
            },
        },

        movePlusKnight: {
            name: 'подвижный конь',
            texture: 'move-plus-knight',

            getMoves: (game, x, y, piece) => {
                const moves = [];
                const knightMoves = [
                    [2, 1], [2, -1], [-2, 1], [-2, -1],
                    [1, 2], [1, -2], [-1, 2], [-1, -2],
                    [0, 1], [0, -1], [1, 0], [-1, 0]
                ];
                
                knightMoves.forEach(([dx, dy]) => {
                    const nx = x + dx;
                    const ny = y + dy;
                    
                    if (game.isValidSquare(nx, ny)) {
                        if (!game.boardState[nx][ny]) {
                            moves.push({x: nx, y: ny, type: 'move'});
                        } else if (game.boardState[nx][ny].color !== piece.color) {
                            moves.push({x: nx, y: ny, type: 'capture'});
                        }
                    }
                });
                
                return moves;
            },
        },

        //BISHOP EVOLUTIONS
        //-------------------------------------------------------------------------

        XRayBishop: {//ДОДЕЛАТЬ
            name: 'Рентген-слон',
            texture: 'x-ray-bishop',

            getMoves: (game, x, y, piece) => {
            
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
        },

        twoColorBishop: {
            name: 'двух цветный слон',
            texture: 'two-color-bishop',

            getMoves: (game, x, y, piece) => {
                const moves = [];
                const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
                const kingMoves = [
                    [0, 1], [1, 0], [0, -1], [-1, 0],
                    [1, 1], [1, -1], [-1, 1], [-1, -1]
                ];
                
                kingMoves.forEach(([dx, dy]) => {
                    const nx = x + dx;
                    const ny = y + dy;
                    
                    if (game.isValidSquare(nx, ny)) {
                        if (!game.boardState[nx][ny]) {
                            moves.push({x: nx, y: ny, type: 'move'});
                        } else if (game.boardState[nx][ny].color !== piece.color) {
                            moves.push({x: nx, y: ny, type: 'capture'});
                        }
                    }
                });
                
                directions.forEach(([dx, dy]) => {
                    let nx = x + dx;
                    let ny = y + dy;
                    
                    while (game.isValidSquare(nx, ny)) {
                        if (!game.boardState[nx][ny]) {
                            moves.push({x: nx, y: ny, type: 'move'});
                        } else {
                            if (game.boardState[nx][ny].color !== piece.color) {
                                moves.push({x: nx, y: ny, type: 'capture'});
                            }
                            break;
                        }
                        nx += dx;
                        ny += dy;
                    }
                });
                
                return moves;
            },
        },

        bombBishop: {//ДОДЕЛАТЬ
            name: 'бомба слон',
            texture: 'bomb-bishop',

            getMoves: (game, x, y, piece) => {
                const moves = [];
                const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
                
                directions.forEach(([dx, dy]) => {
                    let nx = x + dx;
                    let ny = y + dy;
                    
                    while (game.isValidSquare(nx, ny)) {
                        if (!game.boardState[nx][ny]) {
                            moves.push({x: nx, y: ny, type: 'move'});
                        } else {
                            if (game.boardState[nx][ny].color !== piece.color) {
                                moves.push({x: nx, y: ny, type: 'capture'});
                            }
                            break;
                        }
                        nx += dx;
                        ny += dy;
                    }
                });
                
                return moves;
            },
        },

        //ROOK EVOLUTIONS
        //--------------------------------------------------------------------

        XRayRook: {//ДОДЕЛАТЬ
            name: 'рентген ладья',
            texture: 'x-ray-rook',

            getMoves: (game, x, y, piece) => {
                const moves = [];
                const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
                
                directions.forEach(([dx, dy]) => {
                    let nx = x + dx;
                    let ny = y + dy;
                    
                    while (game.isValidSquare(nx, ny)) {
                        if (!game.boardState[nx][ny]) {
                            moves.push({x: nx, y: ny, type: 'move'});
                        } else {
                            if (game.boardState[nx][ny].color !== piece.color) {
                                moves.push({x: nx, y: ny, type: 'capture'});
                            }
                            break;
                        }
                        nx += dx;
                        ny += dy;
                    }
                });
                
                return moves;
            },
        },

        movePlusRook: {
            name: 'подвижная ладья',
            texture: 'move-plus-rook',

            getMoves: (game, x, y, piece) => {
                const moves = [];
                const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
                const kingMoves = [
                    [0, 1], [1, 0], [0, -1], [-1, 0],
                    [1, 1], [1, -1], [-1, 1], [-1, -1]
                ];
                
                kingMoves.forEach(([dx, dy]) => {
                    const nx = x + dx;
                    const ny = y + dy;
                    
                    if (game.isValidSquare(nx, ny)) {
                        if (!game.boardState[nx][ny]) {
                            moves.push({x: nx, y: ny, type: 'move'});
                        } else if (game.boardState[nx][ny].color !== piece.color) {
                            moves.push({x: nx, y: ny, type: 'capture'});
                        }
                    }
                });
                
                directions.forEach(([dx, dy]) => {
                    let nx = x + dx;
                    let ny = y + dy;
                    
                    while (game.isValidSquare(nx, ny)) {
                        if (!game.boardState[nx][ny]) {
                            moves.push({x: nx, y: ny, type: 'move'});
                        } else {
                            if (game.boardState[nx][ny].color !== piece.color) {
                                moves.push({x: nx, y: ny, type: 'capture'});
                            }
                            break;
                        }
                        nx += dx;
                        ny += dy;
                    }
                });
                
                return moves;
            },
        },

        horizontalRook: {//ДОДЕЛАТЬ
            name: 'горизонтальная ладья',
            texture: 'horizontal-rook',

            getMoves: (game, x, y, piece) => {
                const moves = [];
                const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
                
                directions.forEach(([dx, dy]) => {
                    let nx = x + dx;
                    let ny = y + dy;
                    
                    while (game.isValidSquare(nx, ny)) {
                        if (!game.boardState[nx][ny]) {
                            moves.push({x: nx, y: ny, type: 'move'});
                        } else {
                            if (game.boardState[nx][ny].color !== piece.color) {
                                moves.push({x: nx, y: ny, type: 'capture'});
                            }
                            break;
                        }
                        nx += dx;
                        ny += dy;
                    }
                });
                
                return moves;
            },
        },

        duck: {
            name: 'утка',
            texture: 'duck',

            getMoves: (game, x, y, piece) => {
                
                const moves = [];

                for (let r = 0; r < 8; r++) {
                    for (let c = 0; c < 8; c++) {
                        if (!game.boardState[r][c] && !(r == x && c == y)) {
                            moves.push({x: r,y: c,type: 'move'});
                        }
                    }
                }
                
                return moves;
            },
        },

        //QUEEN EVOLUTIONS
        //-----------------------------------------------------------------------
        

        queenWithPotential: {
            name: 'Королева с потенциалом',
            texture: 'queen-with-evolution',

            getMoves: (game, x, y, piece) => {
                const moves = [];
                const directions = [
                    [0, 1], [1, 0], [0, -1], [-1, 0],
                    [1, 1], [1, -1], [-1, 1], [-1, -1]
                ];
                
                directions.forEach(([dx, dy]) => {
                    let nx = x + dx;
                    let ny = y + dy;
                    
                    while (game.isValidSquare(nx, ny)) {
                        if (!game.boardState[nx][ny]) {
                            moves.push({x: nx, y: ny, type: 'move'});
                        } else {
                            if (game.boardState[nx][ny].color !== piece.color) {
                                moves.push({x: nx, y: ny, type: 'capture'});
                            }
                            break;
                        }
                        nx += dx;
                        ny += dy;
                    }
                });
                
                return moves;
            },
        },

        queenOfKnights: {
            name: 'Королева коней',
            texture: 'queen-of-horses',
            
            getMoves: (game, x, y, piece) => {
                const moves = [];
                const directions = [
                    [0, 1], [1, 0], [0, -1], [-1, 0],
                    [1, 1], [1, -1], [-1, 1], [-1, -1]
                ];
                const knightMoves = [
                    [2, 1], [2, -1], [-2, 1], [-2, -1],
                    [1, 2], [1, -2], [-1, 2], [-1, -2]
                ];
                
                knightMoves.forEach(([dx, dy]) => {
                    const nx = x + dx;
                    const ny = y + dy;
                    
                    if (game.isValidSquare(nx, ny)) {
                        if (!game.boardState[nx][ny]) {
                            moves.push({x: nx, y: ny, type: 'move'});
                        } else if (game.boardState[nx][ny].color !== piece.color) {
                            moves.push({x: nx, y: ny, type: 'capture'});
                        }
                    }
                });
                
                directions.forEach(([dx, dy]) => {
                    let nx = x + dx;
                    let ny = y + dy;
                    
                    while (game.isValidSquare(nx, ny)) {
                        if (!game.boardState[nx][ny]) {
                            moves.push({x: nx, y: ny, type: 'move'});
                        } else {
                            if (game.boardState[nx][ny].color !== piece.color) {
                                moves.push({x: nx, y: ny, type: 'capture'});
                            }
                            break;
                        }
                        nx += dx;
                        ny += dy;
                    }
                });
                
                return moves;
            },
        },

        queenOfCamels: {
            name: 'Королева верблюдов',
            texture: 'queen-of-camels',

            getMoves: (game, x, y, piece) => {
                const moves = [];
                const directions = [
                    [0, 1], [1, 0], [0, -1], [-1, 0],
                    [1, 1], [1, -1], [-1, 1], [-1, -1]
                ];
                const camelMoves = [
                    [3, 1], [3, -1], [-3, 1], [-3, -1],
                    [1, 3], [1, -3], [-1, 3], [-1, -3]
                ];
                
                camelMoves.forEach(([dx, dy]) => {
                    const nx = x + dx;
                    const ny = y + dy;
                    
                    if (game.isValidSquare(nx, ny)) {
                        if (!game.boardState[nx][ny]) {
                            moves.push({x: nx, y: ny, type: 'move'});
                        } else if (game.boardState[nx][ny].color !== piece.color) {
                            moves.push({x: nx, y: ny, type: 'capture'});
                        }
                    }
                });
                
                directions.forEach(([dx, dy]) => {
                    let nx = x + dx;
                    let ny = y + dy;
                    
                    while (game.isValidSquare(nx, ny)) {
                        if (!game.boardState[nx][ny]) {
                            moves.push({x: nx, y: ny, type: 'move'});
                        } else {
                            if (game.boardState[nx][ny].color !== piece.color) {
                                moves.push({x: nx, y: ny, type: 'capture'});
                            }
                            break;
                        }
                        nx += dx;
                        ny += dy;
                    }
                });
                
                return moves;
            },
        },

        //KING EVOLUTIONS
        //-------------------------------------------------------------------------

        movePlusKing: {
            name: 'подвижный король',
            texture: 'move-plus-king',

            getMoves: (game, x, y, piece) => {
                const moves = [];
                const kingMoves = [
                    [0, 1], [1, 0], [0, -1], [-1, 0],
                    [1, 1], [1, -1], [-1, 1], [-1, -1],
                    [0, 2], [0, -2]
                ];
                
                kingMoves.forEach(([dx, dy]) => {
                    const nx = x + dx;
                    const ny = y + dy;
                    
                    if (game.isValidSquare(nx, ny)) {
                        if (!game.boardState[nx][ny]) {
                            moves.push({x: nx, y: ny, type: 'move'});
                        } else if (game.boardState[nx][ny].color !== piece.color) {
                            moves.push({x: nx, y: ny, type: 'capture'});
                        }
                    }
                });
                
                return moves;
            },
        },

        kingWithPotential: {
            name: 'корль с потенциалом',
            texture: 'king-with-potential',

            getMoves: (game, x, y, piece) => {
                const moves = [];
                const kingMoves = [
                    [0, 1], [1, 0], [0, -1], [-1, 0],
                    [1, 1], [1, -1], [-1, 1], [-1, -1]
                ];
                
                kingMoves.forEach(([dx, dy]) => {
                    const nx = x + dx;
                    const ny = y + dy;
                    
                    if (game.isValidSquare(nx, ny)) {
                        if (!game.boardState[nx][ny]) {
                            moves.push({x: nx, y: ny, type: 'move'});
                        } else if (game.boardState[nx][ny].color !== piece.color) {
                            moves.push({x: nx, y: ny, type: 'capture'});
                        }
                    }
                });
                
                return moves;
            },
        },

        boomKing: {
            name: 'взрывной король',
            texture: 'boom-king',

            getMoves: (game, x, y, piece) => {
                const moves = [];
                const kingMoves = [
                    [0, 1], [1, 0], [0, -1], [-1, 0],
                    [1, 1], [1, -1], [-1, 1], [-1, -1]
                ];
                
                kingMoves.forEach(([dx, dy]) => {
                    const nx = x + dx;
                    const ny = y + dy;
                    
                    if (game.isValidSquare(nx, ny)) {
                        if (!game.boardState[nx][ny]) {
                            moves.push({x: nx, y: ny, type: 'move'});
                        } else if (game.boardState[nx][ny].color !== piece.color) {
                            moves.push({x: nx, y: ny, type: 'capture'});
                        }
                    }
                });
                
                return moves;
            },
        }
    };

    static mods = {};
    static customTextures = {};
    static overrides = {};

    static registerMod(modName, modData) {
        this.mods[modName] = modData;
        
        if (modData.pieces) {
            for (const [pieceType, pieceData] of Object.entries(modData.pieces)) {
                this.pieces[pieceType] = pieceData;
                if (pieceData.texturePath) {
                    this.customTextures[pieceType] = pieceData.texturePath;
                }
            }
        }
        
        if (modData.overrides) {
            for (const [pieceType, overrideData] of Object.entries(modData.overrides)) {
                if (!this.overrides[pieceType]) this.overrides[pieceType] = {};
                Object.assign(this.overrides[pieceType], overrideData);
            }
        }
        
        if (modData.evolutions) {
            for (const [baseType, newEvolutions] of Object.entries(modData.evolutions)) {
                if (this.pieces[baseType]) {
                    const existingOptions = this.pieces[baseType].evolutionOptions || (() => []);
                    this.pieces[baseType].evolutionOptions = (piece) => [
                        ...existingOptions(piece),
                        ...newEvolutions
                    ];
                }
            }
        }
    }

    static getPieceDefinition(pieceType) {
        // Сначала проверяем эволюции
        for (const mod of Object.values(this.mods)) {
            if (mod.evolutions && mod.evolutions[pieceType]) {
                return {...mod.evolutions[pieceType]};
            }
        }
        
        // Затем проверяем переопределения
        const definition = {...this.pieces[pieceType]};
        if (this.overrides[pieceType]) {
            Object.assign(definition, this.overrides[pieceType]);
        }
        
        return definition;
    }

    static getMoves(game, x, y, piece) {
        const pieceType = piece.evolved ? piece.evolutionType : piece.type;
        const definition = this.getPieceDefinition(pieceType);
        return definition.getMoves?.(game, x, y, piece) || [];
    }

    static getTexture(pieceType, color) {
        const definition = this.getPieceDefinition(pieceType);
        const baseTexture = definition.texturePath || 
                           definition.texture || 
                           pieceType;
        
        // Унифицируем имя файла:
        return `${color}-${baseTexture}`
            .replace(/\+/g, '-plus')
            .replace(/[_\s]/g, '-')
            .toLowerCase();
    }

    static getEvolutionOptions(piece) {
        const pieceType = piece.evolved ? piece.evolutionType : piece.type;
        const definition = this.getPieceDefinition(pieceType);
        return definition.evolutionOptions?.(piece) || [];
    }
}