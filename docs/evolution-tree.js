export let EVOLUTION_TREE = {
    'pawn': ['pawn_spearman', 'pawn_runner', 'pawn_torpedo'], 
    'knight': ['knight_paladin', ,'knight_camel' , 'knight_knight'],
    // 'bishop': ['bishop_bomber', 'bishop_ghost', 'two_color_bishop'],
    'bishop': ['bishop_ghost', 'two_color_bishop', 'bishop_swapper'],
    'rook': ['rook_ghost', 'rook_tank', 'statue'],
    'queen': ['queen_knight', 'queen_camel', 'queen_upgradeable'], 

    'pawn_runner': ['pawn_spartan', 'pawn_superrunner'],
    'pawn_spearman': ['pawn_spartan'],
    
    'knight_camel': ['knight_camel_hybrid', 'knight_endless'],
    'knight_paladin': ['rook', 'knight_king'],
    'knight_knight': ['rook', 'knight_king', 'bishop_ship'],

    'two_color_bishop': ['rook', 'bishop_ship'],
    'bishop_bomber': ['bishop_nuke'],
    'bishop_ghost': ['bishop_sniper'],
    'swap_bishop': ['rook'],

    'rook_tank': ['rook_helicopter', 'queen'],
    'rook_ghost': ['rook_sniper'],

    'queen_camel': ['queen_knight_camel'],
    'queen_knight': ['queen_knight_camel'],
    'queen_upgradeable': ['king_nuke', 'queen_ghost', 'queen_range', 'king'],

    'pawn_superrunner': ['knight'],
    'pawn_spartan': ['bishop']
};