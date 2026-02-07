import { translations } from './translations.js';
import { EVOLUTION_TREE } from './evolution-tree.js';
import {pieceValues, PST} from './engine-pieces.js'

let currentLanguage = 'en'; // Default to English

function t(key, params = {}) {
    const text = translations[currentLanguage][key] || key;
    return text.replace(/{(\w+)}/g, (match, param) => params[param] || match);
}

function getPieceDisplayName(type) {
    return t(PIECE_TYPES[type].name);
}

function getPieceDescription(type) {
    const descKey = PIECE_TYPES[type].desc;
    return descKey ? t(descKey) : '';
}

function switchLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('evolution-chess-language', lang);
    updateUILanguage();
}

function updateUILanguage() {
    // Update title
    document.getElementById('game-title').textContent = t('title');

    // Update turn indicator
    const turnText = document.getElementById('turn-display');
    const currentTurnText = currentTurn === 'white' ? t('turn_white') : t('turn_black');
    turnText.innerText = currentTurnText;

    // Update piece info
    const infoPanel = document.getElementById('piece-info');
    if (!selectedCell || !board[selectedCell.y][selectedCell.x]) {
        infoPanel.innerText = t('select_piece');
    }

    // Update move history header
    document.getElementById('move-history-title').textContent = t('move_history');

    // Update buttons
    document.querySelector('.reset-btn').textContent = t('new_game');
    document.querySelector('.mod-upload-label').textContent = t('load_mod');

    // Update AI buttons
    const aiBtnWhite = document.querySelector('.ai-btn-white');
    const aiBtnBlack = document.querySelector('.ai-btn-black');
    if (aiBtnWhite) aiBtnWhite.textContent = t('vs_ai_white');
    if (aiBtnBlack) aiBtnBlack.textContent = t('vs_ai_black');

    // Update settings modal if open
    const settingsModal = document.getElementById('settings-modal-overlay');
    if (settingsModal && settingsModal.style.display !== 'none') {
        updateSettingsModal();
    }

    // Update navigation button titles
    updateNavigationButtons();
}

function showSettingsModal() {
    const modal = document.getElementById('settings-modal-overlay');
    const langSelect = document.getElementById('language-select');
    langSelect.value = currentLanguage;
    modal.style.display = 'flex';
}

function closeSettingsModal() {
    document.getElementById('settings-modal-overlay').style.display = 'none';
}

function saveSettings() {
    const langSelect = document.getElementById('language-select');
    const newLang = langSelect.value;
    switchLanguage(newLang);
    closeSettingsModal();
}

// Position Editor Functions
function openPositionEditor() {
    closeSettingsModal();
    initializePositionEditor();
    document.getElementById('position-editor-modal').style.display = 'flex';
}

function closePositionEditor() {
    document.getElementById('position-editor-modal').style.display = 'none';
}

function initializePositionEditor() {
    // Copy current board state to editor
    editorBoard = JSON.parse(JSON.stringify(board));
    editorTurn = currentTurn;

    createEditorBoard();
    createPieceSelectionPanel();
    updateEditorTurnButtons();
    updatePositionEditorTranslations();
}

function updatePositionEditorTranslations() {
    // Update titles
    const pieceSelectionTitle = document.getElementById('piece-selection-title');
    const boardPositionTitle = document.getElementById('board-position-title');

    if (pieceSelectionTitle) pieceSelectionTitle.textContent = t('piece_selection');
    if (boardPositionTitle) boardPositionTitle.textContent = t('board_position');

    // Update turn buttons
    const whiteTurnBtn = document.getElementById('set-white-turn');
    const blackTurnBtn = document.getElementById('set-black-turn');

    if (whiteTurnBtn) whiteTurnBtn.textContent = t('white_to_move');
    if (blackTurnBtn) blackTurnBtn.textContent = t('black_to_move');

    // Update action buttons
    const buttons = document.querySelectorAll('#position-editor-modal [data-action]');
    buttons.forEach(btn => {
        const action = btn.getAttribute('data-action');
        switch (action) {
            case 'clear':
                btn.textContent = '🗑️ ' + t('clear_board');
                break;
            case 'standard':
                btn.textContent = '♟️ ' + t('standard_position');
                break;
            case 'save':
                btn.textContent = '💾 ' + t('save_position');
                break;
            case 'load':
                btn.textContent = '📂 ' + t('load_position');
                break;
            case 'apply':
                btn.textContent = '✓ ' + t('apply_to_game');
                break;
            case 'cancel':
                btn.textContent = t('cancel', 'Cancel');
                break;
        }
    });
}

function createEditorBoard() {
    const editorBoardEl = document.getElementById('editor-board');
    editorBoardEl.innerHTML = '';

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
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
                // Get the correct symbol name from PIECE_TYPES
                const pieceDef = PIECE_TYPES[piece.type];
                const symbolName = pieceDef ? pieceDef.symbol || piece.type : piece.type;
                const imgName = `${piece.color}_${symbolName}`;
                if (CUSTOM_ASSETS[imgName]) {
                    img.src = CUSTOM_ASSETS[imgName];
                } else {
                    img.src = `assets/images/${imgName}.svg`;
                }
                img.style.width = '100%';
                img.style.height = '100%';
                img.onerror = function() {
                    this.style.display = 'none';
                    pieceEl.textContent = getPieceSymbol(piece.type);
                };

                pieceEl.appendChild(img);
                cell.appendChild(pieceEl);
            }

            editorBoardEl.appendChild(cell);
        }
    }
}

