import React, { useState } from 'react';
import { FaTimes, FaCheck, FaTrophy } from 'react-icons/fa';
import { VocabSet, View } from '../types';
import Layout from './Layout';

interface LearnProps {
  currentSet: VocabSet;
  setView: (view: View) => void;
}

const Learn: React.FC<LearnProps> = ({ currentSet, setView }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [learnedCards, setLearnedCards] = useState<Set<string>>(new Set());

  const progress = currentSet.cards.length > 0 
    ? (learnedCards.size / currentSet.cards.length) * 100 
    : 0;

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      let nextIndex = currentCardIndex;
      let attempts = 0;
      do {
        nextIndex = (nextIndex + 1) % currentSet.cards.length;
        attempts++;
      } while (learnedCards.has(currentSet.cards[nextIndex].id) && attempts < currentSet.cards.length);
      
      setCurrentCardIndex(nextIndex);
    }, 200);
  };

  const markAsLearned = () => {
    const newLearned = new Set(learnedCards);
    newLearned.add(currentSet.cards[currentCardIndex].id);
    setLearnedCards(newLearned);
    
    if (newLearned.size < currentSet.cards.length) {
      nextCard();
    }
  };

  const subtitle = `${learnedCards.size} / ${currentSet.cards.length} mastered`;

  return (
    <Layout title={`Learn: ${currentSet.name}`} subtitle={subtitle} setView={setView}>
      <div className="mb-6">
        <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-green-500 h-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
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
      ) : learnedCards.size === currentSet.cards.length ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <FaTrophy className="text-6xl text-yellow-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Congratulations!</h3>
          <p className="text-gray-600 mb-6">You've mastered all cards in this set!</p>
          <button
            onClick={() => {
              setLearnedCards(new Set());
              setCurrentCardIndex(0);
            }}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Start Over
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
              onClick={nextCard}
              className="bg-red-100 text-red-700 px-6 py-3 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
            >
              <FaTimes />
              Still Learning
            </button>
            <button
              onClick={markAsLearned}
              className="bg-green-100 text-green-700 px-6 py-3 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2"
            >
              <FaCheck />
              Got It!
            </button>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Learn;