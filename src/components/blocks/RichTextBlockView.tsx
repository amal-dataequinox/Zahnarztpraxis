import type { SerializedEditorState, SerializedLexicalNode } from '@payloadcms/richtext-lexical/lexical'
import React from 'react'

import { LexicalRichText } from '@/components/cms/LexicalRichText'
import { Reveal } from '@/components/motion/Reveal'
import { Container, Stack } from '@/design-system'
import { cn } from '@/design-system/lib/cn'
import type { RichTextBlock } from '@/payload-types'

type Props = { block: RichTextBlock }

type LexicalSection = {
  title?: string
  nodes: SerializedLexicalNode[]
}

function extractNodeText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const record = node as { text?: string; children?: unknown[] }
  if (typeof record.text === 'string') return record.text
  if (Array.isArray(record.children)) {
    return record.children.map(extractNodeText).join('')
  }
  return ''
}

function wrapLexical(nodes: SerializedLexicalNode[]): SerializedEditorState {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: nodes,
    },
  }
}

function splitLexicalByHeadings(data: SerializedEditorState | null | undefined): {
  introNodes: SerializedLexicalNode[]
  sections: LexicalSection[]
} {
  const children = data?.root?.children
  if (!Array.isArray(children) || children.length === 0) {
    return { introNodes: [], sections: [] }
  }

  const introNodes: SerializedLexicalNode[] = []
  const sections: LexicalSection[] = []
  let current: LexicalSection | null = null

  children.forEach((node, idx) => {
    const typed = node as SerializedLexicalNode & { type?: string; tag?: string }
    const isH2 = typed.type === 'heading' && typed.tag === 'h2'
    const isH3 = typed.type === 'heading' && typed.tag === 'h3'

    // Treat top-level initial H2 followed immediately by paragraphs before first H3 as intro banner
    if (idx === 0 && isH2) {
      introNodes.push(node)
      return
    }

    if (isH2 || isH3) {
      if (current && current.nodes.length > 0) {
        sections.push(current)
      }
      current = {
        title: extractNodeText(node).trim(),
        nodes: [],
      }
      return
    }

    if (current) {
      current.nodes.push(node)
    } else {
      introNodes.push(node)
    }
  })

  if (current && (current as LexicalSection).nodes.length > 0) {
    sections.push(current)
  }

  return { introNodes, sections }
}

