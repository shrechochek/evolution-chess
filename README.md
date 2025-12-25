# Evolution Chess
Chess where pieces evolve

<!-- ![Stars Counter](https://img.shields.io/github/stars/shrechochek/evolution-chess?style=for-the-badge&labelColor=%232e383c&color=%23dbbc7f) -->

---

> [!IMPORTANT]
>  🌍 **Languages**  
>  [🇺🇸(en)](README.md)  |  [🇷🇺(ru)](resources/READMEs/ru/README.md)

---

## Contents
- [How to play](#how-to-play)
- [How pieces evolve](#how-pieces-evolve)
- [How to create mods](#how-to-create-mods)
- [Game example](#game-example)
- [Authors](#authors)

---

## How to play
You can play Evolution Chess in two ways:

1. 🌐 [**Play online**](https://shrechochek.github.io/evolution-chess/)
2. 💻 Download respository and run on your own PC

> [!NOTE]
> ### You can play against your friends or AI

---

## Game Example
<img src="resources/game-images/game-example-1.png" width="700">

📸 More screenshots: [here](resources/game-images)
---

## How Pieces Evolve
When a piece captures another piece, it gains experience and can evolve into a new piece

[**Evolution tree**](https://miro.com/app/board/uXjVI-ZUrws=/)

---

## 🗂 How to Create Mods
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
"PIECE_TYPES": {
  "pawn": { 
    "name": "копейщик", 
    "symbol": "spearman", 
    "desc": "пешка, которая бьет клетку перд собой",
    "role": "pawn", 
    "tier": 1, 
    "xpReq": 1,
    "special": "spear_attack"
  }
}
```

- **`name`** — display name of the piece
- **`symbol`** — symbol defined in `SYMBOLS`
- **`desc`** — description of the piece
- **`role`** — special role:
  <!--  - `king` — can castle, losing all kings means defeat
  - `pawn` — can promote, en passant enabled
  - `rook` — participates in castling -->
  | Role   | Description |
  |--------|-------------|
  | `king` | Main piece. Losing all kings means defeat. Can castle |
  | `pawn` | Can promote. En passant is enabled |
  | `rook` | Participates in castling |
- **`tier`** — evolution tier
- **`xpReq`** — XP required to evolve (`-1` = no evolution)
- **`special`** - special ability
  <!-- - `spear_attack` - attack square ahead
  - `revenge` - destroy the figure that ate it
  - `teleport` - teleport to every square without piece on it
  - `explode_n` - destroy everything within radius n, when this piece captured or capture
  - `detonate_n` - destroy everything within radius n, when this piece capture or captured, expect pawns and kings
  - `explode_all_n` - destroy everything within radius n, when this piece captured or capture
  - `range_capture` - capture without moving
  - `swap_ally` - swap places with same color piece -->
  | Special | Description |
  |--------|-------------|
  | `spear_attack` | Attacks the square directly in front |
  | `revenge` | Destroys the piece that captured it |
  | `teleport` | Can move to any empty square |
  | `explode_n` | Destroys all pieces within radius **n** on capture or being captured |
  | `detonate_n` | Same as explode, but **does not affect pawns and kings** |
  | `explode_all_n` | Destroys everything within radius **n** |
  | `range_capture` | Can capture without moving |
  | `swap_ally` | Swaps position with a friendly piece |
  | `ghost_n` | Can pass through **n** pieces |
  | `immortal` | Cannot be captured |
- **`ghost`** - can go through n pieces (you must set n)
- **`immortal`** - cannot be captured

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

### Final `.json` structure
```json
{
  "SYMBOLS": {...},
  "PIECE_TYPES": {...},
  "EVOLUTION_TREE": {...}
}
```

### Final mod structure
```text
mod/
 ├── images/
 └── mod.json
```

> [!NOTE]
> If you still don't understand how to create mods or want to see a specific example you can check <br>
> [`mod example`](resources/mods/mod_example)

---

## authors
- 👨‍💻 **Programmer**: [_shrechochek_](https://github.com/shrechochek)
- 🎨 **Artist**: [_Serebr1k_](https://github.com/Serebr1k-code)