function createPieceSelectionPanel() {
    const panel = document.getElementById('piece-selection-panel');
    panel.innerHTML = '';

    // Group pieces by tier
    const piecesByTier = {};
    const maxTier = 3;

    // Initialize tiers
    for (let tier = 1; tier <= maxTier; tier++) {
        piecesByTier[tier] = [];
    }

    // Sort pieces into tiers
    Object.keys(PIECE_TYPES).forEach(pieceType => {
        const pieceDef = PIECE_TYPES[pieceType];
        if (pieceDef.tier && pieceDef.tier >= 1 && pieceDef.tier <= maxTier) {
            piecesByTier[pieceDef.tier].push(pieceType);
        }
    });

    // Create tier sections
    for (let tier = 1; tier <= maxTier; tier++) {
        const tierPieces = piecesByTier[tier];
        if (tierPieces.length === 0) continue;

        // Add tier header
        const tierHeader = document.createElement('div');
        tierHeader.className = 'tier-header';
        tierHeader.textContent = `Tier ${tier}`;
        tierHeader.style.fontSize = '14px';
        tierHeader.style.fontWeight = 'bold';
        tierHeader.style.margin = '10px 0 5px 0';
        tierHeader.style.color = '#f1c40f';
        panel.appendChild(tierHeader);

        // Add pieces for this tier
        const tierContainer = document.createElement('div');
        tierContainer.className = 'tier-pieces';
        tierContainer.style.display = 'flex';
        tierContainer.style.flexWrap = 'wrap';
        tierContainer.style.gap = '2px';
        tierContainer.style.marginBottom = '15px';

        tierPieces.forEach(pieceType => {
            const pieceButton = document.createElement('button');
            pieceButton.className = 'piece-selection-btn';
            pieceButton.setAttribute('data-piece-type', pieceType);
            pieceButton.onclick = () => selectPiece(pieceType);

            const img = document.createElement('img');
            const imgName = `${selectedPieceColor}_${PIECE_TYPES[pieceType].symbol || pieceType}`;
            if (CUSTOM_ASSETS[imgName]) {
                img.src = CUSTOM_ASSETS[imgName];
            } else {
                img.src = `assets/images/${imgName}.svg`;
            }
            img.style.width = '32px';
            img.style.height = '32px';
            img.onerror = function() {
                this.style.display = 'none';
                pieceButton.textContent = getPieceSymbol(pieceType);
                pieceButton.style.fontSize = '20px';
                pieceButton.style.padding = '8px';
            };

            pieceButton.appendChild(img);

            // Add tooltip with piece name
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

    // Update visual selection
    document.querySelectorAll('.piece-selection-btn').forEach(btn => {
        const isSelected = btn.getAttribute('data-piece-type') === pieceType;
        btn.classList.toggle('selected', isSelected);
    });
}

function handleEditorCellClick(x, y) {
    if (selectedPieceType) {
        // Place selected piece
        editorBoard[y][x] = {
            type: selectedPieceType,
            color: selectedPieceColor,
            xp: 0,
            hasMoved: false,
            id: Math.random().toString(36).substr(2, 9)
        };
    } else {
        // Remove piece
        editorBoard[y][x] = null;
    }

    createEditorBoard();
}

function getPieceSymbol(pieceType) {
    // First try to get from PIECE_TYPES symbol mapping
    if (PIECE_TYPES[pieceType] && PIECE_TYPES[pieceType].symbol) {
        const symbolKey = PIECE_TYPES[pieceType].symbol;
        if (SYMBOLS[symbolKey]) {
            return SYMBOLS[symbolKey];
        }
    }

    // Fallback to hardcoded symbols for basic pieces
    const symbols = {
        pawn: '♟', knight: '♞', bishop: '♗', rook: '♜', queen: '♛', king: '♚'
    };
    return symbols[pieceType] || '?';
}

// Color selection
document.getElementById('select-white-pieces').onclick = () => {
    selectedPieceColor = 'white';
    document.getElementById('select-white-pieces').style.background = '#f1c40f';
    document.getElementById('select-black-pieces').style.background = '#34495e';
    createPieceSelectionPanel();
};

document.getElementById('select-black-pieces').onclick = () => {
    selectedPieceColor = 'black';
    document.getElementById('select-black-pieces').style.background = '#f1c40f';
    document.getElementById('select-white-pieces').style.background = '#34495e';
    createPieceSelectionPanel();
};

// Turn selection
document.getElementById('set-white-turn').onclick = () => {
    editorTurn = 'white';
    updateEditorTurnButtons();
};

document.getElementById('set-black-turn').onclick = () => {
    editorTurn = 'black';
    updateEditorTurnButtons();
};

function updateEditorTurnButtons() {
    const whiteBtn = document.getElementById('set-white-turn');
    const blackBtn = document.getElementById('set-black-turn');

    if (editorTurn === 'white') {
        whiteBtn.style.background = '#f1c40f';
        whiteBtn.style.color = '#333';
        blackBtn.style.background = '#34495e';
        blackBtn.style.color = 'white';
    } else {
        blackBtn.style.background = '#f1c40f';
        blackBtn.style.color = '#333';
        whiteBtn.style.background = '#34495e';
        whiteBtn.style.color = 'white';
    }
}

// Board operations
function clearEditorBoard() {
    editorBoard = Array(8).fill(null).map(() => Array(8).fill(null));
    createEditorBoard();
}

function loadStandardPosition() {
    // Create standard chess starting position
    editorBoard = Array(8).fill(null).map(() => Array(8).fill(null));

    // Place pawns
    for (let x = 0; x < 8; x++) {
        editorBoard[1][x] = createPiece('pawn', 'black');
        editorBoard[6][x] = createPiece('pawn', 'white');
    }

    // Place other pieces
    const backRow = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    backRow.forEach((type, x) => {
        if (PIECE_TYPES[type]) {
            editorBoard[0][x] = createPiece(type, 'black');
            editorBoard[7][x] = createPiece(type, 'white');
        }
    });

    editorTurn = 'white';
    updateEditorTurnButtons();
    createEditorBoard();
}

function savePosition() {
    const positionData = {
        board: editorBoard,
        turn: editorTurn
    };

    localStorage.setItem('chessPositionEditor', JSON.stringify(positionData));
    alert(t('position_saved'));
}

function loadPosition() {
    const saved = localStorage.getItem('chessPositionEditor');
    if (saved) {
        const positionData = JSON.parse(saved);
        editorBoard = positionData.board;
        editorTurn = positionData.turn;
        updateEditorTurnButtons();
        createEditorBoard();
        alert(t('position_loaded'));
    } else {
        alert(t('no_saved_position'));
    }
}

function applyPosition() {
    // Apply the edited position to the main game
    board = JSON.parse(JSON.stringify(editorBoard));
    currentTurn = editorTurn;

    // Reset game state
    possibleMoves = [];
    selectedCell = null;
    gameOver = false;
    alertGameOver = false;
    let moveHistory = [];
    let historyIndex = -1;
    enPassantTarget = null;
    let castlingRights = {
        white: { kingSide: true, queenSide: true },
        black: { kingSide: true, queenSide: true }
    };

    // Clear arrows and update UI
    clearArrows();
    renderBoard();
    // updateMoveHistory();
    // updateTurnIndicator();

    closePositionEditor();
    alert(t('position_applied'));
}

function updateSettingsModal() {
    // Update settings modal content if needed
    const modal = document.getElementById('settings-modal-overlay');
    if (modal.style.display !== 'none') {
        const langSelect = document.getElementById('language-select');
        langSelect.value = currentLanguage;

        // Update modal title and labels
        modal.querySelector('h2').textContent = t('settings');
        modal.querySelector('label').textContent = t('language') + ':';
        modal.querySelectorAll('option')[0].textContent = t('english');
        modal.querySelectorAll('option')[1].textContent = t('russian');
        modal.querySelectorAll('button')[0].textContent = 'Cancel'; // Keep English for now
        modal.querySelectorAll('button')[1].textContent = 'Save'; // Keep English for now

        // Update position editor translations
        const positionEditorBtn = document.getElementById('position-editor-btn-text');
        const positionEditorDesc = document.getElementById('position-editor-desc');
        if (positionEditorBtn) positionEditorBtn.textContent = t('position_editor');
        if (positionEditorDesc) positionEditorDesc.textContent = t('position_editor_desc');
    }
}

// Position Editor variables
let selectedPieceType = null;
let selectedPieceColor = 'white';
let editorBoard = Array(8).fill(null).map(() => Array(8).fill(null));
let editorTurn = 'white';

const BOARD_SIZE = 8;

let CUSTOM_ASSETS = {}; 

let SYMBOLS = {
    // Basic
    pawn: 'pawn', knight: 'knight', bishop: 'bishop', rook: 'rook', queen: 'queen', king: 'king',
    // Tier 2
    spearman: 'spearman', runner: 'runner', torpedo: 'torpedo',
    camel: 'camel', paladin: 'paladin', knight_knight: 'knight_knight',
    bomber: 'bomber', ghost: 'ghost', two_color_bishop: 'two_color_bishop', swap_bishop: 'swap_bishop',
    tank: 'tank', car: 'car', statue: 'statue',
    ring: 'ring', crown: 'crown', queen_upgradeable: 'queen_upgradeable',
    tnt: 'tnt', dead_end: 'dead_end',
    // Tier 3
    spartan: 'spartan', super_runner: 'super_runner',
    camel_knight: 'camel_knight', endless_knight: 'endless_knight', moose: 'moose',
    nuke_bishop: 'nuke_bishop', sniper: 'sniper', ship: 'ship',
    helicopter: 'helicopter', rocket: 'rocket',
    unicorn: 'unicorn', pin: 'pin', range: 'range',
};

const VEC_ORTHO = [{dx:1,dy:0},{dx:-1,dy:0},{dx:0,dy:1},{dx:0,dy:-1}];
const VEC_DIAG = [{dx:1,dy:1},{dx:1,dy:-1},{dx:-1,dy:1},{dx:-1,dy:-1}];
const VEC_KNIGHT = [{dx:2,dy:1},{dx:2,dy:-1},{dx:-2,dy:1},{dx:-2,dy:-1},{dx:1,dy:2},{dx:1,dy:-2},{dx:-1,dy:2},{dx:-1,dy:-2}];
const VEC_CAMEL = [{dx:3,dy:1},{dx:3,dy:-1},{dx:-3,dy:1},{dx:-3,dy:-1},{dx:1,dy:3},{dx:1,dy:-3},{dx:-1,dy:3},{dx:-1,dy:-3}];

const move_audio = new Audio('assets/sounds/move.mp3');
const capture_audio = new Audio('assets/sounds/capture.mp3');

function slide(vectors) { return vectors.map(v => ({...v, slide: true})); }
function step(vectors) { return vectors.map(v => ({...v, slide: false})); }

let PIECE_TYPES = {
    // === TIER 1 ===
    'pawn': { name: 'pawn', symbol: SYMBOLS.pawn, role: 'pawn', tier: 1, xpReq: 1 },
    'rook': { name: 'rook', symbol: SYMBOLS.rook, moves: slide(VEC_ORTHO), tier: 1, xpReq: 1, role: 'rook' },
    'knight': { name: 'knight', symbol: SYMBOLS.knight, moves: step(VEC_KNIGHT), tier: 1, xpReq: 1 },
    'bishop': { name: 'bishop', symbol: SYMBOLS.bishop, moves: slide(VEC_DIAG), tier: 1, xpReq: 1 },
    'queen': { name: 'queen', symbol: SYMBOLS.queen, moves: [...slide(VEC_ORTHO), ...slide(VEC_DIAG)], tier: 1, xpReq: 2 },
    'king': { name: 'king', symbol: SYMBOLS.king, moves: [...step(VEC_ORTHO), ...step(VEC_DIAG)], tier: 1, xpReq: -1, role: 'king' },

    // === TIER 2 ===
    'pawn_runner': { name: 'runner', desc: 'runner_desc', symbol: SYMBOLS.runner, tier: 2, xpReq: 1, role: 'pawn', extraMoves: [{dx:1,dy:1},{dx:-1,dy:1}] },
    'pawn_spearman': { name: 'spearman', desc: 'spearman_desc', symbol: SYMBOLS.spearman, tier: 2, xpReq: 1, role: 'pawn', special: 'spear_attack' },
    'pawn_torpedo': { name: 'torpedo', desc: 'torpedo_desc', symbol: SYMBOLS.torpedo, tier: 2, xpReq: 1, role: 'pawn', extraMoves: [{dx:0,dy:2}] },

    'knight_camel': { name: 'camel', desc: 'camel_desc', symbol: SYMBOLS.camel, tier: 2, xpReq: 2, moves: step(VEC_CAMEL) },
    'knight_paladin': { name: 'paladin', desc: 'paladin_desc', symbol: SYMBOLS.paladin, tier: 2, xpReq: 2, moves: [...step(VEC_KNIGHT), ...step(VEC_ORTHO)] },
    'knight_knight': { name: 'knight_knight', desc: 'knight_knight_desc', symbol: SYMBOLS.knight_knight, tier: 2, xpReq: 1, moves: [...step(VEC_KNIGHT), ...step(VEC_DIAG)] },

    'bishop_bomber': { name: 'bomber', desc: 'bomber_desc', symbol: SYMBOLS.bomber, tier: 2, xpReq: 2, moves: slide(VEC_DIAG), special: 'revenge' },
    'bishop_ghost': { name: 'ghost', desc: 'ghost_desc', symbol: SYMBOLS.ghost, tier: 2, xpReq: 2, moves: slide(VEC_DIAG), ghost: 1 },
    'two_color_bishop': { name: 'two_color_bishop', desc: 'two_color_bishop_desc', symbol: SYMBOLS.two_color_bishop, tier: 2, xpReq: 1, moves: [...slide(VEC_DIAG), ...step(VEC_ORTHO), ...step(VEC_DIAG)] },
    'bishop_swapper': { name: 'swap_bishop', desc: 'swap_bishop_desc', symbol: SYMBOLS.swap_bishop, tier: 2, xpReq: -1, moves: slide(VEC_DIAG), special: 'swap_ally'},

    'rook_tank': { name: 'tank', desc: 'tank_desc', symbol: SYMBOLS.tank, tier: 2, xpReq: 2, moves: [...slide(VEC_ORTHO), ...step(VEC_DIAG)] },
    'rook_ghost': { name: 'car', desc: 'car_desc', symbol: SYMBOLS.car, tier: 2, xpReq: 2, moves: [...slide(VEC_ORTHO)], ghost: 1 },
    'statue': { name: 'statue', desc: 'statue_desc', symbol: SYMBOLS.statue, tier: 2, xpReq: -1, moves:[], immortal: true, special: 'teleport' },

    'queen_camel': { name: 'ring', desc: 'ring_desc', symbol: SYMBOLS.ring, tier: 2, xpReq: 4, moves: [...slide(VEC_ORTHO), ...slide(VEC_DIAG), ...step(VEC_CAMEL)] },
    'queen_knight': { name: 'crown', desc: 'crown_desc', symbol: SYMBOLS.crown, tier: 2, xpReq: 4, moves: [...slide(VEC_ORTHO), ...slide(VEC_DIAG), ...step(VEC_KNIGHT)] },
    'queen_upgradeable': { name: 'queen_upgradeable', desc: 'queen_upgradeable_desc', symbol: SYMBOLS.queen_upgradeable, tier: 2, xpReq: 1, moves: [...slide(VEC_ORTHO), ...slide(VEC_DIAG)] },

    'king_nuke': { name: 'tnt', desc: 'tnt_desc', symbol: SYMBOLS.tnt, tier: 3, xpReq: -1, moves: [...step(VEC_ORTHO), ...step(VEC_DIAG)], special: 'explode_all_5', role: 'king'  },

    // === TIER 3 ===
    'pawn_spartan': { name: 'spartan', desc: 'spartan_desc', symbol: SYMBOLS.spartan, tier: 3, xpReq: 1, role: 'pawn', extraMoves: [{dx:1,dy:1},{dx:-1,dy:1}], special: 'spear_attack' },
    'pawn_superrunner': { name: 'super_runner', desc: 'super_runner_desc', symbol: SYMBOLS.super_runner, tier: 3, xpReq: 1, role: 'pawn', extraMoves: [{dx:1,dy:1},{dx:-1,dy:1},{dx:1,dy:0},{dx:-1,dy:0},{dx:-1,dy:-1},{dx:1,dy:-1},{dx:0,dy:-1}] },

    'knight_camel_hybrid': { name: 'camel_knight', desc: 'camel_knight_desc', symbol: SYMBOLS.camel_knight, tier: 3, xpReq: -1, moves: [...step(VEC_KNIGHT), ...step(VEC_CAMEL)] },
    'knight_endless': { name: 'endless_knight', desc: 'endless_knight_desc', symbol: SYMBOLS.endless_knight, tier: 3, xpReq: -1, moves: [...slide(VEC_KNIGHT)], ghost: 10 },
    'knight_king': { name: 'moose', desc: 'moose_desc', symbol: SYMBOLS.moose, tier: 3, xpReq: -1, moves: [...step(VEC_KNIGHT), ...step(VEC_ORTHO), ...step(VEC_DIAG)]},

    'bishop_nuke': { name: 'nuke_bishop', desc: 'nuke_bishop_desc', symbol: SYMBOLS.nuke_bishop, tier: 3, xpReq: -1, moves: slide(VEC_DIAG), special: 'explode_3' },
    'bishop_sniper': { name: 'sniper', desc: 'sniper_desc', symbol: SYMBOLS.sniper, tier: 3, xpReq: -1, moves: [...slide(VEC_DIAG)], ghost: 2 },
    'bishop_ship': { name: 'ship', desc: 'ship_desc', symbol: SYMBOLS.ship, tier: 3, xpReq: -1, moves: [...step(VEC_KNIGHT), ...slide(VEC_DIAG)] },

    'rook_helicopter': { name: 'helicopter', desc: 'helicopter_desc', symbol: SYMBOLS.helicopter, tier: 2, xpReq: -1, moves: [...slide(VEC_ORTHO), ...step(VEC_KNIGHT)] },
    'rook_sniper':  { name: 'rocket', desc: 'rocket_desc', symbol: SYMBOLS.rocket, tier: 3, xpReq: -1, moves: [...slide(VEC_ORTHO)], ghost: 2 },

    'queen_knight_camel': { name: 'unicorn', desc: 'unicorn_desc', symbol: SYMBOLS.unicorn, tier: 3, xpReq: -1, moves: [...slide(VEC_ORTHO), ...slide(VEC_DIAG), ...step(VEC_KNIGHT), ...step(VEC_CAMEL)] },
    'queen_ghost': { name: 'pin', desc: 'pin_desc', symbol: SYMBOLS.pin, tier: 3, xpReq: -1, moves: [...slide(VEC_ORTHO), ...slide(VEC_DIAG)], ghost : 2 },
    'queen_range': { name: 'range', desc: 'range_desc', symbol: SYMBOLS.range, tier: 3, xpReq: -1, moves: [...slide(VEC_ORTHO), ...slide(VEC_DIAG)], special: 'range_capture'}
};

let board = [];
let currentTurn = 'white';
let selectedCell = null;
let possibleMoves = [];
let markedSquares = new Set(); // Track user-marked squares
let gameOver = false;
let alertGameOver = false;
let enPassantTarget = null;
let white_kings = 0;
let black_kings = 0;
let aiSide = null; // Глобальная переменная для стороны ИИ

// History system for move navigation
let gameHistory = [];
let currentHistoryIndex = -1;
let isViewingHistory = false;
let aiBlockedAfterHistoryReturn = false; // Блокировка ИИ после возврата из режима просмотра истории
let turnBeforeHistoryReturn = null; // Чей был ход перед возвратом из истории

// Move notation history
let moveNotationHistory = []; // Array of {notation, historyIndex, isWhite}

// --- FUNCTIONS ---

// History management functions
function saveGameState() {
    const state = {
        board: JSON.parse(JSON.stringify(board)), // Deep clone
        currentTurn: currentTurn,
        selectedCell: selectedCell,
        possibleMoves: [...possibleMoves],
        gameOver: gameOver,
        enPassantTarget: enPassantTarget ? {...enPassantTarget} : null,
        white_kings: white_kings,
        black_kings: black_kings
        // aiSide не сохраняется - это глобальная настройка
    };

    // If we're viewing history and making a new move, truncate history after current position
    if (isViewingHistory && currentHistoryIndex < gameHistory.length - 1) {
        gameHistory = gameHistory.slice(0, currentHistoryIndex + 1);
    }

    gameHistory.push(state);
    currentHistoryIndex = gameHistory.length - 1;
    isViewingHistory = false;
}

function goToMove(index) {
    if (index < 0 || index >= gameHistory.length) return;

    const state = gameHistory[index];
    board = JSON.parse(JSON.stringify(state.board)); // Deep clone

    // currentTurn восстанавливается только при просмотре прошлого,
    // но не при возврате к текущему ходу
    if (index < gameHistory.length - 1) {
        currentTurn = state.currentTurn;
    }

    // Очищаем выделение и возможные ходы при просмотре истории
    selectedCell = null;
    possibleMoves = [];
    gameOver = state.gameOver;
    // enPassantTarget = state.enPassantTarget ? {...state.enPassantTarget} : null;
    white_kings = state.white_kings;
    black_kings = state.black_kings;
    // aiSide не восстанавливается из истории - это глобальная настройка игры

    const wasViewingHistory = isViewingHistory;
    currentHistoryIndex = index;
    isViewingHistory = (index < gameHistory.length - 1);

    // Если только что вернулись из режима просмотра истории к текущему ходу
    if (wasViewingHistory && !isViewingHistory) {
        // Блокируем ИИ только если сейчас ход игрока
        // Если сейчас ход ИИ, даем ему ходить сразу
        if (currentTurn !== aiSide) {
            aiBlockedAfterHistoryReturn = true;
            turnBeforeHistoryReturn = currentTurn;
        } else {
            // Снимаем старую блокировку, если она была
            aiBlockedAfterHistoryReturn = false;
            turnBeforeHistoryReturn = null;
        }
    }

    renderBoard();
    updateInfo();
    updateGameStatus(); // Update the turn display
    updateNavigationButtons();
    updateMoveHistoryDisplay();
    move_audio.play().catch(e=>{});
}

function canGoBack() {
    return currentHistoryIndex > 0;
}

function canGoForward() {
    return currentHistoryIndex < gameHistory.length - 1;
}

function goBack() {
    if (canGoBack()) {
        goToMove(currentHistoryIndex - 1);
    }
}

function goForward() {
    if (canGoForward()) {
        goToMove(currentHistoryIndex + 1);
    }
}

function goToStart() {
    if (gameHistory.length > 0) {
        goToMove(0);
    }
}

function goToEnd() {
    if (gameHistory.length > 0) {
        goToMove(gameHistory.length - 1);
    }
}

// Generate simple move notation
function generateMoveNotation(piece, fromX, fromY, move) {
    const toX = move.x;
    const toY = move.y;

    // Files and ranks
    const fromFile = String.fromCharCode(97 + fromX); // a-h
    const toFile = String.fromCharCode(97 + toX);
    const toRank = 8 - toY; // 1-8

    let notation = '';

    // Castling
    if (move.isCastling) {
        notation = (toX === 6) ? 'O-O' : 'O-O-O';
        return notation;
    }

    // Piece symbol (only for non-pawns)
    if (PIECE_TYPES[piece.type].role !== 'pawn') {
        notation = PIECE_TYPES[piece.type].symbol.toUpperCase();
    }

    // Capture
    if (move.isCapture) {
        if (PIECE_TYPES[piece.type].role === 'pawn') {
            notation = fromFile + 'x';
        } else {
            notation += 'x';
        }
    }

    // Destination
    notation += toFile + toRank;

    // Special moves
    if (move.isEnPassant) {
        notation += ' e.p.';
    }

    return notation;
}

// Add move to notation history
function addMoveToNotationHistory(piece, fromX, fromY, move) {
    // alert("=====TEST ALERT 2=====")
    const notation = generateMoveNotation(piece, fromX, fromY, move);
    const isWhite = piece.color === 'white';

    moveNotationHistory.push({
        notation: notation,
        historyIndex: gameHistory.length - 1,
        isWhite: isWhite
    });

    updateMoveHistoryDisplay();
}

// Update move history display
function updateDragHighlights() {
    // Clear all existing highlights
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('possible-move', 'capture', 'selected');
    });

    // Apply new highlights
    if (selectedCell) {
        // Highlight selected cell
        const selectedCellEl = document.querySelector(`.cell[data-cell-x="${selectedCell.x}"][data-cell-y="${selectedCell.y}"]`);
        if (selectedCellEl) {
            selectedCellEl.classList.add('selected');
        }
    }

    // Highlight possible moves
    possibleMoves.forEach(move => {
        const cellEl = document.querySelector(`.cell[data-cell-x="${move.x}"][data-cell-y="${move.y}"]`);
        if (cellEl) {
            if (board[move.y][move.x] || move.isCapture) {
                cellEl.classList.add('capture');
            } else {
                cellEl.classList.add('possible-move');
            }
        }
    });
}

function updateMoveHistoryDisplay() {
    // alert("=====TEST ALERT=====")
    const historyEl = document.getElementById('move-history');
    historyEl.innerHTML = '';

    if (moveNotationHistory.length === 0) {
        historyEl.innerHTML = '<div style="color: #666; font-style: italic; text-align: center; padding: 15px; font-size: 12px;">No moves yet</div>';
        return;
    }

    // Group moves in pairs (white-black)
    for (let i = 0; i < moveNotationHistory.length; i += 2) {
        const moveRow = document.createElement('div');
        moveRow.className = 'move-row';

        // Move number
        const moveNumber = document.createElement('span');
        moveNumber.className = 'move-number';
        moveNumber.textContent = Math.floor(i / 2) + 1 + '.';
        moveRow.appendChild(moveNumber);

        // White move
        const whiteMove = moveNotationHistory[i];
        const whiteSpan = document.createElement('span');
        whiteSpan.className = 'move-white' + (whiteMove.historyIndex === currentHistoryIndex ? ' current' : '');
        whiteSpan.textContent = whiteMove.notation;
        whiteSpan.onclick = () => goToMove(whiteMove.historyIndex);
        moveRow.appendChild(whiteSpan);

        // Black move (if exists)
        const blackMove = moveNotationHistory[i + 1];
        const blackSpan = document.createElement('span');
        if (blackMove) {
            blackSpan.className = 'move-black' + (blackMove.historyIndex === currentHistoryIndex ? ' current' : '');
            blackSpan.textContent = blackMove.notation;
            blackSpan.onclick = () => goToMove(blackMove.historyIndex);
        } else {
            blackSpan.className = 'move-black move-empty';
            blackSpan.textContent = '';
        }
        moveRow.appendChild(blackSpan);

        historyEl.appendChild(moveRow);
    }

    // Auto-scroll to bottom only when adding new moves, not when navigating
    // (scroll only if we're at or near the bottom)
    const isNearBottom = historyEl.scrollTop + historyEl.clientHeight >= historyEl.scrollHeight - 50;
    if (isNearBottom) {
        historyEl.scrollTop = historyEl.scrollHeight;
    }
}

function updateNavigationButtons() {
    const startBtn = document.getElementById('nav-start');
    const backBtn = document.getElementById('nav-back');
    const forwardBtn = document.getElementById('nav-forward');
    const endBtn = document.getElementById('nav-end');
    const counter = document.getElementById('move-counter');

    if (startBtn) {
        startBtn.disabled = !canGoBack() || currentHistoryIndex <= 0;
        startBtn.title = t('go_to_start');
        startBtn.addEventListener("click", goToStart);
    }
    if (backBtn) {
        backBtn.disabled = !canGoBack();
        backBtn.title = t('previous_move');
        backBtn.addEventListener("click", goBack);
    }
    if (forwardBtn) {
        forwardBtn.disabled = !canGoForward();
        forwardBtn.title = t('next_move');
        forwardBtn.addEventListener("click", goForward);
    }
    if (endBtn) {
        endBtn.disabled = !canGoForward() || currentHistoryIndex >= gameHistory.length - 2;
        endBtn.title = t('go_to_end');
        endBtn.addEventListener("click", goToEnd);
    }

    if (counter) {
        const currentMove = Math.max(0, currentHistoryIndex);
        const totalMoves = gameHistory.length - 1; // Subtract 1 because index 0 is initial position
        counter.textContent = `${currentMove}/${totalMoves}`;
    }
}

function addActionsToButtons() {
    // Set actions for buttons
    document.getElementById('save-position-btn').addEventListener("click", savePosition);
    document.getElementById('load-position-btn').addEventListener("click", loadPosition);
    document.getElementById('apply-position-btn').addEventListener("click", applyPosition);
    
    document.getElementById('open-position-editor-btn').addEventListener("click", openPositionEditor);
    document.getElementById('close-position-editor-btn').addEventListener("click", closePositionEditor);
    
    document.getElementById('clear-editor-board-btn').addEventListener("click", clearEditorBoard);
    document.getElementById('load-standart-position-btn').addEventListener("click", loadStandardPosition);
    
    document.querySelector('.settings-icon').addEventListener("click", showSettingsModal);
    document.getElementById('save-settings-btn').addEventListener("click", saveSettings);
    document.getElementById('close-settings-modal-btn').addEventListener("click", closeSettingsModal);

    document.querySelector('.reset-btn').addEventListener("click", initGame);
}

function initGame() {
    console.log('initGame called');
    board = createBoard();
    currentTurn = 'white';
    selectedCell = null;
    gameOver = false;
    alertGameOver = false;
    possibleMoves = [];
    markedSquares.clear(); // Clear all square markings
    enPassantTarget = null;
    aiSide = null; // Сбрасываем сторону ИИ при новой игре

    // Reset history
    gameHistory = [];
    currentHistoryIndex = -1;
    isViewingHistory = false;
    aiBlockedAfterHistoryReturn = false;
    turnBeforeHistoryReturn = null;
    moveNotationHistory = [];

    //add actions to buttons
    addActionsToButtons()

    // Game log removed - now using move history

    updateGameStatus();
    renderBoard();
    updateInfo();

    // Save initial game state to history
    saveGameState();
    updateNavigationButtons();
    updateMoveHistoryDisplay();
    console.log('initGame completed');
}

function updateGameStatus() {
    // If the game is already over we should not re-run win/draw notifications.
    if (alertGameOver) return;
    // alert(gameOver)
    white_kings = 0;
    black_kings = 0;
    
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const piece = board[y][x];
            if (piece && PIECE_TYPES[piece.type].role === 'king') {
                if (piece.color === 'white') white_kings++;
                else black_kings++;
            }
        }
    }

    // gameOver should be true when player wins then give alert because alert will pause the js execution
    if (white_kings === 0 && black_kings === 0) {
        alert(t('draw kings destroyed!'));
        alertGameOver = true;
    } else if (white_kings === 0) {
        alert(t('black wins!'));
        alertGameOver = true;
    } else if (black_kings === 0) {
        alert(t('white wins!'));
        alertGameOver = true;
    }

    // alert("END!!!")
}

