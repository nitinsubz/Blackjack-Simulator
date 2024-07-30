export type Card = {
  value: string;
  suit: '♠' | '♥' | '♦' | '♣';  
};

export type HandResult = 'win' | 'lose' | 'bust' | 'push' | 'playing';

export type GameState = {
  playerHands: Card[][];
  dealerHand: Card[];
  deck: Card[];
  currentPlayerHand: number;
  bet: number;
  gameStatus: 'playing' | 'playerBlackjack' | 'playerBust' | 'dealerBust' | 'playerWin' | 'dealerWin' | 'push' | 'lastHandBusted';
  dealerRevealed: boolean;
  handResults: HandResult[];
};

declare global {
  interface Array<T> {
    pop(): T | undefined;
  }
}

Array.prototype.pop = function <T>(): T | undefined {
  // Call the original pop method
  const poppedItem = Array.prototype.splice.call(this, -1, 1)[0];

  // If poppedItem is undefined, create and assign a new shuffled deck
  if (poppedItem === undefined) {
    console.log('Deck is empty, creating a new shuffled deck');
    const newDeck = createShuffledDeck();
    this.push(...newDeck);
    return this.pop();
  }

  return poppedItem;
};

export function initializeSimulatorHand(): GameState {
    const deck = createShuffledDeck();
    return {
      playerHands: [[deck.pop()!, deck.pop()!]],
      dealerHand: [deck.pop()!, deck.pop()!],
      deck,
      currentPlayerHand: 0,
      bet: 10,
      gameStatus: 'playing',
      dealerRevealed: true, // In simulator mode, dealer's card is always revealed
      handResults: ['playing'],
    };
  }
  
  export function determineOptimalPlay(playerHand: Card[], dealerUpCard: Card): 'H' | 'S' | 'DD' | 'SP' {
    const playerValue = calculateHandValue(playerHand);
    const dealerValue = cardValues[dealerUpCard.value];
    const isPair = playerHand.length === 2 && playerHand[0].value === playerHand[1].value;
    const isSoft = playerHand.some(card => card.value === 'A') && playerValue <= 21;
  
    if (isPair) {
      if (['A', '8'].includes(playerHand[0].value)) return 'SP';
      if (playerHand[0].value === '9' && ![7, 10, 11].includes(dealerValue)) return 'SP';
      if (['2', '3', '6', '7'].includes(playerHand[0].value) && dealerValue <= 7) return 'SP';
      if (playerHand[0].value === '4' && [5, 6].includes(dealerValue)) return 'SP';
      if (playerHand[0].value === '5' && dealerValue <= 9) return 'DD';
      if (playerHand[0].value === '10') return 'S';
    }
  
    if (isSoft) {
      if (playerValue <= 17) return 'H';
      if (playerValue === 18) {
        if (dealerValue >= 9) return 'H';
        if (dealerValue <= 6) return 'DD';
        return 'S';
      }
      return 'S';
    }
  
    if (playerValue <= 8) return 'H';
    if (playerValue === 9) return dealerValue >= 3 && dealerValue <= 6 ? 'DD' : 'H';
    if (playerValue === 10) return dealerValue <= 9 ? 'DD' : 'H';
    if (playerValue === 11) return 'DD';
    if (playerValue === 12) return dealerValue >= 4 && dealerValue <= 6 ? 'S' : 'H';
    if (playerValue >= 13 && playerValue <= 16) return dealerValue <= 6 ? 'S' : 'H';
    return 'S';
  }
  
const cardValues: { [key: string]: number } = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  'J': 10, 'Q': 10, 'K': 10, 'A': 11
};

export function calculateHandValue(hand: Card[]): number {
  let value = 0;
  let aceCount = 0;

  for (const card of hand) {
    value += cardValues[card.value];
    if (card.value === 'A') aceCount++;
  }

  while (value > 21 && aceCount > 0) {
    value -= 10;
    aceCount--;
  }

  return value;
}

export function initializeGame(): GameState {
  const deck = createShuffledDeck();
  return {
    playerHands: [[deck.pop()!, deck.pop()!]],
    dealerHand: [deck.pop()!, deck.pop()!],
    deck,
    currentPlayerHand: 0,
    bet: 10,
    gameStatus: 'playing',
    dealerRevealed: false,
    handResults: ['playing'],
  };
}

