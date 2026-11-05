import type { Metadata } from 'next'
import { CheckGrid } from '@/components/diagnostics/CheckGrid'
import { FeatureGrid } from '@/components/dorabotka/FeatureGrid'
import { IntegrationGrid } from '@/components/dorabotka/IntegrationGrid'
import { ProofSide } from '@/components/dorabotka/ProofSide'
import { LeadButton } from '@/components/lead/LeadButton'
import { CaseCard } from '@/components/sections/CaseCard'
import { PageHero } from '@/components/sections/PageHero'
import { ReportSample } from '@/components/sections/ReportSample'
import { SectionShell } from '@/components/sections/SectionShell'
import { StageTable } from '@/components/sections/StageTable'
import { Icon } from '@/components/ui/Icon'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { TextLink } from '@/components/ui/TextLink'
import { toImage } from '@/lib/media'
import { ROUTES } from '@/lib/navigation'
import { getPageGlobal } from '@/lib/queries'
import styles from './page.module.css'

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageGlobal('dorabotka')
  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    alternates: { canonical: ROUTES.dorabotka },
  }
}

export default async function DorabotkaPage() {
  const page = await getPageGlobal('dorabotka', [
    'hero',
    'work',
    'integrations',
    'audit',
    'format',
    'proof',
  ])

  const { hero, work, integrations, audit, format, proof } = page

  // depth 1 из getPageGlobal: связи приходят документами, id значит, что запись удалена
  const cases = (proof.cases ?? []).filter((item) => typeof item === 'object')
  const review = typeof proof.review === 'object' ? proof.review : null
  const publication = typeof proof.publication === 'object' ? proof.publication : null

  return (
    <main className={styles.page}>
      <PageHero
        visual="dorabotka"
        title={hero.title}
        lead={hero.lead}
        breadcrumbs={[{ label: hero.breadcrumb }]}
      />

      <SectionShell>
        <SectionHeader title={work.title} lead={work.lead} />
        <FeatureGrid items={work.items} />
      </SectionShell>

      <div className={styles.band}>
        <SectionShell>
          <SectionHeader title={integrations.title} lead={integrations.lead} />
          <IntegrationGrid items={integrations.items} />
        </SectionShell>
      </div>

      <SectionShell>
        <SectionHeader title={audit.title} lead={audit.lead} />
        <CheckGrid items={audit.checks} columns={4} />
        <ReportSample {...audit.sample} />
        <LeadButton source="dorabotka-audit" fill>
          {audit.buttonLabel}
        </LeadButton>
      </SectionShell>

      <SectionShell inverse>
        <div className={styles.formatTop}>
          <SectionHeader title={format.title} lead={format.lead} />
          <ul className={styles.principles}>
            {format.principles?.map((item) => (
              <li key={item.text} className={`body-m ${styles.principle}`}>
                <Icon slug="task-alt" size={24} className={styles.marker} />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <StageTable {...format.table} />
      </SectionShell>

      <SectionShell>
        <div className={styles.proofHead}>
          <SectionHeader
            title={proof.title}
            action={<TextLink href={ROUTES.cases}>{proof.allLabel}</TextLink>}
          />
        </div>
        <div className={styles.proofRow}>
          <div className={styles.proofCases}>
            {cases.map((item) => (
              <CaseCard
                key={item.id}
                title={item.title}
                href={`${ROUTES.cases}/${item.slug}`}
                metric={item.metric}
                before={item.before}
                after={item.after}
                result={item.result}
                task={item.task}
                done={item.done}
                labels={proof.labels}
              />
            ))}
          </div>
          <ProofSide
            review={review}
            publication={
              publication && {
                ...publication,
                cover: toImage(publication.cover),
              }
            }
            closeLabel={proof.closeLabel}
          />
        </div>
      </SectionShell>
    </main>
  )
}
