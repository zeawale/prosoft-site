import { getSettings } from '@/lib/queries'
import { HeaderBar } from './HeaderBar'

/** Серверная обёртка: телефон из реквизитов, вся логика в HeaderBar */
export async function Header() {
  const settings = await getSettings()
  return <HeaderBar phone={settings.phone} phoneRaw={settings.phoneRaw ?? settings.phone} />
}
