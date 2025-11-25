window.modRegistration = {
    name: "All Evolutions Mod",
    author: "Serebr1k, Shrechochek",
    version: "1.0",
    description: "Добавляет все возможные эволюции фигур с новыми способностями",
    texturePaths: {
        // Пешки
        'spearmen': {
            'black': 'assets/black-spearmen.png',
            'white': 'assets/white-spearmen.png'
        },
        'move-plus-pawn': {
            'black': 'assets/black-move-plus-pawn.png',
            'white': 'assets/white-move-plus-pawn.png'
        },
        'torpedo-pawn': {
            'black': 'assets/black-torpedo-pawn.png',
            'white': 'assets/white-torpedo-pawn.png'
        },
        'move-plus-plus-pawn': {
            'black': 'assets/black-move-plus-plus-pawn.png',
            'white': 'assets/white-move-plus-plus-pawn.png'
        },
        'move-and-attack-pawn': {
            'black': 'assets/black-move-and-attack-pawn.png',
            'white': 'assets/white-move-and-attack-pawn.png'
        },
        'torpedo-plus-pawn': {
            'black': 'assets/black-torpedo-plus-pawn.png',
            'white': 'assets/white-torpedo-plus-pawn.png'
        },
        
        // Кони
        'camel': {
            'black': 'assets/black-camel.png',
            'white': 'assets/white-camel.png'
        },
        'knight-with-next-evolution': {
            'black': 'assets/black-knight-evolvable.png',
            'white': 'assets/white-knight-evolvable.png'
        },
        'move-plus-knight': {
            'black': 'assets/black-move-plus-knight.png',
            'white': 'assets/white-move-plus-knight.png'
        },
        
        // Слоны
        '2color-bishop': {
            'black': 'assets/black-2color-bishop.png',
            'white': 'assets/white-2color-bishop.png'
        },
        'x-ray-bishop': {
            'black': 'assets/black-x-ray-bishop.png',
            'white': 'assets/white-x-ray-bishop.png'
        },
        'bomb-bishop': {
            'black': 'assets/black-bomb-bishop.png',
            'white': 'assets/white-bomb-bishop.png'
        },
        
        // Ладьи
        'x-ray-rook': {
            'black': 'assets/black-x-ray-rook.png',
            'white': 'assets/white-x-ray-rook.png'
        },
        'move-plus-rook': {
            'black': 'assets/black-move-plus-rook.png',
            'white': 'assets/white-move-plus-rook.png'
        },
        'horizontal-rook': {
            'black': 'assets/black-horizontal-rook.png',
            'white': 'assets/white-horizontal-rook.png'
        },
        
        // Ферзи
        'queen-of-horses': {
            'black': 'assets/black-queen-of-horses.png',
            'white': 'assets/white-queen-of-horses.png'
        },
        'queen-of-camels': {
            'black': 'assets/black-queen-of-camels.png',
            'white': 'assets/white-queen-of-camels.png'
        },
        'queen-with-evolution': {
            'black': 'assets/black-queen-with-evolution.png',
            'white': 'assets/white-queen-with-evolution.png'
        },
        
        // Короли
        'boom-king': {
            'black': 'assets/black-boom-king.png',
            'white': 'assets/white-boom-king.png'
        },
        'king-with-potential': {
            'black': 'assets/black-king-with-potentional.png',
            'white': 'assets/white-king-with-potential.png'
        },
        'move-plus-king': {
            'black': 'assets/black-move-plus-king.png',
            'white': 'assets/white-move-plus-king.png'
        }
    },
    pieces: {
        pawn: {
            evolutionOptions: (piece) => [
                {
                    type: 'spearmen',
                    name: 'Копейщик',
                    description: 'Может бить клетку прямо перед собой'
                },
                {
                    type: 'move-plus-pawn',
                    name: 'Пешка+',
                    description: 'Может ходить по диагонали вперёд'
                },
                {
                    type: 'torpedo-pawn',
                    name: 'Торпедная пешка',
                    description: 'Может продвинуться сразу на две клетки вперёд'
                },
                // {
                //     type: 'move-plus-plus-pawn',
                //     name: 'Пешка++',
                //     description: 'Может ходить вперёд, по диагонали и в стороны'
                // },
                // {
                //     type: 'move-and-attack-pawn',
                //     name: 'Атакующая пешка',
                //     description: 'Может атаковать прямо и по диагонали'
                // },
                // {
                //     type: 'torpedo-plus-pawn',
                //     name: 'Торпеда+',
                //     description: 'Может перепрыгивать через фигуры при движении'
                // }
            ]
        },
        knight: {
            evolutionOptions: (piece) => [
                {
                    type: 'camel',
                    name: 'Верблюд',
                    description: 'Ходит на 3 клетки в одну сторону и 1 в другую'
                },
                {
                    type: 'knight-with-next-evolution',
                    name: 'Конь с эволюцией',
                    description: 'Может эволюционировать дальше'
                },
                {
                    type: 'move-plus-knight',
                    name: 'Конь+',
                    description: 'Может ходить как конь + по горизонтали и вертикали на 1 клетку'
                }
            ]
        },
        bishop: {
            evolutionOptions: (piece) => [
                {
                    type: '2color-bishop',
                    name: 'Двуцветный слон',
                    description: 'Ходит как слон + может ходить на 1 клетку в любую сторону'
                },
                {
                    type: 'x-ray-bishop',
                    name: 'Рентген-слон',
                    description: 'Может перепрыгивать через фигуры (1 за ход)'
                },
                // {
                //     type: 'cannibal-bishop',
                //     name: 'Каннибал-слон',
                //     description: 'Может съедать свои фигуры'
                // },
                {
                    type: 'bomb-bishop',
                    name: 'Бомба-Слон',
                    description: 'Взрывает все вокруг (3x3) при съедении (кроме пешек и королей)'
                }
            ]
        },
        rook: {
            evolutionOptions: (piece) => [
                {
                    type: 'x-ray-rook',
                    name: 'Рентген-ладья',
                    description: 'Может перепрыгивать через фигуры (1 за ход)'
                },
                {
                    type: 'move-plus-rook',
                    name: 'Ладья+',
                    description: 'Ходит как ладья + может ходить на 1 клетку в любую сторону'
                },
                {
                    type: 'horizontal-rook',
                    name: 'Горизонтальная ладья',
                    description: 'Доска зациклена по горизонтали (из 8 клетки можно пойти в 1)'
                }
            ]
        },
        queen: {
            evolutionOptions: (piece) => [
                {
                    type: 'queen-of-horses',
                    name: 'Королева коней',
                    description: 'Ходит как ферзь + ходы коня'
                },
                {
                    type: 'queen-of-camels',
                    name: 'Королева верблюдов',
                    description: 'Ходит как ферзь + ходы верблюда (3+1)'
                },
                {
                    type: 'queen-with-evolution',
                    name: 'Королева с потенциалом',
                    description: 'Ходит как обычная королева, но может эволюционировать дальше'
                }
            ]
        },
        king: {
            evolutionOptions: (piece) => [
                {
                    type: 'boom-king',
                    name: 'Король-бомба',
                    description: 'При смерти взрывает всё вокруг (3x3, включая пешек)'
                },
                {
                    type: 'king-with-potential',
                    name: 'Король с потенциалом',
                    description: 'Обычный король с будущими эволюциями'
                },
                {
                    type: 'move-plus-king',
                    name: 'Король+',
                    description: 'Может ходить на 2 клетки по вертикали/горизонтали'
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
        },
        
        'move-plus-pawn': {
            name: 'Пешка+',
            texture: 'move-plus-pawn',
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
            texture: 'torpedo-pawn',
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
            texture: 'move-plus-plus-pawn',
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
            texture: 'move-and-attack-pawn',
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
            texture: 'torpedo-plus-pawn',
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
        
        'knight-with-next-evolution': {
            name: 'Конь с эволюцией',
            texture: 'knight-with-next-evolution',
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
            texture: 'move-plus-knight',
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
            }
        },
        
        '2color-bishop': {
            name: 'Двуцветный слон',
            texture: '2color-bishop',
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
            texture: 'x-ray-bishop',
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
            texture: 'cannibal-bishop',
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
            texture: 'bomb-bishop',
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
            // Обработчик для случая, когда этот слон захватывает другую фигуру
            onCapture: function(game, piece, x, y, capturedPiece, board) {
                // ВАЖНО: НЕМЕДЛЕННО ОБНОВЛЯЕМ ДОСКУ, чтобы показать текущее состояние
                requestAnimationFrame(() => {
                    game.renderer.renderBoard();
                    
                    // Затем запускаем взрыв с задержкой
                    setTimeout(() => {
                        try {
                            // Создаем эффект взрыва с максимальным приоритетом
                            const centerSquare = document.querySelector(`.square[data-row="${x}"][data-col="${y}"]`);
                            if (centerSquare) {
                                // Создаем большой яркий взрыв
                                const explosion = document.createElement('div');
                                explosion.className = 'explosion-effect';
                                explosion.style.zIndex = "999"; // Максимальный приоритет
                                explosion.style.transform = "scale(1.5)";
                                explosion.style.background = "radial-gradient(circle, rgba(255,165,0,0.9) 0%, rgba(255,0,0,0.8) 50%, rgba(0,0,0,0) 100%)";
                                centerSquare.appendChild(explosion);
                                
                                // Убеждаемся, что анимация запустилась
                                requestAnimationFrame(() => {
                                    // Определяем зону взрыва
                                    const startRow = Math.max(0, x - 1);
                                    const endRow = Math.min(7, x + 1);
                                    const startCol = Math.max(0, y - 1);
                                    const endCol = Math.min(7, y + 1);
                                    
                                    // ВАЖНО: Делаем прямую копию доски
                                    const newBoard = JSON.parse(JSON.stringify(board));
                                    
                                    // Взрываем все фигуры в области 3x3, кроме пешек и королей
                                    for (let r = startRow; r <= endRow; r++) {
                                        for (let c = startCol; c <= endCol; c++) {
                                            const targetPiece = newBoard[r][c];
                                            
                                            // Пропускаем пустые клетки, пешек и королей
                                            if (!targetPiece || targetPiece.type === 'pawn' || targetPiece.type === 'king') {
                                                continue;
                                            }
                                            
                                            // Создаем мини-взрыв на месте фигуры
                                            const targetSquare = document.querySelector(`.square[data-row="${r}"][data-col="${c}"]`);
                                            if (targetSquare) {
                                                const miniExplosion = document.createElement('div');
                                                miniExplosion.className = 'explosion-effect mini';
                                                miniExplosion.style.zIndex = "998";
                                                miniExplosion.style.transform = 'scale(0.7)';
                                                targetSquare.appendChild(miniExplosion);
                                            }
                                            
                                            // // Удаляем фигуру с доски
                                            // newBoard[r][c] = null;
                                            
                                            // ВАЖНО: Прямо обновляем состояние игры 
                                            game.boardState[r][c] = null;
                                        }
                                    }
                                    
                                    // Через секунду удаляем эффект взрыва и обновляем доску
                                    setTimeout(() => {
                                        // Удаляем все эффекты взрыва
                                        document.querySelectorAll('.explosion-effect').forEach(el => el.remove());
                                        
                                        // ВАЖНО: Обновляем доску через рендерер
                                        game.renderer.renderBoard();
                                        
                                        // Проверяем окончание игры
                                        game.checkGameEnd();
                                    }, 500);
                                });
                            }
                        } catch (e) {
                            console.error('>>> bomb-bishop: Ошибка при взрыве:', e);
                        }
                    }, 50); // Небольшая задержка для начала анимации
                });
                
                return board;
            },
            // Добавляем обработчик для случая, когда этот слон захвачен
            onCaptured: function(game, piece, x, y, capturedBy, board) {
                // ВАЖНО: НЕМЕДЛЕННО ОБНОВЛЯЕМ ДОСКУ, чтобы показать текущее состояние
                requestAnimationFrame(() => {
                    game.renderer.renderBoard();
                    
                    // Затем запускаем взрыв с задержкой
                    setTimeout(() => {
                        try {
                            // Создаем эффект взрыва с максимальным приоритетом
                            const centerSquare = document.querySelector(`.square[data-row="${x}"][data-col="${y}"]`);
                            if (centerSquare) {
                                // Создаем большой яркий взрыв
                                const explosion = document.createElement('div');
                                explosion.className = 'explosion-effect';
                                explosion.style.zIndex = "999"; // Максимальный приоритет
                                explosion.style.transform = "scale(1.5)";
                                explosion.style.background = "radial-gradient(circle, rgba(255,165,0,0.9) 0%, rgba(255,0,0,0.8) 50%, rgba(0,0,0,0) 100%)";
                                centerSquare.appendChild(explosion);
                                
                                // Убеждаемся, что анимация запустилась
                                requestAnimationFrame(() => {
                                    // Определяем зону взрыва
                                    const startRow = Math.max(0, x - 1);
                                    const endRow = Math.min(7, x + 1);
                                    const startCol = Math.max(0, y - 1);
                                    const endCol = Math.min(7, y + 1);
                                    
                                    // ВАЖНО: Делаем прямую копию доски
                                    const newBoard = JSON.parse(JSON.stringify(board));
                                    
                                    // Взрываем все фигуры в области 3x3, кроме пешек и королей
                                    for (let r = startRow; r <= endRow; r++) {
                                        for (let c = startCol; c <= endCol; c++) {
                                            const targetPiece = newBoard[r][c];
                                            
                                            // Пропускаем пустые клетки, пешек и королей
                                            if (!targetPiece || targetPiece.type === 'pawn' || targetPiece.type === 'king') {
                                                continue;
                                            }
                                            
                                            // Создаем мини-взрыв на месте фигуры
                                            const targetSquare = document.querySelector(`.square[data-row="${r}"][data-col="${c}"]`);
                                            if (targetSquare) {
                                                const miniExplosion = document.createElement('div');
                                                miniExplosion.className = 'explosion-effect mini';
                                                miniExplosion.style.zIndex = "998";
                                                miniExplosion.style.transform = 'scale(0.7)';
                                                targetSquare.appendChild(miniExplosion);
                                            }
                                            
                                            // Удаляем фигуру с доски
                                            newBoard[r][c] = null;
                                            
                                            // ВАЖНО: Прямо обновляем состояние игры 
                                            game.boardState[r][c] = null;
                                        }
                                    }
                                    
                                    // Через секунду удаляем эффект взрыва и обновляем доску
                                    setTimeout(() => {
                                        // Удаляем все эффекты взрыва
                                        document.querySelectorAll('.explosion-effect').forEach(el => el.remove());
                                        
                                        // ВАЖНО: Обновляем доску через рендерер
                                        game.renderer.renderBoard();
                                        
                                        // Проверяем окончание игры
                                        game.checkGameEnd();
                                    }, 500);
                                });
                            }
                        } catch (e) {
                            console.error('>>> bomb-bishop: Ошибка при взрыве при захвате:', e);
                        }
                    }, 50); // Небольшая задержка для начала анимации
                });
                
                return board;
            },
            onTurnStart: (game, piece, x, y, board, color) => {
                // Добавляем эффект при начале хода
                const square = document.querySelector(`.square[data-row="${x}"][data-col="${y}"]`);
                if (square) {
                    const effect = document.createElement('div');
                    effect.className = 'glow-effect';
                    square.appendChild(effect);
                    
                    setTimeout(() => {
                        effect.remove();
                    }, 500);
                }
                return board;
            }
        },

        'x-ray-rook': {
            name: 'Рентген-ладья',
            texture: 'x-ray-rook',
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
            texture: 'move-plus-rook',
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
            texture: 'horizontal-rook',
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
            texture: 'queen-of-horses',
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
            texture: 'queen-of-camels',
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
            texture: 'queen-with-evolution',
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
            texture: 'boom-king',
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
            // Переписанный обработчик с явным именем
            onCaptured: function(game, piece, x, y, capturedBy, board) {
                // ВАЖНО: Добавляем прямую реализацию взрыва короля
                try {
                    // НЕМЕДЛЕННО ОБНОВЛЯЕМ ДОСКУ, чтобы показать текущее состояние
                    requestAnimationFrame(() => {
                        game.renderer.renderBoard();
                        
                        // Затем запускаем взрыв с небольшой задержкой
                        setTimeout(() => {
                            try {
                                // Создаем эффект взрыва с максимальным приоритетом
                                const centerSquare = document.querySelector(`.square[data-row="${x}"][data-col="${y}"]`);
                                if (centerSquare) {
                                    // Создаем большой яркий взрыв
                                    const explosion = document.createElement('div');
                                    explosion.className = 'explosion-effect king-explosion';
                                    explosion.style.zIndex = "999"; // Максимальный приоритет
                                    explosion.style.transform = "scale(2.0)";
                                    explosion.style.background = "radial-gradient(circle, rgba(255,255,0,0.9) 0%, rgba(255,0,0,0.8) 50%, rgba(0,0,0,0) 100%)";
                                    centerSquare.appendChild(explosion);
                                    
                                    // Убеждаемся, что анимация запустилась
                                    requestAnimationFrame(() => {
                                        // Определяем зону взрыва
                                        const startRow = Math.max(0, x - 2);
                                        const endRow = Math.min(7, x + 2);
                                        const startCol = Math.max(0, y - 2);
                                        const endCol = Math.min(7, y + 2);
                                        
                                        // Взрываем ВСЕ фигуры, кроме королей
                                        for (let r = startRow; r <= endRow; r++) {
                                            for (let c = startCol; c <= endCol; c++) {
                                                // Пропускаем клетку самого взрывающегося короля
                                                if (r === x && c === y) continue;
                                                
                                                const targetPiece = board[r][c];
                                                
                                                // Пропускаем пустые клетки и других королей
                                                if (!targetPiece || targetPiece.type === 'king') {
                                                    continue;
                                                }
                                                
                                                // Рассчитываем расстояние от центра взрыва
                                                const distance = Math.max(Math.abs(r - x), Math.abs(c - y));
                                                
                                                // Фигуры на расстоянии 1 уничтожаются всегда
                                                // Фигуры на расстоянии 2 уничтожаются с вероятностью 50%
                                                const shouldDestroy = distance === 1 || (distance === 2 && Math.random() > 0.5);
                                                
                                                if (shouldDestroy) {
                                                    // Создаем мини-взрыв на месте фигуры
                                                    const targetSquare = document.querySelector(`.square[data-row="${r}"][data-col="${c}"]`);
                                                    if (targetSquare) {
                                                        const miniExplosion = document.createElement('div');
                                                        miniExplosion.className = 'explosion-effect mini';
                                                        miniExplosion.style.zIndex = "998";
                                                        miniExplosion.style.transform = 'scale(0.7)';
                                                        miniExplosion.style.opacity = '0.7';
                                                        targetSquare.appendChild(miniExplosion);
                                                    }
                                                    
                                                    // Удаляем фигуру с доски сразу
                                                    game.boardState[r][c] = null;
                                                }
                                            }
                                        }
                                                
                                        // Через секунду удаляем эффект взрыва и обновляем доску
                                        setTimeout(() => {
                                            // Удаляем все эффекты взрыва
                                            document.querySelectorAll('.explosion-effect').forEach(el => el.remove());
                                            
                                            // ВАЖНО: Обновляем доску через рендерер
                                            game.renderer.renderBoard();
                                            
                                            // Проверяем окончание игры
                                            game.checkGameEnd();
                                        }, 800);
                                    });
                                }
                            } catch (e) {
                                console.error('>>> boom-king: Ошибка при анимации взрыва:', e);
                            }
                        }, 50);
                    });
                } catch (e) {
                    console.error('>>> boom-king: Ошибка при прямом взрыве:', e);
                }
                
                return board;
            },
            onTurnEnd: (game, piece, x, y, board, color) => {
                // Создаем эффект "тиканья" в конце хода
                const square = document.querySelector(`.square[data-row="${x}"][data-col="${y}"]`);
                if (square) {
                    const effect = document.createElement('div');
                    effect.className = 'bomb-tick-effect';
                    square.appendChild(effect);
                    
                    setTimeout(() => {
                        effect.remove();
                    }, 300);
                }
                return board;
            }
        },

        'king-with-potential': {
            name: 'Король с потенциалом',
            texture: 'king-with-potential',
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
            texture: 'move-plus-king',
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