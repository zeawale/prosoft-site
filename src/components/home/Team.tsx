import { QuoteBlock } from '@/components/sections/QuoteBlock'
import { TeamCard } from '@/components/sections/TeamCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { toImage } from '@/lib/media'
import type { Team as TeamMember } from '@/payload-types'
import styles from './Team.module.css'

type Props = {
  title: string
  lead?: string | null
  members: TeamMember[]
}

/** Блок «Команда»: цитата основателя. Карточки остальных есть только в кадре телефона */
export function Team({ title, lead, members }: Props) {
  const founder = members.find((member) => member.isFounder)
  const others = members.filter((member) => !member.isFounder)

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

      <div className={styles.row}>
        {others.map((member) => (
          <TeamCard
            key={member.id}
            photo={toImage(member.photo)}
            name={member.name}
            role={member.role}
            quote={member.quote}
          />
        ))}
      </div>
    </>
  )
}
