import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Link, useNavigate } from 'react-router-dom'
import { handleApiError } from '@/shared/api/handleApiError'
import { EstadoError } from '@/shared/components'
import { Button, Card, Input } from '@/shared/ui'
import AuthPageLayout from '../components/AuthPageLayout'
import { useAuth } from '../hooks/useAuth'

const fields = [
  { name: 'username', label: 'Nombre de usuario', type: 'text' },
  { name: 'full_name', label: 'Nombre completo', type: 'text' },
  { name: 'email', label: 'Correo electrónico', type: 'email' },
  { name: 'password', label: 'Contraseña', type: 'password' },
] as const

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [error, setError] = useState('')
  const form = useForm({
    defaultValues: { username: '', full_name: '', email: '', password: '' },
    onSubmit: async ({ value }) => {
      setError('')
      try {
        await register(value)
        navigate('/login', { replace: true })
      } catch (submitError: unknown) {
        setError(handleApiError(submitError, 'No se pudo completar el registro.'))
      }
    },
  })

  return (
    <AuthPageLayout>
      <Card className="mx-auto max-w-lg border-white/60 shadow-2xl shadow-black/20">
        <div className="mb-6 text-center">
          <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-amber-100 text-2xl dark:bg-amber-400/10">
            ✨
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Crear cuenta
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Registrate para confirmar y seguir tus pedidos.
          </p>
        </div>

        {error && <div className="mb-5"><EstadoError mensaje={error} /></div>}

        <form
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void form.handleSubmit()
          }}
          className="space-y-4"
        >
          {fields.map(({ name, label, type }) => (
            <form.Field
              key={name}
              name={name}
              validators={{
                onBlur: ({ value }) => {
                  if (!value.trim()) return `${label} es obligatorio`
                  if (name === 'password' && value.length < 8) return 'La contraseña debe tener al menos 8 caracteres'
                  return undefined
                },
              }}
            >
              {(field) => (
                <label htmlFor={field.name} className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {label}
                  <Input
                    id={field.name}
                    name={field.name}
                    type={type}
                    value={field.state.value}
                    minLength={name === 'password' ? 8 : undefined}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    required
                    autoComplete={name === 'password' ? 'new-password' : name === 'email' ? 'email' : 'name'}
                    className="mt-2"
                  />
                  {field.state.meta.errors.map((fieldError) => (
                    <span key={String(fieldError)} className="mt-1 block text-xs text-rose-600">{fieldError}</span>
                  ))}
                </label>
              )}
            </form.Field>
          ))}
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button type="submit" disabled={isSubmitting} className="w-full py-3">
                {isSubmitting ? 'Creando cuenta…' : 'Registrarme'}
              </Button>
            )}
          </form.Subscribe>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-300">
            Iniciar sesión
          </Link>
        </p>
      </Card>
    </AuthPageLayout>
  )
}
