import { Admin } from "./admin.entity.js";

export interface AdminRepository {
    findAll(): Promise<Admin[] | undefined>;
    findOne(id: string): Promise<Admin | undefined>;
    add(admin: Admin): Promise<Admin | undefined>;
    update(id: string, admin: Admin): Promise<Admin | undefined>;
    partialUpdate(id: string, updates: Partial<Admin>): Promise<Admin | undefined>;
    delete(id: string): Promise<Admin | undefined>;

    logOvertime(id: string, hours: number): Promise<Admin | undefined>;

    addEventuality(
        adminId: string,
        event: { type: string; description: string; date: string }
    ): Promise<boolean>;
}