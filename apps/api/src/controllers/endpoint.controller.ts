import { NextFunction, Request, Response } from 'express';
import { AppError } from '../middlewares/errorHandler.middleware';
import ProjectModel, { ProjectType } from '../models/project.model';
import { IAuthenticatedRequest } from '../middlewares/token.middleware';
import mongoose from 'mongoose';
import { sendSuccess } from '../utils/responseHandler';

//  ENDPOINTS - CRUD
export const getAllEndpoints = async (
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
      { endpoints: 1 } // Only return the endpoints field
    );

    if (!existingProject) {
      const error: AppError = new Error('No projects found.');
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      status: 'success',
      message: 'All API Endpoints found',
      data: {
        endpoints: existingProject.endpoints,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSingleEndpoint = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId } = req.query;
    const { endpointId: id } = req.params;
    if (!id || !projectId) {
      const error: AppError = new Error('Invalid Details');
      error.status = 400;
      throw error;
    }
    // const existingEndpoint = await ProjectModel.findOne({ _id: id });

    const singleEndpoint: ProjectType | null = await ProjectModel.findOne(
      { _id: projectId, 'endpoints._id': id },
      { 'endpoints.$': 1 } // This projects the matched element from the array
    );
    if (!singleEndpoint) {
      const error: AppError = new Error('No projects found.');
      error.status = 404;
      return next(error);
    }

    sendSuccess(res, singleEndpoint.endpoints[0], 'Endpoint found', 200);
  } catch (error) {
    next(error);
  }
};

export const updateSingleEndpoint = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId } = req.query;
    const { endpointId } = req.params;
    const id = endpointId;
    // Check if projectId and endpoint id are provided
    if (!id || !projectId) {
      const error: AppError = new Error('Invalid Details');
      error.status = 400;
      throw error;
    }

    const { endpoint } = req.body;

    endpoint._id = id;

    const existingProject = await ProjectModel.findOneAndUpdate(
      { _id: projectId, 'endpoints._id': id },
      { $set: { 'endpoints.$': endpoint } },
      { new: true }
    );

    if (!existingProject) {
      const error: AppError = new Error('No projects or endpoints found.');
      error.status = 404;
      return next(error);
    }

    const updatedEndpoint = existingProject.endpoints.find(
      (ep) => ep._id.toString() === id
    );

    if (!updatedEndpoint) {
      const error: AppError = new Error('Endpoint not updated.');
      error.status = 404;
      return next(error);
    }
    sendSuccess(res, { endpoint: updatedEndpoint }, 'Endpoint updated', 200);
  } catch (error) {
    next(error);
  }
};

export const deleteSingleEndpoint = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId } = req.query;
    const { endpointId: id } = req.params;
    if (!id || !projectId) {
      const error: AppError = new Error('Invalid Details');
      error.status = 400;
      throw error;
    }
    await ProjectModel.updateOne(
      { _id: projectId },
      { $pull: { endpoints: { _id: id } } }
    );
    sendSuccess(res, {}, 'Endpoint deleted', 200);
  } catch (err) {
    return next(err);
  }
};

export const createSingleEndpoint = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { endpoint } = req.body;
    const { projectId } = req.query;

    if (!projectId) {
      const error: AppError = new Error('Invalid Details');
      error.status = 400;
      throw error;
    }

    const updatedProject = await ProjectModel.findOneAndUpdate(
      { _id: projectId },
      {
        $push: {
          endpoints: {
            ...endpoint, // Add the new endpoint details
            _id: new mongoose.Types.ObjectId(), // Generate a new ObjectId for the endpoint
          },
        },
      },
      { new: true } // This will return the updated document
    );
    if (!updatedProject) {
      const error: AppError = new Error('No project found, create one');
      error.status = 404;
      return next(error);
    }
    const newEndpoint =
      updatedProject.endpoints[updatedProject.endpoints.length - 1];
    sendSuccess(res, { endpoint: newEndpoint }, 'New Endpoint created', 201);
  } catch (err) {
    return next(err);
  }
};
