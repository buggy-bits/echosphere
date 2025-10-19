import { createContext, useContext, useReducer, ReactNode } from 'react';
import { ProjectState, Project, Endpoint, ProjectResources } from '../types';
import { projectService } from '../services/projectService';

type ProjectAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'SET_CURRENT_PROJECT'; payload: Project | null }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'REMOVE_PROJECT'; payload: string }
  | { type: 'SET_ENDPOINTS'; payload: Endpoint[] }
  | { type: 'ADD_ENDPOINT'; payload: Endpoint }
  | { type: 'UPDATE_ENDPOINT'; payload: Endpoint }
  | { type: 'REMOVE_ENDPOINT'; payload: string }
  | { type: 'SET_RESOURCES'; payload: ProjectResources }
  | { type: 'ADD_RESOURCE'; payload: { resourceName: string; data: any[] } }
  | { type: 'UPDATE_RESOURCE'; payload: { resourceName: string; data: any[] } }
  | { type: 'REMOVE_RESOURCE'; payload: string };

interface ProjectContextType extends ProjectState {
  loadProjects: () => Promise<void>;
  loadProject: (id: string) => Promise<void>;
  createProject: (name: string, description?: string) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  loadProjectEndpoints: (projectId: string) => Promise<void>;
  createEndpoint: (projectId: string, data: any) => Promise<void>;
  updateEndpoint: (projectId: string, id: string, data: Partial<Endpoint>) => Promise<void>;
  deleteEndpoint: (id: string, projectId: string) => Promise<void>;
  loadProjectResources: (projectId: string) => Promise<void>;
  createResource: (projectId: string, name: string, data: any) => Promise<void>;
  updateResource: (projectId: string, resourceName: string, data: any) => Promise<void>;
  deleteResource: (projectId: string, resourceName: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const initialState: ProjectState = {
  currentProject: null,
  projects: [],
  endpoints: [],
  resources: {
    users: [
      { id: 1, name: 'example', value: 'sample' },
      { id: 2, name: 'example2', value: 'sample2' },
    ],
  },
  loading: false,
  error: null,
};

function projectReducer(state: ProjectState, action: ProjectAction): ProjectState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload, loading: false };
    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProject: action.payload };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map((p) => (p._id === action.payload._id ? action.payload : p)),
        currentProject:
          state.currentProject?._id === action.payload._id ? action.payload : state.currentProject,
      };
    case 'REMOVE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter((p) => p._id !== action.payload),
        currentProject: state.currentProject?._id === action.payload ? null : state.currentProject,
      };
    case 'SET_ENDPOINTS':
      return { ...state, endpoints: action.payload };
    case 'ADD_ENDPOINT':
      return { ...state, endpoints: [...state.endpoints, action.payload] };
    case 'UPDATE_ENDPOINT':
      return {
        ...state,
        endpoints: state.endpoints.map((e) => (e._id === action.payload._id ? action.payload : e)),
      };
    case 'REMOVE_ENDPOINT':
      return {
        ...state,
        endpoints: state.endpoints.filter((e) => e._id !== action.payload),
      };
    case 'SET_RESOURCES':
      return {
        ...state,
        resources: action.payload,
      };
    case 'ADD_RESOURCE':
      return {
        ...state,
        resources: {
          ...state.resources,
          [action.payload.resourceName]: action.payload.data,
        },
      };
    case 'UPDATE_RESOURCE':
      return {
        ...state,
        resources: {
          ...state.resources,
          [action.payload.resourceName]: action.payload.data,
        },
      };
    case 'REMOVE_RESOURCE':
      return {
        ...state,
        resources: Object.fromEntries(
          Object.entries(state.resources).filter(([key]) => key !== action.payload),
        ),
      };
    default:
      return state;
  }
}

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  const loadProjects = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const projects = await projectService.getProjects();
      dispatch({ type: 'SET_PROJECTS', payload: projects });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Failed to load projects',
      });
    }
  };

  const loadProject = async (id: string) => {
    try {
      const project = await projectService.getProject(id);
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Failed to load project',
      });
    }
  };

  const createProject = async (name: string, description?: string) => {
    try {
      const project = await projectService.createProject({
        project: { projectName: name, description },
      });
      dispatch({ type: 'ADD_PROJECT', payload: project });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Failed to create project',
      });
      throw error;
    }
  };

  const updateProject = async (id: string, data: Partial<Project>) => {
    try {
      const project = await projectService.updateProject(id, data);
      dispatch({ type: 'UPDATE_PROJECT', payload: project });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Failed to update project',
      });
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await projectService.deleteProject(id);
      dispatch({ type: 'REMOVE_PROJECT', payload: id });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Failed to delete project',
      });
      throw error;
    }
  };

  const loadProjectEndpoints = async (projectId: string) => {
    try {
      const endpoints = await projectService.getProjectEndpoints(projectId);
      dispatch({ type: 'SET_ENDPOINTS', payload: endpoints });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Failed to load endpoints',
      });
    }
  };

  const createEndpoint = async (projectId: string, data: any) => {
    try {
      const endpoint = await projectService.createEndpoint(projectId, data);
      dispatch({ type: 'ADD_ENDPOINT', payload: endpoint });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Failed to create endpoint',
      });
      throw error;
    }
  };

  const updateEndpoint = async (projectId: string, id: string, data: Partial<Endpoint>) => {
    try {
      const endpoint = await projectService.updateEndpoint(projectId, id, data);
      dispatch({ type: 'UPDATE_ENDPOINT', payload: endpoint });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Failed to update endpoint',
      });
      throw error;
    }
  };

  const deleteEndpoint = async (id: string, projectId: string) => {
    try {
      await projectService.deleteEndpoint(id, projectId);
      dispatch({ type: 'REMOVE_ENDPOINT', payload: id });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Failed to delete endpoint',
      });
      throw error;
    }
  };

  const loadProjectResources = async (projectId: string) => {
    try {
      const resources = await projectService.getProjectResources(projectId);
      dispatch({ type: 'SET_RESOURCES', payload: resources });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Failed to load resources',
      });
    }
  };

  const createResource = async (projectId: string, name: string, data: any) => {
    try {
      const resources = await projectService.createResource(projectId, name, data);
      dispatch({ type: 'SET_RESOURCES', payload: resources });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Failed to create resource',
      });
      throw error;
    }
  };

  const updateResource = async (projectId: string, resourceName: string, data: any) => {
    try {
      const resources = await projectService.updateResource(projectId, resourceName, data);
      dispatch({ type: 'SET_RESOURCES', payload: resources });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Failed to update resource',
      });
      throw error;
    }
  };

  const deleteResource = async (projectId: string, resourceName: string) => {
    try {
      const resources = await projectService.deleteResource(projectId, resourceName);
      dispatch({ type: 'SET_RESOURCES', payload: resources });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Failed to delete resource',
      });
      throw error;
    }
  };

  const value: ProjectContextType = {
    ...state,
    loadProjects,
    loadProject,
    createProject,
    updateProject,
    deleteProject,
    loadProjectEndpoints,
    createEndpoint,
    updateEndpoint,
    deleteEndpoint,
    loadProjectResources,
    createResource,
    updateResource,
    deleteResource,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
