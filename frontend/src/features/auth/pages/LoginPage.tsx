import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Link, useNavigate } from 'react-router-dom'
import { handleApiError } from '@/shared/api/handleApiError'
import { EstadoError } from '@/shared/components'
import { Button, Card, Input } from '@/shared/ui'
import AuthPageLayout from '../components/AuthPageLayout'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [error, setError] = useState('')

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      setError('')
      try {
        await login(value.username, value.password)
        navigate('/', { replace: true })
      } catch (submitError: unknown) {
        setError(handleApiError(
          submitError,
          'No se pudo iniciar sesión. Verificá tus credenciales.',
        ))
      }
    },
  })

  return (
    <AuthPageLayout>
      <Card className="mx-auto max-w-md border-white/60 shadow-2xl shadow-black/20">
        <div className="mb-7 text-center">
          <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl dark:bg-emerald-400/10">
            🍽️
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Food Store
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Iniciá sesión para continuar
          </p>
        </div>

        {error && <div className="mb-5"><EstadoError mensaje={error} /></div>}

        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void form.handleSubmit()
          }}
          className="space-y-5"
        >
          <form.Field
            name="username"
            validators={{
              onBlur: ({ value }) => value.trim() ? undefined : 'El usuario es obligatorio',
            }}
          >
            {(field) => (
              <label htmlFor={field.name} className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Usuario o email
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  required
                  className="mt-2"
                  placeholder="Tu usuario"
                  autoComplete="username"
                />
                {field.state.meta.errors.map((fieldError) => (
                  <span key={String(fieldError)} className="mt-1 block text-xs text-rose-600">{fieldError}</span>
                ))}
              </label>
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onBlur: ({ value }) => value ? undefined : 'La contraseña es obligatoria',
            }}
          >
            {(field) => (
              <label htmlFor={field.name} className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Contraseña
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  required
                  className="mt-2"
                  placeholder="Tu contraseña"
                  autoComplete="current-password"
                />
                {field.state.meta.errors.map((fieldError) => (
                  <span key={String(fieldError)} className="mt-1 block text-xs text-rose-600">{fieldError}</span>
                ))}
              </label>
            )}
          </form.Field>

          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" disabled={isSubmitting} className="w-full py-3">
                {isSubmitting ? 'Ingresando…' : 'Iniciar sesión'}
              </Button>
            )}
          </form.Subscribe>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          ¿No tenés cuenta?{' '}
          <Link to="/register" className="font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-300">
            Registrate
          </Link>
        </p>
      </Card>
    </AuthPageLayout>
  )
}
