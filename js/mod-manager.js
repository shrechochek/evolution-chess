class ModManager {
    constructor(game) {
        this.game = game;
        this.activeMods = {}; // {modName: modData}
        this.loadedModScripts = {}; // {modName: scriptElement}
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

    async loadJSMod(file) {
        try {
            const modName = file.name.replace('.js', '');
            
            // Удаляем предыдущую версию мода если есть
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
                this.activeMods[finalModName] = this.processModData(window.modRegistration.data);
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

    processModData(modData) {
        // Для каждого изменяемого типа фигуры сохраняем оригинальные данные
        if (modData.pieces) {
            for (const [pieceType, pieceDef] of Object.entries(modData.pieces)) {
                // Сохраняем оригинальные evolutionOptions если они есть
                if (!pieceDef.evolutionOptions && Piece.pieces[pieceType]?.evolutionOptions) {
                    pieceDef.evolutionOptions = Piece.pieces[pieceType].evolutionOptions;
                }
                
                // Сохраняем оригинальные текстуры если новые не указаны
                if (!pieceDef.texture && Piece.pieces[pieceType]?.texture) {
                    pieceDef.texture = Piece.pieces[pieceType].texture;
                }
            }
        }
        return modData;
    }

    applyMods() {
        // Сбрасываем все модификации
        Piece.mods = {};
        Piece.customTextures = {};
        Piece.overrides = {};
        
        // Применяем активные моды
        for (const [modName, modData] of Object.entries(this.activeMods)) {
            if (modData) {
                try {
                    Piece.registerMod(modName, modData);
                    console.log(`Applied mod: ${modName}`);
                } catch (err) {
                    console.error(`Error applying mod ${modName}:`, err);
                }
            }
        }
        
        this.game.initGame();
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

    removeMod(modName) {
        if (this.loadedModScripts[modName]) {
            document.body.removeChild(this.loadedModScripts[modName]);
            delete this.loadedModScripts[modName];
        }
        delete this.activeMods[modName];
        this.updateModsList();
    }

    clearAllMods() {
        for (const modName in this.loadedModScripts) {
            document.body.removeChild(this.loadedModScripts[modName]);
        }
        this.loadedModScripts = {};
        this.activeMods = {};
        this.updateModsList();
    }
}