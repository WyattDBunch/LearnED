export interface Card {
  id: string; // Changed from number to string for UUID
  term: string;
  definition: string;
}

export interface VocabSet {
  id: string; // Changed from number to string for UUID
  name: string;
  cards: Card[];
}

export type View = 'dashboard' | 'flashcards' | 'learn' | 'test' | 'manage' | 'auth';