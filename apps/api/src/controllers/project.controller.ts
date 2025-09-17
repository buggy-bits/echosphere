import { NextFunction, Request, Response } from "express";
import { AppError } from "../middlewares/errorHandler.middleware";
import ProjectModel, { ProjectType } from "../models/project.model";
import { IAuthenticatedRequest } from "../middlewares/token.middleware";
import UserModel from "../models/user.model";
import { BACKEND_URL } from "../config/env";
import mongoose from "mongoose";

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
      // resources: project.resources,
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

export const getAllProjects = async (
  req: IAuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      const error: AppError = new Error("No user authentication.");
      error.status = 400;
      throw error;
    }
    const projects = await ProjectModel.find({ userId }).select(
      "_id projectName createdAt"
    );

    if (!projects) {
      const error: AppError = new Error("No projects found.");
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      status: "success",
      message: "All projects found",
      data: {
        projects,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSingleProject = async (
  req: IAuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) {
      const error: AppError = new Error("No user authentication.");
      error.status = 400;
      throw error;
    }
    const existingProject = await ProjectModel.findOne({ _id: id });

    if (!existingProject) {
      const error: AppError = new Error("No projects found.");
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      status: "success",
      message: "All projects found",
      data: {
        project: existingProject,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSingleProject = async (
  req: IAuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      const error: AppError = new Error("No user authentication.");
      error.status = 400;
      throw error;
    }

    const existingProject = await ProjectModel.findOneAndDelete({ _id: id });

    if (!existingProject) {
      const error: AppError = new Error("No projects found.");
      error.status = 404;
      throw error;
    }
    // remove this project from user model
    const user = await UserModel.findById(userId);
    if (user) {
      user.projects = user.projects.filter(
        (projectId) => projectId.toString() !== existingProject._id.toString()
      );
      await user.save();
    }

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const updateSingleProject = async (
  req: IAuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      const error: AppError = new Error("No user authentication.");
      error.status = 400;
      throw error;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }
    const { project } = req.body;

    const existingProject = await ProjectModel.findOneAndReplace(
      { _id: id },
      project,
      { new: true }
    );

    if (!existingProject) {
      const error: AppError = new Error("No projects found.");
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      status: "success",
      project: existingProject,
    });
  } catch (error) {
    next(error);
  }
};
