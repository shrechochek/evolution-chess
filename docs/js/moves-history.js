
import { gameHistory,
         aiBlockedAfterHistoryReturn, turnBeforeHistoryReturn,
         currentTurn, selectedCell, possibleMoves, gameOver, 
         enPassantTarget, white_kings, black_kings, board
       } from "./script.js";

export let currentHistoryIndex = -1;
export let isViewingHistory = false;

// History management functions
export function saveGameState() {
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

export function goToMove(index) {
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

export function canGoBack() {
    return currentHistoryIndex > 0;
}

export function canGoForward() {
    return currentHistoryIndex < gameHistory.length - 1;
}

export function goBack() {
    if (canGoBack()) {
        goToMove(currentHistoryIndex - 1);
    }
}

export function goForward() {
    if (canGoForward()) {
        goToMove(currentHistoryIndex + 1);
    }
}

export function goToStart() {
    if (gameHistory.length > 0) {
        goToMove(0);
    }
}

export function goToEnd() {
    if (gameHistory.length > 0) {
        goToMove(gameHistory.length - 1);
    }
}