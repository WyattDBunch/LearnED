import { createClient } from '@supabase/supabase-js'
import { VocabSet, Card } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface DbSet {
  id: string
  name: string
  user_id: string | null
  created_at: string
  updated_at: string
}

export interface DbCard {
  id: string
  set_id: string
  term: string
  definition: string
  created_at: string
  updated_at: string
}

export const convertDbSetToVocabSet = (
  dbSet: DbSet & { cards?: DbCard[] }
): VocabSet => ({
  id: dbSet.id,
  name: dbSet.name,
  cards: dbSet.cards?.map(card => ({
    id: card.id,
    term: card.term,
    definition: card.definition,
  })) || [],
})

export const convertVocabSetToDb = (
  vocabSet: VocabSet
): Omit<DbSet, 'created_at' | 'updated_at'> => ({
  id: vocabSet.id,
  name: vocabSet.name,
  user_id: null,
})
