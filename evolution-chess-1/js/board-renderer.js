class BoardRenderer {
    constructor(game) {
        this.game = game;
        this.errorImage = 'error'; // Базовое имя для текстуры ошибки
        this.textureCache = {}; // Кеш загруженных стандартных текстур
        
        // Предзагрузка стандартных текстур
        this.preloadStandardTextures();
    }
    
    // Метод для предзагрузки стандартных текстур
    preloadStandardTextures() {
        // Список стандартных фигур
        const standardPieces = ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king'];
        // Цвета фигур
        const colors = ['white', 'black'];
        
        // Загружаем стандартные текстуры
        for (const piece of standardPieces) {
            for (const color of colors) {
                const textureName = `${color}-${piece}`;
                this.preloadTexture(`pieces/${textureName}.png`, textureName);
            }
        }
        
        // Также загружаем текстуру ошибки
        this.preloadTexture(`pieces/${this.errorImage}.png`, this.errorImage);
    }
    
    // Метод для предзагрузки одной текстуры
    preloadTexture(url, name) {
        if (this.textureCache[name]) return; // Если уже в кеше, пропускаем
        
        const img = new Image();
        
        img.onload = () => {
            this.textureCache[name] = url;
        };
        
        img.onerror = () => {
            console.warn(`⚠️ Не удалось загрузить стандартную текстуру: ${name}`);
        };
        
        img.src = url;
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
        const colorPrefix = piece.color === 'white' ? 'white-' : 'black-';
        const textureKey = Piece.getTexture(pieceType, piece.color);
        const fullTextureName = colorPrefix + textureKey;
        
        // Проверяем кастомные текстуры (Object URL из ZIP)
        if (Piece.customTextures[fullTextureName]) {
            pieceElement.style.backgroundImage = `url('${Piece.customTextures[fullTextureName]}')`;
        }
        // Проверяем кеш стандартных текстур
        else if (this.textureCache[fullTextureName]) {
            pieceElement.style.backgroundImage = `url('${this.textureCache[fullTextureName]}')`;
        }
        // Если текстуры нет в кеше, загружаем и кешируем
        else {
            const textureUrl = `pieces/${fullTextureName}.png`;
            
            // Проверяем, загружается ли уже эта текстура
            if (!this.textureCache[fullTextureName + '_loading']) {
                this.textureCache[fullTextureName + '_loading'] = true;
                
                const img = new Image();
                img.onload = () => {
                    delete this.textureCache[fullTextureName + '_loading'];
                    this.textureCache[fullTextureName] = textureUrl;
                    
                    // Обновляем все элементы с этой текстурой на доске
                    document.querySelectorAll(`.piece[data-texture="${fullTextureName}"]`).forEach(el => {
                        el.style.backgroundImage = `url('${textureUrl}')`;
                    });
                };
                
                img.onerror = () => {
                    delete this.textureCache[fullTextureName + '_loading'];
                    // Используем текстуру ошибки
                    this.textureCache[fullTextureName] = `pieces/${this.errorImage}.png`;
                    
                    // Обновляем все элементы с этой текстурой на доске
                    document.querySelectorAll(`.piece[data-texture="${fullTextureName}"]`).forEach(el => {
                        el.classList.add('error');
                        el.style.backgroundImage = `url('pieces/${this.errorImage}.png')`;
                    });
                };
                
                img.src = textureUrl;
            }
            
            // Устанавливаем временное изображение до загрузки
            pieceElement.style.backgroundImage = 'none';
            pieceElement.dataset.texture = fullTextureName;
        }
        
        square.appendChild(pieceElement);
    }
    
    // Новый метод для добавления цветового префикса к URL текстуры
    addColorPrefixToTexture(url, colorPrefix) {
        // Разбиваем URL на части
        const parts = url.split('/');
        const filename = parts.pop();
        
        // Если имя файла уже содержит цветовой префикс, возвращаем как есть
        if (filename.startsWith('white-') || filename.startsWith('black-')) {
            return url;
        }
        
        // Добавляем цветовой префикс перед именем файла
        parts.push(colorPrefix + filename);
        return parts.join('/');
    }

    highlightSquare(row, col, type) {
        const square = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
        if (square) {
            square.classList.add(type === 'capture' ? 'capture' : 'highlight');
        }
    }
}