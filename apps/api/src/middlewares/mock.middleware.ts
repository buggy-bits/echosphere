import { NextFunction, Request, Response } from "express";
import { AppError } from "./errorHandler.middleware";
import mongoose from "mongoose";
import { error } from "console";

export interface IMockRequest extends Request {
  project?: {
    projectId: mongoose.Types.ObjectId;
  };
}
interface MockRequestPayload {
  project: {
    projectId: mongoose.Types.ObjectId;
  };
}
export const attachProjectIdToRequest = async (
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

    // Attach user info to request object

    (req as any).project = {
      projectId: new mongoose.Types.ObjectId(projectId),
    };
    next();
  } catch (error) {
    next(error);
  }
};
