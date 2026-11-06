import { QuoteBlock } from '@/components/sections/QuoteBlock'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { toImage } from '@/lib/media'
import type { Team as TeamMember } from '@/payload-types'

type Props = {
  title: string
  lead?: string | null
  members: TeamMember[]
}

/** Блок основателя на главной и «О компании» */
export function Team({ title, lead, members }: Props) {
  const founder = members.find((member) => member.isFounder)

  return (
    <>
      <SectionHeader title={title} lead={lead} />

      {founder && (
        <QuoteBlock
          photo={toImage(founder.photo)}
          quote={founder.quote ?? ''}
          name={founder.name}
          role={founder.role}
          links={founder.links}
        />
      )}
    </>
  )
}
