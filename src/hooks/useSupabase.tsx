import { useState, useEffect } from 'react'
import { VocabSet } from '../types'
import { supabase, convertDbSetToVocabSet, DbCard } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export const useSupabase = () => {
  const [sets, setSets] = useState<VocabSet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Fetch all sets with their cards
  const fetchSets = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('sets')
        .select(`
          *,
          cards (*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      const vocabSets = data?.map(convertDbSetToVocabSet) || []
      setSets(vocabSets)
      
      // Also save to localStorage as cache
      localStorage.setItem('vocabSets', JSON.stringify(vocabSets))
    } catch (err) {
      console.error('Error fetching sets:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      
      // Fallback to localStorage if online fetch fails
      const cached = localStorage.getItem('vocabSets')
      if (cached) {
        setSets(JSON.parse(cached))
      }
    } finally {
      setLoading(false)
    }
  }

  // Create a new set
  const createSet = async (name: string): Promise<VocabSet | null> => {
    try {
      const { data, error } = await supabase
        .from('sets')
        .insert({ 
          name, 
          user_id: user?.id || null 
        })
        .select()
        .single()

      if (error) throw error

      const newSet = convertDbSetToVocabSet({ ...data, cards: [] })
      setSets(prev => [newSet, ...prev])
      return newSet
    } catch (err) {
      console.error('Error creating set:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    }
  }

  // Update a set
  const updateSet = async (setId: string, updates: Partial<VocabSet>) => {
    try {
      const { error } = await supabase
        .from('sets')
        .update({ name: updates.name })
        .eq('id', setId)

      if (error) throw error

      setSets(prev => prev.map(s => 
        s.id === setId ? { ...s, ...updates } : s
      ))
    } catch (err) {
      console.error('Error updating set:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  // Delete a set
  const deleteSet = async (setId: string) => {
    try {
      const { error } = await supabase
        .from('sets')
        .delete()
        .eq('id', setId)

      if (error) throw error

      setSets(prev => prev.filter(s => s.id !== setId))
    } catch (err) {
      console.error('Error deleting set:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  // Add a card to a set
  const addCard = async (setId: string, term: string, definition: string) => {
    try {
      const { data, error } = await supabase
        .from('cards')
        .insert({ 
          set_id: setId,
          term,
          definition 
        })
        .select()
        .single()

      if (error) throw error

      const newCard = {
        id: data.id,
        term: data.term,
        definition: data.definition
      }

      setSets(prev => prev.map(s => 
        s.id === setId 
          ? { ...s, cards: [...s.cards, newCard] }
          : s
      ))
    } catch (err) {
      console.error('Error adding card:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  // Delete a card
  const deleteCard = async (setId: string, cardId: string) => {
    try {
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', cardId)

      if (error) throw error

      setSets(prev => prev.map(s => 
        s.id === setId 
          ? { ...s, cards: s.cards.filter(c => c.id !== cardId) }
          : s
      ))
    } catch (err) {
      console.error('Error deleting card:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  // Load sets on mount and when user changes
  useEffect(() => {
    fetchSets()
  }, [user])

  // Set up real-time subscription
  useEffect(() => {
    const setsSubscription = supabase
      .channel('sets-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'sets' },
        () => fetchSets()
      )
      .subscribe()

    const cardsSubscription = supabase
      .channel('cards-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'cards' },
        () => fetchSets()
      )
      .subscribe()

    return () => {
      setsSubscription.unsubscribe()
      cardsSubscription.unsubscribe()
    }
  }, [user])

  return {
    sets,
    loading,
    error,
    createSet,
    updateSet,
    deleteSet,
    addCard,
    deleteCard,
    refetch: fetchSets
  }
}