import type { Metadata } from 'next'
import { ContactsBlock } from '@/components/about/ContactsBlock'
import { StatsCard } from '@/components/about/StatsCard'
import { StatusCards } from '@/components/about/StatusCards'
import { PageHead } from '@/components/cases/PageHead'
import { Team } from '@/components/home/Team'
import { ReviewCarousel } from '@/components/sections/ReviewCarousel'
import { SectionShell } from '@/components/sections/SectionShell'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ROUTES } from '@/lib/navigation'
import { getCookieBanner, getPageGlobal, getSettings, getTeam } from '@/lib/queries'
import { getAllReviews } from './queries'
import styles from './page.module.css'

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageGlobal('about')
  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    alternates: { canonical: ROUTES.about },
  }
}

export default async function AboutPage() {
  const [about, settings, team, reviews, cookie] = await Promise.all([
    getPageGlobal('about', ['hero', 'team', 'status', 'reviews', 'contacts']),
    getSettings(),
    getTeam(),
    getAllReviews(),
    getCookieBanner(),
  ])

  const { hero, stats, status, contacts } = about

  return (
    <main className={styles.page}>
      <div className={`wrap ${styles.intro}`}>
        <PageHead crumbs={[{ label: hero.breadcrumb }]} title={hero.title} lead={hero.lead} />
        {stats && stats.length > 0 && <StatsCard stats={stats} />}
      </div>

      <SectionShell>
        <Team title={about.team.title} lead={about.team.lead} members={team} />
      </SectionShell>

      <SectionShell>
        <SectionHeader title={status.title} />
        <StatusCards items={status.items} />
      </SectionShell>

      <SectionShell>
        <ReviewCarousel title={about.reviews.title} lead={about.reviews.lead} reviews={reviews} />
      </SectionShell>

      <SectionShell id="contacts">
        <SectionHeader title={contacts.title} />
        <ContactsBlock {...contacts} settings={settings} consentVersion={cookie.version} />
      </SectionShell>
    </main>
  )
}
