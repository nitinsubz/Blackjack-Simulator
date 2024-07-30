import { useState, useEffect } from 'react';
import { animated, useSpring } from 'react-spring';
import DealerHand from './DealerHand';
import PlayerHand from './PlayerHand';
import ActionButtons from './ActionButtons';
import ChipStack from './ChipStack';
import { GameState, calculateHandValue, canSplit, canDouble, revealDealerCard } from '../utils/blackjack';

type TableProps = {
  gameState: GameState;
  onHit: () => void;
  onStand: () => void;
  onDouble: () => void;
  onSplit: () => void;
  isDealerTurn: boolean;
  resetGame: () => void;
};

export default function Table({ gameState, onHit, onStand, onDouble, onSplit, isDealerTurn, resetGame }: TableProps) {
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
      <div className="h-4" /> {/* Spacer */}
      <div className="flex flex-wrap justify-center mt-8">
        {gameState.playerHands.map((hand, index) => {
          let borderColor = 'border-transparent';
          if (gameState.handResults[index] === 'win') {
            borderColor = 'border-green-400';
          } else if (gameState.handResults[index] === 'lose' || gameState.handResults[index] === 'bust') {
            borderColor = 'border-red-500';
          }

          return (
            <div 
              key={index} 
              className={`flex flex-col items-center m-2 border-4 rounded-lg p-2 ${borderColor} ${
                index === gameState.currentPlayerHand && gameState.gameStatus === 'playing'? 'ring-2 ring-yellow-400' : ''
              }`}
            >
              <PlayerHand 
                cards={hand} 
                isActive={false}
              />
                { !['playing', 'lastHandBusted'].includes(gameState.gameStatus) && 
                <div className={`inline-block px-2 py-1 text- font-bold text-white text-center rounded-full ${
                  gameState.handResults[index] === 'win' ? 'bg-green-500' : 'bg-orange-500'
                }`}>
                  {gameState.handResults[index] === 'win' ? 'You Win' : gameState.handResults[index] === 'lose' ? 'You Lose!' : gameState.handResults[index] === 'push' ? 'Push' : 'You Busted!'}
                </div>
              }
            
            </div>
          );
        })}
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
     <button 
        className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300 ease-in-out"
        onClick={resetGame}
      >
        New Game
      </button>

      {isDealerTurn && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white text-2xl font-bold -mt-24">Dealer&apos;s Turn</div>
        </div>
      )}
      {/* {showResult && (
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
      )} */}
    </div>
  );
}