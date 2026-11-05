import type { Metadata } from 'next'
import { CheckGrid } from '@/components/diagnostics/CheckGrid'
import { Quiz } from '@/components/diagnostics/Quiz'
import { LeadButton } from '@/components/lead/LeadButton'
import { PageHero } from '@/components/sections/PageHero'
import { ReportSample } from '@/components/sections/ReportSample'
import { SectionShell } from '@/components/sections/SectionShell'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ROUTES } from '@/lib/navigation'
import { getPageGlobal, getSettings } from '@/lib/queries'
import styles from './page.module.css'

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageGlobal('diagnostics')
  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    alternates: { canonical: ROUTES.diagnostics },
  }
}

export default async function DiagnosticsPage() {
  const [page, settings] = await Promise.all([
    getPageGlobal('diagnostics', ['hero', 'checks', 'report', 'quiz']),
    getSettings(),
  ])

  const { hero, checks, report, quiz } = page

  return (
    <main className={styles.page}>
      <PageHero
        visual="diagnostics"
        title={hero.title}
        lead={hero.lead}
        breadcrumbs={[{ label: hero.breadcrumb }]}
      />

      <SectionShell>
        <SectionHeader title={checks.title} lead={checks.lead} />
        <CheckGrid items={checks.items} />
      </SectionShell>

      <SectionShell>
        <SectionHeader title={report.title} lead={report.lead} />
        <ReportSample {...report.sample} />
        <LeadButton source="diagnostics-report" fill>
          {report.buttonLabel}
        </LeadButton>
      </SectionShell>

      <Quiz {...quiz} source="diagnostics-quiz" phone={settings.phone} />
    </main>
  )
}
