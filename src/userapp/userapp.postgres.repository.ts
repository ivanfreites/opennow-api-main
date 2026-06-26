import { UserAppRepository } from "./userapp.repository.interface.js";
import { UserApp } from "./userapp.entity.js";
import { Client } from "pg";

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'agrosoft',
  password: 'postgres',
  port: 5432,
});

client.connect();

export class UserAppPostgresRepository implements UserAppRepository {

  async findAll(): Promise<UserApp[] | undefined> {
    try {
      const res = await client.query('SELECT * FROM userapps');
      return res.rows as UserApp[];
    } catch (error) {
      console.error('Error finding all userapps:', error);
      return undefined;
    }
  }

  async findOne(id: string): Promise<UserApp | undefined> {
    try {
      const res = await client.query('SELECT * FROM userapps WHERE id = $1', [id]);
      return res.rows.length > 0 ? res.rows[0] as UserApp : undefined;
    } catch (error) {
      console.error(`Error finding userapp by ID (${id}):`, error);
      return undefined;
    }
  }

  async add(userApp: UserApp): Promise<UserApp | undefined> {
    try {
      // Ajusta los campos según la estructura de tu entidad UserApp
      const res = await client.query(
        `INSERT INTO userapps (id, name, email, role, settings)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [
          userApp.id,
          userApp.name,
          userApp.email,
          userApp.role,
          JSON.stringify(userApp.settings)
        ]
      );

      return res.rows.length > 0 ? res.rows[0] as UserApp : undefined;
    } catch (error) {
      console.error('Error adding userapp:', error);
      return undefined;
    }
  }

  async update(id: string, updatedUserApp: UserApp): Promise<UserApp | undefined> {
    try {
      const res = await client.query(
        `UPDATE userapps SET name = $1, email = $2, role = $3, settings = $4
         WHERE id = $5 RETURNING *`,
        [
          updatedUserApp.name,
          updatedUserApp.email,
          updatedUserApp.role,
          JSON.stringify(updatedUserApp.settings),
          id
        ]
      );

      if (!res.rows || res.rows.length === 0) {
        console.warn(`No userapp updated for id: ${id}`);
        return undefined;
      }

      return res.rows[0] as UserApp;
    } catch (error) {
      console.error(`Error updating userapp (${id}):`, error);
      return undefined;
    }
  }

  async partialUpdate(id: string, updates: Partial<UserApp>): Promise<UserApp | undefined> {
    try {
      const keys = Object.keys(updates);
      if (keys.length === 0) {
        console.warn(`No fields provided for partial update of userapp ${id}`);
        return undefined;
      }

      const values = keys.map((key) => {
        const value = (updates as any)[key];
        return typeof value === 'object' ? JSON.stringify(value) : value;
      });

      const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
      const query = `UPDATE userapps SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;

      const res = await client.query(query, [...values, id]);

      if (!res.rows || res.rows.length === 0) {
        console.warn(`No userapp partially updated for id: ${id}`);
        return undefined;
      }

      return res.rows[0] as UserApp;
    } catch (error) {
      console.error(`Error partially updating userapp (${id}):`, error);
      return undefined;
    }
  }

  async delete(id: string): Promise<UserApp | undefined> {
    try {
      const res = await client.query('DELETE FROM userapps WHERE id = $1 RETURNING *', [id]);

      if (res.rowCount === 0) {
        console.warn(`No userapp deleted for id: ${id}`);
        return undefined;
      }

      return res.rows[0] as UserApp;
    } catch (error) {
      console.error(`Error deleting userapp (${id}):`, error);
      return undefined;
    }
  }
}