/**
 * Кладёт woff2 Onest и IBM Plex Mono из npm-пакетов в public/fonts.
 *
 * Зачем копия, а не импорт CSS пакета: при импорте Next выдаёт файлам
 * хешированные имена, известные только после сборки, а <link rel="preload">
 * нужно написать до неё. Стабильный путь в public — единственный способ
 * получить preload.
 *
 * Файлы лежат в репозитории, чтобы сайт собирался, даже если скрипт не
 * отработал. Скрипт висит на prebuild.
 */
import { copyFile, mkdir, readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(import.meta.url)
const outDir = path.resolve(process.cwd(), 'public/fonts')

const sets = [
  {
    pkg: '@fontsource-variable/onest',
    files: ['cyrillic', 'cyrillic-ext', 'latin', 'latin-ext'].map(
      (subset) => `onest-${subset}-wght-normal.woff2`,
    ),
  },
  {
    pkg: '@fontsource/ibm-plex-mono',
    files: ['cyrillic', 'latin', 'latin-ext'].flatMap((subset) =>
      ['400', '500'].map((weight) => `ibm-plex-mono-${subset}-${weight}-normal.woff2`),
    ),
  },
]

await mkdir(outDir, { recursive: true })

let changed = 0
for (const { pkg, files } of sets) {
  const srcDir = path.join(path.dirname(require.resolve(`${pkg}/package.json`)), 'files')

  for (const file of files) {
    const from = path.join(srcDir, file)
    const to = path.join(outDir, file)

    // Сравниваем содержимое, а не даты: иначе каждая установка зависимостей
    // делает вид, что шрифты изменились
    const same = await readFile(to)
      .then(async (existing) => existing.equals(await readFile(from)))
      .catch(() => false)

    if (same) continue

    await copyFile(from, to)
    changed++
    console.log(`copy-fonts: ${file}`)
  }
}

console.log(
  changed ? `copy-fonts: обновлено файлов — ${changed}` : 'copy-fonts: шрифты уже актуальны',
)
