import { VEC_ORTHO, VEC_DIAG, VEC_KNIGHT, VEC_CAMEL, slide, step } from './constants.js';

// Game core factory. It expects accessor functions so the main app can hot-replace
// PIECE_TYPES or EVOLUTION_TREE (for mods) and re-use the same game instance.
export function createGame({ getPieceTypes, getEvolutionTree }) {
    function isValidPos(x, y) {
        return x >= 0 && x < 8 && y >= 0 && y < 8;
    }

    function getValidMoves(piece, startX, startY, checkBoard, epTarget = null, ignoreCastling = false) {
        const PIECE_TYPES = getPieceTypes();
        const moves = [];
        const def = PIECE_TYPES[piece.type];
        const isWhite = piece.color === 'white';
        const direction = isWhite ? -1 : 1;

        if (def && def.special === 'teleport') {
            for(let y=0; y<8; y++) for(let x=0; x<8; x++) if (!checkBoard[y][x]) moves.push({x,y});
            return moves;
        }

        if (def && def.role === 'pawn') {
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
                        if (!PIECE_TYPES[target.type].immortal) moves.push({x: tx, y: ty, isCapture: true});
                    } else if (!target && epTarget && epTarget.x === tx && epTarget.y === ty) {
                        moves.push({x: tx, y: ty, isCapture: true, isEnPassant: true});
                    }
                }
            });
            if (def && def.special === 'spear_attack') {
                const forwardY = startY + direction;
                if (isValidPos(startX, forwardY)) {
                    const target = checkBoard[forwardY][startX];
                    if (target && target.color !== piece.color) {
                        if (!PIECE_TYPES[target.type].immortal) moves.push({x: startX, y: forwardY, isCapture: true});
                    }
                }
            }
            if (def && def.extraMoves) {
                def.extraMoves.forEach(m => {
                    const actualDy = m.dy * direction;
                    const tx = startX + m.dx;
                    const ty = startY + actualDy;
                    if (isValidPos(tx, ty) && !checkBoard[ty][tx]) moves.push({x: tx, y: ty});
                });
            }
        }

        if (def && def.moves) {
            def.moves.forEach(vec => {
                const dx = vec.dx, dy = vec.dy;
                if (vec.slide) {
                    let obstaclesPassed = 0;
                    const ghostLimit = (def.ghost === true) ? Infinity : (def.ghost || 0);
                    for (let i = 1; i < 8; i++) {
                        const tx = startX + (dx * i);
                        const ty = startY + (dy * i);
                        if (!isValidPos(tx, ty)) break;
                        const target = checkBoard[ty][tx];
                        if (!target) moves.push({x: tx, y: ty});
                        else {
                            if (target.color !== piece.color) {
                                if (!PIECE_TYPES[target.type].immortal) moves.push({x: tx, y: ty, isCapture: true});
                            } else if (def.special === 'swap_ally' && target.color === piece.color) {
                                moves.push({x: tx, y: ty, isSwap: true});
                                break;
                            }
                            obstaclesPassed++;
                            if (obstaclesPassed > ghostLimit) break;
                        }
                    }
                } else {
                    const tx = startX + dx, ty = startY + dy;
                    if (isValidPos(tx, ty)) {
                        const target = checkBoard[ty][tx];
                        if (!target) moves.push({x: tx, y: ty});
                        else if (target.color !== piece.color) {
                            if (!PIECE_TYPES[target.type].immortal) moves.push({x: tx, y: ty, isCapture: true});
                        }
                    }
                }
            });
        }

        if (def && def.role === 'king' && !piece.hasMoved && !ignoreCastling) {
            const row = isWhite ? 7 : 0;
            const oppColor = isWhite ? 'black' : 'white';
            const kRook = checkBoard[row][7];
            if (kRook && PIECE_TYPES[kRook.type].role === 'rook' && !kRook.hasMoved) {
                if (!checkBoard[row][5] && !checkBoard[row][6]) {
                    if (!isSquareAttacked(4, row, oppColor, checkBoard, epTarget) && !isSquareAttacked(5, row, oppColor, checkBoard, epTarget) && !isSquareAttacked(6, row, oppColor, checkBoard, epTarget)) {
                        moves.push({x:6,y:row,isCastling:true, rookX:7, rookToX:5});
                    }
                }
            }
            const qRook = checkBoard[row][0];
            if (qRook && PIECE_TYPES[qRook.type].role === 'rook' && !qRook.hasMoved) {
                if (!checkBoard[row][1] && !checkBoard[row][2] && !checkBoard[row][3]) {
                    if (!isSquareAttacked(4, row, oppColor, checkBoard, epTarget) && !isSquareAttacked(3, row, oppColor, checkBoard, epTarget) && !isSquareAttacked(2, row, oppColor, checkBoard, epTarget)) {
                        moves.push({x:2,y:row,isCastling:true, rookX:0, rookToX:3});
                    }
                }
            }
        }

        return moves;
    }

    function isSquareAttacked(tx, ty, attackerColor, checkBoard, epTarget = null) {
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const piece = checkBoard[y][x];
                if (piece && piece.color === attackerColor) {
                    const moves = getValidMoves(piece, x, y, checkBoard, epTarget, true);
                    if (moves.some(m => m.x === tx && m.y === ty)) return true;
                }
            }
        }
        return false;
    }

    function isInCheck(color, checkBoard = null, epTarget = null) {
        const board = checkBoard || [];
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const piece = board[y][x];
                if (piece && getPieceTypes()[piece.type] && getPieceTypes()[piece.type].role === 'king' && piece.color === color) {
                    const opponentColor = color === 'white' ? 'black' : 'white';
                    return isSquareAttacked(x, y, opponentColor, board, epTarget);
                }
            }
        }
        return false;
    }

    function explode(board, cx, cy, attackerColor, radius) {
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const tx = cx + dx;
                const ty = cy + dy;
                if (isValidPos(tx, ty)) {
                    const victim = board[ty][tx];
                    if (victim && !getPieceTypes()[victim.type].immortal) {
                        if (radius > 1) board[ty][tx] = null; else board[ty][tx] = null;
                    }
                }
            }
        }
    }

    function explode_all(board, cx, cy, attackerColor, radius) {
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const tx = cx + dx;
                const ty = cy + dy;
                if (isValidPos(tx, ty)) {
                    const victim = board[ty][tx];
                    if (victim && !getPieceTypes()[victim.type].immortal) {
                        if (radius > 1) board[ty][tx] = null; else board[ty][tx] = null;
                    }
                }
            }
        }
    }

    function canEvolve(piece) {
        const EVOLUTION_TREE = getEvolutionTree();
        const evolutions = EVOLUTION_TREE && EVOLUTION_TREE[piece.type];
        if (!evolutions || evolutions.length === 0) return false;
        const def = getPieceTypes()[piece.type];
        return piece.xp >= def.xpReq;
    }

    // Apply a move to the given board (mutates board in-place) and return an object
    // describing side effects so the UI layer can react (play sounds, show modals).
    // Parameters:
    // - board: 2D array [y][x]
    // - fromX, fromY: source coords
    // - move: move object as generated by getValidMoves
    // - options: { enPassantTarget }
    function applyMove(board, fromX, fromY, move, options = {}) {
        const events = [];
        let enPassantTarget = options.enPassantTarget || null;

        const toX = move.x;
        const toY = move.y;
        const piece = board[fromY][fromX];
        if (!piece) return { board, enPassantTarget, events };

        let target = board[toY] && board[toY][toX];

        // Notation/history is handled by UI layer; here we only mutate and report events
        if (move.isSwap) {
            board[fromY][fromX] = target;
            board[toY][toX] = piece;
            piece.hasMoved = true;
            events.push({ type: 'swap', piece, swappedWith: target, fromX, fromY, toX, toY });

            // Check if swapped target (now at fromX,fromY) is a pawn reaching end
            const swapped = board[fromY][fromX];
            if (swapped && getPieceTypes()[swapped.type].role === 'pawn') {
                const isAtEnd = (swapped.color === 'white' && fromY === 0) || (swapped.color === 'black' && fromY === 7);
                if (isAtEnd) events.push({ type: 'promotion_needed', piece: swapped, x: fromX, y: fromY, cause: 'swap' });
            }

            return { board, enPassantTarget, events };
        }

        // En-passant capture
        if (move.isEnPassant) {
            const dir = piece.color === 'white' ? 1 : -1;
            const capturedPawnY = toY + dir;
            target = board[capturedPawnY] && board[capturedPawnY][toX];
            if (target) {
                board[capturedPawnY][toX] = null;
                events.push({ type: 'capture', piece, target, fromX, fromY, toX, toY, enPassant: true });
            }
        }

        if (target) {
            // normal capture
            events.push({ type: 'capture', piece, target, fromX, fromY, toX, toY });
            piece.xp = (piece.xp || 0) + 1;

            const targetDef = getPieceTypes()[target.type] || {};
            if (['explode_3', 'detonate_3'].includes(targetDef.special)) {
                // small explosion radius 1
                explode(board, toX, toY, target.color, 1);
                events.push({ type: 'explosion', center: { x: toX, y: toY }, radius: 1 });
            } else if (['explode_5', 'detonate_5'].includes(targetDef.special)) {
                explode(board, toX, toY, target.color, 2);
                events.push({ type: 'explosion', center: { x: toX, y: toY }, radius: 2 });
            } else if ((targetDef.special || '').startsWith('explode_all')) {
                const last = targetDef.special[targetDef.special.length - 1];
                const radius_to_explode = parseInt(last, 10);
                explode_all(board, toX, toY, target.color, (radius_to_explode - 1) / 2);
                events.push({ type: 'explosion_all', center: { x: toX, y: toY }, radius: (radius_to_explode - 1) / 2 });
            }
        }

        // Place piece on destination (account for range_capture which deletes target)
        const def = getPieceTypes()[piece.type] || {};
        if (target) {
            if (def.special === 'range_capture') {
                board[toY][toX] = null; // range captures remove target and attacker doesn't occupy
            } else if (events.some(e => e.type === 'explosion')) {
                // if there was an explosion on capture, some pieces may be removed by explosion
                if (def.role !== 'king' && def.role !== 'pawn') {
                    board[toY][toX] = null; // attacker dies in explosion (unless king/pawn)
                } else {
                    board[toY][toX] = piece;
                }
            } else if ((getPieceTypes()[target.type] || {}).special === 'revenge') {
                // revenge causes an explosion and clears the square
                explode_all(board, toX, toY, target.color, 1);
                board[toY][toX] = null;
                events.push({ type: 'explosion_all', center: { x: toX, y: toY }, radius: 1, cause: 'revenge' });
            } else {
                board[toY][toX] = piece;
            }
        } else {
            board[toY][toX] = piece;
        }

        // Clear from-square (unless range_capture special rules apply)
        if (def.special !== 'range_capture') {
            board[fromY][fromX] = null;
        } else if (!target) {
            board[fromY][fromX] = null;
        }

        piece.hasMoved = true;

        // Castling: move rook accordingly
        if (move.isCastling) {
            const rook = board[toY] && board[toY][move.rookX];
            if (rook) {
                board[toY][move.rookToX] = rook;
                board[toY][move.rookX] = null;
                rook.hasMoved = true;
                events.push({ type: 'castling', rook, rookFromX: move.rookX, rookToX: move.rookToX });
            }
        }

        // Set en-passant target if double pawn move
        if (move.isDoublePawnMove) {
            const dir = piece.color === 'white' ? -1 : 1;
            enPassantTarget = { x: toX, y: toY - dir };
            events.push({ type: 'en_passant_target', enPassantTarget });
        } else {
            enPassantTarget = null;
        }

        // Pawn promotion
        const isAtEnd = (piece.color === 'white' && toY === 0) || (piece.color === 'black' && toY === 7);
        if (def.role === 'pawn' && isAtEnd) {
            // report that UI needs to promote this pawn
            events.push({ type: 'promotion_needed', piece, x: toX, y: toY });
            return { board, enPassantTarget, events };
        }

        // Explosions caused by attacker (specials like explode_all on attacker)
        if (events.some(e => e.type === 'capture')) {
            if (def.special && def.special.startsWith('explode_all')) {
                const last = def.special[def.special.length - 1];
                const radius_to_explode = parseInt(last, 10);
                explode_all(board, toX, toY, piece.color, (radius_to_explode - 1) / 2);
                events.push({ type: 'explosion_all', center: { x: toX, y: toY }, radius: (radius_to_explode - 1) / 2, cause: 'attacker' });
            } else if (def.special && def.special.startsWith('explode')) {
                const radius = def.special === 'explode_5' ? 2 : 1;
                explode(board, toX, toY, piece.color, radius);
                events.push({ type: 'explosion', center: { x: toX, y: toY }, radius, cause: 'attacker' });
            }
        }

        // Evolution check (do not trigger UI here; just report availability)
        if (canEvolve(piece)) {
            events.push({ type: 'evolution_available', piece, x: toX, y: toY });
        }

        return { board, enPassantTarget, events };
    }

    return {
        isValidPos, getValidMoves, isSquareAttacked, isInCheck, explode, explode_all, canEvolve
        , applyMove
    };
}
