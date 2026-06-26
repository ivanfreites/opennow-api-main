
import { UserApp } from "./userapp.entity.js";

export interface UserAppRepository {
    findAll(): Promise<UserApp[] | undefined>;
    findOne(id: string): Promise<UserApp | undefined>;
    add(userApp: UserApp): Promise<UserApp | undefined>;
    update(id: string, userApp: UserApp): Promise<UserApp | undefined>;
    partialUpdate(id: string, updates: Partial<UserApp>): Promise<UserApp | undefined>;
    delete(id: string): Promise<UserApp | undefined>;
}