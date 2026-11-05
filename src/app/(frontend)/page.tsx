import type { Metadata } from 'next'
import { Publications } from '@/components/home/Publications'
import { PainCheck } from '@/components/home/PainCheck'
import { Services } from '@/components/home/Services'
import { Team } from '@/components/home/Team'
import { LeadButton } from '@/components/lead/LeadButton'
import { CaseCard } from '@/components/sections/CaseCard'
import { DateStrip } from '@/components/sections/DateStrip'
import { DiagnosticsOffer } from '@/components/sections/DiagnosticsOffer'
import { Faq } from '@/components/sections/Faq'
import { PageHero } from '@/components/sections/PageHero'
import { ReviewCarousel } from '@/components/sections/ReviewCarousel'
import { SectionShell } from '@/components/sections/SectionShell'
import { StageTable } from '@/components/sections/StageTable'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { Button } from '@/components/ui/Button'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { TextLink } from '@/components/ui/TextLink'
import { toImage } from '@/lib/media'
import { ROUTES } from '@/lib/navigation'
import {
  getHomeCases,
  getHomePublications,
  getHomeReviews,
  getPageGlobal,
  getTeam,
} from '@/lib/queries'
import styles from './page.module.css'

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageGlobal('home')
  return {
    // absolute: бренд уже в заголовке, шаблон « | ПРО-СОФТ» здесь не нужен
    title: { absolute: seo.metaTitle },
    description: seo.metaDescription,
    alternates: { canonical: ROUTES.home },
  }
}

export default async function HomePage() {
  const [home, cases, team, reviews, publications] = await Promise.all([
    getPageGlobal('home', ['hero', 'dateStrip', 'diagnostics', 'faq']),
    getHomeCases(),
    getTeam(),
    getHomeReviews(),
    getHomePublications(),
  ])

  const { hero, dateStrip, diagnostics, painCheck, services, stages, faq } = home

  return (
    <main className={styles.page}>
      <PageHero
        visual="home"
        title={hero.title}
        lead={hero.lead}
        facts={hero.facts}
        actions={
          <>
            <LeadButton source="home-hero">{hero.primaryLabel}</LeadButton>
            {hero.secondaryLabel && hero.secondaryRoute && (
              <Button variant="secondary" href={ROUTES[hero.secondaryRoute]}>
                {hero.secondaryLabel}
              </Button>
            )}
          </>
        }
        below={<DateStrip {...dateStrip} />}
        belowGap={96}
      />

      <DiagnosticsOffer {...diagnostics} source="home-diagnostics" />

      <SectionShell>
        <PainCheck {...painCheck} />
      </SectionShell>

      <SectionShell id="services">
        <Services {...services} />
      </SectionShell>

      <SectionShell inverse>
        <SectionHeader title={stages.title} lead={stages.lead} />
        <StageTable {...stages.table} />
      </SectionShell>

      <SectionShell>
        <div className={styles.casesHead}>
          <SectionHeader
            title={home.cases.title}
            lead={home.cases.lead}
            action={<TextLink href={ROUTES.cases}>{home.cases.allLabel}</TextLink>}
          />
        </div>
        <div className={styles.cases}>
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
              labels={home.cases.labels}
            />
          ))}
        </div>
      </SectionShell>

      <SectionShell>
        <Team title={home.team.title} lead={home.team.lead} members={team} />
      </SectionShell>

      <SectionShell>
        <ReviewCarousel
          title={home.reviews.title}
          lead={home.reviews.lead}
          reviews={reviews}
          allLabel={home.reviews.allLabel}
          collapseLabel={home.reviews.collapseLabel}
          moreLabel={home.reviews.moreLabel}
          lessLabel={home.reviews.lessLabel}
        />
      </SectionShell>

      <Publications
        {...home.publications}
        publications={publications.map((item) => ({ ...item, cover: toImage(item.cover) }))}
      />

      <Faq {...faq} />
      <FaqJsonLd items={faq.items ?? []} />
    </main>
  )
}
