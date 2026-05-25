import { getUserById } from './users'
import { db } from '../db/client'

export interface Payment {
  id: string
  userId: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: Date
}

export async function createPayment(userId: string, amount: number, currency: string): Promise<Payment> {
  const user = await getUserById(userId)
  if (!user) throw new Error(`User ${userId} not found`)

  return db.query(
    'INSERT INTO payments (user_id, amount, currency, status) VALUES ($1, $2, $3, $4) RETURNING *',
    [userId, amount, currency, 'pending']
  )
}

export async function getPaymentsByUser(userId: string): Promise<Payment[]> {
  const user = await getUserById(userId)
  if (!user) throw new Error(`User ${userId} not found`)

  return db.query('SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC', [userId])
}
