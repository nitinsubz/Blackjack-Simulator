type ActionButtonsProps = {
    onHit: () => void;
    onStand: () => void;
    onDouble: () => void;
    onSplit: () => void;
    gameStatus: string;
    canSplit: boolean;
    canDouble: boolean;
  };
  
  export default function ActionButtons({ onHit, onStand, onDouble, onSplit, gameStatus, canSplit, canDouble }: ActionButtonsProps) {
    const isPlaying = gameStatus === 'playing';
  
    return (
      <div className="flex justify-center mt-8 space-x-4">
        <button
          className={`bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded ${!isPlaying && 'opacity-50 cursor-not-allowed'}`}
          onClick={onHit}
          disabled={!isPlaying}
        >
          Hit
        </button>
        <button
          className={`bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ${!isPlaying && 'opacity-50 cursor-not-allowed'}`}
          onClick={onStand}
          disabled={!isPlaying}
        >
          Stand
        </button>
        <button
          className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ${(!isPlaying || !canDouble) && 'opacity-50 cursor-not-allowed'}`}
          onClick={onDouble}
          disabled={!isPlaying || !canDouble}
        >
          Double
        </button>
        <button
          className={`bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded ${(!isPlaying || !canSplit) && 'opacity-50 cursor-not-allowed'}`}
          onClick={onSplit}
          disabled={!isPlaying || !canSplit}
        >
          Split
        </button>
      </div>
    );
  }