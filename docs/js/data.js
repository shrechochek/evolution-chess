// ========== DATA MODULE ==========
// Все данные и константы приложения

import { translations } from './translations.js';
import { EVOLUTION_TREE } from './evolution-tree.js';

// Language settings
export let currentLanguage = 'en'; // Default to English

// Translation function
export function t(key, params = {}) {
    const text = translations[currentLanguage][key] || key;
    return text.replace(/{(\w+)}/g, (match, param) => params[param] || match);
}

// Initialize language from localStorage or default to English
const savedLanguage = localStorage.getItem('evolution-chess-language');
if (savedLanguage && translations[savedLanguage]) {
    currentLanguage = savedLanguage;
} else {
    currentLanguage = 'en'; // Default to English
}

// Board configuration
export const BOARD_SIZE = 8;

// Custom assets for mods
export let CUSTOM_ASSETS = {}; 

// Symbols mapping
export let SYMBOLS = {
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

// Movement vectors
export const VEC_ORTHO = [{dx:1,dy:0},{dx:-1,dy:0},{dx:0,dy:1},{dx:0,dy:-1}];
export const VEC_DIAG = [{dx:1,dy:1},{dx:1,dy:-1},{dx:-1,dy:1},{dx:-1,dy:-1}];
export const VEC_KNIGHT = [{dx:2,dy:1},{dx:2,dy:-1},{dx:-2,dy:1},{dx:-2,dy:-1},{dx:1,dy:2},{dx:1,dy:-2},{dx:-1,dy:2},{dx:-1,dy:-2}];
export const VEC_CAMEL = [{dx:3,dy:1},{dx:3,dy:-1},{dx:-3,dy:1},{dx:-3,dy:-1},{dx:1,dy:3},{dx:1,dy:-3},{dx:-1,dy:3},{dx:-1,dy:-3}];

// Audio
export const move_audio = new Audio('assets/sounds/effects/move.mp3');
export const capture_audio = new Audio('assets/sounds/effects/capture.mp3');

// Helper functions for vectors
function slide(vectors) { return vectors.map(v => ({...v, slide: true})); }
function step(vectors) { return vectors.map(v => ({...v, slide: false})); }

// Piece types definition
export let PIECE_TYPES = {
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

// Export EVOLUTION_TREE for other modules
export { EVOLUTION_TREE };

// Game state variables
export let board = [];
export let currentTurn = 'white';
export let selectedCell = null;
export let possibleMoves = [];
export let markedSquares = new Set(); // Track user-marked squares
export let gameOver = false;
export let alertGameOver = false;
export let enPassantTarget = null;
export let white_kings = 0;
export let black_kings = 0;
export let aiSide = null; // Global variable for AI side

// History system for move navigation
export let gameHistory = [];
export let currentHistoryIndex = -1;
export let isViewingHistory = false;
export let aiBlockedAfterHistoryReturn = false; // Block AI after history return
export let turnBeforeHistoryReturn = null; // Whose turn it was before history return

// Move notation history
export let moveNotationHistory = []; // Array of {notation, historyIndex, isWhite}

// Position Editor variables
export let selectedPieceType = null;
export let selectedPieceColor = 'white';
export let editorBoard = Array(8).fill(null).map(() => Array(8).fill(null));
export let editorTurn = 'white';