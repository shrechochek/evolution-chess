class ModManager {
    constructor(game) {
        this.game = game;
        this.activeMods = {};
        this.loadedModScripts = {};
        this.loadedModAssets = {};
        this.initModUI();
    }

    initModUI() {
        this.modsPanel = document.getElementById('mods-panel');
        this.modsList = document.getElementById('mods-list');
        this.modFileInput = document.getElementById('mod-file-input');
        this.loadModBtn = document.getElementById('load-mod-btn');
        this.toggleModsBtn = document.getElementById('toggle-mods-btn');
        this.modDropArea = document.getElementById('mod-drop-area');
        this.applyModsBtn = document.getElementById('apply-mods-btn');

        // Инициализация обработчиков событий
        this.toggleModsBtn.addEventListener('click', () => {
            this.modsPanel.classList.toggle('hidden');
        });

        this.loadModBtn.addEventListener('click', () => {
            this.modFileInput.click();
        });

        this.modFileInput.addEventListener('change', (e) => {
            if (e.target.files.length) {
                this.loadJSMod(e.target.files[0]);
            }
        });

        // Drag and Drop
        this.modDropArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.modDropArea.classList.add('highlight');
        });

        this.modDropArea.addEventListener('dragleave', () => {
            this.modDropArea.classList.remove('highlight');
        });

        this.modDropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.modDropArea.classList.remove('highlight');
            if (e.dataTransfer.files.length) {
                this.loadJSMod(e.dataTransfer.files[0]);
            }
        });

        this.applyModsBtn.addEventListener('click', () => {
            this.applyMods();
            this.modsPanel.classList.add('hidden');
        });
    }

    async loadZipMod(file) {
        try {
            const zip = await JSZip.loadAsync(file);
            const modName = file.name.replace('.zip', '');
            
            if (this.loadedModScripts[modName]) {
                this.removeMod(modName);
            }
    
            // Загрузка скрипта
            const scriptFile = zip.file('script.js');
            if (!scriptFile) throw new Error('Файл script.js не найден в архиве');
            
            const scriptContent = await scriptFile.async('text');
            const scriptBlob = new Blob([scriptContent], { type: 'application/javascript' });
            const scriptUrl = URL.createObjectURL(scriptBlob);
    
            const script = document.createElement('script');
            script.src = scriptUrl;
            
            await new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = () => reject(new Error('Ошибка загрузки скрипта мода'));
                document.body.appendChild(script);
            });
    
            this.loadedModScripts[modName] = script;
    
            // Загрузка текстур
            if (window.modRegistration?.texturePaths) {
                this.loadedModAssets[modName] = {};
                
                // Предзагрузка всех текстур напрямую
                await this.preloadTexturesDirectly(window.modRegistration.texturePaths, zip, modName);
            }
    
            // Регистрация мода
            if (window.modRegistration) {
                const finalModName = window.modRegistration.name || modName;
                this.activeMods[finalModName] = this.processModData(window.modRegistration);
                window.modRegistration = null;
                this.updateModsList();
                alert(`Мод "${finalModName}" загружен!`);
            }
        } catch (err) {
            console.error('Ошибка загрузки мода:', err);
            alert(`Ошибка: ${err.message}`);
        }
    }

    // Метод для прямой предзагрузки и сохранения текстур
    async preloadTexturesDirectly(texturePaths, zip, modName) {
        // Предзагрузка всех текстур
        if (typeof texturePaths === 'object') {
            for (const [textureKey, textureValue] of Object.entries(texturePaths)) {
                try {
                    // Если значение - объект с цветами
                    if (typeof textureValue === 'object') {
                        // Загружаем каждый цветовой вариант текстуры
                        for (const [colorKey, colorPath] of Object.entries(textureValue)) {
                            if (typeof colorPath !== 'string') continue;
                            
                            // Получаем файл из архива
                            const textureFile = zip.file(colorPath);
                            if (textureFile) {
                                // Преобразуем содержимое в Blob и создаем URL
                                const blob = await textureFile.async('blob');
                                const objectUrl = URL.createObjectURL(blob);
                                
                                // Создаём имя текстуры в формате "white-spearmen" или "black-spearmen"
                                const textureName = `${colorKey}-${textureKey}`;
                                
                                // Сохраняем текстуру в кеше Piece 
                                if (!Piece.customTextures) Piece.customTextures = {};
                                Piece.customTextures[textureName] = objectUrl;
                                
                                // Сохраняем в локальном кеше мода
                                this.loadedModAssets[modName][textureName] = objectUrl;
                            } else {
                                console.warn(`⚠️ Не найден файл текстуры: ${colorPath}`);
                            }
                        }
                    } else if (typeof textureValue === 'string') {
                        // Для случаев, когда указан просто путь к текстуре
                        console.log(`Обработка строковой текстуры: ${textureKey} -> ${textureValue}`);
                        
                        // Пробуем найти варианты с префиксами цветов
                        const textureVariants = [
                            { path: `assets/white-${textureKey}.png`, name: `white-${textureKey}` },
                            { path: `assets/black-${textureKey}.png`, name: `black-${textureKey}` },
                            { path: textureValue, name: textureKey }
                        ];
                        
                        for (const variant of textureVariants) {
                            console.log(`Поиск варианта: ${variant.path}`);
                            
                            const textureFile = zip.file(variant.path);
                            if (textureFile) {
                                // Загружаем и кешируем текстуру
                                const blob = await textureFile.async('blob');
                                const objectUrl = URL.createObjectURL(blob);
                                
                                if (!Piece.customTextures) Piece.customTextures = {};
                                
                                // Для общей текстуры добавляем к имени префикс цвета
                                if (variant.name === textureKey) {
                                    // Добавляем текстуры с префиксами цветов "white-" и "black-" 
                                    Piece.customTextures[`white-${textureKey}`] = objectUrl;
                                    Piece.customTextures[`black-${textureKey}`] = objectUrl;
                                    
                                    console.log(`✅ Добавлены текстуры: white-${textureKey}, black-${textureKey} -> ${objectUrl}`);
                                } else {
                                    // Сохраняем текстуру с именем из варианта (уже содержит префикс цвета)
                                    Piece.customTextures[variant.name] = objectUrl;
                                    console.log(`✅ Загружена текстура: ${variant.name} -> ${objectUrl}`);
                                }
                                
                                this.loadedModAssets[modName][variant.name] = objectUrl;
                            }
                        }
                    }
                } catch (error) {
                    console.error(`❌ Ошибка загрузки текстуры ${textureKey}:`, error);
                }
            }
        }
    }

    processModData(modData) {
        // Для каждого изменяемого типа фигуры сохраняем оригинальные данные
        if (modData.pieces) {
            for (const [pieceType, pieceData] of Object.entries(modData.pieces)) {
                const originalPiece = Piece.pieces[pieceType];
                if (originalPiece) {
                    // Сохраняем оригинальные методы и свойства, если их нет в моде
                    ['getMoves', 'evolutionOptions', 'name', 'texture', 'evolutionRequirement'].forEach(prop => {
                        if (!pieceData[prop] && originalPiece[prop]) {
                            pieceData[prop] = originalPiece[prop];
                        }
                    });
                }
            }
        }
    
        // Обрабатываем обработчики событий
        if (modData.overrides) {
            for (const [pieceType, overrideDef] of Object.entries(modData.overrides)) {
                if (!Piece.overrides[pieceType]) Piece.overrides[pieceType] = {};
                Object.assign(Piece.overrides[pieceType], overrideDef);
            }
        }
    
        return modData.data || modData;
    }

    applyMods() {
        // Сбрасываем модификации, но сохраняем кешированные текстуры
        const cachedTextures = {...Piece.customTextures};
        
        Piece.mods = {};
        Piece.customTextures = cachedTextures; // Восстанавливаем кешированные текстуры
        Piece.overrides = {};
        
        // Применяем активные моды
        for (const [modName, modData] of Object.entries(this.activeMods)) {
            if (modData) {
                try {
                    // Регистрируем мод
                    Piece.registerMod(modName, modData);
                } catch (err) {
                    console.error(`Error applying mod ${modName}:`, err);
                }
            }
        }
        
        this.game.initGame();
    }

    removeMod(modName) {
        // Освобождаем ресурсы скрипта
        if (this.loadedModScripts[modName]) {
            URL.revokeObjectURL(this.loadedModScripts[modName].src);
            document.body.removeChild(this.loadedModScripts[modName]);
            delete this.loadedModScripts[modName];
        }
        
        // Освобождаем ресурсы текстур
        if (this.loadedModAssets[modName]) {
            for (const textureUrl of Object.values(this.loadedModAssets[modName])) {
                URL.revokeObjectURL(textureUrl);
            }
            delete this.loadedModAssets[modName];
        }
        
        delete this.activeMods[modName];
        this.updateModsList();
    }

    clearAllMods() {
        for (const modName in this.loadedModScripts) {
            this.removeMod(modName);
        }
    }

    // Обновляем метод загрузки мода
    async loadJSMod(file) {
        if (file.name.endsWith('.zip')) {
            return this.loadZipMod(file);
        }
        
        // Старая реализация для .js файлов
        try {
            const modName = file.name.replace('.js', '');
            
            if (this.loadedModScripts[modName]) {
                this.removeMod(modName);
            }

            const script = document.createElement('script');
            script.src = URL.createObjectURL(file);
            
            await new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = () => reject(new Error('Ошибка загрузки скрипта'));
                document.body.appendChild(script);
            });

            this.loadedModScripts[modName] = script;
            
            if (window.modRegistration) {
                const finalModName = window.modRegistration.name || modName;
                this.activeMods[finalModName] = this.processModData(window.modRegistration);
                window.modRegistration = null;
                
                this.updateModsList();
                alert(`Мод "${finalModName}" загружен!`);
            } else {
                throw new Error('Мод не вызвал window.modRegistration!');
            }
        } catch (err) {
            console.error('Ошибка загрузки мода:', err);
            alert(`Ошибка: ${err.message}`);
        }
    }

    updateModsList() {
        this.modsList.innerHTML = '';
        
        for (const modName in this.activeMods) {
            const modItem = document.createElement('div');
            modItem.className = `mod-item ${this.activeMods[modName] ? 'active' : ''}`;
            
            const modData = this.activeMods[modName];
            const description = modData.description ? `<p class="mod-description">${modData.description}</p>` : '';
            
            modItem.innerHTML = `
                <div class="mod-header">
                    <span class="mod-name">${modName}</span>
                    <span class="toggle">${this.activeMods[modName] ? '✓' : '×'}</span>
                </div>
                ${description}
            `;
            
            modItem.addEventListener('click', () => {
                this.activeMods[modName] = !this.activeMods[modName];
                modItem.classList.toggle('active');
                modItem.querySelector('.toggle').textContent = 
                    this.activeMods[modName] ? '✓' : '×';
            });
            
            this.modsList.appendChild(modItem);
        }
    }

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
}