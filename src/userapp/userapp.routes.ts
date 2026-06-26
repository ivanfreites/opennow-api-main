
import { Router } from "express";
import { UserAppController } from './userapp.controller.js';

export const userAppRouter = Router();
const userAppController = new UserAppController();

userAppRouter.get('/', userAppController.findAllUserApps);
userAppRouter.get('/:id', userAppController.findUserAppById);
userAppRouter.post('/', sanitizeUserAppInput, userAppController.addUserApp);
userAppRouter.put('/:id', sanitizeUserAppInput, userAppController.updateUserApp);
userAppRouter.patch('/:id', userAppController.patchUserApp);
userAppRouter.delete('/:id', userAppController.deleteUserApp);  

function sanitizeUserAppInput(req: any, res: any, next: any) {
  req.body.sanitizedInput = {
    name: req.body.name,
    cadastralNumber: req.body.cadastralNumber,
    area: req.body.area,
    location: req.body.location,
    status: req.body.status,
    tasks: req.body.tasks,
    rainfall: req.body.rainfall,
  }
  
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })

  next()
}