function createShuffledDeck(): Card[] {
  const suits: ('♠' | '♥' | '♦' | '♣')[] = ['♠', '♥', '♦', '♣'];
  const values = ['2'];
  const deck: Card[] = [];

  // Create 6 decks
  for (let deckNum = 0; deckNum < 6; deckNum++) {
    for (const suit of suits) {
      for (const value of values) {
        deck.push({ value, suit });
      }
    }
  }

  // Shuffle the combined deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

export function hit(gameState: GameState): GameState {
  const newState = { ...gameState };
  const currentHand = newState.playerHands[newState.currentPlayerHand];
  currentHand.push(newState.deck.pop()!);
  
  const playerValue = calculateHandValue(currentHand);
  if (playerValue > 21) {
    newState.handResults[newState.currentPlayerHand] = 'bust';
    if (newState.currentPlayerHand < newState.playerHands.length - 1) {
      newState.currentPlayerHand++;
      const nextHand = newState.playerHands[newState.currentPlayerHand];
      if (nextHand.length === 1) {
        nextHand.push(newState.deck.pop()!);
      }
    } else if (newState.playerHands.length == 1){
      newState.gameStatus = 'playerBust';
    } else if(newState.currentPlayerHand === newState.playerHands.length - 1) {
      newState.gameStatus = 'lastHandBusted';
    }
  }

  return newState;
}

export function stand(gameState: GameState): GameState {
  const newState = { ...gameState };
  if (newState.currentPlayerHand < newState.playerHands.length - 1) {
    newState.currentPlayerHand++;
    const nextHand = newState.playerHands[newState.currentPlayerHand];
    if (nextHand.length === 1) {
      nextHand.push(newState.deck.pop()!);
    }

    return newState;
  }

  return resolveDealerHand(newState);
}

export function double(gameState: GameState): GameState {
  const newState = { ...gameState };
  const currentHand = newState.playerHands[newState.currentPlayerHand];

  newState.bet *= 2;
  currentHand.push(newState.deck.pop()!);
  
  if (calculateHandValue(currentHand) > 21) {
    if (newState.currentPlayerHand < newState.playerHands.length - 1) {
      newState.currentPlayerHand++;
      const nextHand = newState.playerHands[newState.currentPlayerHand];
      if (nextHand.length === 1) {
        nextHand.push(newState.deck.pop()!);
      }
    } else if (newState.playerHands.length == 1){
      newState.gameStatus = 'playerBust';
    } else if(newState.currentPlayerHand === newState.playerHands.length - 1) {
      newState.gameStatus = 'lastHandBusted';
    }
  } else {
    if (newState.currentPlayerHand < newState.playerHands.length - 1) {
      newState.currentPlayerHand++;
      const nextHand = newState.playerHands[newState.currentPlayerHand];
      if (nextHand.length === 1) {
        nextHand.push(newState.deck.pop()!);
      }
    }
  }

  return newState;
}

function areAllHandsPlayed(gameState: GameState): boolean {
  return gameState.currentPlayerHand === gameState.playerHands.length - 1;
}

export function split(gameState: GameState): GameState {
  const newState = { ...gameState };
  const currentHand = newState.playerHands[newState.currentPlayerHand];
  
  if (currentHand.length !== 2 || currentHand[0].value !== currentHand[1].value) {
    return newState;
  }

  const newHand = [currentHand.pop()!];
  currentHand.push(newState.deck.pop()!);
  
  newState.playerHands.splice(newState.currentPlayerHand + 1, 0, newHand);
  newState.handResults.splice(newState.currentPlayerHand + 1, 0, 'playing');

  return newState;
}

export function canSplit(gameState: GameState): boolean {
  const currentHand = gameState.playerHands[gameState.currentPlayerHand];
  return currentHand.length === 2 && currentHand[0].value === currentHand[1].value && gameState.playerHands.length < 4;
}

export function canDouble(gameState: GameState): boolean {
  const currentHand = gameState.playerHands[gameState.currentPlayerHand];
  return currentHand.length === 2;
}

export function revealDealerCard(gameState: GameState): GameState {
  return {
    ...gameState,
    dealerRevealed: true
  };
}

export function dealerHit(gameState: GameState): GameState {
  const newState = { ...gameState };
  const dealerValue = calculateHandValue(newState.dealerHand);

  if (dealerValue < 17) {
    newState.dealerHand.push(newState.deck.pop()!);
    return newState;
  }

  return finalizeDealerHand(newState);
}

export function resolveDealerHand(gameState: GameState): GameState {
  if (!areAllHandsPlayed(gameState)) {
    return gameState;
  }
  return dealerHit(gameState);
}

function finalizeDealerHand(gameState: GameState): GameState {
  const newState = { ...gameState };
  const dealerValue = calculateHandValue(newState.dealerHand);

  if (dealerValue > 21) {
    newState.gameStatus = 'dealerBust';
    newState.handResults = newState.handResults.map(result => 
      result === 'playing' ? 'win' : result
    );
  } else {
    const playerHandValues = newState.playerHands.map(calculateHandValue);
    newState.handResults = playerHandValues.map(value => {
      if (value > 21) return 'lose';
      if (value > dealerValue) return 'win';
      if (value < dealerValue) return 'lose';
      return 'push';
    });

    const playerBestHand = Math.max(...playerHandValues.filter(v => v <= 21));
    
    if (playerBestHand > dealerValue) {
      newState.gameStatus = 'playerWin';
    } else if (dealerValue > playerBestHand) {
      newState.gameStatus = 'dealerWin';
    } else {
      newState.gameStatus = 'push';
    }
  }

  return newState;
}