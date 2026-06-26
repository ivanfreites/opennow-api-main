import { Request, Response } from 'express';
import { UserApp } from './userapp.entity.js';
import { UserAppPostgresRepository } from './userapp.postgres.repository.js';

const userAppRepository = new UserAppPostgresRepository();

export class UserAppController {

  async findAllUserApps(req: Request, res: Response) {
    const userApps = await userAppRepository.findAll();
    res.json(userApps);
  }

  async findUserAppById(req: Request, res: Response) {
    const userAppId = req.params.id;
    const userApp = await userAppRepository.findOne(userAppId);
    if (!userApp) {
      res.status(404).json({
        errorMessage: 'UserApp not found',
        errorCode: 'USERAPP_NOT_FOUND'
      });
      return;
    }
    res.json(userApp);
  }

  async addUserApp(req: Request, res: Response) {
    const input = req.body;
    const newUserApp = new UserApp(
      input.name,
      input.cadastralNumber,
      input.area,
      input.location,
      input.status,
      input.tasks,
      input.rainfall
    );
    await userAppRepository.add(newUserApp);
    res.status(201).json(newUserApp);
  }

  async updateUserApp(req: Request, res: Response) {
    try {
      const userAppId = req.params.id;
      const input = req.body;

      const existingUserApp = await userAppRepository.findOne(userAppId);
      if (!existingUserApp) {
        return res.status(404).json({
          errorMessage: 'UserApp not found',
          errorCode: 'USERAPP_NOT_FOUND'
        });
      }

      existingUserApp.name = input.name;
      existingUserApp.cadastralNumber = input.cadastralNumber;
      existingUserApp.area = input.area;
      existingUserApp.location = input.location;
      existingUserApp.status = input.status;
      existingUserApp.tasks = input.tasks;
      existingUserApp.rainfall = input.rainfall;

      const updated = await userAppRepository.update(userAppId, existingUserApp);

      if (!updated) {
        return res.status(500).json({
          errorMessage: 'Update failed',
          errorCode: 'USERAPP_UPDATE_FAILED'
        });
      }

      res.status(200).json(updated);

    } catch (err) {
      console.error('Error updating userApp:', err);
      res.status(500).json({
        errorMessage: 'Internal server error',
        errorCode: 'USERAPP_UPDATE_ERROR'
      });
    }
  }

  async deleteUserApp(req: Request, res: Response) {
    try {
      const userAppId = req.params.id;
      const deleted = await userAppRepository.delete(userAppId);
      if (!deleted) {
        res.status(404).json({ errorMessage: 'UserApp not found' });
        return;
      }
      res.status(200).json(deleted);
    } catch (err) {
      console.error('Error deleting userApp:', err);
      res.status(500).json({
        errorMessage: 'Error deleting userApp',
        errorCode: 'USERAPP_DELETE_ERROR'
      });
    }
  }

  async patchUserApp(req: Request, res: Response) {
    try {
      const userAppId = req.params.id;
      const updates = req.body;

      const updated = await userAppRepository.partialUpdate(userAppId, updates);

      if (!updated) {
        return res.status(404).json({
          errorMessage: 'UserApp not found or no fields updated',
          errorCode: 'USERAPP_PATCH_FAILED'
        });
      }

      res.status(200).json(updated);

    } catch (err) {
      console.error('Error patching userApp:', err);
      res.status(500).json({
        errorMessage: 'Internal server error',
        errorCode: 'USERAPP_PATCH_ERROR'
      });
    }
  }
}