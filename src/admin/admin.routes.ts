import { Router } from "express";
import { AdminController } from './admin.controller.js'; // Asegúrate de actualizar el nombre del archivo

export const adminRouter = Router();
const adminController = new AdminController();

adminRouter.get('/', adminController.findAllAdmins);
adminRouter.get('/:id', adminController.findAdminById);
adminRouter.post('/', sanitizeAdminInput, adminController.addAdmin);
adminRouter.put('/:id', sanitizeAdminInput, adminController.updateAdmin);
adminRouter.patch('/:id', adminController.patchAdmin);
adminRouter.delete('/:id', adminController.deleteAdmin);

adminRouter.post('/:id/overtime', adminController.logOvertime);
adminRouter.post('/:id/eventualities', adminController.addEventuality);

function sanitizeAdminInput(req: any, res: any, next: any) {
  const sanitizedInput: any = {
    fullname: req.body.fullname,
    role: req.body.role,
    seniority: req.body.seniority,
    availablehours: req.body.availablehours,
    salary: req.body.salary,
    overtimehours: req.body.overtimehours,
    performancescore: req.body.performancescore,
    assignedtasks: req.body.assignedtasks
  };

  if (req.method === 'POST') {
    sanitizedInput.id = req.body.id ?? crypto.randomUUID();
  }

  Object.keys(sanitizedInput).forEach((key) => {
    if (sanitizedInput[key] === undefined) {
      delete sanitizedInput[key];
    }
  });

  req.body.sanitizedInput = sanitizedInput;
  next();
}