import {
  checkWinner,
  isBoardFull,
  type Board,
  type Difficulty,
  type Player,
} from './types'

const AI: Player = 'O'
const HUMAN: Player = 'X'

function emptyCells(board: Board): number[] {
  const result: number[] = []
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) result.push(i)
  }
  return result
}

function easyMove(board: Board): number {
  const empty = emptyCells(board)
  return empty[Math.floor(Math.random() * empty.length)]
}

function mediumMove(board: Board): number {
  for (const i of emptyCells(board)) {
    const test = board.slice()
    test[i] = AI
    if (checkWinner(test)?.winner === AI) return i
  }
  for (const i of emptyCells(board)) {
    const test = board.slice()
    test[i] = HUMAN
    if (checkWinner(test)?.winner === HUMAN) return i
  }
  return easyMove(board)
}

function minimax(
  board: Board,
  currentPlayer: Player,
  depth: number
): { score: number; move: number } {
  const winner = checkWinner(board)
  if (winner?.winner === AI) return { score: 10 - depth, move: -1 }
  if (winner?.winner === HUMAN) return { score: depth - 10, move: -1 }
  if (isBoardFull(board)) return { score: 0, move: -1 }

  const empty = emptyCells(board)
  const isMax = currentPlayer === AI

  let bestScore = isMax ? -Infinity : Infinity
  let bestMove = empty[0]

  for (const i of empty) {
    const next = board.slice()
    next[i] = currentPlayer
    const opponent: Player = currentPlayer === AI ? HUMAN : AI
    const result = minimax(next, opponent, depth + 1)

    if (isMax) {
      if (result.score > bestScore) {
        bestScore = result.score
        bestMove = i
      }
    } else {
      if (result.score < bestScore) {
        bestScore = result.score
        bestMove = i
      }
    }
  }

  return { score: bestScore, move: bestMove }
}

function hardMove(board: Board): number {
  return minimax(board, AI, 0).move
}

export function getAIMove(board: Board, difficulty: Difficulty): number {
  switch (difficulty) {
    case 'EASY':
      return easyMove(board)
    case 'MEDIUM':
      return mediumMove(board)
    case 'HARD':
      return hardMove(board)
  }
}
