window.modRegistration = {
    name: "All Evolutions Mod",
    author: "Serebr1k, Shrechochek",
    version: "1.0",
    description: "Добавляет все возможные эволюции фигур с новыми способностями",
    texturePaths: {
        // Пешки
        'spearmen': 'assets/spearmen.png',
        'move-plus-pawn': 'assets/move-plus-pawn.png',
        'torpedo-pawn': 'assets/torpedo-pawn.png',
        'move-plus-plus-pawn': 'assets/move-plus-plus-pawn.png',
        'move-and-attack-pawn': 'assets/move-and-attack-pawn.png',
        'torpedo-plus-pawn': 'assets/torpedo-plus-pawn.png',
        
        // Кони
        'camel': 'assets/camel.png',
        'knight-with-next-evolution': 'assets/knight-with-next-evolution.png',
        'move-plus-knight': 'assets/move-plus-knight.png',
        
        // Слоны
        '2color-bishop': 'assets/2color-bishop.png',
        'x-ray-bishop': 'assets/x-ray-bishop.png',
        // 'cannibal-bishop': 'assets/cannibal-bishop.png',
        'bomb-bishop': 'assets/bomb-bishop.png',
        
        // Ладьи
        'x-ray-rook': 'assets/x-ray-rook.png',
        'move-plus-rook': 'assets/move-plus-rook.png',
        'horizontal-rook': 'assets/horizontal-rook.png',
        
        // Ферзи
        'queen-of-horses': 'assets/queen-of-horses.png',
        'queen-of-camels': 'assets/queen-of-camels.png',
        'queen-with-evolution': 'assets/queen-with-evolution.png',
        
        // Короли
        'boom-king': 'assets/boom-king.png',
        'king-with-potential': 'assets/king-with-potential.png',
        'move-plus-king': 'assets/move-plus-king.png'
    },
    pieces: {
        pawn: {
            evolutionOptions: (piece) => [
                {
                    type: 'spearmen',
                    name: 'Копейщик',
                    description: 'Может бить клетку прямо перед собой',
                    texture: 'spearmen'
                },
                {
                    type: 'move-plus-pawn',
                    name: 'Пешка+',
                    description: 'Может ходить по диагонали вперёд',
                    texture: 'move-plus-pawn'
                },
                {
                    type: 'torpedo-pawn',
                    name: 'Торпедная пешка',
                    description: 'Может продвинуться сразу на две клетки вперёд',
                    texture: 'torpedo-pawn'
                },
                {
                    type: 'move-plus-plus-pawn',
                    name: 'Пешка++',
                    description: 'Может ходить вперёд, по диагонали и в стороны',
                    texture: 'move-plus-plus-pawn'
                },
                {
                    type: 'move-and-attack-pawn',
                    name: 'Атакующая пешка',
                    description: 'Может атаковать прямо и по диагонали',
                    texture: 'move-and-attack-pawn'
                },
                {
                    type: 'torpedo-plus-pawn',
                    name: 'Торпеда+',
                    description: 'Может перепрыгивать через фигуры при движении',
                    texture: 'torpedo-plus-pawn'
                }
            ]
        },
        knight: {
            evolutionOptions: (piece) => [
                {
                    type: 'camel',
                    name: 'Верблюд',
                    description: 'Ходит на 3 клетки в одну сторону и 1 в другую',
                    texture: 'camel'
                },
                {
                    type: 'knight-with-next-evolution',
                    name: 'Конь с эволюцией',
                    description: 'Может эволюционировать дальше',
                    texture: 'knight-with-next-evolution'
                },
                {
                    type: 'move-plus-knight',
                    name: 'Конь+',
                    description: 'Может ходить как конь + по горизонтали и вертикали на 1 клетку',
                    texture: 'move-plus-knight'
                }
            ]
        },
        bishop: {
            evolutionOptions: (piece) => [
                {
                    type: '2color-bishop',
                    name: 'Двуцветный слон',
                    description: 'Ходит как слон + может ходить на 1 клетку в любую сторону',
                    texture: '2color-bishop'
                },
                {
                    type: 'x-ray-bishop',
                    name: 'Рентген-слон',
                    description: 'Может перепрыгивать через фигуры (1 за ход)',
                    texture: 'x-ray-bishop'
                },
                {
                    type: 'cannibal-bishop',
                    name: 'Каннибал-слон',
                    description: 'Может съедать свои фигуры',
                    texture: 'cannibal-bishop'
                },
                {
                    type: 'bomb-bishop',
                    name: 'Бомба-Слон',
                    description: 'Взрывает все вокруг (3x3) при съедении (кроме пешек и королей)',
                    texture: 'bomb-bishop'
                }
            ]
        },
        rook: {
            evolutionOptions: (piece) => [
                {
                    type: 'x-ray-rook',
                    name: 'Рентген-ладья',
                    description: 'Может перепрыгивать через фигуры (1 за ход)',
                    texture: 'x-ray-rook'
                },
                {
                    type: 'move-plus-rook',
                    name: 'Ладья+',
                    description: 'Ходит как ладья + может ходить на 1 клетку в любую сторону',
                    texture: 'move-plus-rook'
                },
                {
                    type: 'horizontal-rook',
                    name: 'Горизонтальная ладья',
                    description: 'Доска зациклена по горизонтали (из 8 клетки можно пойти в 1)',
                    texture: 'horizontal-rook'
                }
            ]
        },
        queen: {
            evolutionOptions: (piece) => [
                {
                    type: 'queen-of-horses',
                    name: 'Королева коней',
                    description: 'Ходит как ферзь + ходы коня',
                    texture: 'queen-of-horses'
                },
                {
                    type: 'queen-of-camels',
                    name: 'Королева верблюдов',
                    description: 'Ходит как ферзь + ходы верблюда (3+1)',
                    texture: 'queen-of-camels'
                },
                {
                    type: 'queen-with-evolution',
                    name: 'Королева с потенциалом',
                    description: 'Ходит как обычная королева, но может эволюционировать дальше',
                    texture: 'queen-with-evolution'
                }
            ]
        },
        king: {
            evolutionOptions: (piece) => [
                {
                    type: 'boom-king',
                    name: 'Король-бомба',
                    description: 'При смерти взрывает всё вокруг (3x3, включая пешек)',
                    texture: 'boom-king'
                },
                {
                    type: 'king-with-potential',
                    name: 'Король с потенциалом',
                    description: 'Обычный король с будущими эволюциями',
                    texture: 'king-with-potential'
                },
                {
                    type: 'move-plus-king',
                    name: 'Король+',
                    description: 'Может ходить на 2 клетки по вертикали/горизонтали',
                    texture: 'move-plus-king'
                }
            ]
        }
    },
    overrides: {
        // Полные определения для всех новых типов фигур
        'spearmen': {
            name: 'Копейщик',
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
        
        'move-plus-pawn': {
            name: 'Пешка+',
            getMoves: (game, x, y, piece) => {
                const moves = [];
                const direction = piece.color === 'white' ? -1 : 1;
                
                if (game.isValidSquare(x + direction, y) && !game.boardState[x + direction][y]) {
                    moves.push({x: x + direction, y, type: 'move'});
                }
                
                [-1, 1].forEach(dy => {
                    if (game.isValidSquare(x + direction, y + dy)) {
                        if (!game.boardState[x + direction][y + dy]) {
                            moves.push({x: x + direction, y: y + dy, type: 'move'});
                        }
                        if (game.boardState[x + direction][y + dy] && 
                            game.boardState[x + direction][y + dy].color !== piece.color) {
                            moves.push({x: x + direction, y: y + dy, type: 'capture'});
                        }
                    }
                });
                
                return moves;
            }
        },
        
        'torpedo-pawn': {
            name: 'Торпедная пешка',
            getMoves: (game, x, y, piece) => {
                const moves = [];
                const direction = piece.color === 'white' ? -1 : 1;
                
                [1, 2].forEach(steps => {
                    if (game.isValidSquare(x + steps * direction, y) && 
                        !game.boardState[x + steps * direction][y]) {
                        moves.push({x: x + steps * direction, y, type: 'move'});
                    }
                });
                
                [-1, 1].forEach(dy => {
                    if (game.isValidSquare(x + direction, y + dy) && 
                        game.boardState[x + direction][y + dy] && 
                        game.boardState[x + direction][y + dy].color !== piece.color) {
                        moves.push({x: x + direction, y: y + dy, type: 'capture'});
                    }
                });
                
                return moves;
            }
        },
        
        'move-plus-plus-pawn': {
            name: 'Пешка++',
            getMoves: (game, x, y, piece) => {
                const moves = [];
                const direction = piece.color === 'white' ? -1 : 1;
                
                // Ход вперёд
                if (game.isValidSquare(x + direction, y) && !game.boardState[x + direction][y]) {
                    moves.push({x: x + direction, y, type: 'move'});
                }
                
                // Ходы по диагонали вперёд
                [-1, 1].forEach(dy => {
                    const r = x + direction;
                    const c = y + dy;
                    if (game.isValidSquare(r, c)) {
                        if (!game.boardState[r][c]) {
                            moves.push({x: r, y: c, type: 'move'});
                        }
                        if (game.boardState[r][c] && game.boardState[r][c].color !== piece.color) {
                            moves.push({x: r, y: c, type: 'capture'});
                        }
                    }
                });
                
                // Ходы в стороны
                [-1, 1].forEach(dy => {
                    const c = y + dy;
                    if (game.isValidSquare(x, c) && !game.boardState[x][c]) {
                        moves.push({x, y: c, type: 'move'});
                    }
                });
                
                return moves;
            }
        },
        
        'move-and-attack-pawn': {
            name: 'Атакующая пешка',
            getMoves: (game, x, y, piece) => {
                const moves = [];
                const direction = piece.color === 'white' ? -1 : 1;
                
                // Ходы как move+ pawn
                if (game.isValidSquare(x + direction, y) && !game.boardState[x + direction][y]) {
                    moves.push({x: x + direction, y, type: 'move'});
                }
                
                // Взятие как move+ pawn и spearmen
                [-1, 0, 1].forEach(dy => {
                    const r = x + direction;
                    const c = y + dy;
                    if (game.isValidSquare(r, c) && game.boardState[r][c] && 
                        game.boardState[r][c].color !== piece.color) {
                        moves.push({x: r, y: c, type: 'capture'});
                    }
                });
                
                return moves;
            }
        },
        
        'torpedo-plus-pawn': {
            name: 'Торпеда+',
            getMoves: (game, x, y, piece) => {
                const moves = [];
                const direction = piece.color === 'white' ? -1 : 1;
                
                // Ходы как torpedo pawn с прыжком
                [1, 2].forEach(steps => {
                    const r = x + steps * direction;
                    if (game.isValidSquare(r, y)) {
                        if (steps === 1 || !game.boardState[x + direction][y]) {
                            if (!game.boardState[r][y]) {
                                moves.push({x: r, y, type: 'move'});
                            }
                        }
                    }
                });
                
                // Взятие по диагонали
                [-1, 1].forEach(dy => {
                    const r = x + direction;
                    const c = y + dy;
                    if (game.isValidSquare(r, c) && game.boardState[r][c] && 
                        game.boardState[r][c].color !== piece.color) {
                        moves.push({x: r, y: c, type: 'capture'});
                    }
                });
                
                return moves;
            }
        },
        
        'camel': {
            name: 'Верблюд',
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
        
        'knight-with-next-evolution': {
            name: 'Конь с эволюцией',
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
            }
        },
        
        'move-plus-knight': {
            name: 'Конь+',
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
                
                // Дополнительные ходы на 1 клетку
                const plusMoves = [
                    [1, 0], [-1, 0], [0, 1], [0, -1]
                ];
                
                plusMoves.forEach(([dx, dy]) => {
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
            '2color-bishop': {
                name: 'Двуцветный слон',
                getMoves: (game, x, y, piece) => {
                    const moves = [];
                    
                    // Стандартные ходы слона
                    const bishopDirections = [
                        [1, 1], [1, -1], [-1, 1], [-1, -1]
                    ];
                    
                    bishopDirections.forEach(([dx, dy]) => {
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
                    
                    // Ходы короля (на 1 клетку)
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
                }
            },

            'x-ray-bishop': {
                name: 'Рентген-слон',
                getMoves: (game, x, y, piece) => {
                    const moves = [];
                    const directions = [
                        [1, 1], [1, -1], [-1, 1], [-1, -1]
                    ];
                    
                    directions.forEach(([dr, dc]) => {
                        let r = x + dr;
                        let c = y + dc;
                        let hasJumped = false;
                        
                        while (game.isValidSquare(r, c)) {
                            if (!game.boardState[r][c]) {
                                moves.push({x: r, y: c, type: hasJumped ? 'move-after-jump' : 'move'});
                            } else {
                                if (!hasJumped) {
                                    moves.push({x: r, y: c, type: 'jump'});
                                    hasJumped = true;
                                    
                                    // Продолжаем после прыжка
                                    let nextR = r + dr;
                                    let nextC = c + dc;
                                    while (game.isValidSquare(nextR, nextC)) {
                                        if (!game.boardState[nextR][nextC]) {
                                            moves.push({x: nextR, y: nextC, type: 'move-after-jump'});
                                        } else {
                                            break;
                                        }
                                        nextR += dr;
                                        nextC += dc;
                                    }
                                }
                                break;
                            }
                            r += dr;
                            c += dc;
                        }
                        
                        // Проверка взятия без прыжка
                        if (!hasJumped) {
                            r = x + dr;
                            c = y + dc;
                            while (game.isValidSquare(r, c)) {
                                if (game.boardState[r][c]) {
                                    if (game.boardState[r][c].color !== piece.color) {
                                        moves.push({x: r, y: c, type: 'capture'});
                                    }
                                    break;
                                }
                                r += dr;
                                c += dc;
                            }
                        }
                    });
                    
                    return moves;
                }
            },

            'cannibal-bishop': {
                name: 'Каннибал-слон',
                getMoves: (game, x, y, piece) => {
                    const moves = [];
                    const directions = [
                        [1, 1], [1, -1], [-1, 1], [-1, -1]
                    ];
                    
                    directions.forEach(([dr, dc]) => {
                        let r = x + dr;
                        let c = y + dc;
                        
                        while (game.isValidSquare(r, c)) {
                            if (!game.boardState[r][c]) {
                                moves.push({x: r, y: c, type: 'move'});
                            } else {
                                // Может съесть любую фигуру (даже своего цвета)
                                moves.push({x: r, y: c, 
                                    type: game.boardState[r][c].color === piece.color ? 'capture-ally' : 'capture'});
                                break;
                            }
                            r += dr;
                            c += dc;
                        }
                    });
                    
                    return moves;
                }
            },

            'bomb-bishop': {
                name: 'Бомба-Слон',
                getMoves: (game, x, y, piece) => {
                    // Ходит как обычный слон
                    const moves = [];
                    const directions = [
                        [1, 1], [1, -1], [-1, 1], [-1, -1]
                    ];
                    
                    directions.forEach(([dr, dc]) => {
                        let r = x + dr;
                        let c = y + dc;
                        
                        while (game.isValidSquare(r, c)) {
                            if (!game.boardState[r][c]) {
                                moves.push({x: r, y: c, type: 'move'});
                            } else {
                                if (game.boardState[r][c].color !== piece.color) {
                                    moves.push({x: r, y: c, type: 'capture'});
                                }
                                break;
                            }
                            r += dr;
                            c += dc;
                        }
                    });
                    
                    return moves;
                }, 
                on_capture: (game, piece, x, y, capturedPiece, board) => {
                    // Взрыв при съедении любой фигуры
                    for (let r = Math.max(0, x-1); r <= Math.min(7, x+1); r++) {
                        for (let c = Math.max(0, y-1); c <= Math.min(7, y+1); c++) {
                            if (board[r][c] && board[r][c].type !== 'king') {
                                board[r][c] = null;
                            }
                        }
                    }
                    return board;
                }
            },

            'x-ray-rook': {
                name: 'Рентген-ладья',
                getMoves: (game, x, y, piece) => {
                    const moves = [];
                    const directions = [
                        [1, 0], [-1, 0], [0, 1], [0, -1]
                    ];
                    
                    directions.forEach(([dr, dc]) => {
                        let r = x + dr;
                        let c = y + dc;
                        let hasJumped = false;
                        
                        while (game.isValidSquare(r, c)) {
                            if (!game.boardState[r][c]) {
                                moves.push({x: r, y: c, type: hasJumped ? 'move-after-jump' : 'move'});
                            } else {
                                if (!hasJumped) {
                                    moves.push({x: r, y: c, type: 'jump'});
                                    hasJumped = true;
                                    
                                    // Продолжаем после прыжка
                                    let nextR = r + dr;
                                    let nextC = c + dc;
                                    while (game.isValidSquare(nextR, nextC)) {
                                        if (!game.boardState[nextR][nextC]) {
                                            moves.push({x: nextR, y: nextC, type: 'move-after-jump'});
                                        } else {
                                            break;
                                        }
                                        nextR += dr;
                                        nextC += dc;
                                    }
                                }
                                break;
                            }
                            r += dr;
                            c += dc;
                        }
                        
                        // Проверка взятия без прыжка
                        if (!hasJumped) {
                            r = x + dr;
                            c = y + dc;
                            while (game.isValidSquare(r, c)) {
                                if (game.boardState[r][c]) {
                                    if (game.boardState[r][c].color !== piece.color) {
                                        moves.push({x: r, y: c, type: 'capture'});
                                    }
                                    break;
                                }
                                r += dr;
                                c += dc;
                            }
                        }
                    });
                    
                    return moves;
                }
            },

            'move-plus-rook': {
                name: 'Ладья+',
                getMoves: (game, x, y, piece) => {
                    const moves = [];
                    
                    // Стандартные ходы ладьи
                    const rookDirections = [
                        [1, 0], [-1, 0], [0, 1], [0, -1]
                    ];
                    
                    rookDirections.forEach(([dr, dc]) => {
                        let r = x + dr;
                        let c = y + dc;
                        
                        while (game.isValidSquare(r, c)) {
                            if (!game.boardState[r][c]) {
                                moves.push({x: r, y: c, type: 'move'});
                            } else {
                                if (game.boardState[r][c].color !== piece.color) {
                                    moves.push({x: r, y: c, type: 'capture'});
                                }
                                break;
                            }
                            r += dr;
                            c += dc;
                        }
                    });
                    
                    // Ходы короля (на 1 клетку)
                    const kingMoves = [
                        [1, 1], [1, -1], [-1, 1], [-1, -1]
                    ];
                    
                    kingMoves.forEach(([dr, dc]) => {
                        const r = x + dr;
                        const c = y + dc;
                        
                        if (game.isValidSquare(r, c)) {
                            if (!game.boardState[r][c]) {
                                moves.push({x: r, y: c, type: 'move'});
                            } else if (game.boardState[r][c].color !== piece.color) {
                                moves.push({x: r, y: c, type: 'capture'});
                            }
                        }
                    });
                    
                    return moves;
                }
            },

            'horizontal-rook': {
                name: 'Горизонтальная ладья',
                getMoves: (game, x, y, piece) => {
                    const moves = [];
                    
                    // Вертикальные ходы (обычные)
                    for (let dr = 1; x + dr < 8; dr++) {
                        const r = x + dr;
                        if (!game.boardState[r][y]) {
                            moves.push({x: r, y, type: 'move'});
                        } else {
                            if (game.boardState[r][y].color !== piece.color) {
                                moves.push({x: r, y, type: 'capture'});
                            }
                            break;
                        }
                    }
                    for (let dr = -1; x + dr >= 0; dr--) {
                        const r = x + dr;
                        if (!game.boardState[r][y]) {
                            moves.push({x: r, y, type: 'move'});
                        } else {
                            if (game.boardState[r][y].color !== piece.color) {
                                moves.push({x: r, y, type: 'capture'});
                            }
                            break;
                        }
                    }
                    
                    // Горизонтальные ходы (зацикленные)
                    for (let step = 1; step < 8; step++) {
                        const c = (y + step) % 8;
                        if (!game.boardState[x][c]) {
                            moves.push({x, y: c, type: 'move'});
                        } else {
                            if (game.boardState[x][c].color !== piece.color) {
                                moves.push({x, y: c, type: 'capture'});
                            }
                            break;
                        }
                    }
                    for (let step = 1; step < 8; step++) {
                        const c = (y - step + 8) % 8;
                        if (!game.boardState[x][c]) {
                            moves.push({x, y: c, type: 'move'});
                        } else {
                            if (game.boardState[x][c].color !== piece.color) {
                                moves.push({x, y: c, type: 'capture'});
                            }
                            break;
                        }
                    }
                    
                    return moves;
                }
            },

            'queen-of-horses': {
                name: 'Королева коней',
                getMoves: (game, x, y, piece) => {
                    const moves = [];
                    
                    // Ходы ферзя
                    const queenDirections = [
                        [1, 0], [-1, 0], [0, 1], [0, -1],
                        [1, 1], [1, -1], [-1, 1], [-1, -1]
                    ];
                    
                    queenDirections.forEach(([dr, dc]) => {
                        let r = x + dr;
                        let c = y + dc;
                        
                        while (game.isValidSquare(r, c)) {
                            if (!game.boardState[r][c]) {
                                moves.push({x: r, y: c, type: 'move'});
                            } else {
                                if (game.boardState[r][c].color !== piece.color) {
                                    moves.push({x: r, y: c, type: 'capture'});
                                }
                                break;
                            }
                            r += dr;
                            c += dc;
                        }
                    });
                    
                    // Ходы коня
                    const knightMoves = [
                        [2, 1], [2, -1], [-2, 1], [-2, -1],
                        [1, 2], [1, -2], [-1, 2], [-1, -2]
                    ];
                    
                    knightMoves.forEach(([dr, dc]) => {
                        const r = x + dr;
                        const c = y + dc;
                        
                        if (game.isValidSquare(r, c)) {
                            if (!game.boardState[r][c]) {
                                moves.push({x: r, y: c, type: 'move'});
                            } else if (game.boardState[r][c].color !== piece.color) {
                                moves.push({x: r, y: c, type: 'capture'});
                            }
                        }
                    });
                    
                    return moves;
                }
            },

            'queen-of-camels': {
                name: 'Королева верблюдов',
                getMoves: (game, x, y, piece) => {
                    const moves = [];
                    
                    // Ходы ферзя
                    const queenDirections = [
                        [1, 0], [-1, 0], [0, 1], [0, -1],
                        [1, 1], [1, -1], [-1, 1], [-1, -1]
                    ];
                    
                    queenDirections.forEach(([dr, dc]) => {
                        let r = x + dr;
                        let c = y + dc;
                        
                        while (game.isValidSquare(r, c)) {
                            if (!game.boardState[r][c]) {
                                moves.push({x: r, y: c, type: 'move'});
                            } else {
                                if (game.boardState[r][c].color !== piece.color) {
                                    moves.push({x: r, y: c, type: 'capture'});
                                }
                                break;
                            }
                            r += dr;
                            c += dc;
                        }
                    });
                    
                    // Ходы верблюда
                    const camelMoves = [
                        [3, 1], [3, -1], [-3, 1], [-3, -1],
                        [1, 3], [1, -3], [-1, 3], [-1, -3]
                    ];
                    
                    camelMoves.forEach(([dr, dc]) => {
                        const r = x + dr;
                        const c = y + dc;
                        
                        if (game.isValidSquare(r, c)) {
                            if (!game.boardState[r][c]) {
                                moves.push({x: r, y: c, type: 'move'});
                            } else if (game.boardState[r][c].color !== piece.color) {
                                moves.push({x: r, y: c, type: 'capture'});
                            }
                        }
                    });
                    
                    return moves;
                }
            },

            'queen-with-evolution': {
                name: 'Королева с потенциалом',
                getMoves: (game, x, y, piece) => {
                    // Ходит как обычный ферзь
                    const moves = [];
                    const directions = [
                        [1, 0], [-1, 0], [0, 1], [0, -1],
                        [1, 1], [1, -1], [-1, 1], [-1, -1]
                    ];
                    
                    directions.forEach(([dr, dc]) => {
                        let r = x + dr;
                        let c = y + dc;
                        
                        while (game.isValidSquare(r, c)) {
                            if (!game.boardState[r][c]) {
                                moves.push({x: r, y: c, type: 'move'});
                            } else {
                                if (game.boardState[r][c].color !== piece.color) {
                                    moves.push({x: r, y: c, type: 'capture'});
                                }
                                break;
                            }
                            r += dr;
                            c += dc;
                        }
                    });
                    
                    return moves;
                }
            },

            'boom-king': {
                name: 'Король-бомба',
                getMoves: (game, x, y, piece) => {
                    // Ходит как обычный король
                    const moves = [];
                    const kingMoves = [
                        [0, 1], [1, 0], [0, -1], [-1, 0],
                        [1, 1], [1, -1], [-1, 1], [-1, -1]
                    ];
                    
                    kingMoves.forEach(([dr, dc]) => {
                        const r = x + dr;
                        const c = y + dc;
                        
                        if (game.isValidSquare(r, c)) {
                            if (!game.boardState[r][c]) {
                                moves.push({x: r, y: c, type: 'move'});
                            } else if (game.boardState[r][c].color !== piece.color) {
                                moves.push({x: r, y: c, type: 'capture'});
                            }
                        }
                    });
                    
                    return moves;
                }, 
                on_captured: (game, piece, x, y, capturedBy, board) => {
                    // Взрыв при смерти
                    for (let r = Math.max(0, x-1); r <= Math.min(7, x+1); r++) {
                        for (let c = Math.max(0, y-1); c <= Math.min(7, y+1); c++) {
                            if (!(r === x && c === y) && board[r][c]) {
                                board[r][c] = null;
                            }
                        }
                    }
                    return board;
                }
            },

            'king-with-potential': {
                name: 'Король с потенциалом',
                getMoves: (game, x, y, piece) => {
                    // Ходит как обычный король
                    const moves = [];
                    const kingMoves = [
                        [0, 1], [1, 0], [0, -1], [-1, 0],
                        [1, 1], [1, -1], [-1, 1], [-1, -1]
                    ];
                    
                    kingMoves.forEach(([dr, dc]) => {
                        const r = x + dr;
                        const c = y + dc;
                        
                        if (game.isValidSquare(r, c)) {
                            if (!game.boardState[r][c]) {
                                moves.push({x: r, y: c, type: 'move'});
                            } else if (game.boardState[r][c].color !== piece.color) {
                                moves.push({x: r, y: c, type: 'capture'});
                            }
                        }
                    });
                    
                    return moves;
                }
            },

            'move-plus-king': {
                name: 'Король+',
                getMoves: (game, x, y, piece) => {
                    const moves = [];
                    
                    // Стандартные ходы короля
                    const kingMoves = [
                        [1, 0], [-1, 0], [0, 1], [0, -1],
                        [1, 1], [1, -1], [-1, 1], [-1, -1]
                    ];
                    
                    kingMoves.forEach(([dr, dc]) => {
                        const r = x + dr;
                        const c = y + dc;
                        
                        if (game.isValidSquare(r, c)) {
                            if (!game.boardState[r][c]) {
                                moves.push({x: r, y: c, type: 'move'});
                            } else if (game.boardState[r][c].color !== piece.color) {
                                moves.push({x: r, y: c, type: 'capture'});
                            }
                        }
                    });
                    
                    // Дополнительные ходы на 2 клетки
                    const plusMoves = [
                        [2, 0], [-2, 0], [0, 2], [0, -2]
                    ];
                    
                    plusMoves.forEach(([dr, dc]) => {
                        const r = x + dr;
                        const c = y + dc;
                        
                        if (game.isValidSquare(r, c)) {
                            if (!game.boardState[r][c]) {
                                moves.push({x: r, y: c, type: 'move'});
                            } else if (game.boardState[r][c].color !== piece.color) {
                                moves.push({x: r, y: c, type: 'capture'});
                            }
                        }
                    });
                    
                    return moves;
                }
            }
        }
    }
}