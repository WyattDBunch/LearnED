import React from 'react';
import { FaPlus, FaTrash, FaLayerGroup, FaGraduationCap, FaClipboardCheck, FaEdit } from 'react-icons/fa';
import { VocabSet, View } from '../types';

interface DashboardProps {
  sets: VocabSet[];
  createSet: (name: string) => Promise<void>;
  deleteSet: (setId: string) => Promise<void>;
  setCurrentSet: (set: VocabSet) => void;
  setView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ sets, createSet, deleteSet, setCurrentSet, setView }) => {
  const handleCreateNewSet = async () => {
    const name = prompt('Enter set name:');
    if (name && name.trim()) {
      await createSet(name.trim());
    }
  };

  const handleDeleteSet = async (setId: string) => {
    if (sets.length === 1) {
      alert("You can't delete the last set!");
      return;
    }
    if (window.confirm('Are you sure you want to delete this set?')) {
      await deleteSet(setId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">VocabLearn</h1>
          <button
            onClick={handleCreateNewSet}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <FaPlus />
            New Set
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sets.map(set => (
            <div key={set.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{set.name}</h3>
                <button
                  onClick={() => handleDeleteSet(set.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
              <p className="text-gray-600 mb-6">{set.cards.length} cards</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCurrentSet(set);
                    setView('flashcards');
                  }}
                  className="flex-1 bg-indigo-100 text-indigo-700 py-2 rounded-lg hover:bg-indigo-200 transition-colors flex items-center justify-center gap-2"
                >
                  <FaLayerGroup />
                  Cards
                </button>
                <button
                  onClick={() => {
                    setCurrentSet(set);
                    setView('learn');
                  }}
                  className="flex-1 bg-green-100 text-green-700 py-2 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
                >
                  <FaGraduationCap />
                  Learn
                </button>
                <button
                  onClick={() => {
                    setCurrentSet(set);
                    setView('test');
                  }}
                  className="flex-1 bg-purple-100 text-purple-700 py-2 rounded-lg hover:bg-purple-200 transition-colors flex items-center justify-center gap-2"
                >
                  <FaClipboardCheck />
                  Test
                </button>
              </div>
              <button
                onClick={() => {
                  setCurrentSet(set);
                  setView('manage');
                }}
                className="w-full mt-3 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <FaEdit />
                Manage Cards
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;