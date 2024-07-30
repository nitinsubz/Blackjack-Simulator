import React, { useState, useEffect } from 'react';
import { Card, GameState, initializeSimulatorHand, determineOptimalPlay } from '../utils/blackjack';
import DealerHand from './DealerHand';
import PlayerHand from './PlayerHand';

export default function Simulator() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedCorrect = sessionStorage.getItem('correctCount');
    const storedIncorrect = sessionStorage.getItem('incorrectCount');
    if (storedCorrect) setCorrectCount(parseInt(storedCorrect, 10));
    if (storedIncorrect) setIncorrectCount(parseInt(storedIncorrect, 10));
    newHand();
  }, []);

  useEffect(() => {
    if (isClient) {
      sessionStorage.setItem('correctCount', correctCount.toString());
    }
  }, [correctCount, isClient]);

  useEffect(() => {
    if (isClient) {
      sessionStorage.setItem('incorrectCount', incorrectCount.toString());
    }
  }, [incorrectCount, isClient]);

  const newHand = () => {
    setGameState(initializeSimulatorHand());
    setMessage(null);
    setAttempts(0);
  };

  const handleAction = (action: 'H' | 'S' | 'DD' | 'SP') => {
    if (!gameState) return;

    const optimalPlay = determineOptimalPlay(gameState.playerHands[0], gameState.dealerHand[1]);
    
    if (action === optimalPlay) {
      setMessage(`Correct!`);
      setCorrectCount(prev => prev + 1);
      setTimeout(newHand, 1000);
    } else {
      // setAttempts(prev => prev + 1);
      //if (attempts >= 1) {
        setMessage(`Incorrect. The optimal play is to ${getPlayDescription(optimalPlay)}.`);
        setIncorrectCount(prev => prev + 1);
        setTimeout(newHand, 2000);
      // } else {
      //   setMessage("Incorrect. Try again.");
      //   setTimeout(() => setMessage(null), 1500);
      // }
    }
  };

  const getPlayDescription = (play: 'H' | 'S' | 'DD' | 'SP') => {
    switch (play) {
      case 'H': return 'Hit';
      case 'S': return 'Stand';
      case 'DD': return 'Double Down';
      case 'SP': return 'Split';
    }
  };

  const startNewSession = () => {
    if (isClient) {
      sessionStorage.removeItem('correctCount');
      sessionStorage.removeItem('incorrectCount');
    }
    setCorrectCount(0);
    setIncorrectCount(0);
    newHand();
  };

  if (!gameState) {
    return <div>Loading...</div>;
  }

  const totalAttempts = correctCount + incorrectCount;
  const accuracy = totalAttempts > 0 ? (correctCount / totalAttempts * 100).toFixed(1) : '0.0';

  return (
    <div className="relative felt-texture rounded-3xl p-8 pt-24 shadow-xl overflow-hidden">
      <div className="absolute top-0 left-0 right-0 bg-gray-800 text-white px-4 py-2">
        <div className="flex justify-between items-center">
          <div>
            <span className="mr-4">Correct: <span className="font-bold">{correctCount}</span></span>
            <span>Incorrect: <span className="font-bold">{incorrectCount}</span></span>
          </div>
          <div className="flex items-center">
            <span className="mr-4">Accuracy: <span className="font-bold">{accuracy}%</span></span>
            <button 
              onClick={startNewSession}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded text-sm"
            >
              Start New Session
            </button>
          </div>
        </div>
      </div>
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-b-lg font-bold text-sm">
        DEALER MUST STAND ON 17 AND MUST DRAW TO 16
      </div>
      <div className="absolute top-24 right-4 w-24 h-32 bg-blue-800 rounded-lg flex items-center justify-center">
        <div className="w-20 h-28 bg-white rounded-lg border-2 border-blue-900"></div>
      </div>
      <div className="mt-16">
        <DealerHand cards={gameState.dealerHand} hideFirst={true} />
      </div>
      <div className="h-0" /> {/* Spacer */}
      <PlayerHand cards={gameState.playerHands[0]} isActive={false} />
      
      <div className="mt-12 grid grid-cols-2 gap-4 max-w-md mx-auto">
        <button onClick={() => handleAction('H')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-xl shadow-md transition duration-300 ease-in-out transform hover:scale-105">
          Hit
        </button>
        <button onClick={() => handleAction('S')} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg text-xl shadow-md transition duration-300 ease-in-out transform hover:scale-105">
          Stand
        </button>
        <button onClick={() => handleAction('DD')} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg text-xl shadow-md transition duration-300 ease-in-out transform hover:scale-105">
          Double
        </button>
        <button onClick={() => handleAction('SP')} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-xl shadow-md transition duration-300 ease-in-out transform hover:scale-105">
          Split
        </button>
      </div>

      {message && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white text-black text-xl font-bold p-6 rounded-lg shadow-lg">
            {message}
          </div>
        </div>
      )}
    </div>
  );
}