function createBoard() {
    const newBoard = Array(8).fill(null).map(() => Array(8).fill(null));
    const hasType = (t) => PIECE_TYPES[t] !== undefined;

    for(let x=0; x<8; x++) {
        if(hasType('pawn')) newBoard[1][x] = createPiece('pawn', 'black');
        if(hasType('pawn')) newBoard[6][x] = createPiece('pawn', 'white');
    }
    const backRow = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    backRow.forEach((type, x) => {
        if(hasType(type)) {
            newBoard[0][x] = createPiece(type, 'black');
            newBoard[7][x] = createPiece(type, 'white');
        }
    });
    return newBoard;
}

function createPiece(type, color) {
    return {
        type: type,
        color: color,
        xp: 0,
        hasMoved: false,
        id: Math.random().toString(36).substr(2, 9)
    };
}

function isSquareAttacked(tx, ty, attackerColor, checkBoard) {
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const piece = checkBoard[y][x];
            if (piece && piece.color === attackerColor) {
                const moves = getValidMoves(piece, x, y, checkBoard, true);
                if (moves.some(m => m.x === tx && m.y === ty)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function isInCheck(color, checkBoard = board) {
    // Найти короля указанного цвета
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const piece = checkBoard[y][x];
            if (piece && PIECE_TYPES[piece.type].role === 'king' && piece.color === color) {
                // Проверить, атакуется ли позиция короля противником
                const opponentColor = color === 'white' ? 'black' : 'white';
                return isSquareAttacked(x, y, opponentColor, checkBoard);
            }
        }
    }
    return false; // Король не найден
}

function getValidMoves(piece, startX, startY, checkBoard = board, ignoreCastling = false) {
    const moves = [];
    const def = PIECE_TYPES[piece.type];
    const isWhite = piece.color === 'white';
    const direction = isWhite ? -1 : 1;

    if (def.special === 'teleport') {
        for(let y=0; y<8; y++) {
            for(let x=0; x<8; x++) {
                if (!checkBoard[y][x]) {
                    moves.push({x, y});
                }
            }
        }
        return moves; 
    }

    if (def.role === 'pawn') {
        let dy = direction;
        if (isValidPos(startX, startY + dy) && !checkBoard[startY + dy][startX]) {
            moves.push({x: startX, y: startY + dy});
            if (!piece.hasMoved && isValidPos(startX, startY + dy * 2) && !checkBoard[startY + dy * 2][startX]) {
                moves.push({x: startX, y: startY + dy * 2, isDoublePawnMove: true});
            }
        }
        [[-1, dy], [1, dy]].forEach(att => {
            const tx = startX + att[0];
            const ty = startY + att[1];
            if (isValidPos(tx, ty)) {
                const target = checkBoard[ty][tx];
                if (target && target.color !== piece.color) {
                    if (!PIECE_TYPES[target.type].immortal) {
                         moves.push({x: tx, y: ty, isCapture: true});
                    }
                }
                else if (!target && enPassantTarget && enPassantTarget.x === tx && enPassantTarget.y === ty) {
                     moves.push({x: tx, y: ty, isCapture: true, isEnPassant: true});
                }
            }
        });
        if (def.special === 'spear_attack') {
            const forwardY = startY + direction;
            if (isValidPos(startX, forwardY)) {
                const target = checkBoard[forwardY][startX];
                if (target && target.color !== piece.color) {
                     if (!PIECE_TYPES[target.type].immortal) {
                         moves.push({x: startX, y: forwardY, isCapture: true});
                     }
                }
            }
        }
        if (def.extraMoves) {
            def.extraMoves.forEach(m => {
                const actualDy = m.dy * direction; 
                const tx = startX + m.dx;
                const ty = startY + actualDy;
                if (isValidPos(tx, ty) && !checkBoard[ty][tx]) {
                    moves.push({x: tx, y: ty});
                }
            });
        }
    }

    if (def.moves) {
        def.moves.forEach(vec => {
            const dx = vec.dx;
            const dy = vec.dy;
            
            if (vec.slide) {
                let obstaclesPassed = 0;
                const ghostLimit = (def.ghost === true) ? Infinity : (def.ghost || 0);

                for (let i = 1; i < 8; i++) {
                    const tx = startX + (dx * i);
                    const ty = startY + (dy * i);
                    if (!isValidPos(tx, ty)) break;
                    
                    const target = checkBoard[ty][tx];
                    if (!target) {
                        moves.push({x: tx, y: ty});
                    } else {
                        // 1. Проверка на ВРАГА (Обычное взятие)
                        if (target.color !== piece.color) {
                            if (!PIECE_TYPES[target.type].immortal) {
                                moves.push({x: tx, y: ty, isCapture: true});
                            }
                        } 
                        // 2. Проверка на СОЮЗНИКА И СПЕЦ. СПОСОБНОСТЬ (Обмен)
                        else if (def.special === 'swap_ally' && target.color === piece.color) {
                            // Если фигура - Слон-рокировщик и цель - союзник:
                            moves.push({x: tx, y: ty, isSwap: true});
                            // Обмен является конечным ходом в этом направлении, дальше не скользим
                            break; 
                        }

                        // Продолжение обработки препятствий (для "Призрака" и т.п.)
                        obstaclesPassed++;
                        if (obstaclesPassed > ghostLimit) break;
                    }
                }
            } else {
                const tx = startX + dx;
                const ty = startY + dy;
                if (isValidPos(tx, ty)) {
                    const target = checkBoard[ty][tx];
                    if (!target) {
                        moves.push({x: tx, y: ty});
                    } else if (target.color !== piece.color) {
                        if (!PIECE_TYPES[target.type].immortal) {
                            moves.push({x: tx, y: ty, isCapture: true});
                        }
                    }
                }
            }
        });
    }

    if (def.role === 'king' && !piece.hasMoved && !ignoreCastling) {
        const row = isWhite ? 7 : 0;
        const oppColor = isWhite ? 'black' : 'white';
        
        const kRook = checkBoard[row][7];
        if (kRook && PIECE_TYPES[kRook.type].role === 'rook' && !kRook.hasMoved) {
            if (!checkBoard[row][5] && !checkBoard[row][6]) {
                if (
                    !isSquareAttacked(4, row, oppColor, checkBoard) &&
                    !isSquareAttacked(5, row, oppColor, checkBoard) &&
                    !isSquareAttacked(6, row, oppColor, checkBoard)
                ) {
                    moves.push({x: 6, y: row, isCastling: true, rookX: 7, rookToX: 5});
                }
            }
        }
        
        const qRook = checkBoard[row][0];
        if (qRook && PIECE_TYPES[qRook.type].role === 'rook' && !qRook.hasMoved) {
            if (!checkBoard[row][1] && !checkBoard[row][2] && !checkBoard[row][3]) {
                if (
                    !isSquareAttacked(4, row, oppColor, checkBoard) &&
                    !isSquareAttacked(3, row, oppColor, checkBoard) &&
                    !isSquareAttacked(2, row, oppColor, checkBoard)
                ) {
                    moves.push({x: 2, y: row, isCastling: true, rookX: 0, rookToX: 3});
                }
            }
        }
    }
    return moves;
}

function isValidPos(x, y) {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
}

function cellClick(x, y) {
    if (isViewingHistory) return;

    // Clear all square markings and arrows when clicking any cell
    markedSquares.clear();
    clearArrows();

    const clickedPiece = board[y][x];
    const move = possibleMoves.find(m => m.x === x && m.y === y);

    if (move) {
        makeMove(selectedCell.x, selectedCell.y, move);
        return;
    }

    if (clickedPiece && clickedPiece.color === currentTurn) {
        selectedCell = {x, y};
        possibleMoves = getValidMoves(clickedPiece, x, y);
        renderBoard();
        updateInfo(clickedPiece);
    } else if (clickedPiece && clickedPiece.color !== currentTurn) {
        // Показываем информацию о фигуре противника
        selectedCell = null;
        possibleMoves = [];
        renderBoard();
        updateInfo(clickedPiece);
    } else {
        selectedCell = null;
        possibleMoves = [];
        renderBoard();
        updateInfo(null);
    }
}

function makeMove(fromX, fromY, move) {
    const toX = move.x;
    const toY = move.y;
    const piece = board[fromY][fromX];
    let target = board[toY][toX];
    let pawnPromoted = false; // Флаг для отслеживания превращения пешки

    addMoveToNotationHistory(piece, fromX, fromY, move);

    if (move.isSwap) {
        board[fromY][fromX] = target;
        board[toY][toX] = piece;
        
        piece.hasMoved = true;
        
        log(`🔄 ${getPieceDisplayName(piece.type)} swapped with ${getPieceDisplayName(target.type)}`);
        move_audio.play().catch(e=>{});


        const isAtEnd = (target.color === 'white' && fromY === 0) || (target.color === 'black' && fromY === 7);
        log("hi");
        log(isAtEnd)
        if (PIECE_TYPES[target.type].role === 'pawn' && isAtEnd) {
            updateGameStatus(); // Проверяем состояние перед превращением
            if (!gameOver) {
                renderBoard();
                showPromotionModal(target);
            }
            return; 
        }
        
        endTurn();
        return;
    }
    
    let captureHappened = false;
    let enemyType = null;
    let explosion = false;

    if (move.isEnPassant) {
        const dir = piece.color === 'white' ? 1 : -1; 
        const capturedPawnY = toY + dir;
        target = board[capturedPawnY][toX]; 
        board[capturedPawnY][toX] = null; 
        captureHappened = true;
        log(t('en_passant'));
    }

    if (target) {
        capture_audio.play().catch(e=>{});
        captureHappened = true;
        enemyType = target.type;
        piece.xp += 1;
        
        if (['explode_3', 'detonate_3'].includes(PIECE_TYPES[target.type].special)) {
            explode(toX, toY, board[toY][toX].color, 1);
            explosion = true;
        } else if (['explode_5', 'detonate_5'].includes(PIECE_TYPES[target.type].special)) {
            explode(toX, toY, board[toY][toX].color, 2);
            explosion = true;
        } else if (['explode_all_5', 'explode_all_3', 'explode_all_7', 'explode_all_1', 'explode_all_9'].includes(PIECE_TYPES[target.type].special)) {
            let radius_to_explode = parseInt(PIECE_TYPES[target.type].special[(PIECE_TYPES[target.type].special).length - 1], 10);
            explode_all(toX, toY, board[toY][toX].color, (radius_to_explode-1) / 2);
            explosion = true;
        }
    } else {
        move_audio.play().catch(e=>{});
    }

    // Перемещение и обработка особых эффектов при перемещении
    if(target) {
        if(PIECE_TYPES[piece.type].special === 'range_capture') {
            board[toY][toX] = null;
        } else if(explosion) {
            // Если произошел взрыв при взятии, проверяем, умирает ли атакующий
            if(PIECE_TYPES[piece.type].role !== 'king' && PIECE_TYPES[piece.type].role !== 'pawn') {
                board[toY][toX] = null; // Не король и не пешка умирают от взрыва камикадзе
            } else {
                board[toY][toX] = piece; // Короли и пешки занимают место
            }
        } else if(PIECE_TYPES[target.type].special === 'revenge') {
            explosion = true;
            // // Логика "мести": если атакующий не король, он умирает
            // if(PIECE_TYPES[piece.type].role === 'king') {
            //      // Король выживает при мести (упрощение, или можно добавить урон)
            //      board[toY][toX] = piece;
            // } else {
            //     board[toY][toX] = null;
            // }
            explode_all(toX, toY, board[toY][toX].color, 1);
            board[toY][toX] = null;
        } else {
            board[toY][toX] = piece;
        }
    } else {
        board[toY][toX] = piece;
    }

    // Очистка старой клетки (если это не дальняя атака)
    if(PIECE_TYPES[piece.type].special !== 'range_capture') {
        board[fromY][fromX] = null;
    } else if(!target) {
        board[fromY][fromX] = null; // Если range_capture но никого не съел - просто ход
    }
    
    piece.hasMoved = true;

    // Рокировка
    if (move.isCastling) {
        const rook = board[toY][move.rookX];
        board[toY][move.rookToX] = rook;
        board[toY][move.rookX] = null;
        rook.hasMoved = true;
        log(t('castling'));
    }

    // Взятие на проходе (метка)
    if (move.isDoublePawnMove) {
        const dir = piece.color === 'white' ? -1 : 1;
        enPassantTarget = { x: toX, y: toY - dir }; 
    } else {
        enPassantTarget = null;
    }

    const def = PIECE_TYPES[piece.type];
    const isAtEnd = (piece.color === 'white' && toY === 0) || (piece.color === 'black' && toY === 7);
    
    if (def.role === 'pawn' && isAtEnd) {
        updateGameStatus(); // Проверяем состояние перед превращением
        if (!gameOver) {
            renderBoard();
            // Для ИИ - автоматическое превращение в ферзя
            if (piece.color !== aiSide) {
                showPromotionModal(piece);
                return;
            } else {
                // Автоматическая эволюция для ИИ - превращаем в ферзя
                piece.type = 'queen';
                piece.xp = 0;
                pawnPromoted = true; // Устанавливаем флаг
                log(`🤖 AI pawn promoted to ${getPieceDisplayName('queen')}`);
                // Важно: завершаем ход после превращения
                endTurn();
                return;
            }
        }
        return;
    }

    // Взрывы атакующего (Ядерный король, Бомбер и т.д.)
    if (captureHappened && enemyType) {
        log(t('piece_capture', { piece: getPieceDisplayName(piece.type), target: getPieceDisplayName(enemyType) }));
        
        if (def.special && def.special.startsWith('explode_all')) {
            // Убрана ошибочная логика ручного декремента королей здесь!
            let radius_to_explode = parseInt(def.special[(def.special).length - 1], 10);
            explode_all(toX, toY, piece.color, (radius_to_explode-1) / 2);
        } else if (def.special && def.special.startsWith('explode')) {
            const radius = def.special === 'explode_5' ? 2 : 1; 
            explode(toX, toY, piece.color, radius);
            board[toX][toY] = null;
            board[fromX][fromY] = null;
        }
    }

    // Проверка на победу/поражение ПОСЛЕ всех взрывов и перемещений
    updateGameStatus();
    if(gameOver) {
        renderBoard();
        return;
    }

    if (canEvolve(piece) && explosion === false && !pawnPromoted) {
        renderBoard();
        if (piece.color === aiSide) {
            // Автоматическая эволюция для ИИ - выбираем первую доступную опцию
            const options = EVOLUTION_TREE[piece.type];
            if (options && options.length > 0) {
                const newType = options[0]; // Выбираем первую доступную эволюцию
                piece.type = newType;
                piece.xp = 0;
                log(`🧬 AI evolution completed: ${getPieceDisplayName(newType)}`);
                updateGameStatus();
            }
        } else {
            // Показываем модальное окно для игрока
            showEvolutionModal(piece);
            return;
        }
    }

    endTurn();

    // Add move to notation history after ending turn (when gameHistory is updated)
    // addMoveToNotationHistory(piece, fromX, fromY, move);
}

function endTurn() {
    // Save current game state to history before changing turn
    saveGameState();

    selectedCell = null;
    possibleMoves = [];
    currentTurn = currentTurn === 'white' ? 'black' : 'white';
    renderBoard();
    const turnText = document.getElementById('turn-display');
    turnText.innerText = currentTurn === 'white' ? t('turn_white') : t('turn_black');
    updateNavigationButtons();

    // Снимаем блокировку ИИ после того, как игрок сделал ход и ход перешел к следующему игроку
    if (aiBlockedAfterHistoryReturn && currentTurn !== turnBeforeHistoryReturn) {
        aiBlockedAfterHistoryReturn = false;
        turnBeforeHistoryReturn = null;
    }
}

function explode(cx, cy, attackerColor, radius) {
    log(t('explosion', { radius }));
    for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
            // if (dx===0 && dy===0) log("delete");
            const tx = cx + dx;
            const ty = cy + dy;
            if (isValidPos(tx, ty)) {
                const victim = board[ty][tx];
                if (victim && PIECE_TYPES[victim.type].role !== 'pawn' && !PIECE_TYPES[victim.type].immortal) { 
                    const isNuke = radius > 1;
                    // if (isNuke || victim.color !== attackerColor) {
                    board[ty][tx] = null;
                        // Счетчики королей здесь не трогаем, они обновятся в updateGameStatus
                    // }
                }
            }
        }
    }
}

