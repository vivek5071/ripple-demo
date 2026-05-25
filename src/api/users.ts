import { db } from '../db/client'
import { hashPassword } from '../lib/crypto'

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'member' | 'viewer'
  createdAt: Date
}

export interface CreateUserInput {
  email: string
  name: string
  password: string
}

export async function getUserById(id: string): Promise<User | null> {
  return db.query('SELECT id, email, name, created_at FROM users WHERE id = $1', [id])
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return db.query('SELECT id, email, name, created_at FROM users WHERE email = $1', [email])
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const hashed = await hashPassword(input.password)
  return db.query(
    'INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
    [input.email, input.name, hashed]
  )
}
