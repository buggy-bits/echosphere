export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    REFRESH: '/api/v1/token/refresh',
  },
  PROJECTS: '/api/v1/projects',
  ENDPOINTS: '/api/v1/endpoints',
  RESOURCES: '/api/v1/resources',
} as const;

export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] as const;

export const STATUS_CODES = [
  { value: 200, label: '200 - OK' },
  { value: 201, label: '201 - Created' },
  { value: 202, label: '202 - Accepted' },
  { value: 204, label: '204 - No Content' },
  { value: 400, label: '400 - Bad Request' },
  { value: 401, label: '401 - Unauthorized' },
  { value: 403, label: '403 - Forbidden' },
  { value: 404, label: '404 - Not Found' },
  { value: 409, label: '409 - Conflict' },
  { value: 422, label: '422 - Unprocessable Entity' },
  { value: 500, label: '500 - Internal Server Error' },
  { value: 503, label: '503 - Service Unavailable' },
] as const;

export const DELAY_PRESETS = [
  { value: 0, label: 'No delay' },
  { value: 100, label: '100ms' },
  { value: 300, label: '300ms' },
  { value: 500, label: '500ms' },
  { value: 1000, label: '1 second' },
  { value: 2000, label: '2 seconds' },
  { value: 5000, label: '5 seconds' },
] as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:projectId',
} as const;