function explode_all(cx, cy, attackerColor, radius) {
    log(t('explosion', { radius }));
    for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
            // if (dx===0 && dy===0) continue; // Центр взрыва (сам атакующий) не уничтожается
            const tx = cx + dx;
            const ty = cy + dy;
            if (isValidPos(tx, ty)) {
                const victim = board[ty][tx];
                if (victim && !PIECE_TYPES[victim.type].immortal) { 
                    const isNuke = radius > 1;
                    if (isNuke) {
                        board[ty][tx] = null;
                        // Счетчики королей здесь не трогаем
                    }
                }
            }
        }
    }
}

// --- MODALS & RENDER ---

function showModal(title, text, items, callback) {
    const overlay = document.getElementById('modal-overlay');
    const container = document.getElementById('modal-container');
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-subtitle').innerText = text;
    container.innerHTML = '';

    items.forEach(item => {
        const def = PIECE_TYPES[item];
        if (!def) return; 

        const card = document.createElement('div');
        card.className = `modal-card ${def.tier === 3 ? 'tier-3-card' : ''}`;
        
        const img = document.createElement('img');
        const color = currentTurn;
        const imgName = `${color}_${def.symbol}`;
        
        if (CUSTOM_ASSETS[imgName]) {
             img.src = CUSTOM_ASSETS[imgName];
        } else {
             img.src = `assets/images/${imgName}.svg`;
        }

        img.onerror = function() {
            this.style.display = 'none';
            this.nextElementSibling.style.display='block';
        };

        card.innerHTML = '';
        card.appendChild(img);
        
        const placeholder = document.createElement('div');
        placeholder.style.display = 'none';
        placeholder.style.fontSize = '40px';
        placeholder.innerText = '?';
        card.appendChild(placeholder);

        const nameSpan = document.createElement('span');
        nameSpan.className = 'modal-name';
        nameSpan.innerText = getPieceDisplayName(item);
        card.appendChild(nameSpan);

        const descSpan = document.createElement('span');
        descSpan.className = 'modal-desc';
        descSpan.innerText = getPieceDescription(item);
        card.appendChild(descSpan);

        card.onclick = () => {
            overlay.style.display = 'none';
            callback(item);
        };
        container.appendChild(card);
    });

    overlay.style.display = 'flex';
}

