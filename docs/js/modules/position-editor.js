// Position editor module. Factory returns an object with methods to open/close the editor
// and perform save/load/apply operations. It does not touch game core; it operates on
// the provided API (PIECE_TYPES, CUSTOM_ASSETS, createPiece, t, SYMBOLS, BOARD_SIZE).

export function createPositionEditor({ PIECE_TYPES, CUSTOM_ASSETS, createPiece, t, SYMBOLS, BOARD_SIZE }) {
    let selectedPieceType = null;
    let selectedPieceColor = 'white';
    let editorBoard = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
    let editorTurn = 'white';

    function openPositionEditor() {
        document.getElementById('settings-modal-overlay').style.display = 'none';
        initializePositionEditor();
        document.getElementById('position-editor-modal').style.display = 'flex';
    }

    function closePositionEditor() {
        document.getElementById('position-editor-modal').style.display = 'none';
    }

    function initializePositionEditor() {
        editorBoard = JSON.parse(JSON.stringify(window.board));
        editorTurn = window.currentTurn;
        createEditorBoard();
        createPieceSelectionPanel();
        updateEditorTurnButtons();
        updatePositionEditorTranslations();
    }

    function updatePositionEditorTranslations() {
        const pieceSelectionTitle = document.getElementById('piece-selection-title');
        const boardPositionTitle = document.getElementById('board-position-title');
        if (pieceSelectionTitle) pieceSelectionTitle.textContent = t('piece_selection');
        if (boardPositionTitle) boardPositionTitle.textContent = t('board_position');

        const whiteTurnBtn = document.getElementById('set-white-turn');
        const blackTurnBtn = document.getElementById('set-black-turn');
        if (whiteTurnBtn) whiteTurnBtn.textContent = t('white_to_move');
        if (blackTurnBtn) blackTurnBtn.textContent = t('black_to_move');

        const buttons = document.querySelectorAll('#position-editor-modal [data-action]');
        buttons.forEach(btn => {
            const action = btn.getAttribute('data-action');
            switch (action) {
                case 'clear': btn.textContent = '🗑️ ' + t('clear_board'); break;
                case 'standard': btn.textContent = '♟️ ' + t('standard_position'); break;
                case 'save': btn.textContent = '💾 ' + t('save_position'); break;
                case 'load': btn.textContent = '📂 ' + t('load_position'); break;
                case 'apply': btn.textContent = '✓ ' + t('apply_to_game'); break;
                case 'cancel': btn.textContent = t('cancel', 'Cancel'); break;
            }
        });
    }

    function createEditorBoard() {
        const editorBoardEl = document.getElementById('editor-board');
        if (!editorBoardEl) return;
        editorBoardEl.innerHTML = '';
        for (let y = 0; y < BOARD_SIZE; y++) {
            for (let x = 0; x < BOARD_SIZE; x++) {
                const cell = document.createElement('div');
                cell.className = `editor-cell ${(x + y) % 2 === 0 ? 'light' : 'dark'}`;
                cell.setAttribute('data-x', x);
                cell.setAttribute('data-y', y);
                cell.onclick = () => handleEditorCellClick(x, y);

                const piece = editorBoard[y][x];
                if (piece) {
                    const pieceEl = document.createElement('div');
                    pieceEl.className = `editor-piece ${piece.color}`;
                    pieceEl.style.fontSize = '24px';
                    pieceEl.style.display = 'flex';
                    pieceEl.style.alignItems = 'center';
                    pieceEl.style.justifyContent = 'center';

                    const img = document.createElement('img');
                    const pieceDef = PIECE_TYPES[piece.type];
                    const symbolName = pieceDef ? pieceDef.symbol || piece.type : piece.type;
                    const imgName = `${piece.color}_${symbolName}`;
                    img.src = CUSTOM_ASSETS[imgName] || `assets/images/figures/${imgName}.svg`;
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.onerror = function() { this.style.display = 'none'; pieceEl.textContent = getPieceSymbol(piece.type); };

                    pieceEl.appendChild(img);
                    cell.appendChild(pieceEl);
                }

                editorBoardEl.appendChild(cell);
            }
        }
    }

    function createPieceSelectionPanel() {
        const panel = document.getElementById('piece-selection-panel');
        if (!panel) return;
        panel.innerHTML = '';
        const piecesByTier = {};
        const maxTier = 3;
        for (let tier = 1; tier <= maxTier; tier++) piecesByTier[tier] = [];
        Object.keys(PIECE_TYPES).forEach(pieceType => {
            const pieceDef = PIECE_TYPES[pieceType];
            if (pieceDef.tier && pieceDef.tier >= 1 && pieceDef.tier <= maxTier) piecesByTier[pieceDef.tier].push(pieceType);
        });

        for (let tier = 1; tier <= maxTier; tier++) {
            const tierPieces = piecesByTier[tier];
            if (tierPieces.length === 0) continue;
            const tierHeader = document.createElement('div');
            tierHeader.className = 'tier-header'; tierHeader.textContent = `Tier ${tier}`;
            tierHeader.style.fontSize = '14px'; tierHeader.style.fontWeight = 'bold'; tierHeader.style.margin = '10px 0 5px 0'; tierHeader.style.color = '#f1c40f';
            panel.appendChild(tierHeader);

            const tierContainer = document.createElement('div');
            tierContainer.className = 'tier-pieces'; tierContainer.style.display = 'flex'; tierContainer.style.flexWrap = 'wrap'; tierContainer.style.gap = '2px'; tierContainer.style.marginBottom = '15px';

            tierPieces.forEach(pieceType => {
                const pieceButton = document.createElement('button');
                pieceButton.className = 'piece-selection-btn'; pieceButton.setAttribute('data-piece-type', pieceType);
                pieceButton.onclick = () => selectPiece(pieceType);

                const img = document.createElement('img');
                const imgName = `${selectedPieceColor}_${PIECE_TYPES[pieceType].symbol || pieceType}`;
                img.src = CUSTOM_ASSETS[imgName] || `images/${imgName}.svg`;
                img.style.width = '32px'; img.style.height = '32px';
                img.onerror = function() { this.style.display = 'none'; pieceButton.textContent = getPieceSymbol(pieceType); pieceButton.style.fontSize = '20px'; pieceButton.style.padding = '8px'; };
                pieceButton.appendChild(img);

                const pieceDef = PIECE_TYPES[pieceType];
                const pieceName = pieceDef.name || pieceType;
                pieceButton.title = pieceName.charAt(0).toUpperCase() + pieceName.slice(1).replace(/_/g, ' ');
                tierContainer.appendChild(pieceButton);
            });

            panel.appendChild(tierContainer);
        }
    }

    function selectPiece(pieceType) {
        selectedPieceType = pieceType;
        document.querySelectorAll('.piece-selection-btn').forEach(btn => {
            const isSelected = btn.getAttribute('data-piece-type') === pieceType;
            btn.classList.toggle('selected', isSelected);
        });
    }

    function handleEditorCellClick(x, y) {
        if (selectedPieceType) {
            editorBoard[y][x] = { type: selectedPieceType, color: selectedPieceColor, xp:0, hasMoved:false, id: Math.random().toString(36).substr(2,9) };
        } else {
            editorBoard[y][x] = null;
        }
        createEditorBoard();
    }

    function getPieceSymbol(pieceType) {
        if (PIECE_TYPES[pieceType] && PIECE_TYPES[pieceType].symbol) {
            const symbolKey = PIECE_TYPES[pieceType].symbol;
            if (SYMBOLS[symbolKey]) return SYMBOLS[symbolKey];
        }
        const symbols = { pawn: '♟', knight: '♞', bishop: '♗', rook: '♜', queen: '♛', king: '♚' };
        return symbols[pieceType] || '?';
    }

    function updateEditorTurnButtons() {
        const whiteBtn = document.getElementById('set-white-turn');
        const blackBtn = document.getElementById('set-black-turn');
        if (!whiteBtn || !blackBtn) return;
        if (editorTurn === 'white') {
            whiteBtn.style.background = '#f1c40f'; whiteBtn.style.color = '#333'; blackBtn.style.background = '#34495e'; blackBtn.style.color = 'white';
        } else {
            blackBtn.style.background = '#f1c40f'; blackBtn.style.color = '#333'; whiteBtn.style.background = '#34495e'; whiteBtn.style.color = 'white';
        }
    }

    function clearEditorBoard() {
        editorBoard = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
        createEditorBoard();
    }

    function loadStandardPosition() {
        editorBoard = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
        for (let x=0;x<BOARD_SIZE;x++) { editorBoard[1][x] = createPiece('pawn','black'); editorBoard[6][x] = createPiece('pawn','white'); }
        const backRow = ['rook','knight','bishop','queen','king','bishop','knight','rook'];
        backRow.forEach((type,x)=>{ if (PIECE_TYPES[type]) { editorBoard[0][x] = createPiece(type,'black'); editorBoard[7][x] = createPiece(type,'white'); } });
        editorTurn = 'white'; updateEditorTurnButtons(); createEditorBoard();
    }

    function savePosition() {
        const positionData = { board: editorBoard, turn: editorTurn };
        localStorage.setItem('chessPositionEditor', JSON.stringify(positionData));
        alert(t('position_saved'));
    }

    function loadPosition() {
        const saved = localStorage.getItem('chessPositionEditor');
        if (saved) { const positionData = JSON.parse(saved); editorBoard = positionData.board; editorTurn = positionData.turn; updateEditorTurnButtons(); createEditorBoard(); alert(t('position_loaded')); }
        else alert(t('no_saved_position'));
    }

    function applyPosition() {
        window.board = JSON.parse(JSON.stringify(editorBoard));
        window.currentTurn = editorTurn;
        window.possibleMoves = [];
        window.selectedCell = null;
        window.gameOver = false;
        window.alertGameOver = false;
        window.enPassantTarget = null;
        window.markedSquares && window.markedSquares.clear();
        if (typeof window.clearArrows === 'function') window.clearArrows();
        if (typeof window.renderBoard === 'function') window.renderBoard();
        closePositionEditor();
        alert(t('position_applied'));
    }

    // Attach basic DOM hooks for color/turn selectors inside the editor
    function attachDomHooks() {
        const whiteSel = document.getElementById('select-white-pieces');
        const blackSel = document.getElementById('select-black-pieces');
        if (whiteSel) whiteSel.onclick = () => { selectedPieceColor = 'white'; whiteSel.style.background = '#f1c40f'; if (blackSel) blackSel.style.background = '#34495e'; createPieceSelectionPanel(); };
        if (blackSel) blackSel.onclick = () => { selectedPieceColor = 'black'; blackSel.style.background = '#f1c40f'; if (whiteSel) whiteSel.style.background = '#34495e'; createPieceSelectionPanel(); };

        const whiteTurn = document.getElementById('set-white-turn');
        const blackTurn = document.getElementById('set-black-turn');
        if (whiteTurn) whiteTurn.onclick = () => { editorTurn = 'white'; updateEditorTurnButtons(); };
        if (blackTurn) blackTurn.onclick = () => { editorTurn = 'black'; updateEditorTurnButtons(); };
    }

    // Run attach hooks on factory creation (DOM elements may or may not exist yet)
    setTimeout(attachDomHooks, 50);

    return {
        openPositionEditor, closePositionEditor, initializePositionEditor, updatePositionEditorTranslations,
        savePosition, loadPosition, applyPosition, clearEditorBoard, loadStandardPosition
    };
}
