import { Row } from '../app/private/page'

export const buildContractQuery = (row: Row, token: string): string => {
  const params = new URLSearchParams({
    cliente: row.nombre,
    nif: row.dni,
    fecha: row.fecha,
    importe: row.importe,
    token,
  })

  return `/api/contract?${params.toString()}`
}
