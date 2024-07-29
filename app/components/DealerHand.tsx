import { useState, useEffect } from 'react';
import Card from './Card';
import { Card as CardType } from '../utils/blackjack';

type HandProps = {
  cards: CardType[];
  hideFirst?: boolean;
};

export default function Hand({ cards, hideFirst = false }: HandProps) {
  const [displayedCards, setDisplayedCards] = useState(cards);

  useEffect(() => {
    setDisplayedCards(cards);
  }, [cards]);

  return (
    <div className="flex justify-center items-center h-32 mb-8">
      {displayedCards.map((card, index) => (
        <div key={`${card.value}-${card.suit}-${index}`} className={index > 0 ? "ml-2" : ""} style={{zIndex: index}}>
          <Card 
            hidden={index === 0 && hideFirst} 
            value={card.value} 
            suit={card.suit} 
          />
        </div>
      ))}
    </div>
  );
}