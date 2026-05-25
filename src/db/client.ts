export const db = {
  query: async (sql: string, params: unknown[] = []): Promise<any> => {
    // placeholder — wire up pg/mysql/etc here
    throw new Error('db.query not implemented')
  }
}
