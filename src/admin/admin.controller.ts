import { Request, Response } from 'express';
import { Admin } from './admin.entity.js';
import { AdminPostgresRepository } from './admin.postgres.repository.js';

const adminRepository = new AdminPostgresRepository();

export class AdminController {
    async deleteAdmin(req: Request, res: Response) {
        const adminId = req.params.id;


        const deleted = await adminRepository.delete(adminId);
        if (!deleted) {
            res.status(404).json({
                errorMessage: 'Admin not found',
                errorCode: 'ADMIN_NOT_FOUND'
            });
            return;
        }

        res.json({ message: 'Admin deleted successfully', data: deleted });
    }

    addEventuality(arg0: string, addEventuality: any) {
        throw new Error("Method not implemented.");
    }

    async findAllAdmins(req: Request, res: Response) {
        const admins = await adminRepository.findAll();
        res.json(admins);
    }
    

    async findAdminById(req: Request, res: Response) {
        const adminId = req.params.id;
        const admin = await adminRepository.findOne(adminId);
        if (!admin) {
            res.status(404).json({
                errorMessage: 'Admin not found',
                errorCode: 'ADMIN_NOT_FOUND'
            });
            return;
        }
        res.json(admin);
    }

    async addAdmin(req: Request, res: Response) {
        const input = req.body.sanitizedInput;
        const newAdmin = new Admin(
            input.fullname,
            input.role,
            input.seniority,
            input.availablehours,
            input.salary,
            input.overtimehours,
            input.performancescore,
            input.assignedtasks,
            input.id
        );

        await adminRepository.add(newAdmin);
        res.status(201).json(newAdmin);
    }

    async updateAdmin(req: Request, res: Response) {
        const adminId = req.params.id;
        const input = req.body.sanitizedInput;

        const updatedAdmin = new Admin(
            input.fullname,
            input.role,
            input.seniority,
            input.availablehours,
            input.salary,
            input.overtimehours,
            input.performancescore,
            input.assignedtasks,
            adminId
        );

        const updated = await adminRepository.update(adminId, updatedAdmin);
        if (!updated) {
            res.status(404).json({
                errorMessage: 'Admin not found',
                errorCode: 'ADMIN_NOT_FOUND'
            });
            return;
        }

        res.json(updated);
    }

    async patchAdmin(req: Request, res: Response) {
        const adminId = req.params.id;
        const updates = req.body.sanitizedInput;

        const updated = await adminRepository.partialUpdate(adminId, updates);
        if (!updated) {
            res.status(404).json({
                errorMessage: 'Admin not found',
                errorCode: 'ADMIN_NOT_FOUND'
            });
            return;
        }

        res.json({ message: 'Admin updated', data: updated });
    }

    async deactivateAdmin(req: Request, res: Response) {
        const adminId = req.params.id;
        const admin = await adminRepository.findOne(adminId);

        if (!admin) {
            res.status(404).json({
                errorMessage: 'Admin not found',
                errorCode: 'ADMIN_NOT_FOUND'
            });
            return;
        }

        await adminRepository.deactivate(adminId);
        res.json({ message: 'Admin deactivated successfully' });
    }

    async reassignTask(req: Request, res: Response) {
        const adminId = req.params.id;
        const { taskIndex, newTask } = req.body;

        const admin = await adminRepository.findOne(adminId);
        if (!admin) {
            res.status(404).json({
                errorMessage: 'Admin not found',
                errorCode: 'ADMIN_NOT_FOUND'
            });
            return;
        }

        admin.reassignTask(taskIndex, newTask);
        await adminRepository.update(adminId, admin);

        res.json({ message: 'Task reassigned', data: admin });
    }

    async logOvertime(req: Request, res: Response) {
        const adminId = req.params.id;
        const { hours } = req.body;

        const admin = await adminRepository.findOne(adminId);
        if (!admin) {
            res.status(404).json({
                errorMessage: 'Admin not found',
                errorCode: 'ADMIN_NOT_FOUND'
            });
            return;
        }

        admin.logOvertime(hours);
        await adminRepository.update(adminId, admin);

        res.json({ message: 'Overtime logged', data: admin });
    }

    async registerEventuality(req: Request, res: Response) {
        const adminId = req.params.id;
        const { type, description, date } = req.body;

        const admin = await adminRepository.findOne(adminId);
        if (!admin) {
            res.status(404).json({
                errorMessage: 'Admin not found',
                errorCode: 'ADMIN_NOT_FOUND'
            });
            return;
        }

        await adminRepository.addEventuality(adminId, { type, description, date });

        res.json({ message: 'Eventuality registered' });
    }
}