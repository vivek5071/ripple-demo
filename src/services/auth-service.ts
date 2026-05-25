import { getUserByEmail, getUserById, User } from '../api/users'
import { verifyPassword, generateToken } from '../lib/crypto'

export interface AuthResult {
  user: User
  token: string
}

export async function login(email: string, password: string): Promise<AuthResult> {
  const user = await getUserByEmail(email)
  if (!user) throw new Error('Invalid credentials')

  const valid = await verifyPassword(password, user.id)
  if (!valid) throw new Error('Invalid credentials')

  const token = generateToken(user.id)
  return { user, token }
}

export async function validateSession(token: string): Promise<User | null> {
  const userId = parseToken(token)
  if (!userId) return null
  return getUserById(userId)
}

function parseToken(token: string): string | null {
  try {
    const [, payload] = token.split('.')
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString())
    return decoded.sub ?? null
  } catch {
    return null
  }
}
