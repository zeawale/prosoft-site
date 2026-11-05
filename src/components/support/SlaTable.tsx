import styles from './SlaTable.module.css'

type Props = {
  requestLabel: string
  reactionLabel: string
  solutionLabel: string
  hoursLabel: string
  rows?: { request: string; reaction: string; solution: string; hours: string }[] | null
  price: string
  priceCaption: string
  priceNote: string
}

/** Таблица времени реакции и плашка с ценой. На телефоне строка становится столбиком с подписями */
export function SlaTable({
  requestLabel,
  reactionLabel,
  solutionLabel,
  hoursLabel,
  rows,
  price,
  priceCaption,
  priceNote,
}: Props) {
  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr className={`label-13 ${styles.head}`}>
            <th scope="col">{requestLabel}</th>
            <th scope="col">{reactionLabel}</th>
            <th scope="col">{solutionLabel}</th>
            <th scope="col">{hoursLabel}</th>
          </tr>
        </thead>
        <tbody>
          {rows?.map((row) => (
            <tr key={row.request} className={styles.row}>
              <td className={`body-m ${styles.request}`}>{row.request}</td>
              <td>
                <span className={`label-12 ${styles.cellLabel}`}>{reactionLabel}</span>
                <span className={`number-s ${styles.value}`}>{row.reaction}</span>
              </td>
              <td>
                <span className={`label-12 ${styles.cellLabel}`}>{solutionLabel}</span>
                <span className={`number-s ${styles.value}`}>{row.solution}</span>
              </td>
              <td>
                <span className={`label-12 ${styles.cellLabel}`}>{hoursLabel}</span>
                <span className={`body-s ${styles.hours}`}>{row.hours}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.price}>
        <div className={styles.stat}>
          <p className={`number-l ${styles.priceValue}`}>{price}</p>
          <p className={`body-s ${styles.note}`}>{priceCaption}</p>
        </div>
        <p className={`body-m ${styles.note}`}>{priceNote}</p>
      </div>
    </>
  )
}
