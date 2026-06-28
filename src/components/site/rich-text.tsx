import * as React from 'react'
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import { cn } from '@/lib/utils'

type LexicalData = React.ComponentProps<typeof LexicalRichText>['data']

/**
 * Renders Payload Lexical rich-text. Returns null when there is no content so
 * callers can show their own fallback copy.
 */
export const RichText = ({
  data,
  className,
}: {
  data: unknown
  className?: string
}) => {
  if (!data || typeof data !== 'object') return null
  return (
    <div className={cn('prose-breeder', className)}>
      <LexicalRichText data={data as LexicalData} />
    </div>
  )
}
