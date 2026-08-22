import { api } from './client'



export type GameType = 'snake' | 'tictactoe' | 'flappybird'

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD'

export interface StartSessionRequest {
  gameType: GameType
  difficulty: Difficulty
}

export interface StartSessionResponse {
  sessionId: string
  expiresAt: string
}

export interface ScoreSubmitRequest {
  gameType: GameType
  difficulty: Difficulty
  score: number
  sessionId: string
}

export interface ScoreResponse {
  id: number
  userId: number
  username: string
  gameType: string
  difficulty: Difficulty
  score: number
  createdAt: string
}

export const scoreApi = {
  startSession: (data: StartSessionRequest) =>
    api.post<StartSessionResponse>('/api/scores/sessions', data).then((r) => r.data),

  submit: (data: ScoreSubmitRequest) =>
    api.post<ScoreResponse>('/api/scores', data).then((r) => r.data),

  topScores: (gameType: GameType, limit = 10) =>
    api
      .get<ScoreResponse[]>('/api/scores', { params: { gameType, limit } })
      .then((r) => r.data),

  myScores: (limit = 10) =>
    api
      .get<ScoreResponse[]>('/api/scores/me', { params: { limit } })
      .then((r) => r.data),

  delete: (id: number) => api.delete<void>(`/api/scores/${id}`),
}
