import type { Metadata } from 'next'
import { Proof } from '@/components/erp/Proof'
import { RequestHeroButton } from '@/components/lead/RequestHeroButton'
import { ProcessMap } from '@/components/erp/ProcessMap'
import { ErpOrKa } from '@/components/sections/ErpOrKa'
import { Faq } from '@/components/sections/Faq'
import { PageHero } from '@/components/sections/PageHero'
import { SectionShell } from '@/components/sections/SectionShell'
import { StageTable } from '@/components/sections/StageTable'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ROUTES } from '@/lib/navigation'
import { getPageGlobal } from '@/lib/queries'
import type { Case } from '@/payload-types'
import styles from './page.module.css'

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPageGlobal('erp')
  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    alternates: { canonical: ROUTES.erp },
  }
}

const caseOf = (item: number | Case | null | undefined) =>
  item && typeof item === 'object' ? item : null

export default async function ErpPage() {
  const erp = await getPageGlobal('erp', ['hero', 'erpOrKa', 'faq'])
  const { hero, erpOrKa, map, stages, proof, faq } = erp

  return (
    <main className={styles.page}>
      <PageHero
        visual="erp"
        title={hero.title}
        lead={hero.lead}
        breadcrumbs={[{ label: hero.breadcrumb }]}
        actions={
          <RequestHeroButton source="erp-hero" label={hero.ctaLabel} comment={hero.ctaComment} />
        }
      />

      <SectionShell>
        <ErpOrKa {...erpOrKa} source="erp-erp-or-ka" layout="full" />
      </SectionShell>

      <SectionShell>
        <SectionHeader title={map.title} lead={map.lead} />
        <ProcessMap
          integrationsTitle={map.integrationsTitle}
          integrations={map.integrations}
          nodePrefix={map.nodePrefix}
          subsystemLabel={map.subsystemLabel}
          benefitLabel={map.benefitLabel}
          caseLabel={map.caseLabel}
          nodes={(map.nodes ?? []).map((node) => {
            const related = caseOf(node.relatedCase)
            return {
              icon: node.icon,
              title: node.title,
              subsystem: node.subsystem,
              benefit: node.benefit,
              caseHref: related && `${ROUTES.cases}/${related.slug}`,
              caseLink: node.caseLink || related?.title,
              openByDefault: node.openByDefault,
            }
          })}
        />
      </SectionShell>

      <SectionShell inverse>
        <SectionHeader title={stages.title} lead={stages.lead} />
        <StageTable {...stages.table} />
      </SectionShell>

      <SectionShell>
        <Proof
          title={proof.title}
          allLabel={proof.allLabel}
          cases={proof.cases.filter((item): item is Case => typeof item === 'object')}
          labels={proof.labels}
        />
      </SectionShell>

      <Faq {...faq} />
      <FaqJsonLd items={faq.items ?? []} />
    </main>
  )
}