function canEvolve(piece) {
    const evolutions = EVOLUTION_TREE[piece.type];
    if (!evolutions || evolutions.length === 0) return false;
    const def = PIECE_TYPES[piece.type];
    return piece.xp >= def.xpReq;
}

function showEvolutionModal(piece) {
    const options = EVOLUTION_TREE[piece.type];
    showModal(t('evolution_title'), t('evolution_text'), options, (newType) => {
        piece.type = newType;
        piece.xp = 0;
        log(t('evolution_complete'));
        // Проверяем статус игры после эволюции (вдруг число королей изменилось)
        updateGameStatus();
        endTurn();
    });
}

function showPromotionModal(piece) {
    const defaultOptions = ['queen', 'rook', 'bishop', 'knight'];
    const options = defaultOptions.filter(t => PIECE_TYPES[t] !== undefined);

    showModal(t('promotion_title'), t('promotion_text'), options, (newType) => {
        piece.type = newType;
        piece.xp = 0;
        piece.hasMoved = true;
        log(t('promotion', { piece: getPieceDisplayName(newType) }));
        updateGameStatus();
        endTurn();
    });
}

function renderBoard() {
    const boardEl = document.getElementById('board');
    if (!boardEl) {
        console.error('Board element not found!');
        return;
    }
    boardEl.innerHTML = '';

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const cell = document.createElement('div');
            cell.className = `cell ${(x + y) % 2 === 0 ? 'light' : 'dark'}`;
            cell.onclick = () => cellClick(x, y);
            cell.oncontextmenu = (e) => {
                e.preventDefault(); // Prevent default context menu
            };

            // Store coordinates for drag and drop
            cell.setAttribute('data-cell-x', x);
            cell.setAttribute('data-cell-y', y);

            const move = possibleMoves.find(m => m.x === x && m.y === y);
            if (move) {
                if (board[y][x] || move.isCapture) {
                    cell.classList.add('capture');
                } else if (move.isCastling || move.isEnPassant) {
                    cell.classList.add('possible-move');
                } else {
                    cell.classList.add('possible-move');
                }
            }
            if (selectedCell && selectedCell.x === x && selectedCell.y === y) {
                cell.classList.add('selected');
            }
            if (markedSquares.has(`${x},${y}`)) {
                // cell.classList.add('user-marked');
                if((x+y)%2 == 0) {
                    cell.classList.add('user-marked-light');
                }
                else {
                    cell.classList.add('user-marked-dark');
                }
            }

            const piece = board[y][x];
            if (piece) {
                const pieceEl = document.createElement('div');
                const def = PIECE_TYPES[piece.type];
                if (!def) {
                    pieceEl.innerText = "?";
                    cell.appendChild(pieceEl);
                    boardEl.appendChild(cell);
                    continue;
                }

                pieceEl.className = `piece ${piece.color} tier-${def.tier}`;
                if (def.immortal) pieceEl.classList.add('immortal');

                // Highlight king if in check
                if (def.role === 'king') {
                    const opponentColor = piece.color === 'white' ? 'black' : 'white';
                    if (isSquareAttacked(x, y, opponentColor, board)) {
                        pieceEl.classList.add('king-in-check');
                    }
                }

                // Add drag and drop functionality
                if (!isViewingHistory && piece.color === currentTurn) {
                    pieceEl.classList.add('draggable');
                    pieceEl.setAttribute('data-x', x);
                    pieceEl.setAttribute('data-y', y);

                    // Add dragging class if this piece is being dragged
                    if (isDragging && draggedFromX === x && draggedFromY === y) {
                        pieceEl.classList.add('dragging');
                    }
                } else {
                    pieceEl.classList.remove('draggable');
                    pieceEl.classList.remove('dragging');
                    pieceEl.removeAttribute('data-x');
                    pieceEl.removeAttribute('data-y');
                }

                const img = document.createElement('img');
                const imgName = `${piece.color}_${def.symbol}`;

                if (CUSTOM_ASSETS[imgName]) {
                    img.src = CUSTOM_ASSETS[imgName];
                } else {
                    img.src = `assets/images/${imgName}.svg`;
                }

                img.onerror = function() {
                    this.style.display = 'none';
                    const textSpan = document.createElement('span');
                    textSpan.style.fontSize = '12px';
                    textSpan.style.fontWeight = 'bold';
                    textSpan.innerText = def.name;
                    pieceEl.appendChild(textSpan);
                };

                pieceEl.appendChild(img);

                if (piece.xp > 0 && def.xpReq != -1) {
                    const badge = document.createElement('span');
                    badge.className = 'lvl-badge';
                    badge.innerText = `${piece.xp}/${def.xpReq}`;
                    pieceEl.appendChild(badge);
                }

                cell.appendChild(pieceEl);
            }
            boardEl.appendChild(cell);
        }
    }

    // Add coordinate labels
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    // Add letters to bottom row (y=7)
    for (let x = 0; x < 8; x++) {
        const bottomCell = document.querySelector(`.cell[data-cell-x="${x}"][data-cell-y="7"]`);
        if (bottomCell) {
            const letterLabel = document.createElement('div');
            if(x%2 === 0) {
                letterLabel.className = 'coordinate-label-light coordinate-letter';
            } else {
                letterLabel.className = 'coordinate-label-dark coordinate-letter';
            }
            letterLabel.textContent = letters[x];
            bottomCell.appendChild(letterLabel);
        }
    }

    // Add numbers to left column (x=0), from 8 at top to 1 at bottom
    for (let y = 0; y < 8; y++) {
        const leftCell = document.querySelector(`.cell[data-cell-x="0"][data-cell-y="${y}"]`);
        if (leftCell) {
            const numberLabel = document.createElement('div');
            // numberLabel.className = 'coordinate-label-dark coordinate-number';
            if(y%2 !== 0) {
                numberLabel.className = 'coordinate-label-light coordinate-number';
            } else {
                numberLabel.className = 'coordinate-label-dark coordinate-number';
            }
            numberLabel.textContent = (8 - y).toString(); // 8 at y=0, 7 at y=1, ..., 1 at y=7
            leftCell.appendChild(numberLabel);
        }
    }

    // Add SVG overlay for arrows
    const boardRect = boardEl.getBoundingClientRect();
    arrowsSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    arrowsSvg.setAttribute('width', '100%');
    arrowsSvg.setAttribute('height', '100%');
    arrowsSvg.setAttribute('viewBox', `0 0 ${boardRect.width} ${boardRect.height}`);
    arrowsSvg.style.position = 'absolute';
    arrowsSvg.style.top = '0';
    arrowsSvg.style.left = '0';
    arrowsSvg.style.pointerEvents = 'none';
    arrowsSvg.style.zIndex = '10';
    arrowsSvg.style.width = '100%';
    arrowsSvg.style.height = '100%';
    boardEl.style.position = 'relative'; // Make board container relative for absolute positioning
    boardEl.appendChild(arrowsSvg);

    // Update highlights after rendering
    updateDragHighlights();

    if(gameOver) {
        selectedCell = null;
        gameOver = false;
        possibleMoves = [];
        markedSquares.clear();
        clearArrows();
        renderBoard();
    }
}

