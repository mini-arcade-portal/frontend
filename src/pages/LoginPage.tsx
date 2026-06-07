import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { authApi, type LoginRequest } from '@/api/auth'
import { extractErrorMessage } from '@/api/client'
import { useAuthStore } from '@/store/authStore'
import { TextField } from '@/components/TextField'
import { Button } from '@/components/Button'

const loginSchema = z.object({
  username: z.string().min(1, 'Add meg a felhasználóneved'),
  password: z.string().min(1, 'Add meg a jelszavad'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const mutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      login(data.token, { username: data.username, role: data.role })
      navigate(redirectTo, { replace: true })
    },
  })

  const onSubmit = (values: LoginFormValues) => {
    mutation.mutate(values)
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center min-h-[60vh]">
      <ArtPanel
        title={
          <>
            Csapj <em className="italic text-pink-deep not-italic-fallback">bele</em>.
          </>
        }
        subtitle="Egy fiók, sok játék, egy ranglista. Pár másodperc az egész."
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card-dark p-10"
        noValidate
      >
        <h3 className="font-display font-extrabold text-4xl tracking-tight mb-1">
          Üdv újra!
        </h3>
        <p className="text-sm opacity-70 mb-7">
          Jelentkezz be és folytasd ahol abbahagytad.
        </p>

        <TextField
          label="Felhasználónév"
          autoComplete="username"
          placeholder="panna"
          {...register('username')}
          error={errors.username?.message}
        />

        <TextField
          label="Jelszó"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          {...register('password')}
          error={errors.password?.message}
        />

        {mutation.isError && (
          <div className="mb-4 p-3 rounded-xl bg-coral/10 border-2 border-coral text-coral text-sm font-medium">
            {extractErrorMessage(mutation.error)}
          </div>
        )}

        <Button
          type="submit"
          variant="mustard"
          size="lg"
          fullWidth
          disabled={mutation.isPending}
          className="mt-3"
        >
          {mutation.isPending ? 'Bejelentkezés…' : 'Bejelentkezés →'}
        </Button>

        <div className="text-center text-sm opacity-70 mt-5">
          Még nincs fiókod?{' '}
          <Link to="/register" className="text-mustard font-bold">
            Regisztrálj
          </Link>
        </div>
      </form>
    </div>
  )
}

export function ArtPanel({
  title,
  subtitle,
}: {
  title: React.ReactNode
  subtitle: string
}) {
  return (
    <div className="card-playful p-12 relative overflow-hidden aspect-square grid place-items-center min-h-[400px]">
      <div className="absolute w-[70px] h-[70px] bg-mint border-[3px] border-ink rounded-2xl top-8 left-8 -rotate-12" />
      <div className="absolute w-[60px] h-[60px] bg-mustard border-[3px] border-ink rounded-full bottom-14 left-16" />
      <div className="absolute w-[50px] h-[50px] bg-coral border-[3px] border-ink rounded-2xl top-16 right-10 rotate-[20deg]" />
      <div className="absolute w-[80px] h-[80px] bg-sky border-[3px] border-ink rounded-full bottom-8 right-8" />

      <div className="text-center relative z-10">
        <h2 className="font-display font-black text-5xl md:text-6xl tracking-tight leading-[0.95] mb-4">
          {title}
        </h2>
        <p className="text-base text-ink-2 font-medium max-w-[280px] mx-auto">
          {subtitle}
        </p>
      </div>
    </div>
  )
}
