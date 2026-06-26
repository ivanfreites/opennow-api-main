export type OwnerStatus = 'active' | 'maintenance' | 'retired';

export interface Owner {
  id: string;
  name: string;
  brand: string;
  model: string;
  status: OwnerStatus;
  hours_used: number;
  purchase_date: Date;
}

export interface OwnerRepository {
  findAll(): Promise<Owner[]>;
  findByStatus(status: OwnerStatus): Promise<Owner[]>;
  create(input: Omit<Owner, 'id'>): Promise<Owner>;
  update(id: string, input: Partial<Omit<Owner, 'id'>>): Promise<Owner | null>;
  delete(id: string): Promise<boolean>;
  report(): Promise<any>;
}