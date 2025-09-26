import { NextFunction, Request, Response } from 'express';
import { AppError } from '../middlewares/errorHandler.middleware';
import ProjectModel from '../models/project.model';
import { IAuthenticatedRequest } from '../middlewares/token.middleware';
import { sendSuccess } from '../utils/responseHandler';

//  ENDPOINTS - CRUD
export const getAllResources = async (
  req: IAuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = req.query.projectId;

    if (!projectId) {
      const error: AppError = new Error('No Project, Provide an valid id');
      error.status = 400;
      throw error;
    }
    const existingProject = await ProjectModel.findOne(
      { _id: projectId },
      { resources: 1 } // Only return the endpoints field
    );

    if (!existingProject) {
      const error: AppError = new Error('No projects found.');
      error.status = 404;
      throw error;
    }

    sendSuccess(
      res,
      {
        resources: existingProject.resources,
      },
      'Resources found',
      200
    );
  } catch (error) {
    next(error);
  }
};

export const createSingleResource = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { resource } = req.body;
    const { projectId } = req.query;

    if (!projectId) {
      const error: AppError = new Error('Invalid Details');
      error.status = 400;
      throw error;
    }

    const existingProject = await ProjectModel.findOne({ _id: projectId });
    if (!existingProject) {
      const error: AppError = new Error('No project found, create one');
      error.status = 404;
      return next(error);
    }
    const existingResources = await existingProject?.resources;

    const updatedResources = {
      ...existingResources,
      [resource.name]: resource.data,
    };
    console.dir(existingProject.resources);
    existingProject.resources = updatedResources;
    console.log('data set checkpoint reached');
    console.dir(existingProject.resources);
    await existingProject.save();

    sendSuccess(
      res,
      { resources: updatedResources },
      'New Endpoint created',
      201
    );
  } catch (err) {
    return next(err);
  }
};

export const updateSingleResource = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { resource } = req.body;
    const { projectId } = req.query;

    if (!projectId) {
      const error: AppError = new Error('Invalid Details');
      error.status = 400;
      throw error;
    }

    const existingProject = await ProjectModel.findOne({ _id: projectId });
    if (!existingProject) {
      const error: AppError = new Error('No project found, create one');
      error.status = 404;
      return next(error);
    }
    const existingResources = await existingProject?.resources;

    existingResources[resource.name] = resource.data;

    existingProject.resources = existingResources;
    await existingProject.save();

    sendSuccess(
      res,
      { resources: existingResources },
      'New Endpoint created',
      201
    );
  } catch (err) {
    return next(err);
  }
};

export const deleteSingleResource = async (
  req: IAuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId, name } = req.query;
    const resourceName = name as string;

    if (!projectId) {
      const error: AppError = new Error('Invalid Details');
      error.status = 400;
      throw error;
    }

    const existingProject = await ProjectModel.findOne({ _id: projectId });
    if (!existingProject) {
      const error: AppError = new Error('No project found, create one');
      error.status = 404;
      return next(error);
    }

    // Use $unset to remove the resource from the database
    const updateResult = await ProjectModel.updateOne(
      { _id: projectId },
      { $unset: { [`resources.${resourceName}`]: 1 } }
    );

    if (updateResult.modifiedCount === 0) {
      const error: AppError = new Error(
        'Resource not found or already deleted'
      );
      error.status = 404;
      return next(error);
    }

    // After deletion, reload the project to get the updated resources
    const updatedProject = await ProjectModel.findById(projectId);

    sendSuccess(
      res,
      { resources: updatedProject?.resources },
      'Resource deleted successfully',
      200
    );
  } catch (error) {
    next(error);
  }
};
