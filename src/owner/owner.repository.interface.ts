import { Owner, OwnerStatus } from './owner.entity';

export interface OwnerRepository {
  findAll(): Promise<Owner[]>;
  findByStatus(status: OwnerStatus): Promise<Owner[]>;
  findById(id: string): Promise<Owner | null>;
  create(input: Omit<Owner, 'id'>): Promise<Owner>;
  update(id: string, input: Partial<Omit<Owner, 'id'>>): Promise<Owner | null>;
  delete(id: string): Promise<boolean>;
  report(): Promise<Array<{ status: OwnerStatus; count: number; hours: number }>>;
}