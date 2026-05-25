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

export async function getUserById(id: string, options?: { includeDeleted?: boolean }): Promise<User | null> {
  const sql = options?.includeDeleted
    ? 'SELECT id, email, name, role, created_at FROM users WHERE id = $1'
    : 'SELECT id, email, name, role, created_at FROM users WHERE id = $1 AND deleted_at IS NULL'
  return db.query(sql, [id])
}

export async function getUserByEmail(email: string, options?: { includeDeleted?: boolean }): Promise<User | null> {
  const sql = options?.includeDeleted
    ? 'SELECT id, email, name, role, created_at FROM users WHERE email = $1'
    : 'SELECT id, email, name, role, created_at FROM users WHERE email = $1 AND deleted_at IS NULL'
  return db.query(sql, [email])
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const hashed = await hashPassword(input.password)
  return db.query(
    'INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
    [input.email, input.name, hashed]
  )
}
