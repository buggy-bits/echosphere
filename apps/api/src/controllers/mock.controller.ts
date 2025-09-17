import { NextFunction, Request, Response } from "express";
import { AppError } from "../middlewares/errorHandler.middleware";
import mongoose from "mongoose";
import ProjectModel, {
  EndpointConfig,
  ProjectType,
} from "../models/project.model";
import { IMockRequest } from "../middlewares/mock.middleware";

const findMatchingEndpoint = (
  endpoints: EndpointConfig[],
  requestPath: string,
  requestMethod: EndpointConfig["method"]
) => {
  const normalizedRequestPath = requestPath.replace(/^\/|\/$/g, "");

  for (const endpoint of endpoints) {
    // Normalize the endpoint path as well
    const normalizedEndpointPath = endpoint.path.replace(/^\/|\/$/g, "");

    // Escape special characters in the endpoint path for regex matching
    const escapedPath = normalizedEndpointPath.replace(/:\w+/g, "([^/]+)");
    const regex = new RegExp(`^${escapedPath}$`);
    const match = normalizedRequestPath.match(regex);

    if (
      match &&
      endpoint.method.toUpperCase() === requestMethod.toUpperCase()
    ) {
      const paramNames = (
        normalizedEndpointPath.match(/:\w+/g) || []
      ).map((name) => name.substring(1));
      const params: Record<string, string> = {};

      if (match.length > 1) {
        for (let i = 0; i < paramNames.length; i++) {
          params[paramNames[i]] = match[i + 1];
        }
      }
      return { endpoint, params };
    }
  }
  console.log("nullll");
  return null;
};

export const handleMockRequest = async (
  //  ProjectId will be mentioned in the modified incoming request
  req: IMockRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const method = req.method;
    const projectPayload = req.project;
    const mockPath = req.path;

    if (!projectPayload) {
      const error: AppError = new Error("Please specify an api id.");
      error.status = 400;
      throw error;
    }
    if (!mongoose.Types.ObjectId.isValid(projectPayload.projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }
    const project: ProjectType | null = await ProjectModel.findById(
      projectPayload.projectId
    );
    if (!project) {
      const error: AppError = new Error(
        "Mock api not found, please create one."
      );
      error.status = 404;
      throw error;
    }

    const { endpoint, params } =
      findMatchingEndpoint(
        project.endpoints,
        mockPath,
        method as EndpointConfig["method"]
      ) || {};

    setTimeout(() => {
      res.status(200).json({
        status: "success",
        data: {
          path: mockPath,
          method,
          apiResponse: endpoint?.responseData,
          statusCode: endpoint?.statusCode,
          params,
        },
      });
    }, endpoint?.delay || 0);
  } catch (error) {
    next(error);
  }
};
