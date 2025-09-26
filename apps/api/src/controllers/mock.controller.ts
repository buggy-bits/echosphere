import { NextFunction, Response } from 'express';
import { AppError } from '../middlewares/errorHandler.middleware';
import { EndpointConfig } from '../models/project.model';
import { IMockRequest } from '../middlewares/mock.middleware';
import { extractRouteInfo } from '../utils/mockUtils';

const findMatchingEndpoint = (
  endpoints: EndpointConfig[],
  requestPath: string,
  requestMethod: EndpointConfig['method']
) => {
  // remove the first /
  const normalizedRequestPath = requestPath.replace(/^\/|\/$/g, '');

  for (const endpoint of endpoints) {
    // Normalize the endpoint path as well
    const normalizedEndpointPath = endpoint.path.replace(/^\/|\/$/g, '');

    // Escape special characters in the endpoint path for regex matching
    const escapedPath = normalizedEndpointPath.replace(/:\w+/g, '([^/]+)');
    const regex = new RegExp(`^${escapedPath}$`);
    const match = normalizedRequestPath.match(regex);

    if (
      match &&
      endpoint.method.toUpperCase() === requestMethod.toUpperCase()
    ) {
      const { resourcesWithParams } = extractRouteInfo(
        normalizedEndpointPath,
        normalizedRequestPath
      );

      return { endpoint, resourceData: resourcesWithParams };
    }
  }
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
    const projectData = req.project;
    const mockApiPath = req.path;

    if (!projectData) {
      const error: AppError = new Error('Please specify an api id.');
      error.status = 400;
      throw error;
    }

    const { endpoint, resourceData } =
      findMatchingEndpoint(
        projectData.endpoints,
        mockApiPath,
        method as EndpointConfig['method']
      ) || {};

    if (!endpoint) {
      res.status(404).json(
        projectData.notFoundResponse || {
          status: 'error',
          message: 'Path not found',
        }
      );
      return;
    }
    let responseData;
    if (endpoint?.preferDynamicResponse && resourceData) {
      console.log('No resources');

      // This basic project only supports single pathParms, for multiple, it might be more timetaking project
      const dataFromResourece = resourceData[0];

      const result = projectData.resources[dataFromResourece.resource].find(
        (item: any) =>
          item[dataFromResourece.param]?.toString() === dataFromResourece.value
      );
      console.log(result);
      responseData = result;
    } else {
      responseData = endpoint?.responseData;
    }

    setTimeout(() => {
      res.status(endpoint?.statusCode || 200).json(responseData);
    }, endpoint?.delay || 0);
  } catch (error) {
    next(error);
  }
};