// function test_btn() {
//     selectedCell = null;
//     gameOver = false;
//     possibleMoves = [];
//     markedSquares.clear();
//     clearArrows();
//     renderBoard();
// }

// Update arrow overlay size and position when window changes
function updateArrowOverlay() {
    if (!arrowsSvg) return;

    const boardEl = document.getElementById('board');
    if (!boardEl) return;

    const boardRect = boardEl.getBoundingClientRect();

    // Update SVG viewBox to match current board size
    arrowsSvg.setAttribute('viewBox', `0 0 ${boardRect.width} ${boardRect.height}`);

    // Update all existing arrows to match new coordinates
    arrowElements.forEach(arrow => {
        // Arrows will automatically adjust since they use relative coordinates
        // But we may need to update markers if arrow head sizes changed
    });
}

// Handle window resize and scroll events to keep arrows positioned correctly
window.addEventListener('resize', updateArrowOverlay);
window.addEventListener('scroll', updateArrowOverlay);

// Custom Drag and Drop functionality using mouse events
let draggedPiece = null;
let draggedFromX = -1;
let draggedFromY = -1;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let draggedElement = null;
let dragClone = null;

// Arrow drawing functionality
let arrowStartX = -1;
let arrowStartY = -1;
let isDrawingArrow = false;
let arrowsSvg = null;
let arrowElements = []; // Store arrow elements for clearing
let arrowMovedToDifferentCell = false; // Track if mouse moved to a different cell

// Get current cell size for responsive drag positioning
function getCurrentCellSize() {
    const cell = document.querySelector('.cell');
    if (cell) {
        const rect = cell.getBoundingClientRect();
        return Math.min(rect.width, rect.height);
    }
    return 80; // fallback for desktop
}

// Mouse event handlers
document.addEventListener('mousedown', function(e) {
    if (isViewingHistory || e.button !== 0) return; // Only left mouse button for dragging

    const pieceEl = e.target.closest('.piece.draggable');
    if (!pieceEl) return;

    e.preventDefault();

    const x = parseInt(pieceEl.getAttribute('data-x'));
    const y = parseInt(pieceEl.getAttribute('data-y'));

    draggedPiece = board[y][x];
    draggedFromX = x;
    draggedFromY = y;
    draggedElement = pieceEl;
    dragStartX = e.clientX;
    dragStartY = e.clientY;

    // Create drag clone
    const cellSize = getCurrentCellSize();
    const offset = cellSize / 2; // Center the piece under cursor

    dragClone = pieceEl.cloneNode(true);
    dragClone.className = 'piece dragging';
    dragClone.style.position = 'fixed';
    dragClone.style.zIndex = '1000';
    dragClone.style.opacity = '0.8';
    dragClone.style.pointerEvents = 'none';
    dragClone.style.width = cellSize + 'px';
    dragClone.style.height = cellSize + 'px';
    dragClone.style.left = (e.clientX - offset) + 'px';
    dragClone.style.top = (e.clientY - offset) + 'px';
    dragClone.style.transform = 'none';
    dragClone.style.margin = '0';
    dragClone.style.padding = '0';
    document.body.appendChild(dragClone);

    // Hide original piece
    pieceEl.style.opacity = '0.3';

    // Highlight possible moves for dragged piece (but don't show highlights during dragging)
    selectedCell = {x, y};
    possibleMoves = getValidMoves(draggedPiece, x, y);

    // Don't update highlights during dragging - keep the board clean
});

document.addEventListener('mousemove', function(e) {
    if (!draggedPiece || isViewingHistory) return;

    // Only process drag movement if left mouse button is pressed or we're already dragging
    if (!isDragging && e.buttons !== 1) return; // 1 = left mouse button

    // Start dragging only if mouse moved far enough from start position
    if (!isDragging) {
        const deltaX = Math.abs(e.clientX - dragStartX);
        const deltaY = Math.abs(e.clientY - dragStartY);
        const minDragDistance = 5; // pixels

        if (deltaX > minDragDistance || deltaY > minDragDistance) {
            isDragging = true;
        } else {
            return; // Not dragging yet, just hovering
        }
    }

    // Move the drag clone with the cursor
    if (isDragging && dragClone) {
        const cellSize = getCurrentCellSize();
        const offset = cellSize / 2; // Center the piece under cursor
        dragClone.style.left = (e.clientX - offset) + 'px';
        dragClone.style.top = (e.clientY - offset) + 'px';
    }

    // During dragging, we don't highlight cells - only show highlights when clicking on pieces
});

document.addEventListener('mouseup', function(e) {
    if (!draggedPiece || isViewingHistory || e.button !== 0) return; // Only left mouse button for dropping

    const wasDragging = isDragging;
    isDragging = false;

    // Clean up drag clone and restore original piece
    if (dragClone) {
        document.body.removeChild(dragClone);
        dragClone = null;
    }
    if (draggedElement) {
        draggedElement.style.opacity = '';
    }

    // Only process drop if we were actually dragging
    if (wasDragging) {
        // Find cell under cursor
        const cell = document.elementFromPoint(e.clientX, e.clientY)?.closest('.cell');

        let moveExecuted = false;
        if (cell) {
            const toX = parseInt(cell.getAttribute('data-cell-x'));
            const toY = parseInt(cell.getAttribute('data-cell-y'));

            // Check if this is a valid move
            const move = possibleMoves.find(m => m.x === toX && m.y === toY);
            if (move) {
                // Execute the move
                makeMove(draggedFromX, draggedFromY, move);
                moveExecuted = true;
            }
        }

        // Clear all highlights

        // Reset drag state
        draggedPiece = null;
        draggedElement = null;
        draggedFromX = -1;
        draggedFromY = -1;
        selectedCell = null;
        possibleMoves = [];

        // Only re-render if move wasn't executed (to avoid visual glitches)
        if (!moveExecuted) {
            updateDragHighlights();
        }
    } else {
        // Just clicked, not dragged - reset state
        draggedPiece = null;
        draggedElement = null;
        draggedFromX = -1;
        draggedFromY = -1;
    }
});

// Arrow drawing with right mouse button
document.addEventListener('mousedown', function(e) {
    if (e.button === 2) { // Right mouse button
        e.preventDefault();

        const cell = e.target.closest('.cell');
        if (cell) {
            const x = parseInt(cell.getAttribute('data-cell-x'));
            const y = parseInt(cell.getAttribute('data-cell-y'));

            arrowStartX = x;
            arrowStartY = y;
            isDrawingArrow = true;
            arrowMovedToDifferentCell = false; // Reset movement flag
        }
    }
});

// Track mouse movement during arrow drawing
document.addEventListener('mousemove', function(e) {
    if (isDrawingArrow && e.buttons === 2) { // Right mouse button is held
        // Check if mouse moved to a different cell
        const cell = document.elementFromPoint(e.clientX, e.clientY)?.closest('.cell');
        if (cell) {
            const currentX = parseInt(cell.getAttribute('data-cell-x'));
            const currentY = parseInt(cell.getAttribute('data-cell-y'));

            if (currentX !== arrowStartX || currentY !== arrowStartY) {
                arrowMovedToDifferentCell = true;
            }
        }
    }
});

document.addEventListener('mouseup', function(e) {
    if (e.button === 2) { // Right mouse button
        e.preventDefault();

        const cell = e.target.closest('.cell');
        if (cell && isDrawingArrow) {
            const x = parseInt(cell.getAttribute('data-cell-x'));
            const y = parseInt(cell.getAttribute('data-cell-y'));

            if (arrowMovedToDifferentCell) {
                // Mouse moved to different cell - draw arrow
                // Only draw arrows between different cells
                if (arrowStartX !== x || arrowStartY !== y) {
                    drawArrow(arrowStartX, arrowStartY, x, y, 15, 5);
                }
            } else {
                // Mouse stayed in same cell - toggle square marking
                const squareKey = `${x},${y}`;
                if (markedSquares.has(squareKey)) {
                    markedSquares.delete(squareKey);
                } else {
                    markedSquares.add(squareKey);
                }
                renderBoard(); // Re-render to show/hide marking
            }
        }

        isDrawingArrow = false;
        arrowStartX = -1;
        arrowStartY = -1;
        arrowMovedToDifferentCell = false;
    }
});

