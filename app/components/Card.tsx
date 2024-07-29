import React from 'react';

type CardProps = {
  value: string;
  suit: '♠' | '♥' | '♦' | '♣' | '?';
  hidden?: boolean;
};

const suitColors = {
  '♠': 'text-black',
  '♥': 'text-red-600',
  '♦': 'text-red-600',
  '♣': 'text-black',
  '?': 'text-black',
};

export default function Card({ value, suit, hidden = false }: CardProps) {
  if (hidden) {
    return (
      <div className="bg-blue-500 rounded-lg w-24 h-32 shadow-md flex items-center justify-center">
        <div className="w-20 h-28 bg-blue-700 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg w-24 h-32 shadow-md flex flex-col justify-between p-2 relative">
      <div className={`text-xl font-bold ${suitColors[suit]}`}>
        {value}
        <span className="ml-1">{suit}</span>
      </div>
      <div className={`text-6xl ${suitColors[suit]} self-center`}>
        {suit}
      </div>
      <div className={`text-xl font-bold ${suitColors[suit]} self-end transform rotate-180`}>
        {value}
        <span className="ml-1">{suit}</span>
      </div>
    </div>
  );
}