export interface User {
  id: string;
  userName: string;
  email: string;
  createdAt: string;
}

export interface Project {
  _id: string;
  projectName: string;
  description?: string;
  createdAt: string;
  updatedAt: string;

  baseUrl: string;
}

export interface Endpoint {
  _id: string;
  path: string;
  description?: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';
  preferDynamicResponse: boolean;
  responseData: any;
  statusCode: number;
  delay: number;
  headers?: Record<string, string>;
  isActive: boolean;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  name: string;
  data: any;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectResources {
  [resourceName: string]: any[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface ProjectState {
  currentProject: Project | null;
  projects: Project[];
  endpoints: Endpoint[];
  resources: ProjectResources;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  userName: string;
  email: string;
  password: string;
}

export interface CreateProjectData {
  project: { projectName: string; description?: string };
}

export interface CreateEndpointData {
  path: string;
  method: Endpoint['method'];
  description?: string;
  responseData: any;
  statusCode: number;
  delay: number;
  headers?: Record<string, string>;
}
