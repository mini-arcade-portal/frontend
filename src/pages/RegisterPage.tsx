import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'

import { authApi, type RegisterRequest } from '@/api/auth'
import { extractErrorMessage } from '@/api/client'
import { useAuthStore } from '@/store/authStore'
import { TextField } from '@/components/TextField'
import { Button } from '@/components/Button'
import { ArtPanel } from './LoginPage'

const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Min. 3 karakter')
    .max(50, 'Max. 50 karakter'),
  email: z
    .string()
    .email('Érvénytelen email cím')
    .max(100, 'Max. 100 karakter'),
  password: z
    .string()
    .min(6, 'Min. 6 karakter')
    .max(100, 'Max. 100 karakter'),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterPage() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const mutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (data) => {
      login(data.token, { username: data.username, role: data.role })
      navigate('/', { replace: true })
    },
  })

  const onSubmit = (values: RegisterFormValues) => {
    mutation.mutate(values)
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center min-h-[60vh]">
      <ArtPanel
        title={
          <>
            Új <em className="italic text-pink-deep">játékos</em>?
          </>
        }
        subtitle="Hozd létre a fiókodat és kezdj el játszani egy perc alatt."
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card-dark p-10"
        noValidate
      >
        <h3 className="font-display font-extrabold text-4xl tracking-tight mb-1">
          Regisztráció
        </h3>
        <p className="text-sm opacity-70 mb-7">
          Pár adat és kész is — ingyenes és gyors.
        </p>

        <TextField
          label="Felhasználónév"
          autoComplete="username"
          placeholder="pl. panna"
          {...register('username')}
          error={errors.username?.message}
        />

        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="panna@example.com"
          {...register('email')}
          error={errors.email?.message}
        />

        <TextField
          label="Jelszó"
          type="password"
          autoComplete="new-password"
          placeholder="legalább 6 karakter"
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
          {mutation.isPending ? 'Regisztráció…' : 'Fiók létrehozása →'}
        </Button>

        <div className="text-center text-sm opacity-70 mt-5">
          Van már fiókod?{' '}
          <Link to="/login" className="text-mustard font-bold">
            Bejelentkezés
          </Link>
        </div>
      </form>
    </div>
  )
}
