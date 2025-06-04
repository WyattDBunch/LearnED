import React, { useState } from 'react';
import { FaTrophy, FaChartLine } from 'react-icons/fa';
import { VocabSet, View } from '../types';
import Layout from './Layout';

interface TestProps {
  currentSet: VocabSet;
  setView: (view: View) => void;
}

interface TestQuestion {
  card: { id: string; term: string; definition: string };
  options: string[];
  correct: string;
}

const Test: React.FC<TestProps> = ({ currentSet, setView }) => {
  const [testAnswers, setTestAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const generateQuestions = (): TestQuestion[] => {
    return currentSet.cards.map(card => {
      const correctAnswer = card.definition;
      const otherAnswers = currentSet.cards
        .filter(c => c.id !== card.id)
        .map(c => c.definition)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      const allAnswers = [correctAnswer, ...otherAnswers]
        .sort(() => Math.random() - 0.5);
      
      return {
        card,
        options: allAnswers,
        correct: correctAnswer
      };
    });
  };

  const questions = generateQuestions();

  const handleAnswer = (cardId: string, answer: string) => {
    setTestAnswers({
      ...testAnswers,
      [cardId]: answer
    });
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (testAnswers[q.card.id] === q.correct) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100)
    };
  };

  const score = showResults ? calculateScore() : null;
  const subtitle = `${Object.keys(testAnswers).length} / ${currentSet.cards.length} answered`;

  return (
    <Layout title={`Test: ${currentSet.name}`} subtitle={!showResults ? subtitle : undefined} setView={setView}>
      {currentSet.cards.length < 4 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-600 mb-4">You need at least 4 cards to take a test!</p>
          <button
            onClick={() => setView('manage')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add More Cards
          </button>
        </div>
      ) : showResults && score ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          {score.percentage >= 80 ? (
            <FaTrophy className="text-6xl text-yellow-500 mx-auto mb-4" />
          ) : (
            <FaChartLine className="text-6xl text-blue-500 mx-auto mb-4" />
          )}
          <h3 className="text-3xl font-bold text-gray-900 mb-2">
            {score.percentage}%
          </h3>
          <p className="text-xl text-gray-600 mb-6">
            You got {score.correct} out of {score.total} correct!
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setTestAnswers({});
                setShowResults(false);
              }}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Retake Test
            </button>
            <button
              onClick={() => setView('dashboard')}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Sets
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-6 mb-8">
            {questions.map((q, index) => (
              <div key={q.card.id} className="bg-white rounded-xl shadow-sm p-6 animate-slide-in" style={{animationDelay: `${index * 0.05}s`}}>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {index + 1}. What is the meaning of "{q.card.term}"?
                </h3>
                <div className="space-y-3">
                  {q.options.map((option, optIndex) => (
                    <label
                      key={optIndex}
                      className={`block p-4 rounded-lg border-2 cursor-pointer transition-all
                        ${testAnswers[q.card.id] === option 
                          ? 'border-indigo-500 bg-indigo-50' 
                          : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <input
                        type="radio"
                        name={`question-${q.card.id}`}
                        value={option}
                        checked={testAnswers[q.card.id] === option}
                        onChange={() => handleAnswer(q.card.id, option)}
                        className="mr-3"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={() => setShowResults(true)}
              disabled={Object.keys(testAnswers).length !== currentSet.cards.length}
              className={`px-8 py-3 rounded-lg transition-colors ${
                Object.keys(testAnswers).length === currentSet.cards.length
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Submit Test
            </button>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Test;