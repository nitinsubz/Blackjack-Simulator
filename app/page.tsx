'use client';

import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import Table from './components/Table'
import Simulator from './components/Simulator'
import { GameState, initializeGame, hit, stand, double, split, canSplit, canDouble, revealDealerCard, resolveDealerHand } from './utils/blackjack'

export default function Home() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isDealerTurn, setIsDealerTurn] = useState(false);
  const [activeTab, setActiveTab] = useState<'simulator' | 'game'>('simulator');

  const resetGame = useCallback(() => {
    const newGameState = initializeGame();
    setGameState(newGameState);
    setIsDealerTurn(false);
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const handleHit = () => {
    if (gameState && gameState.gameStatus === 'playing') {
      const newState = hit(gameState);
      setGameState(newState);
      if(newState.gameStatus === 'lastHandBusted') {
        setIsDealerTurn(true);
      }
    }
  };

  const handleStand = () => {
    if (gameState && gameState.gameStatus === 'playing') {
      if(gameState.currentPlayerHand !== gameState.playerHands.length - 1) {
        setGameState(stand(gameState));
      } else {
        setIsDealerTurn(true);
      }
    }
  };

  const handleDouble = () => {
    if (gameState && gameState.gameStatus === 'playing' && canDouble(gameState)) {
      const newState = double(gameState);
      setGameState(newState);
      if (newState.currentPlayerHand === newState.playerHands.length - 1) {
        setIsDealerTurn(true);
      }
    }
  };

  const handleSplit = () => {
    if (gameState && gameState.gameStatus === 'playing' && canSplit(gameState)) {
      setGameState(split(gameState));
    }
  };

  useEffect(() => {
    if (isDealerTurn && gameState) {
      const dealerTurn = async () => {
        if (!gameState.dealerRevealed) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          setGameState(revealDealerCard(gameState));
          console.log("reevelaing dae");
          return;
        }

        const newState = resolveDealerHand(gameState);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setGameState(newState);

        if (newState.gameStatus !== 'playing') {
          setIsDealerTurn(false);
        }
      };

      dealerTurn();
    }
  }, [isDealerTurn, gameState]);

  return (
    <div className="min-h-screen bg-green-800">
      <Head>
        <title>Blackjack Trainer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white text-center mb-8">Blackjack Trainer</h1>
        
        <div className="flex justify-center mb-4">
          <button 
            className={`px-4 py-2 rounded-l ${activeTab === 'simulator' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            onClick={() => setActiveTab('simulator')}
          >
            Simulator Mode
          </button>
          <button 
            className={`px-4 py-2 rounded-r ${activeTab === 'game' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            onClick={() => setActiveTab('game')}
          >
            Game Mode
          </button>
        </div>

        {activeTab === 'simulator' && (
          <Simulator />
        )}

        {activeTab === 'game' && gameState && (
          <>
            <Table 
              gameState={gameState} 
              onHit={handleHit} 
              onStand={handleStand}
              onDouble={handleDouble}
              onSplit={handleSplit}
              isDealerTurn={isDealerTurn}
              resetGame={resetGame}
            />
          </>
        )}
      </main>
    </div>
  )
}