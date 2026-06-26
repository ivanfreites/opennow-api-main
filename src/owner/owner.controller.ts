import { Request, Response } from 'express';
import { Owner } from './owner.entity.js';
import { OwnerPostgresRepository } from './owner.postgres.repository.js';

const ownerRepository = new OwnerPostgresRepository();

export class OwnerController {

  async findAllOwners(_req: Request, res: Response) {
    const list = await ownerRepository.findAll();
    res.json(list);
  }

  async findOwnerById(req: Request, res: Response) {
    const ownerId = req.params.id;
    const item = await ownerRepository.findById(ownerId);
    if (!item) {
      return res.status(404).json({
        errorMessage: 'Owner not found',
        errorCode: 'OWNER_NOT_FOUND'
      });
    }
    res.json(item);
  }

  async addOwner(req: Request, res: Response) {
    const input = req.body;

    // Ajusta estas propiedades según los campos reales de tu entidad Owner
    const newOwner = new Owner(
      input.name,
      input.email,
      input.phone
    );

    await ownerRepository.create(newOwner);
    res.status(201).json(newOwner);
  }

  async updateOwner(req: Request, res: Response) {
    try {
      const ownerId = req.params.id;
      const input = req.body;

      const existing = await ownerRepository.findById(ownerId);
      if (!existing) {
        return res.status(404).json({
          errorMessage: 'Owner not found',
          errorCode: 'OWNER_NOT_FOUND'
        });
      }

      existing.name = input.name;
      existing.email = input.email;
      existing.phone = input.phone;

      const updated = await ownerRepository.update(ownerId, existing);
      if (!updated) {
        return res.status(500).json({
          errorMessage: 'Update failed',
          errorCode: 'OWNER_UPDATE_FAILED'
        });
      }

      res.status(200).json(updated);
    } catch (err) {
      console.error('Error updating owner:', err);
      res.status(500).json({
        errorMessage: 'Internal server error',
        errorCode: 'OWNER_UPDATE_ERROR'
      });
    }
  }

  async deleteOwner(req: Request, res: Response) {
    try {
      const ownerId = req.params.id;
      const deleted = await ownerRepository.delete(ownerId);
      if (!deleted) {
        return res.status(404).json({ errorMessage: 'Owner not found' });
      }
      res.status(200).json(deleted);
    } catch (err) {
      console.error('Error deleting owner:', err);
      res.status(500).json({
        errorMessage: 'Error deleting owner',
        errorCode: 'OWNER_DELETE_ERROR'
      });
    }
  }

  async patchOwner(req: Request, res: Response) {
    try {
      const ownerId = req.params.id;
      const updates = req.body;

      const updated = await ownerRepository.partialUpdate(ownerId, updates);

      if (!updated) {
        return res.status(404).json({
          errorMessage: 'Owner not found or no fields updated',
          errorCode: 'OWNER_PATCH_FAILED'
        });
      }

      res.status(200).json(updated);
    } catch (err) {
      console.error('Error patching owner:', err);
      res.status(500).json({
        errorMessage: 'Internal server error',
        errorCode: 'OWNER_PATCH_ERROR'
      });
    }
  }
}