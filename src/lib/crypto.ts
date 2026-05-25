import { createHash, randomBytes } from 'crypto'

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const hash = createHash('sha256').update(password + salt).digest('hex')
  return `${salt}:${hash}`
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [salt, hash] = storedHash.split(':')
  const candidate = createHash('sha256').update(password + salt).digest('hex')
  return candidate === hash
}

export function generateToken(userId: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256' })).toString('base64')
  const payload = Buffer.from(JSON.stringify({ sub: userId, iat: Date.now() })).toString('base64')
  return `${header}.${payload}.signature`
}
