type ChipStackProps = {
    amount: number;
  };
  
  const chipColors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
  ];
  
  export default function ChipStack({ amount }: ChipStackProps) {
    const chips = Math.min(Math.ceil(amount / 10), 5);
  
    return (
      <div className="relative w-16 h-20">
        {[...Array(chips)].map((_, index) => (
          <div
            key={index}
            className={`absolute w-16 h-16 rounded-full border-4 border-gray-300 ${
              chipColors[index % chipColors.length]
            } flex items-center justify-center text-white font-bold shadow-md`}
            style={{ bottom: `${index * 4}px` }}
          >
            {index === chips - 1 ? `$${amount}` : ''}
          </div>
        ))}
      </div>
    );
  }