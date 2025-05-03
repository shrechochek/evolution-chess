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
            evolutionOptions: (piece) => []
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
            evolutionOptions: (piece) => []
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
            evolutionOptions: (piece) => []
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
            evolutionOptions: (piece) => []
        },

        queen: {
            name: 'Ферзь',
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
            evolutionOptions: (piece) => []
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
            evolutionOptions: (piece) => []
        }
    }

    static mods = {};
    static customTextures = {};
    static overrides = {};

    static registerMod(modName, modData) {
        this.mods[modName] = modData;
        
        // Регистрация новых типов фигур и их текстур
        if (modData.pieces) {
            for (const [pieceType, pieceData] of Object.entries(modData.pieces)) {
                // Сохраняем оригинальные методы если они есть
                const originalPiece = this.pieces[pieceType];
                if (originalPiece) {
                    ['getMoves', 'evolutionOptions'].forEach(prop => {
                        if (!pieceData[prop] && originalPiece[prop]) {
                            pieceData[prop] = originalPiece[prop];
                        }
                    });
                }
                
                this.pieces[pieceType] = pieceData;
                
                // Регистрируем текстуры если они указаны
                if (modData.texturePaths && pieceData.texture) {
                    const textureKey = pieceData.texture;
                    
                    // Учитываем оба варианта: объект с цветами и строковый путь
                    if (modData.texturePaths[textureKey]) {
                        const textureValue = modData.texturePaths[textureKey];
                        
                        if (typeof textureValue === 'object') {
                            // Объект с цветами: { 'white': '...', 'black': '...' }
                            for (const [colorKey, colorPath] of Object.entries(textureValue)) {
                                const textureName = `${colorKey}-${textureKey}`;
                                if (!this.customTextures[textureName]) {
                                    console.warn(`⚠️ Не найдена предзагруженная текстура: ${textureName}`);
                                }
                            }
                        } else {
                            // Строковый путь к текстуре
                            const whiteTextureName = `white-${textureKey}`;
                            const blackTextureName = `black-${textureKey}`;
                            
                            if (!this.customTextures[whiteTextureName] || !this.customTextures[blackTextureName]) {
                                console.warn(`⚠️ Не найдены предзагруженные текстуры: ${whiteTextureName}, ${blackTextureName}`);
                            }
                        }
                    }
                }
            }
        }
        
        // Регистрация переопределений (overrides)
        if (modData.overrides) {
            for (const [pieceType, overrideData] of Object.entries(modData.overrides)) {
                if (!this.overrides[pieceType]) this.overrides[pieceType] = {};
                
                // Слияние существующих переопределений с новыми
                for (const [key, value] of Object.entries(overrideData)) {
                    this.overrides[pieceType][key] = value;
                }
                
                console.log(`Зарегистрированы переопределения для ${pieceType}:`, this.overrides[pieceType]);
                
                // Проверяем текстуры в переопределениях
                if (overrideData.texture && modData.texturePaths) {
                    const textureKey = overrideData.texture;
                    
                    if (modData.texturePaths[textureKey]) {
                        const textureValue = modData.texturePaths[textureKey];
                        
                        if (typeof textureValue === 'object') {
                            // Объект с цветами
                            for (const [colorKey, colorPath] of Object.entries(textureValue)) {
                                const textureName = `${colorKey}-${textureKey}`;
                                if (!this.customTextures[textureName]) {
                                    console.warn(`⚠️ Не найдена предзагруженная текстура: ${textureName}`);
                                }
                            }
                        } else {
                            // Строковый путь
                            const whiteTextureName = `white-${textureKey}`;
                            const blackTextureName = `black-${textureKey}`;
                            
                            if (!this.customTextures[whiteTextureName] || !this.customTextures[blackTextureName]) {
                                console.warn(`⚠️ Не найдены предзагруженные текстуры: ${whiteTextureName}, ${blackTextureName}`);
                            }
                        }
                    }
                }
            }
        }
        
        // Регистрация новых эволюций
        if (modData.evolutions) {
            for (const [baseType, newEvolutions] of Object.entries(modData.evolutions)) {
                if (this.pieces[baseType]) {
                    const existingOptions = this.pieces[baseType].evolutionOptions || (() => []);
                    this.pieces[baseType].evolutionOptions = (piece) => [
                        ...existingOptions(piece),
                        ...newEvolutions
                    ];
                    
                    // Регистрируем текстуры для новых эволюций
                    newEvolutions.forEach(evolution => {
                        if (evolution.texture && modData.texturePaths) {
                            const textureKey = evolution.texture;
                            
                            if (modData.texturePaths[textureKey]) {
                                const textureValue = modData.texturePaths[textureKey];
                                
                                if (typeof textureValue === 'object') {
                                    // Объект с цветами
                                    for (const [colorKey, colorPath] of Object.entries(textureValue)) {
                                        const textureName = `${colorKey}-${textureKey}`;
                                        if (!this.customTextures[textureName]) {
                                            console.warn(`⚠️ Не найдена предзагруженная текстура: ${textureName}`);
                                        }
                                    }
                                } else {
                                    // Строковый путь
                                    const whiteTextureName = `white-${textureKey}`;
                                    const blackTextureName = `black-${textureKey}`;
                                    
                                    if (!this.customTextures[whiteTextureName] || !this.customTextures[blackTextureName]) {
                                        console.warn(`⚠️ Не найдены предзагруженные текстуры: ${whiteTextureName}, ${blackTextureName}`);
                                    }
                                }
                            }
                        }
                    });
                }
            }
        }
    }

    static getPieceDefinition(pieceType) {
        // Сначала проверяем переопределения
        if (this.overrides[pieceType]) {
            const definition = { ...this.pieces[pieceType] || {}, ...this.overrides[pieceType] };
            return definition;
        }
        
        // Затем проверяем стандартные определения
        if (this.pieces[pieceType]) {
            return { ...this.pieces[pieceType] };
        }
        
        console.warn(`Не найдено никакого определения для ${pieceType}`);
        return {}; // Возвращаем пустой объект, если ничего не найдено
    }


    static getMoves(game, x, y, piece) {
        const pieceType = piece.evolved ? piece.evolutionType : piece.type;
        const definition = this.getPieceDefinition(pieceType);
        
        // Если у эволюции нет getMoves, используем оригинальный getMoves
        if (!definition.getMoves && piece.evolved) {
            const originalDefinition = this.getPieceDefinition(piece.type);
            return originalDefinition.getMoves?.(game, x, y, piece) || [];
        }
        
        return definition.getMoves?.(game, x, y, piece) || [];
    }

    static getTexture(pieceType, color) {
        const definition = this.getPieceDefinition(pieceType);
        const baseTexture = definition.texturePath || 
                           definition.texture || 
                           pieceType;
        
        // Возвращаем только базовое имя (цвет добавится при рендеринге)
        return baseTexture
            .replace(/\+/g, '-plus')
            .replace(/[_\s]/g, '-')
            .toLowerCase();
    }

    static getEvolutionOptions(piece) {
        const pieceType = piece.evolved ? piece.evolutionType : piece.type;
        const definition = this.getPieceDefinition(pieceType);
        return definition.evolutionOptions?.(piece) || [];
    }

    static triggerEvent(event, game, ...args) {
        const piece = args[0]; // Первый аргумент - всегда фигура
        const pieceType = piece.evolved ? piece.evolutionType : piece.type;
        
        // Получаем определение типа фигуры
        const definition = this.getPieceDefinition(pieceType);
        
        // Проверяем наличие обработчика
        if (definition && definition[event]) {
            try {
                // Вызываем обработчик и возвращаем его результат
                const result = definition[event](game, ...args);
                return result;
            } catch (error) {
                console.error(`Ошибка в обработчике ${event} для ${pieceType}:`, error);
                return game.boardState;
            }
        }
        
        return game.boardState; // Возвращаем неизмененную доску, если обработчика нет
    }
}