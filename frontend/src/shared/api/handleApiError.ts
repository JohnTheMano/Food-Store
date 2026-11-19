import axios from 'axios'

interface ApiErrorResponse {
  detail?: unknown
}

function messageFromDetail(detail: unknown): string | undefined {
  if (typeof detail === 'string' && detail.trim()) return detail

  if (Array.isArray(detail)) {
    const messages = detail.flatMap((item) => {
      if (typeof item === 'string') return [item]
      if (
        typeof item === 'object'
        && item !== null
        && 'msg' in item
        && typeof item.msg === 'string'
      ) {
        return [item.msg]
      }
      return []
    })
    if (messages.length > 0) return messages.join('; ')
  }

  if (
    typeof detail === 'object'
    && detail !== null
    && 'message' in detail
    && typeof detail.message === 'string'
  ) {
    return detail.message
  }

  return undefined
}

export function handleApiError(
  error: unknown,
  fallbackMessage = 'Ocurrió un error inesperado.',
): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const detailMessage = messageFromDetail(error.response?.data?.detail)
    if (detailMessage) return detailMessage
  }

  if (error instanceof Error && error.message) return error.message
  return fallbackMessage
}
