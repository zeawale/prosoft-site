'use server'

import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { CONSENT_VERSION_FALLBACK } from '@/lib/consent'
import { getConsentVersion } from '@/lib/queries'
import { phoneProblem } from '@/lib/leads'
import type { LeadResult } from '@/lib/leads'

export async function submitLead(formData: FormData): Promise<LeadResult> {
  const name = String(formData.get('name') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const company = String(formData.get('company') ?? '').trim()
  const comment = String(formData.get('comment') ?? '').trim()
  const details = String(formData.get('details') ?? '').trim()
  const consent = formData.get('consent') === 'on'
  const page = String(formData.get('page') ?? '').trim() || 'unknown'

  const fieldErrors: Record<string, string> = {}

  // Обязателен только телефон: имя и компанию человек может не указывать
  const phoneError = phoneProblem(phone)
  if (phoneError) {
    fieldErrors.phone = phoneError
  }

  if (name.length > 200) {
    fieldErrors.name = 'Слишком длинно, сократите до 200 знаков'
  }

  if (company.length > 200) {
    fieldErrors.company = 'Слишком длинно, сократите до 200 знаков'
  }

  if (comment.length > 2000) {
    fieldErrors.comment = 'Комментарий слишком длинный, сократите до 2000 знаков'
  }

  if (!consent) {
    fieldErrors.consent = 'Без согласия не сможем принять заявку. Отметьте пункт выше'
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, kind: 'validation', fieldErrors }
  }

  try {
    const headersList = await headers()
    const forwarded = headersList.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0]?.trim() || headersList.get('x-real-ip') || ''

    const payload = await getPayload({ config })

    // Версия берётся из самого документа согласия: он правится в админке,
    // и константа в коде отстала бы от текста, под которым человек ставит
    // галочку. Фолбэк — на случай, когда документа ещё нет в базе
    const consentVersion = (await getConsentVersion()) ?? CONSENT_VERSION_FALLBACK

    await payload.create({
      collection: 'leads',
      data: {
        name: name || undefined,
        phone,
        company: company || undefined,
        comment: comment || undefined,
        details: details || undefined,
        status: 'new',
        page,
        consentAt: new Date().toISOString(),
        consentIp: ip,
        consentVersion,
      },
    })

    return { ok: true }
  } catch (err) {
    console.error('[submitLead]', err)
    return { ok: false, kind: 'failed' }
  }
}
