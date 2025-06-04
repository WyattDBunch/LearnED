import React, { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { VocabSet, View, Card } from '../types';
import Layout from './Layout';

interface ManageCardsProps {
  currentSet: VocabSet;
  updateSet?: (updates: Partial<VocabSet>) => Promise<void>;
  addCard: (term: string, definition: string) => Promise<void>;
  deleteCard: (cardId: string) => Promise<void>;
  setView: (view: View) => void;
}

const ManageCards: React.FC<ManageCardsProps> = ({ currentSet, updateSet, addCard, deleteCard, setView }) => {
  const [newTerm, setNewTerm] = useState('');
  const [newDefinition, setNewDefinition] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTerm.trim() && newDefinition.trim()) {
      setLoading(true);
      try {
        await addCard(newTerm.trim(), newDefinition.trim());
        setNewTerm('');
        setNewDefinition('');
      } catch (error) {
        console.error('Error adding card:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      await deleteCard(cardId);
    }
  };

  const subtitle = `${currentSet.cards.length} cards`;

  return (
    <Layout title={`Manage: ${currentSet.name}`} subtitle={subtitle} setView={setView}>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Card</h3>
        <form onSubmit={handleAddCard} className="flex gap-4">
          <input
            type="text"
            placeholder="Term"
            value={newTerm}
            onChange={(e) => setNewTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Definition"
            value={newDefinition}
            onChange={(e) => setNewDefinition(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPlus />
          </button>
        </form>
      </div>
      
      <div className="space-y-4">
        {currentSet.cards.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-600">No cards yet. Add your first card above!</p>
          </div>
        ) : (
          currentSet.cards.map((card, index) => (
            <div 
              key={card.id} 
              className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between animate-slide-in" 
              style={{animationDelay: `${index * 0.05}s`}}
            >
              <div className="flex-1">
                <span className="font-semibold text-gray-900">{card.term}</span>
                <span className="mx-4 text-gray-400">→</span>
                <span className="text-gray-700">{card.definition}</span>
              </div>
              <button
                onClick={() => handleDeleteCard(card.id)}
                className="text-gray-400 hover:text-red-500 transition-colors ml-4"
              >
                <FaTrash />
              </button>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default ManageCards;