import React from 'react';

interface ClapperBoardProps {
  isVisible: boolean;
}

const ClapperBoard: React.FC<ClapperBoardProps> = ({ isVisible }) => {
  const wiggleAnimation = {
    animation: isVisible ? 'wiggle 1s ease-in-out infinite' : 'none',
    transformOrigin: 'right center',
    animationDelay: '800ms'
  };

  return (
    <div 
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-75 z-50 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{
        transform: isVisible 
          ? 'translate(-50%, -50%) scale(0.75) rotate(0deg)'
          : 'translate(-50%, -50%) scale(0.75) rotate(180deg)',
        transition: isVisible ? 'all 500ms ease-out' : 'opacity 500ms ease-out, transform 0ms 500ms'
      }}
    >
      <div className="relative">
        {/* Main board */}
        <div className="w-48 h-28 bg-black rounded-lg shadow-2xl flex flex-col">
          {/* Top section */}
          <div className="h-3/4 flex items-center justify-center border-b border-gray-700">
            <div className="text-white text-3xl font-bold">POSTERME</div>
          </div>
          {/* Bottom section */}
          <div className="h-1/2 flex items-center justify-center">
            <div className="text-white text-2xl font-mono"></div>
          </div>
        </div>
        
        {/* Top stick */}
        <div 
          className="absolute -top-8 right-0 w-48 h-8 rounded-t-lg"
          style={{
            ...wiggleAnimation,
            background: 'repeating-linear-gradient(45deg, #000000, #000000 10px, #ffffff 10px, #ffffff 20px)',
            transform: isVisible ? 'rotate(5deg)' : 'rotate(5deg)',
            transition: isVisible ? 'transform 500ms ease-out' : 'none'
          }}
        />
      </div>
      
      <style>
        {`
          @keyframes wiggle {
            0% {
              transform: rotate(5deg);
            }
            25% {
              transform: rotate(18deg);
            }
            50% {
              transform: rotate(-3deg);
            }
            75% {
              transform: rotate(5deg);
            }
            100% {
              transform: rotate(5deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ClapperBoard; 