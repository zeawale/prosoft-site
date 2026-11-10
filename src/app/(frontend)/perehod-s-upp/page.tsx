import type { Metadata } from 'next'
import config from '@payload-config'
import { getPayload } from 'payload'
import { RequestHeroButton } from '@/components/lead/RequestHeroButton'
import { DateStrip } from '@/components/sections/DateStrip'
import { ErpOrKa } from '@/components/sections/ErpOrKa'
import { Faq } from '@/components/sections/Faq'
import { PageHero } from '@/components/sections/PageHero'
import { SectionShell } from '@/components/sections/SectionShell'
import { StageTable } from '@/components/sections/StageTable'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Proof } from '@/components/upp/Proof'
import { Scenarios } from '@/components/upp/Scenarios'
import { toImage } from '@/lib/media'
import { ROUTES } from '@/lib/navigation'
import { getPageGlobal } from '@/lib/queries'
import type { Case, Publication } from '@/payload-types'
import styles from './page.module.css'

const SCENARIOS_ID = 'scenarios'

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageGlobal('upp')
  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    alternates: { canonical: ROUTES.upp },
  }
}

/** Глобал приходит с depth 1: вебинар уже документ, но его обложка ещё id */
async function getWebinar(webinar: number | Publication | null | undefined) {
  if (!webinar) return null
  const payload = await getPayload({ config })
  const id = typeof webinar === 'object' ? webinar.id : webinar
  return payload.findByID({ collection: 'publications', id, depth: 1 })
}

export default async function UppPage() {
  const upp = await getPageGlobal('upp', ['hero', 'dateStrip', 'erpOrKa', 'faq'])
  const { hero, dateStrip, scenarios, erpOrKa, transition, proof, faq } = upp
  const webinar = await getWebinar(proof.webinar)

  return (
    <main className={styles.page}>
      <PageHero
        visual="upp"
        title={hero.title}
        lead={hero.lead}
        breadcrumbs={[{ label: hero.breadcrumb }]}
        actions={
          <RequestHeroButton source="upp-hero" label={hero.ctaLabel} comment={hero.ctaComment} />
        }
        below={<DateStrip {...dateStrip} linkHref={`#${SCENARIOS_ID}`} />}
      />

      <SectionShell id={SCENARIOS_ID}>
        <Scenarios {...scenarios} />
      </SectionShell>

      <SectionShell>
        <ErpOrKa {...erpOrKa} source="upp-erp-or-ka" />
      </SectionShell>

      <SectionShell inverse>
        <SectionHeader title={transition.title} lead={transition.lead} />
        <StageTable {...transition.table} />
      </SectionShell>

      <SectionShell>
        <Proof
          title={proof.title}
          allLabel={proof.allLabel}
          cases={proof.cases.filter((item): item is Case => typeof item === 'object')}
          tag={proof.tag}
          labels={proof.labels}
          webinar={
            webinar && {
              source: webinar.source,
              title: webinar.title,
              speaker: webinar.author,
              duration: webinar.duration,
              caption: webinar.caption,
              cover: toImage(proof.webinarCover) ?? toImage(webinar.cover),
              url: webinar.url,
              intro: proof.webinarIntro,
              timecodes: proof.timecodes,
              publication: { ...webinar, cover: toImage(webinar.cover) },
              closeLabel: proof.webinarCloseLabel,
            }
          }
        />
      </SectionShell>

      <Faq {...faq} />
      <FaqJsonLd items={faq.items ?? []} />
    </main>
  )
}
