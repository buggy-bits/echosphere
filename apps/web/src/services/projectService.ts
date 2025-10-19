import api from './api';
import { API_ENDPOINTS } from '../constants';
import {
  Project,
  CreateProjectData,
  Endpoint,
  CreateEndpointData,
  ProjectResources,
} from '../types';

export const projectService = {
  async getProjects(): Promise<Project[]> {
    const response = await api.get(API_ENDPOINTS.PROJECTS);
    return response.data.data.projects;
  },

  async getProject(id: string): Promise<Project> {
    const response = await api.get(`${API_ENDPOINTS.PROJECTS}/${id}`);
    return response.data.data.project;
  },

  async createProject(data: CreateProjectData): Promise<Project> {
    const response = await api.post(API_ENDPOINTS.PROJECTS, data);
    return response.data.data.project;
  },

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const response = await api.put(`${API_ENDPOINTS.PROJECTS}/${id}`, data);
    return response.data;
  },

  async deleteProject(id: string): Promise<void> {
    await api.delete(`${API_ENDPOINTS.PROJECTS}/${id}`);
  },

  async getProjectEndpoints(projectId: string): Promise<Endpoint[]> {
    const response = await api.get(`${API_ENDPOINTS.ENDPOINTS}?projectId=${projectId}`);
    return response.data.data.endpoints;
  },

  async createEndpoint(projectId: string, data: CreateEndpointData): Promise<Endpoint> {
    const response = await api.post(`${API_ENDPOINTS.ENDPOINTS}?projectId=${projectId}`, {
      endpoint: data,
    });
    return response.data.data.endpoint;
  },

  async updateEndpoint(projectId: string, id: string, data: Partial<Endpoint>): Promise<Endpoint> {
    const response = await api.put(`${API_ENDPOINTS.ENDPOINTS}/${id}?projectId=${projectId}`, {
      endpoint: data,
    });
    return response.data.data.endpoint;
  },

  async deleteEndpoint(id: string, projectId: string): Promise<void> {
    await api.delete(`${API_ENDPOINTS.ENDPOINTS}/${id}?projectId=${projectId}`);
  },

  async getProjectResources(projectId: string): Promise<ProjectResources> {
    const response = await api.get(`${API_ENDPOINTS.RESOURCES}?projectId=${projectId}`);
    return response.data.data.resources;
  },

  async createResource(projectId: string, name: string, data: unknown): Promise<ProjectResources> {
    const response = await api.post(`${API_ENDPOINTS.RESOURCES}?projectId=${projectId}`, {
      resource: { name, data },
    });
    return response.data.data.resources;
  },

  async updateResource(projectId: string, name: string, data: unknown): Promise<ProjectResources> {
    const response = await api.put(`${API_ENDPOINTS.RESOURCES}?projectId=${projectId}`, {
      resource: { name, data },
    });
    return response.data.data.resources;
  },

  async deleteResource(projectId: string, resourceName: string): Promise<ProjectResources> {
    const response = await api.delete(
      `${API_ENDPOINTS.RESOURCES}?projectId=${projectId}&name=${resourceName}`,
    );
    return response.data.data.resources;
  },
};
