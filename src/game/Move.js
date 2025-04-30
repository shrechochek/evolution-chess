class Move {
    /* Move class - class which is used to store information 
     * col, row (int) - destination of move
     * piece (Piece) - figure which made the move
     * isCheck (bool), isCheckmate (bool) - basically name
     * getMoveString() -> str - returns move's string
     */

    constructor(col, row, piece, isCheck = false, isCheckmate = false) {
        this.col = col;
        this.row = row;
        this.piece = piece;
        this.isCheck = isCheck;
        this.isCheckmate = isCheckmate;
    }

    getMoveString() {
        res = this.piece.shortName;
        res += String.fromCharCode('a'.charCodeAt(0) + this.col);
        res += toString(this.row);
        if (this.isCheckmate) {
            res += "#";
        } else if (this.isCheck) {
            res += "+";
        }

        return res;
    }
}