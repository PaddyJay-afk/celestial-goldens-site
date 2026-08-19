const MAX_PUBLIC_JSON_BYTES = 64 * 1024

export class RequestBodyError extends Error {
  constructor(
    message: string,
    public readonly status: 400 | 413 | 415,
  ) {
    super(message)
    this.name = 'RequestBodyError'
  }
}

/**
 * Parse a small JSON request body safely for public form endpoints. The
 * Content-Length preflight avoids unnecessary allocation, and the streaming
 * fallback prevents chunked uploads from bypassing the same limit.
 */
export const parsePublicJson = async (request: Request): Promise<unknown> => {
  const contentType = request.headers.get('content-type')?.toLowerCase() ?? ''
  if (!contentType.startsWith('application/json')) {
    throw new RequestBodyError('Unsupported content type.', 415)
  }

  const contentLength = Number(request.headers.get('content-length') ?? '0')
  if (Number.isFinite(contentLength) && contentLength > MAX_PUBLIC_JSON_BYTES) {
    throw new RequestBodyError('Request body is too large.', 413)
  }

  const reader = request.body?.getReader()
  if (!reader) throw new RequestBodyError('Invalid request.', 400)

  const decoder = new TextDecoder()
  let received = 0
  let raw = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    received += value.byteLength
    if (received > MAX_PUBLIC_JSON_BYTES) {
      await reader.cancel()
      throw new RequestBodyError('Request body is too large.', 413)
    }
    raw += decoder.decode(value, { stream: true })
  }
  raw += decoder.decode()

  try {
    return JSON.parse(raw)
  } catch {
    throw new RequestBodyError('Invalid request.', 400)
  }
}

export { MAX_PUBLIC_JSON_BYTES }