function updateInfo(piece) {
    const infoPanel = document.getElementById('piece-info');
    if (!piece) {
        infoPanel.innerText = t('select_piece');
        return;
    }

    const def = PIECE_TYPES[piece.type];
    const nextEvos = EVOLUTION_TREE[piece.type] || [];
    const hasEvo = nextEvos.length > 0;

    let immortalBadge = def.immortal ? `<span style="font-size:0.6em; background:#9b59b6; color:#fff; padding:2px 5px; border-radius:4px; margin-left:5px;">${t('immortal')}</span>` : '';

    infoPanel.innerHTML = `
        <div style="font-size: 1.4em; margin-bottom:5px;">
            <strong>${getPieceDisplayName(piece.type)}</strong>
            <span style="font-size:0.6em; background:#f1c40f; color:#000; padding:2px 5px; border-radius:4px;">${t('tier')} ${def.tier}</span>
            ${immortalBadge}
        </div>
        <div style="font-size: 0.9em; color: #ccc; margin-bottom: 10px;">${getPieceDescription(piece.type)}</div>

        ${hasEvo ?
            `${t('progress')}: <b>${piece.xp} / ${def.xpReq}</b> XP<br>
            <small style="color:#aaa">${t('next')}: ${nextEvos.map(t => PIECE_TYPES[t] !== undefined ? getPieceDisplayName(t) : t).join(', ')}</small>`
            :
            `<b style="color:#f1c40f">${t('max_level')}</b>`
        }
    `;
}

// --- MOD SYSTEM ---

function loadMod(input) {
    const files = Array.from(input.files);
    
    if(files.length === 0) return;

    Object.values(CUSTOM_ASSETS).forEach(url => URL.revokeObjectURL(url));
    CUSTOM_ASSETS = {};

    const jsonFile = files.find(f => f.name.endsWith('.json'));

    files.forEach(f => {
        if(f.name.toLowerCase().endsWith('.svg')) {
            const key = f.name.replace('.svg', '');
            const url = URL.createObjectURL(f);
            CUSTOM_ASSETS[key] = url;
            console.log(`Loaded asset: ${key}`);
        }
    });

    if (jsonFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const modData = JSON.parse(e.target.result);
                
                if (!modData.PIECE_TYPES || !modData.EVOLUTION_TREE) {
                    alert("Ошибка мода: отсутствуют PIECE_TYPES или EVOLUTION_TREE");
                    return;
                }

                if (modData.SYMBOLS) SYMBOLS = modData.SYMBOLS;
                PIECE_TYPES = modData.PIECE_TYPES;
                EVOLUTION_TREE = modData.EVOLUTION_TREE;

                log(t('mod_loaded', { name: jsonFile.name }));
                log(t('sprites_loaded', { count: Object.keys(CUSTOM_ASSETS).length }));
                
                initGame();
                input.value = '';
            } catch (err) {
                console.error(err);
                alert("Ошибка чтения JSON файла мода!");
            }
        };
        reader.readAsText(jsonFile);
    } else {
        alert("В папке не найден .json файл конфигурации!");
    }
}

function log(msg) {
    // Keep event logging for debugging only - move history is now displayed separately
    console.log(`> ${msg}`);
}
// ================== AI ENGINE for "Шахматы с эволюцией" ==================
// Интеграция с существующими переменными/функциями страницы:
// - board (8x8 array of piece objects)
// - PIECE_TYPES (definitions)
// - getValidMoves(piece, x, y, checkBoard, ignoreCastling)
// - makeMove(fromX, fromY, move)  <-- используется для применения хода в UI
// - renderBoard(), updateInfo(), log(), initGame()
// - глобальная enPassantTarget (движок временно перезаписывает её при симуляции)
// =======================================================================

(function(){
    // Параметры ИИ — настраиваемые
    const AI_CONFIG = {
        timePerMoveMs: 1500,   // лимит времени на ход (ms) — меняйте для "сложности"
        maxDepthHardCap: 4,    // абсолютный максимум глубины итеративного углубления
        mode: 'full',       // 'classic' | 'full'  -- classic: только обычные шахматные фигуры
        useQuiescence: true
    };

    // Классификация классических фигур
    const CLASSIC_SET = new Set(['pawn','knight','bishop','rook','queen','king']);

    // Zobrist hashing
    const Zobrist = {
        table: {},   // pieceType_color_squareIndex -> BigInt
        sideToMove: 0n,
        initialized: false,
        init() {
            if (this.initialized) return;
            this.sideToMove = rand64();
            const pieceTypes = Object.keys(PIECE_TYPES);
            for (const p of pieceTypes) {
                this.table[p] = { white: Array(64).fill(0n), black: Array(64).fill(0n) };
                for (let sq=0; sq<64; sq++){
                    this.table[p].white[sq] = rand64();
                    this.table[p].black[sq] = rand64();
                }
            }
            this.initialized = true;
        },
        hashBoard(board, epTarget, side) {
            // board[y][x] -> piece or null
            let h = 0n;
            for (let y=0; y<8; y++){
                for (let x=0; x<8; x++){
                    const p = board[y][x];
                    if (p) {
                        const idx = y*8 + x;
                        const color = p.color;
                        const type = p.type;
                        if (this.table[type] && this.table[type][color]) {
                            h ^= this.table[type][color][idx];
                        }
                    }
                }
            }
            if (side === 'black') h ^= this.sideToMove;
            if (epTarget) {
                // fold en-passant x coordinate (0..7) into hash
                h ^= BigInt(epTarget.x + 1) * 0x9e3779b97f4a7c15n; // magic
            }
            return h.toString(); // string key for Map
        }
    };

    function rand64(){
        // формируем 64-битное случайное BigInt
        const hi = Math.floor(Math.random() * 0x100000000);
        const lo = Math.floor(Math.random() * 0x100000000);
        return (BigInt(hi) << 32n) ^ BigInt(lo);
    }

    // Клонирование доски и фигур — используется для симуляции ходов
    function cloneBoard(srcBoard) {
        const b = Array(8).fill(null).map(()=>Array(8).fill(null));
        for (let y=0;y<8;y++){
            for (let x=0;x<8;x++){
                const p = srcBoard[y][x];
                if (p) {
                    b[y][x] = {
                        type: p.type,
                        color: p.color,
                        xp: p.xp || 0,
                        hasMoved: p.hasMoved || false,
                        id: p.id || null
                    };
                }
            }
        }
        return b;
    }

    // Утилиты: получить все ходы для стороны на данном board
    function generateAllMoves(boardState, side, epTarget) {
        // getValidMoves использует глобальную enPassantTarget — временно подменим
        const oldEP = enPassantTarget;
        enPassantTarget = epTarget;
        const moves = []; // {fromX,fromY, move}
        for (let y=0;y<8;y++){
            for (let x=0;x<8;x++){
                const p = boardState[y][x];
                if (!p || p.color !== side) continue;
                // Режим classic: пропустить нетипичные фигуры (если включено)
                if (AI_CONFIG.mode === 'classic' && !CLASSIC_SET.has(p.type)) continue;
                try {
                    const mlist = getValidMoves(p, x, y, boardState, true) || [];
                    for (const m of mlist) {
                        moves.push({fromX:x, fromY:y, move:m});
                    }
                } catch (e) {
                    // на всякий случай — если getValidMoves падает для модиф. фигур
                    // пропускаем эти фигуры (в классическом режиме это ожидаемо)
                    //console.warn("getValidMoves error:", e);
                }
            }
        }
        enPassantTarget = oldEP;
        return moves;
    }

    // Применение хода на симулированной доске — возвращает новый epTarget
    function applyPseudoMove(boardState, fromX, fromY, move) {
        // работает с cloned board
        const toX = move.x, toY = move.y;
        const piece = boardState[fromY][fromX];
        let epTarget = null;

        // handle en passant capture
        if (move.isEnPassant) {
            const dir = piece.color === 'white' ? 1 : -1;
            const capturedY = toY + dir;
            boardState[capturedY][toX] = null;
        }

        // handle capture (we simply overwrite)
        const target = boardState[toY][toX];
        if (target) {
            // increment xp on attacker in search world
            piece.xp = (piece.xp || 0) + 1;
        }

        // move piece
        boardState[toY][toX] = Object.assign({}, piece);
        boardState[fromY][fromX] = null;
        boardState[toY][toX].hasMoved = true;

        // castling
        if (move.isCastling) {
            const rook = boardState[toY][move.rookX];
            boardState[toY][move.rookToX] = rook;
            boardState[toY][move.rookX] = null;
            if (boardState[toY][move.rookToX]) boardState[toY][move.rookToX].hasMoved = true;
        }

        // double pawn move -> set enPassant target
        if (move.isDoublePawnMove) {
            const dir = piece.color === 'white' ? -1 : 1;
            epTarget = { x: toX, y: toY - dir };
        } else {
            epTarget = null;
        }

        // promotion handling (простое): если пешка дошла до конца, превращаем в ферзя (если есть)
        const def = PIECE_TYPES[boardState[toY][toX].type];
        if (def && def.role === 'pawn') {
            const isWhite = boardState[toY][toX].color === 'white';
            if ((isWhite && toY === 0) || (!isWhite && toY === 7)) {
                if (PIECE_TYPES['queen']) boardState[toY][toX].type = 'queen';
            }
        }
        return epTarget;
    }

    function evaluateBoard(boardState, sideToMove) {
        let score = 0;
        let whiteMob = 0, blackMob = 0;
        for (let y=0;y<8;y++){
            for (let x=0;x<8;x++){
                const p = boardState[y][x];
                if (!p) continue;
                const type = p.type;
                const color = p.color;
                const v = (pieceValues[type] || 400);
                // const v = (pieceValues[type] || 0);
                const sq = y*8 + x;
                let pstVal = 0;
                if (PST[type]) {
                    pstVal = (color === 'white' ? PST[type][sq] : PST[type][63 - sq]);
                }
                const val = v + pstVal;
                score += (color === 'white') ? val : -val;

                // mobility approx (cheap): count moves
                try {
                    const oldEP = enPassantTarget;
                    enPassantTarget = null; // quick approx
                    const mvs = getValidMoves(p, x, y, boardState, true) || [];
                    enPassantTarget = oldEP;
                    if (color === 'white') whiteMob += mvs.length;
                    else blackMob += mvs.length;
                } catch(e){}
            }
        }
        score += 2 * (whiteMob - blackMob);
        return (sideToMove === 'white') ? score : -score;
    }

    // Quiescence search (разрешаем только взятия)
    function quiescence(alpha, beta, boardState, side, epTarget, tt, depthLimit) {
        const stand_pat = evaluateBoard(boardState, side);
        if (stand_pat >= beta) return beta;
        if (alpha < stand_pat) alpha = stand_pat;

        // generate captures only
        const moves = generateAllMoves(boardState, side, epTarget).filter(it => {
            const tgt = boardState[it.move.y][it.move.x];
            return tgt !== null || it.move.isEnPassant;
        });

        // order captures by simple MVV-LVA (capture value) using target value
        moves.sort((a,b) => {
            const ta = boardState[a.move.y][a.move.x];
            const tb = boardState[b.move.y][b.move.x];
            // const va = ta ? (pieceValues[ta.type]||0) : 0;
            // const vb = tb ? (pieceValues[tb.type]||0) : 0;
            const va = ta ? (pieceValues[ta.type]||400) : 0;
            const vb = tb ? (pieceValues[tb.type]||400) : 0;
            return vb - va;
        });

        for (const m of moves) {
            const newBoard = cloneBoard(boardState);
            const newEP = applyPseudoMove(newBoard, m.fromX, m.fromY, m.move);
            const oldGlobalEP = enPassantTarget;
            enPassantTarget = newEP;
            const score = -quiescence(-beta, -alpha, newBoard, side === 'white' ? 'black' : 'white', newEP, tt, depthLimit-1);
            enPassantTarget = oldGlobalEP;
            if (score >= beta) return beta;
            if (score > alpha) alpha = score;
        }
        return alpha;
    }

    // Альфа-бета с итеративным углублением и ТТ
    function alphaBeta(boardState, depth, alpha, beta, side, epTarget, tt, ply) {
        const hash = Zobrist.hashBoard(boardState, epTarget, side);
        if (tt.has(hash)) {
            const entry = tt.get(hash);
            if (entry.depth >= depth) {
                if (entry.flag === 'EXACT') return entry.value;
                if (entry.flag === 'LOWER' && entry.value > alpha) alpha = entry.value;
                if (entry.flag === 'UPPER' && entry.value < beta) beta = entry.value;
                if (alpha >= beta) return entry.value;
            }
        }

        if (depth === 0) {
            if (AI_CONFIG.useQuiescence) {
                return quiescence(alpha, beta, boardState, side, epTarget, tt, 6);
            } else {
                return evaluateBoard(boardState, side);
            }
        }

        let bestValue = -Infinity;
        let bestMove = null;

        // generate moves
        let moves = generateAllMoves(boardState, side, epTarget);

        // move ordering heuristics: prefer captures
        moves.sort((a,b) => {
            const ta = boardState[a.move.y][a.move.x];
            const tb = boardState[b.move.y][b.move.x];
            // const va = ta ? (pieceValues[ta.type]||0) : 0;
            // const vb = tb ? (pieceValues[tb.type]||0) : 0;
            const va = ta ? (pieceValues[ta.type]||400) : 0;
            const vb = tb ? (pieceValues[tb.type]||400) : 0;
            return (vb - va);
        });

        if (moves.length === 0) {
            // no moves -> evaluate (checkmate/stalemate handling not detailed)
            return evaluateBoard(boardState, side);
        }

        for (const m of moves) {
            const newBoard = cloneBoard(boardState);
            const newEP = applyPseudoMove(newBoard, m.fromX, m.fromY, m.move);

            const oldGlobalEP = enPassantTarget;
            enPassantTarget = newEP;
            const score = -alphaBeta(newBoard, depth-1, -beta, -alpha, side === 'white' ? 'black' : 'white', newEP, tt, ply+1);
            enPassantTarget = oldGlobalEP;

            if (score > bestValue) {
                bestValue = score;
                bestMove = m;
            }
            if (bestValue > alpha) alpha = bestValue;
            if (alpha >= beta) break;
        }

        // store in TT
        let flag = 'EXACT';
        if (bestValue <= alpha) flag = 'UPPER';
        else if (bestValue >= beta) flag = 'LOWER';
        tt.set(hash, { value: bestValue, depth: depth, flag: flag, bestMove: bestMove });

        return bestValue;
    }

    // Основная функция итеративного углубления, возвращает лучший ход {fromX,fromY,move}
    function findBestMove(rootBoard, side, timeLimitMs) {
        Zobrist.init();
        const start = performance.now();
        const tt = new Map();
        let best = null;
        let bestScore = -Infinity;
        let depth = 1;
        const maxDepth = AI_CONFIG.maxDepthHardCap;

        let epTargetRoot = enPassantTarget; // текущее глобальное

        while (true) {
            if (depth > maxDepth) break;
            const now = performance.now();
            if (now - start > timeLimitMs) break;

            // iterative deepening
            try {
                const clonedBoard = cloneBoard(rootBoard);
                const score = alphaBeta(clonedBoard, depth, -Infinity, Infinity, side, epTargetRoot, tt, 0);
                // extract best move from TT if available
                const rootHash = Zobrist.hashBoard(rootBoard, epTargetRoot, side);
                let bestFromTT = null;
                if (tt.has(rootHash) && tt.get(rootHash).bestMove) {
                    bestFromTT = tt.get(rootHash).bestMove;
                    best = bestFromTT;
                    bestScore = tt.get(rootHash).value;
                }
            } catch(e) {
                console.error("search error", e);
            }

            depth++;
            if (performance.now() - start > timeLimitMs) break;
        }

        return { move: best, score: bestScore };
    }

    // AI loop & UI integration
    // aiSide теперь глобальная переменная
    let autoPlay = false;
    let thinking = false;

    function aiPlayOneMove() {
        if (gameOver) return;
        if (!aiSide) return;
        if (currentTurn !== aiSide) return;
        if (thinking) return;
        thinking = true;
        log(t('ai_thinking', { side: aiSide }));
        // snapshot board
        const rootBoard = cloneBoard(board);
        const timeLimit = AI_CONFIG.timePerMoveMs;

        setTimeout(() => {
            try {
                const res = findBestMove(rootBoard, aiSide, timeLimit);
                if (!res.move) {
                    log(t('ai_no_move'));
                    thinking = false;
                    return;
                }
                // Выполнить ход на реальной доске через makeMove
                makeMove(res.move.fromX, res.move.fromY, res.move.move);
            } catch (e) {
                console.error("AI move failed", e);
            } finally {
                thinking = false;
                if (autoPlay && !gameOver) {
                    // если после хода ход переходит к ИИ сопернику, то запустить следующий
                    setTimeout(aiPlayOneMove, 200);
                }
            }
        }, 30); // небольшая задержка для UI
    }

    // UI: добавить контролы в сайдбар (если есть)
    function setupUIControls() {
        const sideBar = document.querySelector('.sidebar');
        if (!sideBar) return;
        const panel = document.createElement('div');
        panel.className = 'panel';
        // panel.style.display = 'flex';
        panel.style.flexDirection = 'column';
        panel.style.gap = '8px';

        // buttons
        const btnWhite = document.createElement('button');
        btnWhite.className = 'ai-btn-white';
        btnWhite.textContent = t('vs_ai_white');
        btnWhite.onclick = () => { aiSide = 'black'; autoPlay = false; log("Player plays white. AI — black."); setTimeout(aiPlayOneMove, 10); };
        const btnBlack = document.createElement('button');
        btnBlack.className = 'ai-btn-black';
        btnBlack.textContent = t('vs_ai_black');
        btnBlack.onclick = () => { aiSide = 'white'; autoPlay = false; log("Player plays black. AI — white."); setTimeout(aiPlayOneMove, 10); };
        const btnAuto = document.createElement('button');
        btnAuto.textContent = 'ИИ vs ИИ (Auto)';
        btnAuto.onclick = () => { autoPlay = !autoPlay; aiSide = 'black'; log("AI vs AI: " + (autoPlay ? "enabled" : "disabled")); if (autoPlay) setTimeout(aiPlayOneMove, 50); };
        const selMode = document.createElement('select');
        const optClassic = document.createElement('option'); optClassic.value='classic'; optClassic.textContent='Classic subset (fast)';
        const optFull = document.createElement('option'); optFull.value='full'; optFull.textContent='Full (slow, all pieces)';
        selMode.appendChild(optClassic); selMode.appendChild(optFull);
        selMode.value = AI_CONFIG.mode;
        selMode.onchange = () => { AI_CONFIG.mode = selMode.value; log(`AI mode: ${AI_CONFIG.mode}`); };

        const inputTime = document.createElement('input');
        inputTime.type = 'number';
        inputTime.value = AI_CONFIG.timePerMoveMs;
        inputTime.min = 100;
        inputTime.step = 100;
        inputTime.title = "ms per move";
        inputTime.onchange = () => { AI_CONFIG.timePerMoveMs = Math.max(100, Number(inputTime.value)); log(`AI time per move: ${AI_CONFIG.timePerMoveMs}ms`); };

        sideBar.appendChild(btnWhite);
        sideBar.appendChild(btnBlack);
        // panel.appendChild(btnAuto);
        // panel.appendChild(document.createTextNode('Режим поиска:'));
        // panel.appendChild(selMode);
        // panel.appendChild(document.createTextNode('Время на ход (ms):'));
        // panel.appendChild(inputTime);

        // sideBar.appendChild(panel);
    }

    // Hook: запуск ИИ когда приходит его ход (наблюдение за currentTurn)
    // Будем проверять через setInterval, это простой способ без глубокого вмешательства.
    function attachAutoWatcher(){
        setInterval(() => {
            if (gameOver) return;
            if (!aiSide) return;
            if (isViewingHistory) return; // Не делать ходы во время просмотра истории

            // Блокировка ИИ после возврата из режима просмотра истории до тех пор,
            // пока ход не сменится (игрок сделает ход)
            if (aiBlockedAfterHistoryReturn && currentTurn === turnBeforeHistoryReturn) {
                return;
            }  

            if (currentTurn === aiSide && !thinking) {
                aiPlayOneMove();
                // Снимаем блокировку после того, как ИИ сделал ход
                aiBlockedAfterHistoryReturn = false;
                turnBeforeHistoryReturn = null;
            }
        }, 300);
    }

    // Инициализация
    Zobrist.init();
    setupUIControls();
    attachAutoWatcher();

    // Экспорт в window для отладки
    window.EVOLVE_AI = {
        findBestMove, aiPlayOneMove, setAIConfig: (cfg)=>Object.assign(AI_CONFIG, cfg), getConfig: ()=>AI_CONFIG
    };

    log(t('ai_loaded'));
})();

