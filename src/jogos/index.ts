export type Jogo = {
  id: number,
  imagem: string,
  titulo: string,
  preco: number
}

export const jogosEmDestaque: Jogo[] = [
  {
    id: 1,
    imagem: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/105600/header.jpg?t=1731252354',
    titulo: 'Terraria',
    preco: 32.99 
  },
  {
    id: 2,
    imagem: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/413150/header.jpg?t=1754692865',
    titulo: 'Stardew Valley',
    preco: 24.99
  },
  {
    id: 3,
    imagem: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/268910/header.jpg?t=1709068852',
    titulo: 'Cuphead',
    preco: 36.99
  },
   {
    id: 4,
    imagem: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1030300/7983574d464e6559ac7e24275727f73a8bcca1f3/header.jpg?t=1756994410',
    titulo: 'Hollow Knight: Silksong',
    preco: 59.99
  },
   {
    id: 5,
    imagem: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1687950/header.jpg?t=1733297467',
    titulo: 'Persona 5 Royal',
    preco: 249.90
  },
  {
    id: 6,
    imagem: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg?t=1748630546',
    titulo: 'Elden Ring',
    preco: 274.50
  },
  {
    id: 7,
    imagem: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg?t=1720558643',
    titulo: 'Red Dead Redemption 2',
    preco: 299.90
  },
  {
    id: 8,
    imagem: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1593500/header.jpg?t=1750949016',
    titulo: 'God of War',
    preco: 199.90
  },

]
