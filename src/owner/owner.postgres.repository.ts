import { Client } from 'pg';
import { Owner, OwnerStatus } from './owner.entity.js';
import { OwnerRepository } from './owner.repository.interface.js';

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'agrosoft',
  password: 'postgres',
  port: 5432,
});

client.connect();

const UPDATABLE_COLUMNS = new Set([
  'name', 'email', 'phone', 'status', 'created_at'
]);

function rowToEntity(row: any): Owner {
  return new Owner(
    row.name,
    row.email,
    row.phone,
    row.status as OwnerStatus,
    row.created_at,
    row.id // UUID como string
  );
}

export class OwnerPostgresRepository implements OwnerRepository {
  async findAll(): Promise<Owner[]> {
    const { rows } = await client.query('SELECT * FROM owner ORDER BY created_at DESC');
    return rows.map(rowToEntity);
  }

  async findByStatus(status: OwnerStatus): Promise<Owner[]> {
    const { rows } = await client.query('SELECT * FROM owner WHERE status = $1', [status]);
    return rows.map(rowToEntity);
  }

  async findById(id: string): Promise<Owner | null> {
    const { rows } = await client.query('SELECT * FROM owner WHERE id = $1', [id]);
    return rows[0] ? rowToEntity(rows[0]) : null;
  }

  async create(entity: Owner): Promise<Owner> {
    const query = `
      INSERT INTO owner (id, name, email, phone, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [
      entity.id,
      entity.name,
      entity.email,
      entity.phone,
      entity.status,
      entity.created_at
    ];
    const { rows } = await client.query(query, values);
    return rowToEntity(rows[0]);
  }

  async update(id: string, input: Partial<Omit<Owner, 'id'>>): Promise<Owner | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    // Actualización lógica
    const query = `
      UPDATE owner
      SET name = $1, email = $2, phone = $3, status = $4, created_at = $5
      WHERE id = $6
      RETURNING *;
    `;
    const values = [
      input.name ?? existing.name,
      input.email ?? existing.email,
      input.phone ?? existing.phone,
      input.status ?? existing.status,
      input.created_at ?? existing.created_at,
      id
    ];
    const { rows } = await client.query(query, values);
    return rows[0] ? rowToEntity(rows[0]) : null;
  }

  async delete(id: string): Promise<boolean> {
    const { rowCount } = await client.query('DELETE FROM owner WHERE id = $1', [id]);
    return (rowCount ?? 0) > 0;
  }

  async report(): Promise<Array<{ status: OwnerStatus; count: number }>> {
    const { rows } = await client.query(`
      SELECT status, COUNT(*) AS count
      FROM owner
      GROUP BY status
    `);
    return rows;
  }

  async partialUpdate(id: string, updates: Partial<Owner>): Promise<Owner | null> {
    const normalized: Record<string, any> = { ...updates };
    const sets: string[] = [];
    const values: any[] = [];
    let i = 1;

    for (const [key, value] of Object.entries(normalized)) {
      if (value === undefined || !UPDATABLE_COLUMNS.has(key)) continue;
      sets.push(`${key} = $${i++}`);
      values.push(value);
    }

    if (sets.length === 0) return this.findById(id);

    values.push(id);
    const query = `UPDATE owner SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`;
    const { rows } = await client.query(query, values);
    return rows[0] ? rowToEntity(rows[0]) : null;
  }
}