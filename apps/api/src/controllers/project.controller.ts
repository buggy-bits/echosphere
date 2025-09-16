import { NextFunction, Request, Response } from "express";
import { AppError } from "../middlewares/errorHandler.middleware";
import ProjectModel, { ProjectType } from "../models/project.model";
import { IAuthenticatedRequest } from "../middlewares/token.middleware";
import UserModel from "../models/user.model";
import { BACKEND_URL } from "../config/env";

const BASE_URL = BACKEND_URL || "http://localhost:3000";

export const createProject = async (
  req: IAuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    const { project } = req.body;
    if (!project) {
      const error: AppError = new Error("Insufficient data to create project.");
      error.status = 400;
      throw error;
    }
    const newProject = new ProjectModel({
      userId: req?.user?.userId,
      projectName: project.projectName,
      endpoints: project.endpoints,
      resources: project.resources,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const savedProject = await newProject.save();
    if (savedProject) {
      // add this new project to user model
      const user = await UserModel.findById(userId);
      if (user) {
        user.projects.push(savedProject._id);
        await user.save();
      }

      const availableEndpoints = newProject.endpoints.map(
        (endpoint) =>
          BASE_URL + "/api/v1/projects/" + savedProject._id + endpoint.path
      );

      res.status(201).json({
        status: "success",
        message: "Mock api created",
        data: {
          projectId: newProject._id,
          projectName: newProject.projectName,
          endpoints: availableEndpoints,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};
