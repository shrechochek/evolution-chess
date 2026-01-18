// Lightweight search module for evolution-chess.
// Exports a factory `createAI` that accepts a small API surface from the main app
// and returns an object with `findBestMove`, `setAIConfig`, `getConfig`.

export function createAI({ getValidMovesWithEP, PIECE_TYPES, pieceValues = {}, PST = {} }) {
    const AI_CONFIG = {
        timePerMoveMs: 1500,
        maxDepthHardCap: 4,
        mode: 'full',
        useQuiescence: true
    };

    const CLASSIC_SET = new Set(['pawn','knight','bishop','rook','queen','king']);

    // Zobrist hashing
    const Zobrist = {
        table: {},
        sideToMove: 0n,
        initialized: false,
        init() {
            if (this.initialized) return;
            this.sideToMove = rand64();
            const pieceTypes = Object.keys(PIECE_TYPES || {});
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
            if (epTarget) h ^= BigInt(epTarget.x + 1) * 0x9e3779b97f4a7c15n;
            return h.toString();
        }
    };

    function rand64(){
        const hi = Math.floor(Math.random() * 0x100000000);
        const lo = Math.floor(Math.random() * 0x100000000);
        return (BigInt(hi) << 32n) ^ BigInt(lo);
    }

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

    function generateAllMoves(boardState, side, epTarget) {
        const moves = [];
        for (let y=0;y<8;y++){
            for (let x=0;x<8;x++){
                const p = boardState[y][x];
                if (!p || p.color !== side) continue;
                if (AI_CONFIG.mode === 'classic' && !CLASSIC_SET.has(p.type)) continue;
                try {
                    const mlist = getValidMovesWithEP(p, x, y, boardState, epTarget, true) || [];
                    for (const m of mlist) moves.push({fromX:x, fromY:y, move:m});
                } catch(e) {
                    // ignore
                }
            }
        }
        return moves;
    }

    function applyPseudoMove(boardState, fromX, fromY, move) {
        const toX = move.x, toY = move.y;
        const piece = boardState[fromY][fromX];
        let epTarget = null;

        if (move.isEnPassant) {
            const dir = piece.color === 'white' ? 1 : -1;
            const capturedY = toY + dir;
            boardState[capturedY][toX] = null;
        }

        const target = boardState[toY][toX];
        if (target) piece.xp = (piece.xp || 0) + 1;

        boardState[toY][toX] = Object.assign({}, piece);
        boardState[fromY][fromX] = null;
        boardState[toY][toX].hasMoved = true;

        if (move.isCastling) {
            const rook = boardState[toY][move.rookX];
            boardState[toY][move.rookToX] = rook;
            boardState[toY][move.rookX] = null;
            if (boardState[toY][move.rookToX]) boardState[toY][move.rookToX].hasMoved = true;
        }

        if (move.isDoublePawnMove) {
            const dir = piece.color === 'white' ? -1 : 1;
            epTarget = { x: toX, y: toY - dir };
        } else {
            epTarget = null;
        }

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
                const sq = y*8 + x;
                let pstVal = 0;
                if (PST[type]) pstVal = (color === 'white' ? PST[type][sq] : PST[type][63 - sq]);
                const val = v + pstVal;
                score += (color === 'white') ? val : -val;

                try {
                    const mvs = getValidMovesWithEP(p, x, y, boardState, null, true) || [];
                    if (color === 'white') whiteMob += mvs.length;
                    else blackMob += mvs.length;
                } catch(e){}
            }
        }
        score += 2 * (whiteMob - blackMob);
        return (sideToMove === 'white') ? score : -score;
    }

    function quiescence(alpha, beta, boardState, side, epTarget, tt, depthLimit) {
        const stand_pat = evaluateBoard(boardState, side);
        if (stand_pat >= beta) return beta;
        if (alpha < stand_pat) alpha = stand_pat;

        const moves = generateAllMoves(boardState, side, epTarget).filter(it => {
            const tgt = boardState[it.move.y][it.move.x];
            return tgt !== null || it.move.isEnPassant;
        });

        moves.sort((a,b) => {
            const ta = boardState[a.move.y][a.move.x];
            const tb = boardState[b.move.y][b.move.x];
            const va = ta ? (pieceValues[ta.type]||400) : 0;
            const vb = tb ? (pieceValues[tb.type]||400) : 0;
            return vb - va;
        });

        for (const m of moves) {
            const newBoard = cloneBoard(boardState);
            const newEP = applyPseudoMove(newBoard, m.fromX, m.fromY, m.move);
            const score = -quiescence(-beta, -alpha, newBoard, side === 'white' ? 'black' : 'white', newEP, tt, depthLimit-1);
            if (score >= beta) return beta;
            if (score > alpha) alpha = score;
        }
        return alpha;
    }

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
            if (AI_CONFIG.useQuiescence) return quiescence(alpha, beta, boardState, side, epTarget, tt, 6);
            else return evaluateBoard(boardState, side);
        }

        let bestValue = -Infinity;
        let bestMove = null;

        let moves = generateAllMoves(boardState, side, epTarget);

        moves.sort((a,b) => {
            const ta = boardState[a.move.y][a.move.x];
            const tb = boardState[b.move.y][b.move.x];
            const va = ta ? (pieceValues[ta.type]||400) : 0;
            const vb = tb ? (pieceValues[tb.type]||400) : 0;
            return (vb - va);
        });

        if (moves.length === 0) return evaluateBoard(boardState, side);

        for (const m of moves) {
            const newBoard = cloneBoard(boardState);
            const newEP = applyPseudoMove(newBoard, m.fromX, m.fromY, m.move);
            const score = -alphaBeta(newBoard, depth-1, -beta, -alpha, side === 'white' ? 'black' : 'white', newEP, tt, ply+1);
            if (score > bestValue) { bestValue = score; bestMove = m; }
            if (bestValue > alpha) alpha = bestValue;
            if (alpha >= beta) break;
        }

        let flag = 'EXACT';
        if (bestValue <= alpha) flag = 'UPPER';
        else if (bestValue >= beta) flag = 'LOWER';
        tt.set(hash, { value: bestValue, depth: depth, flag: flag, bestMove: bestMove });

        return bestValue;
    }

    function findBestMove(rootBoard, side, timeLimitMs) {
        Zobrist.init();
        const start = performance.now();
        const tt = new Map();
        let best = null;
        let bestScore = -Infinity;
        let depth = 1;
        const maxDepth = AI_CONFIG.maxDepthHardCap;

        let epTargetRoot = null;

        while (true) {
            if (depth > maxDepth) break;
            const now = performance.now();
            if (now - start > timeLimitMs) break;
            try {
                const clonedBoard = cloneBoard(rootBoard);
                const score = alphaBeta(clonedBoard, depth, -Infinity, Infinity, side, epTargetRoot, tt, 0);
                const rootHash = Zobrist.hashBoard(rootBoard, epTargetRoot, side);
                if (tt.has(rootHash) && tt.get(rootHash).bestMove) {
                    best = tt.get(rootHash).bestMove;
                    bestScore = tt.get(rootHash).value;
                }
            } catch(e) {}
            depth++;
            if (performance.now() - start > timeLimitMs) break;
        }

        return { move: best, score: bestScore };
    }

    return {
        findBestMove,
        setAIConfig(cfg) { Object.assign(AI_CONFIG, cfg); },
        getConfig() { return AI_CONFIG; }
    };
}
