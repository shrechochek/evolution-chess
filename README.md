# chess where pieces can evolve

## how to play
### you can [ play online ](https://shrechochek.github.io/evolution-chess/) or you can download respository and run site on your own pc

## how pieces evolve?
### when piece eat another piece first piece can evolve into another piece

### you can see evolution tree [ here ](https://miro.com/app/board/uXjVI-ZUrws=/)

## how to create mods
### first of all you must set name for photos that you use

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

### after that you must write information about pieces
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
"name" you must write name of figure
"symbol" you must use one of symbols, that you set earlier
"desc" you must write a description of figure
"role" you can set special role for you figure
    1. king - (can castle, if you have 0 kings you lose, can not be blown)
    2. pawn - (can be promoted, can not be blown, can eat en passant)
    



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