export function RichTextBlockView({ block }: Props) {
  const appearance =
    (block as { appearance?: string | null }).appearance || 'editorial-card'
  const eyebrow = (block as { eyebrow?: string | null }).eyebrow
  const sidebarTitle = (block as { sidebarTitle?: string | null }).sidebarTitle
  const sidebarText = (block as { sidebarText?: string | null }).sidebarText
  const editorState = block.content as SerializedEditorState

  if (appearance === 'plain') {
    return (
      <section className="py-[var(--section-y)] bg-[#f7faf9]">
        <Container size="md">
          <Reveal>
            <div className="editorial-prose-card">
              <LexicalRichText data={editorState} />
            </div>
          </Reveal>
        </Container>
      </section>
    )
  }

  if (appearance === 'bento-sections') {
    const { introNodes, sections } = splitLexicalByHeadings(editorState)
    const bentoCards = sections.filter((s) =>
      s.nodes.some((n) => (n as { type?: string }).type === 'list'),
    )
    const trailingNotes = sections.filter(
      (s) => !s.nodes.some((n) => (n as { type?: string }).type === 'list'),
    )
    const useThreeCols = bentoCards.length >= 3

    return (
      <section className="py-[var(--section-y)] bg-[#f7faf9] border-b border-black/[0.06]">
        <Container>
          <Stack gap="8">
            {introNodes.length > 0 ? (
              <Reveal>
                <div className="editorial-prose-card">
                  {eyebrow ? (
                    <span className="palatty-pill-eyebrow mb-4">
                      <span className="palatty-pill-dot" aria-hidden="true" />
                      {eyebrow}
                    </span>
                  ) : null}
                  <LexicalRichText
                    data={wrapLexical(introNodes)}
                    className="max-w-none [&_h2]:mt-0 [&_h2]:text-2xl sm:[&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:text-[#0e2a2f]"
                  />
                </div>
              </Reveal>
            ) : null}

            {bentoCards.length > 0 ? (
              <Reveal variant="stagger">
                <div
                  className={cn(
                    'richtext-bento-grid',
                    useThreeCols && 'richtext-bento-grid--three',
                  )}
                >
                  {bentoCards.map((sec, idx) => (
                    <article
                      key={`${sec.title || 'sec'}-${idx}`}
                      className={cn(
                        'appenzell-reveal-item richtext-bento-card editorial-prose-card p-6 sm:p-7',
                        idx === bentoCards.length - 1 && 'richtext-bento-card--accent',
                      )}
                    >
                      <span className="care-pillar-eyebrow">
                        {String(idx + 1).padStart(2, '0')} /{' '}
                        {(sec.title || 'DETAILS').toUpperCase()}
                      </span>
                      {sec.title ? (
                        <h3 className="mt-3 mb-3 font-display text-xl font-semibold text-[#0e2a2f]">
                          {sec.title}
                        </h3>
                      ) : null}
                      <LexicalRichText
                        data={wrapLexical(sec.nodes)}
                        className="max-w-none text-[0.94rem] leading-relaxed text-[#496064] [&_ul]:mt-1"
                      />
                    </article>
                  ))}
                </div>
              </Reveal>
            ) : null}

            {trailingNotes.map((sec, idx) => (
              <Reveal key={`note-${idx}`}>
                <div className="rounded-2xl border border-black/[0.08] bg-white px-6 py-5 font-sans text-sm leading-relaxed text-[#4f6468]">
                  {sec.title ? (
                    <p className="mt-0 mb-1 font-semibold text-[#0e2a2f]">{sec.title}</p>
                  ) : null}
                  <LexicalRichText data={wrapLexical(sec.nodes)} className="max-w-none [&_p]:mt-0" />
                </div>
              </Reveal>
            ))}
          </Stack>
        </Container>
      </section>
    )
  }

  if (appearance === 'urgent-split') {
    const { introNodes, sections } = splitLexicalByHeadings(editorState)

    return (
      <section className="py-[var(--section-y)] bg-[#f7faf9] border-b border-black/[0.06]">
        <Container>
          <Stack gap="8">
            {introNodes.length > 0 ? (
              <Reveal>
                <div className="editorial-prose-card">
                  <span className="palatty-pill-eyebrow mb-4">
                    <span className="palatty-pill-dot" aria-hidden="true" />
                    {eyebrow || 'Akute Hilfe'}
                  </span>
                  <LexicalRichText
                    data={wrapLexical(introNodes)}
                    className="max-w-none [&_h2]:mt-0 [&_h2]:text-2xl sm:[&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:text-[#0e2a2f]"
                  />
                </div>
              </Reveal>
            ) : null}

            {sections.length > 0 ? (
              <Reveal variant="stagger">
                <div className="richtext-bento-grid">
                  {sections.map((sec, idx) => (
                    <article
                      key={`${sec.title || 'urgent'}-${idx}`}
                      className={cn(
                        'appenzell-reveal-item richtext-bento-card editorial-prose-card',
                        idx === sections.length - 1 && 'richtext-bento-card--accent',
                      )}
                    >
                      <span className="care-pillar-eyebrow">
                        {String(idx + 1).padStart(2, '0')} /{' '}
                        {idx === 0 ? 'SOFORTMASSNAHMEN' : 'WICHTIGER HINWEIS'}
                      </span>
                      {sec.title ? (
                        <h3 className="mt-3 mb-3 font-display text-2xl font-semibold text-[#0e2a2f]">
                          {sec.title}
                        </h3>
                      ) : null}
                      <LexicalRichText
                        data={wrapLexical(sec.nodes)}
                        className="max-w-none text-[0.96rem] leading-relaxed text-[#364e52] [&_ul]:mt-1"
                      />
                    </article>
                  ))}
                </div>
              </Reveal>
            ) : null}
          </Stack>
        </Container>
      </section>
    )
  }

  // Default: 'editorial-card' (Impressum, Datenschutz, general rich pages)
  const headingNodes = (editorState?.root?.children ?? []).filter(
    (n) => (n as { type?: string; tag?: string }).type === 'heading' && (n as { tag?: string }).tag === 'h2',
  )
  const sectionTitles = headingNodes.map(extractNodeText).filter(Boolean)

  return (
    <section className="py-[var(--section-y)] bg-[#f7faf9] border-b border-black/[0.06]">
      <Container>
        <div
          className={cn(
            'grid gap-8 items-start',
            (sidebarTitle || sidebarText || sectionTitles.length > 1) &&
              'lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-12',
          )}
        >
          <Reveal>
            <div className="editorial-prose-card">
              {eyebrow ? (
                <span className="palatty-pill-eyebrow mb-4">
                  <span className="palatty-pill-dot" aria-hidden="true" />
                  {eyebrow}
                </span>
              ) : null}
              <LexicalRichText
                data={editorState}
                className="max-w-none [&_h2]:mt-8 [&_h2:first-child]:mt-0 [&_h2]:border-t [&_h2]:border-black/[0.07] [&_h2]:pt-6 [&_h2:first-child]:border-t-0 [&_h2:first-child]:pt-0 [&_h2]:font-semibold [&_h2]:text-[#0e2a2f]"
              />
            </div>
          </Reveal>

          {sidebarTitle || sidebarText || sectionTitles.length > 1 ? (
            <aside className="contact-hub-card contact-hub-card--accent lg:sticky lg:top-28">
              <Stack gap="4">
                <span className="palatty-pill-eyebrow">
                  <span className="palatty-pill-dot" aria-hidden="true" />
                  {eyebrow || 'Übersicht'}
                </span>
                {sidebarTitle ? (
                  <h3 className="m-0 font-display text-xl font-semibold text-[#0e2a2f]">
                    {sidebarTitle}
                  </h3>
                ) : null}
                {sidebarText ? (
                  <p className="m-0 font-sans text-sm leading-relaxed text-[#496064]">
                    {sidebarText}
                  </p>
                ) : null}
                {sectionTitles.length > 1 ? (
                  <ul className="m-0 list-none space-y-2 border-t border-black/[0.08] pt-4 p-0">
                    {sectionTitles.map((t, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2.5 font-sans text-sm text-[#364e52]"
                      >
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: 'var(--color-accent)' }}
                          aria-hidden="true"
                        />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Stack>
            </aside>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
