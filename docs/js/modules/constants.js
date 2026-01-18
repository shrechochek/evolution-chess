// Shared constants and small helpers extracted from script.js
export const SYMBOLS = {
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

export const VEC_ORTHO = [{dx:1,dy:0},{dx:-1,dy:0},{dx:0,dy:1},{dx:0,dy:-1}];
export const VEC_DIAG = [{dx:1,dy:1},{dx:1,dy:-1},{dx:-1,dy:1},{dx:-1,dy:-1}];
export const VEC_KNIGHT = [{dx:2,dy:1},{dx:2,dy:-1},{dx:-2,dy:1},{dx:-2,dy:-1},{dx:1,dy:2},{dx:1,dy:-2},{dx:-1,dy:2},{dx:-1,dy:-2}];
export const VEC_CAMEL = [{dx:3,dy:1},{dx:3,dy:-1},{dx:-3,dy:1},{dx:-3,dy:-1},{dx:1,dy:3},{dx:1,dy:-3},{dx:-1,dy:3},{dx:-1,dy:-3}];

export const move_audio = new Audio('assets/sounds/effects/move.mp3');
export const capture_audio = new Audio('assets/sounds/effects/capture.mp3');

export function slide(vectors) { return vectors.map(v => ({...v, slide: true})); }
export function step(vectors) { return vectors.map(v => ({...v, slide: false})); }

export const BOARD_SIZE = 8;
