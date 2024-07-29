import { useState, useEffect } from 'react';
import Card from './Card';
import { Card as CardType } from '../utils/blackjack';

type HandProps = {
  cards: CardType[];
  isActive: boolean;
};

export default function PlayerHand({ cards, isActive }: HandProps) {
  const [displayedCards, setDisplayedCards] = useState(cards);

  useEffect(() => {
    setDisplayedCards(cards);
  }, [cards]);

  return (
    <div className={`flex justify-center items-center h-32 mb-8 ${isActive ? 'border-4 border-yellow-300 rounded-lg p-2' : ''}`}>
      {displayedCards.map((card, index) => (
        <div key={`${card.value}-${card.suit}-${index}`} className={index > 0 ? "ml-2" : ""} style={{zIndex: index}}>
          <Card 
            value={card.value} 
            suit={card.suit} 
          />
        </div>
      ))}
    </div>
  );
}