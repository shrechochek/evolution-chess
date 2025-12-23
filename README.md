# Evolution Chess
Chess where pieces evolve


## contents
- [How to play](#how-to-play)
- [How pieces evolve](#how-pieces-evolve)
- [How to create mods](#how-to-create-mods)
- [Game example](#game-example)
- [Authors](#authors)

---
### How to play

You can play Evolution Chess in two ways:

1. [**Play online**](https://shrechochek.github.io/evolution-chess/)
2. Download respository and run on your own PC

<!-- ### you can [ play online ](https://shrechochek.github.io/evolution-chess/) or you can download respository and run site on your own pc -->

---

## Game Example
<img src="docs/game-example-photos/game-example-1.png" width="700">

---

## How Pieces Evolve
When a piece captures another piece, it gains experience and can evolve into a new piece

[**evolution tree**](https://miro.com/app/board/uXjVI-ZUrws=/)

---

## How to Create Mods

### 1. Create a mod folder
Create a folder with `.json` file

### 2. Add images
If you use custom images:
- upload them to the `/images` folder inside your mod (**recommended**)
- or place them directly in the mod folder


### 3. Set symbols for pieces
```json
"SYMBOLS": {
  "pawn": "pawn",
  "king": "king",
  "rook": "rook",
  "knight": "knight",
  "bishop": "bishop",
  "queen": "queen",
  "spearman": "spearman",
  "star": "star"
},
```

### 4. Describe pieces information
> ```json
> "pawn": { 
>       "name": "копейщик", 
>       "symbol": "spearman", 
>       "desc": "пешка, которая бьет клетку перд собой",
>       "role": "pawn", 
>       "tier": 1, 
>       "xpReq": 1,
>       "special": "spear_attack"
> },
> ```
> * ### "name" you can write name of figure
> * ### "symbol" you can use one of symbols, that you set earlier
> * ### "desc" you can write a description of figure
> * ### "role" you can set special role for you figure
> > 1. king - (can castle, if you have 0 kings you lose, can not be blown)
> > 2. pawn - (can be promoted, can not be blown, can eat en passant)
> > 3. rook - (can participate in castling)
> * ### "tier" you can set a tier of figure
> * ### "xpReq" you can set how much xp it requiers to evolve (use 999 if figure should not evolve)
> * ### "special" you can set special ability of figure
> > 1. spear_attack - (figure can capture piece ahead)
> > 2. revenge - (if piece is captured it destroy piece that captured it)
> > 3. teleport - (piece can teleport to every square of board if square is not occupied with another figure)
> > 4. explode_n - (destroy everything within radius n, when this piece capture or captured, expect pawns and kings)
> > 5. detonate_n - (destroy everything within radius n, when this piece captured, expect pawns and kings)
> > 6. range_capture - (figure can capture without moving)
> > 7. explode_all_n - (destroy everything within radius n, when this piece captured or capture)
> > 8. swap_ally - (piece can change places with another figure of its color)
> * ### "ghost" you can set how much pieces your figure can go through
> * ### "immortal" you can make your pieces immortal

> [!WARNING]
> You should rewrite all standart pieces logic

> [!TIP]
> Standart pieces logic is already described in test mode you can use it

### 5. Write down evolution tree
```json
"EVOLUTION_TREE": {
  "pawn": ["star"],
  "mutant": [],
  "king": [],
  "rook": [],
  "knight": [],
  "bishop": [],
  "queen": []
}
```

> [!NOTE]
> ### In this evolution tree pawn can evolve into star

### Final mod structure
```text
mod/
 ├── images/
 └── mod.json
```

> [!NOTE]
> If you still don't understand how to create mods or want to see a specific example you can check <br>
> */evolution-chess-2-alfa/mod_example* folder
<!-- ##### **if you still don't understand how to create mods or want to see a specific example you can check /evolution-chess-2-alfa/mod_example folder** -->

---

## authors
Programmer: [_shrechochek_](https://github.com/shrechochek)

Artist: [_Serebr1k_](https://github.com/Serebr1k-code)
