import type { Metadata } from 'next'
import { FeatureGrid } from '@/components/dorabotka/FeatureGrid'
import { PageHero } from '@/components/sections/PageHero'
import { SectionShell } from '@/components/sections/SectionShell'
import { StageTable } from '@/components/sections/StageTable'
import { LeadPerson } from '@/components/support/LeadPerson'
import { SlaTable } from '@/components/support/SlaTable'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { TextLink } from '@/components/ui/TextLink'
import { toImage } from '@/lib/media'
import { ROUTES } from '@/lib/navigation'
import { getPageGlobal, getTeam } from '@/lib/queries'
import styles from './page.module.css'

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageGlobal('support')
  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    alternates: { canonical: ROUTES.support },
  }
}

export default async function SupportPage() {
  const [page, members] = await Promise.all([
    getPageGlobal('support', ['hero', 'included', 'sla', 'handover', 'team']),
    getTeam(),
  ])

  const { hero, included, sla, handover, team } = page

  // Связь глобала отдаёт сотрудника без фото: глубина 1 до Media не достаёт
  const personId = typeof team.person === 'object' ? team.person.id : team.person
  const person = members.find((member) => member.id === personId)

  return (
    <main className={styles.page}>
      <PageHero
        visual="support"
        title={hero.title}
        lead={hero.lead}
        breadcrumbs={[{ label: hero.breadcrumb }]}
      />

      <SectionShell>
        <SectionHeader title={included.title} lead={included.lead} />
        <FeatureGrid items={included.items} columns={4} />
      </SectionShell>

      <SectionShell>
        <SectionHeader title={sla.title} lead={sla.lead} />
        <SlaTable {...sla} />
      </SectionShell>

      <SectionShell inverse>
        <SectionHeader title={handover.title} lead={handover.lead} />
        <StageTable {...handover.table} />
      </SectionShell>

      <SectionShell>
        <div className={styles.team}>
          <div className={styles.teamHead}>
            <SectionHeader title={team.title} lead={team.lead} />
            <div className={styles.teamLink}>
              <TextLink href={ROUTES[team.linkRoute]}>{team.linkLabel}</TextLink>
            </div>
          </div>
          {person && (
            <div className={styles.teamCard}>
              <LeadPerson
                photo={toImage(person.photo)}
                name={person.name}
                role={person.role}
                quote={person.quote}
              />
            </div>
          )}
        </div>
      </SectionShell>
    </main>
  )
}
