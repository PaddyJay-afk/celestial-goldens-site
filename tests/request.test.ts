import { describe, expect, it } from 'vitest'
import { MAX_PUBLIC_JSON_BYTES, parsePublicJson } from '@/lib/request'

const requestWithJson = (body: string, contentType = 'application/json') =>
  new Request('http://localhost/api/test', {
    method: 'POST',
    headers: { 'content-type': contentType },
    body,
  })

describe('parsePublicJson', () => {
  it('parses valid JSON requests', async () => {
    await expect(parsePublicJson(requestWithJson('{"message":"hello"}'))).resolves.toEqual({ message: 'hello' })
  })

  it('rejects unsupported content types', async () => {
    const result = parsePublicJson(requestWithJson('message=hello', 'application/x-www-form-urlencoded'))
    await expect(result).rejects.toMatchObject({ status: 415 })
  })

  it('rejects malformed JSON', async () => {
    const result = parsePublicJson(requestWithJson('{invalid'))
    await expect(result).rejects.toMatchObject({ status: 400 })
  })

  it('rejects oversized requests from Content-Length before parsing', async () => {
    const result = parsePublicJson(
      new Request('http://localhost/api/test', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'content-length': String(MAX_PUBLIC_JSON_BYTES + 1),
        },
        body: '{}',
      }),
    )
    await expect(result).rejects.toMatchObject({ status: 413 })
  })

  it('rejects oversized chunked request bodies without a Content-Length header', async () => {
    const payload = JSON.stringify({ message: 'x'.repeat(MAX_PUBLIC_JSON_BYTES) })
    const result = parsePublicJson(
      new Request(
        'http://localhost/api/test',
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: new ReadableStream({
            start(controller) {
              controller.enqueue(new TextEncoder().encode(payload))
              controller.close()
            },
          }),
          duplex: 'half',
        } as unknown as RequestInit,
      ),
    )
    await expect(result).rejects.toMatchObject({ status: 413 })
  })
})
