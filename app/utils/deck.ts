import { CardType, Suit, CardValue } from '../types'

export const createDeck = (): CardType[] => {
  const suits: Suit[] = ['♠', '♥', '♦', '♣']
  const values: CardValue[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  return suits.flatMap(suit => values.map(value => ({ suit, value })))
}

export const shuffleDeck = (deck: CardType[]): CardType[] => {
  return [...deck].sort(() => Math.random() - 0.5)
}