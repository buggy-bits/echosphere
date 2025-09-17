import { NextFunction, Request, Response } from "express";
import { AppError } from "./errorHandler.middleware";
import mongoose from "mongoose";
import { error } from "console";
import ProjectModel, { ProjectType } from "../models/project.model";

export interface IMockRequest extends Request {
  project?: ProjectType;
}
// interface MockRequestPayload {
//   project: {
//     projectId: mongoose.Types.ObjectId;
//   };
// }
export const attachProjectToRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const mockReq = req as IMockRequest;
    const { projectId } = mockReq.params;

    if (!projectId) {
      const error: AppError = new Error("Please specify an api id.");
      error.status = 400;
      throw next(error);
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const projectData = await ProjectModel.findById(projectId);

    if (!projectData) {
      const error: AppError = new Error(
        "Mock api not found, please create one."
      );
      error.status = 404;
      throw next(error);
    }

    // Attach project info to request object
    (req as any).project = projectData;
    next();
  } catch (error) {
    next(error);
  }
};