// Initialize language from localStorage or default to English
const savedLanguage = localStorage.getItem('evolution-chess-language');
if (savedLanguage && translations[savedLanguage]) {
    currentLanguage = savedLanguage;
} else {
    currentLanguage = 'en'; // Default to English
}

// Arrow drawing functions
function drawArrow(fromX, fromY, toX, toY, lineWidth = 3, arrowHeadSize = 10) {
    if (!arrowsSvg) return;

    // Get the actual cell elements to calculate their center positions
    const fromCell = document.querySelector(`.cell[data-cell-x="${fromX}"][data-cell-y="${fromY}"]`);
    const toCell = document.querySelector(`.cell[data-cell-x="${toX}"][data-cell-y="${toY}"]`);

    if (!fromCell || !toCell) return;

    const boardEl = document.getElementById('board');
    const boardRect = boardEl.getBoundingClientRect();
    const fromRect = fromCell.getBoundingClientRect();
    const toRect = toCell.getBoundingClientRect();

    // Calculate center positions relative to board (since SVG now covers the entire board)
    const startX = (fromRect.left + fromRect.width / 2) - boardRect.left;
    const startY = (fromRect.top + fromRect.height / 2) - boardRect.top;
    const endX = (toRect.left + toRect.width / 2) - boardRect.left;
    const endY = (toRect.top + toRect.height / 2) - boardRect.top;

    // Calculate the distance and direction vector
    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Calculate the actual end point for the line (shorten it by arrowHeadSize)
    const adjustedEndX = endX - (dx / distance) * arrowHeadSize;
    const adjustedEndY = endY - (dy / distance) * arrowHeadSize;

    // Create arrow line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', startX);
    line.setAttribute('y1', startY);
    line.setAttribute('x2', adjustedEndX);
    line.setAttribute('y2', adjustedEndY);
    line.setAttribute('stroke', '#ffaa00');
    line.setAttribute('opacity', '0.8');
    line.setAttribute('stroke-width', lineWidth);
    line.setAttribute('marker-end', `url(#arrowhead-${arrowHeadSize})`);

    // Create arrowhead marker
    const markerId = `arrowhead-${arrowHeadSize}`;
    if (!document.getElementById(markerId)) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        marker.setAttribute('id', markerId);
        marker.setAttribute('markerWidth', arrowHeadSize);
        marker.setAttribute('markerHeight', arrowHeadSize * 0.7);
        // marker.setAttribute('refX', arrowHeadSize * 0.9);
        marker.setAttribute('refX', arrowHeadSize * 0.7);
        marker.setAttribute('refY', arrowHeadSize * 0.35);
        marker.setAttribute('orient', 'auto');

        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', `0 0, ${arrowHeadSize} ${arrowHeadSize * 0.35}, 0 ${arrowHeadSize * 0.7}`);
        polygon.setAttribute('fill', '#ffaa00');
        line.setAttribute('opacity', '0.8');

        marker.appendChild(polygon);
        defs.appendChild(marker);
        arrowsSvg.appendChild(defs);
    }

    arrowsSvg.appendChild(line);
    arrowElements.push(line);
}

function clearArrows() {
    if (!arrowsSvg) return;

    // Remove all arrow elements
    arrowElements.forEach(element => {
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
    });
    arrowElements = [];

    // Also clear any existing defs (including all arrowhead markers)
    const allDefs = arrowsSvg.querySelectorAll('defs');
    allDefs.forEach(defs => {
        arrowsSvg.removeChild(defs);
    });
}

// Update UI with current language
updateUILanguage();

initGame();
