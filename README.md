# chess where pieces can evolve

## how to play
### you can [ play online ](https://shrechochek.github.io/evolution-chess/) or you can download respository and run site on your own pc

## how pieces evolve?
### when piece eat another piece first piece can evolve into another piece

### you can see evolution tree [ here ](https://miro.com/app/board/uXjVI-ZUrws=/)

## how to create mods
### first of all you should set name for photos that you use

#### example

```json
"SYMBOLS": {
    "pawn": "pawn",
    "king": "king",
    "rook": "rook",
    "knight": "knight",
    "bishop": "bishop",
    "queen": "queen",
    "slime": "pawn",
    "mutant": "rook"
  },
```

### after that you should write how figures would move

```json
"PIECE_TYPES": {
    "pawn": { 
      "name": "Боевая Слизь", 
      "symbol": "slime", 
      "role": "pawn", 
      "tier": 1, 
      "xpReq": 1 
    },
    "mutant": { 
      "name": "Мутант", 
      "desc": "Ходит как ладья, но недалеко", 
      "symbol": "mutant", 
      "tier": 2, 
      "xpReq": 5, 
      "moves": [
        {"dx":1,"dy":0,"slide":false},
        {"dx":-1,"dy":0,"slide":false},
        {"dx":0,"dy":1,"slide":false},
        {"dx":0,"dy":-1,"slide":false}
      ] 
    },
    "king": { 
      "name": "Король Слизней", 
      "symbol": "king", 
      "role": "king", 
      "tier": 1, 
      "xpReq": 999, 
      "moves": [
        {"dx":1,"dy":0,"slide":false},
        {"dx":-1,"dy":0,"slide":false},
        {"dx":0,"dy":1,"slide":false},
        {"dx":0,"dy":-1,"slide":false},
        {"dx":1,"dy":1,"slide":false},
        {"dx":1,"dy":-1,"slide":false},
        {"dx":-1,"dy":1,"slide":false},
        {"dx":-1,"dy":-1,"slide":false}
      ]
    },
    "rook": { "name": "Ладья", "symbol": "rook", "moves": [{"dx":1,"dy":0,"slide":true},{"dx":-1,"dy":0,"slide":true},{"dx":0,"dy":1,"slide":true},{"dx":0,"dy":-1,"slide":true}], "tier": 1, "xpReq": 999 },
    "knight": { "name": "Конь", "symbol": "knight", "moves": [{"dx":2,"dy":1,"slide":false}], "tier": 1, "xpReq": 999 },
    "bishop": { "name": "Слон", "symbol": "bishop", "moves": [{"dx":1,"dy":1,"slide":true}], "tier": 1, "xpReq": 999 },
    "queen": { "name": "Ферзь", "symbol": "queen", "moves": [{"dx":1,"dy":1,"slide":true},{"dx":1,"dy":0,"slide":true}], "tier": 1, "xpReq": 999 }
  }
```

### then you must write the evolution tree

```json
"EVOLUTION_TREE": {
    "pawn": ["mutant"],
    "mutant": [],
    "king": [],
    "rook": [],
    "knight": [],
    "bishop": [],
    "queen": []
  }
```

### and finally if you use photos, that are not in the original respository you must upload them to the mod folder

<!-- ### you can look at mod example at /evolution-chess-2-alfa/mod example -->

<!-- ### you must upload to the mod file all the photos that are not in the original repository -->

## authors
Programmer: [_shrechochek_](https://github.com/shrechochek)

Artist: [_Serebr1k_](https://github.com/Serebr1k-code)
