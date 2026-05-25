import { getUserById } from '../api/users'

export async function sendWelcomeEmail(userId: string): Promise<void> {
  const user = await getUserById(userId)
  if (!user) return

  console.log(`Sending welcome email to ${user.email}`)
  // email provider integration goes here
}

export async function sendPaymentReceipt(userId: string, amount: number): Promise<void> {
  const user = await getUserById(userId)
  if (!user) return

  console.log(`Sending payment receipt to ${user.email} for $${amount}`)
  // email provider integration goes here
}
