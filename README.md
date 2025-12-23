# Evolution Chess
Chess where pieces evolve


## contents
- [How to play](#how-to-play)
- [How pieces evolve](#how-pieces-evolve)
- [How to create mods](#how-to-create-mods)
- [Game example](#game-example)
- [Authors](#authors)

---

## How to play
You can play Evolution Chess in two ways:

1. [**Play online**](https://shrechochek.github.io/evolution-chess/)
2. Download respository and run on your own PC

---

## Game Example
<img src="docs/game-example-photos/game-example-1.png" width="700">

---

## How Pieces Evolve
When a piece captures another piece, it gains experience and can evolve into a new piece

[**Evolution tree**](https://miro.com/app/board/uXjVI-ZUrws=/)

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
```json
"pawn": { 
  "name": "копейщик", 
  "symbol": "spearman", 
  "desc": "пешка, которая бьет клетку перд собой",
  "role": "pawn", 
  "tier": 1, 
  "xpReq": 1,
  "special": "spear_attack"
},
```

- **`name`** — display name of the piece
- **`symbol`** — symbol defined in `SYMBOLS`
- **`desc`** — description of the piece
- **`role`** — special role:
  - `king` — can castle, losing all kings means defeat
  - `pawn` — can promote, en passant enabled
  - `rook` — participates in castling
- **`tier`** — evolution tier
- **`xpReq`** — XP required to evolve (`-1` = no evolution)
- **`special`** - special ability
  - `spear_attack` - attack square ahead
  - `revenge` - destroy the figure that ate it
  - `teleport` - teleport to every square without piece on it
  - `explode_n` - destroy everything within radius n, when this piece captured or capture
  - `detonate_n` - destroy everything within radius n, when this piece capture or captured, expect pawns and kings
  - `explde_all_n` - destroy everything within radius n, when this piece captured or capture
  - `range_capture` - capture without moving
  - `swap_ally` - swap places with same color piece
- **`ghost`** - can go through n pieces (you must set n)
- **`immortal`** - can not be captured

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
- **Programmer**: [_shrechochek_](https://github.com/shrechochek)
- **Artist**: [_Serebr1k_](https://github.com/Serebr1k-code)
