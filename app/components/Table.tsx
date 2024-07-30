import { useState, useEffect } from 'react';
import { animated, useSpring } from 'react-spring';
import DealerHand from './DealerHand';
import PlayerHand from './PlayerHand';
import ActionButtons from './ActionButtons';
import ChipStack from './ChipStack';
import { GameState, calculateHandValue, canSplit, canDouble } from '../utils/blackjack';

type TableProps = {
  gameState: GameState;
  onHit: () => void;
  onStand: () => void;
  onDouble: () => void;
  onSplit: () => void;
  isDealerTurn: boolean;
};

export default function Table({ gameState, onHit, onStand, onDouble, onSplit, isDealerTurn }: TableProps) {
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (gameState.gameStatus !== 'playing') {
      if (gameState.gameStatus === 'playerBust' || gameState.gameStatus === 'playerBlackjack') {
        setShowResult(true);
      } else {
        setTimeout(() => setShowResult(true), 1500);
      }
    } else {
      setShowResult(false);
    }
  }, [gameState.gameStatus]);

  const resultSpring = useSpring({
    opacity: showResult ? 1 : 0,
    transform: showResult ? 'scale(1)' : 'scale(0.8)',
  });

  return (
    <div className="relative felt-texture rounded-3xl p-8 pt-16 shadow-xl overflow-hidden">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-b-lg font-bold text-sm">
        DEALER MUST STAND ON 17 AND MUST DRAW TO 16
      </div>
      <div className="absolute top-4 right-4 w-24 h-32 bg-blue-800 rounded-lg flex items-center justify-center">
        <div className="w-20 h-28 bg-white rounded-lg border-2 border-blue-900"></div>
      </div>
      <DealerHand cards={gameState.dealerHand} hideFirst={!gameState.dealerRevealed} />
      <div className="h-40" /> {/* Spacer */}
      <div className="flex flex-wrap justify-center">
        {gameState.playerHands.map((hand, index) => (
          <div 
            key={index} 
            className={`m-2 ${index === gameState.currentPlayerHand ? 'border-2 border-yellow-400 rounded-lg p-2' : ''}`}
          >
            <PlayerHand 
              cards={hand} 
              isActive={false}
            />
            {index === gameState.currentPlayerHand && (
              <div className="mt-2 text-center text-white font-bold">
                Current Hand
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-4">
        <ChipStack amount={gameState.bet} />
      </div>
      <ActionButtons 
        onHit={onHit} 
        onStand={onStand}
        onDouble={onDouble}
        onSplit={onSplit}
        gameStatus={gameState.gameStatus}
        canSplit={canSplit(gameState)}
        canDouble={canDouble(gameState)}
      />
      {isDealerTurn && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white text-2xl font-bold">Dealer&apos;s Turn</div>
        </div>
      )}
      {showResult && (
        <animated.div 
          style={{
            ...resultSpring,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          }}
        >
          <div className="bg-white p-4 rounded-lg text-2xl font-bold">
            <p>{gameState.gameStatus}</p>
            <p>Dealer: {calculateHandValue(gameState.dealerHand)}</p>
            {gameState.playerHands.map((hand, index) => (
              <p key={index}>Player Hand {index + 1}: {calculateHandValue(hand)}</p>
            ))}
          </div>
        </animated.div>
      )}
    </div>
  );
}