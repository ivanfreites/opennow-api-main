import crypto from 'node:crypto'

export type OwnerStatus = 'active' | 'inactive' | 'suspended';

export class Owner {
  public id: string;
  name: string;
  email: string;
  phone: string;
  status: OwnerStatus;
  registration_date: Date;

  constructor(
    name: string,
    email: string,
    phone: string,
    status: OwnerStatus,
    registration_date: Date | string,
    id?: string 
  ) {
    this.id = id ?? crypto.randomUUID();
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.status = status;
    this.registration_date =
      registration_date instanceof Date
        ? registration_date
        : new Date(registration_date);
  }
}