import React, { useState } from 'react'
import { VocabSet, View } from './types'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { useSupabase } from './hooks/useSupabase'
import Dashboard from './components/Dashboard'
import Flashcards from './components/Flashcards'
import Learn from './components/Learn'
import Test from './components/Test'
import ManageCards from './components/ManageCards'
import Auth from './components/Auth'

function AppContent() {
  const { user, signOut, loading: authLoading } = useAuth()
  const { sets, loading: setsLoading, createSet, updateSet, deleteSet, addCard, deleteCard } = useSupabase()
  const [currentSet, setCurrentSet] = useState<VocabSet | null>(null)
  const [view, setView] = useState<View>('dashboard')
  const [showAuth, setShowAuth] = useState(false)

  if (authLoading || setsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (showAuth && !user) {
    return <Auth />
  }

  const handleCreateSet = async (name: string) => {
    const newSet = await createSet(name)
    if (newSet) {
      setCurrentSet(newSet)
      setView('manage')
    }
  }

  const handleUpdateSet = async (setId: string, updates: Partial<VocabSet>) => {
    await updateSet(setId, updates)
    if (currentSet && currentSet.id === setId) {
      setCurrentSet({ ...currentSet, ...updates })
    }
  }

  const handleDeleteSet = async (setId: string) => {
    await deleteSet(setId)
    if (currentSet && currentSet.id === setId) {
      setCurrentSet(null)
      setView('dashboard')
    }
  }

  const handleAddCard = async (setId: string, term: string, definition: string) => {
    await addCard(setId, term, definition)
    // Update currentSet if it's the one being modified
    if (currentSet && currentSet.id === setId) {
      const updatedSet = sets.find(s => s.id === setId)
      if (updatedSet) setCurrentSet(updatedSet)
    }
  }

  const handleDeleteCard = async (setId: string, cardId: string) => {
    await deleteCard(setId, cardId)
    // Update currentSet if it's the one being modified
    if (currentSet && currentSet.id === setId) {
      const updatedSet = sets.find(s => s.id === setId)
      if (updatedSet) setCurrentSet(updatedSet)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* User info/auth controls */}
      {view === 'dashboard' && (
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-gray-600">{user.email}</span>
                <button
                  onClick={signOut}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}

      {view === 'dashboard' && (
        <Dashboard 
          sets={sets}
          createSet={handleCreateSet}
          deleteSet={handleDeleteSet}
          setCurrentSet={setCurrentSet}
          setView={setView}
        />
      )}
      {view === 'flashcards' && currentSet && (
        <Flashcards 
          currentSet={currentSet}
          setView={setView}
        />
      )}
      {view === 'learn' && currentSet && (
        <Learn 
          currentSet={currentSet}
          setView={setView}
        />
      )}
      {view === 'test' && currentSet && (
        <Test 
          currentSet={currentSet}
          setView={setView}
        />
      )}
      {view === 'manage' && currentSet && (
        <ManageCards 
          currentSet={currentSet}
          updateSet={(updates) => handleUpdateSet(currentSet.id, updates)}
          addCard={(term, definition) => handleAddCard(currentSet.id, term, definition)}
          deleteCard={(cardId) => handleDeleteCard(currentSet.id, cardId)}
          setView={setView}
        />
      )}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App