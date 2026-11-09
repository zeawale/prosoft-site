import type { Metadata } from 'next'
import { FeatureGrid } from '@/components/dorabotka/FeatureGrid'
import { PageHero } from '@/components/sections/PageHero'
import { SectionShell } from '@/components/sections/SectionShell'
import { StageTable } from '@/components/sections/StageTable'
import { SlaTable } from '@/components/support/SlaTable'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ROUTES } from '@/lib/navigation'
import { getPageGlobal } from '@/lib/queries'
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
  const page = await getPageGlobal('support', ['hero', 'included', 'sla', 'handover'])
  const { hero, included, sla, handover } = page

  return (
    <main className={`${styles.page} ${styles.endsDark}`}>
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
    </main>
  )
}
