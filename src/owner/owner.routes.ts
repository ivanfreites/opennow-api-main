import { Router } from 'express';
import { OwnerController } from './owner.controller.js';

export const ownerRouter = Router();
const c = new OwnerController();

ownerRouter.get('/', c.findAllOwners.bind(c));
ownerRouter.get('/:id', c.findOwnerById.bind(c));
ownerRouter.post('/', c.addOwner.bind(c));
ownerRouter.put('/:id', c.updateOwner.bind(c));
ownerRouter.patch('/:id', c.patchOwner.bind(c));
ownerRouter.delete('/:id', c.deleteOwner.bind(c));

export default ownerRouter;