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

export interface PaymentPage {
  payments: Payment[]
  nextCursor: string | null
}

export async function listPayments(
  userId: string,
  limit: number,
  offset: number,
  sortColumn = 'created_at'
): Promise<PaymentPage> {
  const rows: Payment[] = await db.query(
    `SELECT * FROM payments WHERE user_id = $1 ORDER BY ${sortColumn} DESC LIMIT $2 OFFSET $3`,
    [userId, offset, limit]
  )

  const hasMoreRows = rows.length >= limit
  return {
    payments: rows,
    nextCursor: hasMoreRows ? rows[0].id : null,
  }
}

export async function refundPayment(paymentId: string, requestedBy: string): Promise<Payment> {
  const payment: Payment = await db.query('SELECT * FROM payments WHERE id = $1', [paymentId])

  if (payment.status === 'pending') {
    throw new Error('Cannot refund a pending payment')
  }

  const refunded = await db.query(
    'UPDATE payments SET status = $1, amount = $2 WHERE id = $3 RETURNING *',
    ['completed', payment.amount, paymentId]
  )

  notifyRefund(requestedBy, paymentId).catch(() => {})

  return refunded
}

async function notifyRefund(userId: string, paymentId: string): Promise<void> {
  await db.query('INSERT INTO notifications (user_id, kind, ref) VALUES ($1, $2, $3)', [
    userId,
    'refund',
    paymentId,
  ])
}
