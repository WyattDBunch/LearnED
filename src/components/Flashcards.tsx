import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaSyncAlt } from 'react-icons/fa';
import { VocabSet, View } from '../types';
import Layout from './Layout';

interface FlashcardsProps {
  currentSet: VocabSet;
  setView: (view: View) => void;
}

const Flashcards: React.FC<FlashcardsProps> = ({ currentSet, setView }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % currentSet.cards.length);
    }, 200);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev - 1 + currentSet.cards.length) % currentSet.cards.length);
    }, 200);
  };

  const subtitle = currentSet.cards.length > 0 
    ? `${currentCardIndex + 1} / ${currentSet.cards.length}` 
    : undefined;

  return (
    <Layout title={currentSet.name} subtitle={subtitle} setView={setView}>
      {currentSet.cards.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-600 mb-4">No cards in this set yet!</p>
          <button
            onClick={() => setView('manage')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add Cards
          </button>
        </div>
      ) : (
        <>
          <div 
            className={`flip-card ${isFlipped ? 'flipped' : ''} h-96 mb-8 cursor-pointer`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="flip-card-inner">
              <div className="flip-card-front bg-white shadow-lg">
                <h3 className="text-3xl font-semibold text-gray-900">
                  {currentSet.cards[currentCardIndex].term}
                </h3>
              </div>
              <div className="flip-card-back bg-indigo-600 text-white shadow-lg">
                <p className="text-2xl">
                  {currentSet.cards[currentCardIndex].definition}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={prevCard}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <FaChevronLeft />
              Previous
            </button>
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <FaSyncAlt />
              Flip Card
            </button>
            <button
              onClick={nextCard}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              Next
              <FaChevronRight />
            </button>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Flashcards;