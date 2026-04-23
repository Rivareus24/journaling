export type Mood = 'bad' | 'low' | 'good' | 'great' | null

export interface Entry {
  id: string
  date: string       // ISO yyyy-mm-dd
  body: string
  mood: Mood
  created_at: string
  updated_at: string
}
