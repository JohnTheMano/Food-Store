import { useEffect } from 'react'
import { useNotificationStore } from '@/store/notificationStore'
import { Button } from '@/shared/ui'

export default function Toast() {
  const { message, visible, hideNotification } = useNotificationStore()

  useEffect(() => {
    if (!visible) return
    const timeout = window.setTimeout(hideNotification, 3000)
    return () => window.clearTimeout(timeout)
  }, [visible, message, hideNotification])

  if (!visible) return null

  return (
    <div
      role="status"
      className="fixed bottom-5 right-5 z-[100] flex max-w-sm items-center gap-4 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-2xl"
    >
      <span>{message}</span>
      <Button
        type="button"
        variant="ghost"
        className="shrink-0 px-2 py-1 text-slate-300 hover:text-white"
        onClick={hideNotification}
        aria-label="Cerrar notificación"
      >
        ×
      </Button>
    </div>
  )
}
