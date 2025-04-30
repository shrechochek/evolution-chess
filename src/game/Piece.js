class Piece {
    /* Base piece class contains following variables: 
     * sprite_path (str) - path to piece's sprite which can be used for 
     *   rendering
     * team (str) - determines which *team* does piece belongs to. Currently 
     *   used for white/black figures
     * shortName (str) - very short name of piece (usually 1-2 letters) which 
     *   is used to move's string
     * And following methods:
     * getAbleMoves() -> list[Move] - returns all squares which piece could be 
     *   moved to 
     * getEvolutionVariants() -> list[Piece] - returns all pieces which player 
     *   can currently evolve to 
     * moveHandler() - function which is called after every move
     */

    constructor(team) {
        this.spritePath = 'pieces/white-pawn.png'
        this.team = team
        this.shortName = 'p'
    }

    getAbleMoves() {}
    getEvolutionVariants() {}
    moveHandler() {}
}
