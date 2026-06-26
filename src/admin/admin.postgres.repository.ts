import { AdminRepository } from "./admin.repository.interface.js";
import { Admin } from "./admin.entity.js";
import { Client } from "pg";

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'agrosoft',
    password: 'postgres',
    port: 5432,
});

export class AdminPostgresRepository implements AdminRepository {
    // Nota: Si Admin no requiere deactivate, podrías removerlo de la interfaz
    deactivate(adminId: any) {
        throw new Error('Method not implemented.');
    }

    constructor() {
        client.connect();
    }

    async findAll(): Promise<Admin[] | undefined> {
        const res = await client.query('SELECT * FROM admins');
        return res.rows as Admin[] || undefined;
    }

    async findOne(id: string): Promise<Admin | undefined> {
        const res = await client.query('SELECT * FROM admins WHERE id = $1', [id]);
        return res.rows[0] as Admin || undefined;
    }

    async add(admin: Admin): Promise<Admin | undefined> {
        try {
            const res = await client.query(
                `INSERT INTO admins (
                id, fullname, role, permissions, email
                ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                [
                    admin.id,
                    admin.fullname,
                    admin.role,
                    admin.permissions,
                    admin.email
                ]
            );
            return res.rows[0];
        } catch (error) {
            console.error('Error adding admin:', error);
            return undefined;
        }
    }

    async update(id: string, admin: Admin): Promise<Admin | undefined> {
        try {
            const res = await client.query(
                `UPDATE admins SET 
                fullname = $1, role = $2, permissions = $3, email = $4 
                WHERE id = $5 RETURNING *`,
                [
                    admin.fullname,
                    admin.role,
                    admin.permissions,
                    admin.email,
                    id
                ]
            );
            return res.rows[0];
        } catch (error) {
            console.error('Error updating admin:', error);
            return undefined;
        }
    }

    async partialUpdate(id: string, updates: Partial<Admin>): Promise<Admin | undefined> {
        try {
            const keys = Object.keys(updates);
            const values = Object.values(updates);
            const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
            const query = `UPDATE admins SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;

            const res = await client.query(query, [...values, id]);
            return res.rows[0];
        } catch (error) {
            console.error('Error partially updating admin:', error);
            return undefined;
        }
    }

    async delete(id: string): Promise<Admin | undefined> {
        try {
            const res = await client.query('DELETE FROM admins WHERE id = $1 RETURNING *', [id]);
            return res.rows[0];
        } catch (error) {
            console.error('Error deleting admin:', error);
            return undefined;
        }
    }
}