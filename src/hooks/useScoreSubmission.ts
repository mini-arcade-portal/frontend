import { useCallback, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { scoreApi, type Difficulty, type GameType } from '@/api/scores'
import { extractErrorMessage } from '@/api/client'

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

interface UseScoreSubmissionResult {
  submitStatus: SubmitStatus
  submitError: string | undefined
  /** Starts a fresh single-use session for a new attempt (game start / Play Again). */
  startNewAttempt: () => void
  /** Submits a game-over score using the current attempt's session. */
  submitScore: (score: number) => void
  /** Retries the last submitted score, re-starting the session if it never started. */
  retrySubmit: () => void
}

export function useScoreSubmission(
  gameType: GameType,
  difficulty: Difficulty
): UseScoreSubmissionResult {
  const queryClient = useQueryClient()
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [submitError, setSubmitError] = useState<string>()
  const [lastSubmittedScore, setLastSubmittedScore] = useState<number | null>(null)
  const sessionIdRef = useRef<string | null>(null)

  const startSessionMutation = useMutation({
    mutationFn: () => scoreApi.startSession({ gameType, difficulty }),
    onSuccess: (res) => {
      sessionIdRef.current = res.sessionId
    },
  })

  const submitMutation = useMutation({
    mutationFn: (score: number) => {
      const sessionId = sessionIdRef.current
      if (!sessionId) {
        return Promise.reject(
          new Error('Nincs aktív játékmenet-azonosító — próbáld újra')
        )
      }
      return scoreApi.submit({ gameType, difficulty, score, sessionId })
    },
    onMutate: () => setSubmitStatus('submitting'),
    onSuccess: () => {
      setSubmitStatus('success')
      queryClient.invalidateQueries({ queryKey: ['scores'] })
    },
    onError: (err) => {
      setSubmitStatus('error')
      setSubmitError(extractErrorMessage(err))
    },
  })

  const startNewAttempt = useCallback(() => {
    sessionIdRef.current = null
    setSubmitStatus('idle')
    setSubmitError(undefined)
    setLastSubmittedScore(null)
    startSessionMutation.mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameType, difficulty])

  const submitScore = useCallback(
    (score: number) => {
      if (score > 0 && lastSubmittedScore !== score) {
        setLastSubmittedScore(score)
        submitMutation.mutate(score)
      }
    },
    [submitMutation, lastSubmittedScore]
  )

  const retrySubmit = useCallback(() => {
    if (lastSubmittedScore === null) return
    if (!sessionIdRef.current) {
      startSessionMutation.mutate()
      return
    }
    submitMutation.mutate(lastSubmittedScore)
  }, [submitMutation, lastSubmittedScore, startSessionMutation])

  return { submitStatus, submitError, startNewAttempt, submitScore, retrySubmit }
}
