import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { AxiosError, AxiosHeaders } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LoginPage } from './LoginPage'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'
import type { BackendError } from '@/api/client'

vi.mock('@/api/auth', () => ({
  authApi: {
    login: vi.fn(),
  },
}))

function renderLoginPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/login']}>
        <LoginPage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.mocked(authApi.login).mockReset()
    useAuthStore.setState({ token: null, user: null })
  })

  it('renders the username and password fields and a submit button', () => {
    renderLoginPage()

    expect(screen.getByLabelText('Felhasználónév')).toBeInTheDocument()
    expect(screen.getByLabelText('Jelszó')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Bejelentkezés/ })
    ).toBeInTheDocument()
  })

  it('shows validation errors when submitting an empty form', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.click(screen.getByRole('button', { name: /Bejelentkezés/ }))

    expect(
      await screen.findByText('Add meg a felhasználóneved')
    ).toBeInTheDocument()
    expect(screen.getByText('Add meg a jelszavad')).toBeInTheDocument()
    expect(authApi.login).not.toHaveBeenCalled()
  })

  it('logs the user in and stores the token on successful submit', async () => {
    vi.mocked(authApi.login).mockResolvedValue({
      token: 'jwt-token',
      username: 'panna',
      role: 'USER',
    })
    const user = userEvent.setup()
    renderLoginPage()

    await user.type(screen.getByLabelText('Felhasználónév'), 'panna')
    await user.type(screen.getByLabelText('Jelszó'), 'secret123')
    await user.click(screen.getByRole('button', { name: /Bejelentkezés/ }))

    await waitFor(() => {
      expect(useAuthStore.getState().token).toBe('jwt-token')
    })
    expect(useAuthStore.getState().user).toEqual({
      username: 'panna',
      role: 'USER',
    })
  })

  it('shows the backend error message when login is rejected', async () => {
    const backendError: BackendError = {
      timestamp: new Date().toISOString(),
      status: 401,
      error: 'Unauthorized',
      message: 'Invalid credentials',
    }
    vi.mocked(authApi.login).mockRejectedValue(
      new AxiosError(
        'Request failed',
        '401',
        undefined,
        undefined,
        {
          data: backendError,
          status: 401,
          statusText: 'Unauthorized',
          headers: new AxiosHeaders(),
          config: { headers: new AxiosHeaders() },
        }
      )
    )
    const user = userEvent.setup()
    renderLoginPage()

    await user.type(screen.getByLabelText('Felhasználónév'), 'panna')
    await user.type(screen.getByLabelText('Jelszó'), 'wrong')
    await user.click(screen.getByRole('button', { name: /Bejelentkezés/ }))

    expect(
      await screen.findByText('Hibás felhasználónév vagy jelszó.')
    ).toBeInTheDocument()
    expect(useAuthStore.getState().token).toBeNull()
  })
})
