import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Link,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Api,
  Storage,
  Settings,
  PlayArrow,
  Pause as PauseIcon,
} from '@mui/icons-material';
import { Alert } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useProject } from '../contexts/ProjectContext';
import { Layout } from '../components/common/Layout';
import { LoadingButton } from '../components/common/LoadingButton';
import { useForm } from 'react-hook-form';
import { HTTP_METHODS, STATUS_CODES, DELAY_PRESETS } from '../constants';
import Editor from '@monaco-editor/react';
import { Endpoint } from '../types';
import { truncateString } from '../utils/string';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

type EndpointFormData = {
  path: string;
  method: Endpoint['method'];
  description?: string;
  statusCode: number;
  delay: number;
  preferDynamicResponse: boolean;
};

type ResourceFormData = {
  name: string;
  data: string;
};

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [tabValue, setTabValue] = useState(0);
  const [createEndpointOpen, setCreateEndpointOpen] = useState(false);
  const [createResourceOpen, setCreateResourceOpen] = useState(false);
  const [isEditingEndpoint, setIsEditingEndpoint] = useState(false);
  const [editingEndpoint, setEditingEndpoint] = useState<Endpoint | null>(null);
  const [isEditingResource, setIsEditingResource] = useState(false);
  const [editingResourceName, setEditingResourceName] = useState<string | null>(null);
  const [responseData, setResponseData] = useState('{\n  "message": "Hello World"\n}');
  const [resourceData, setResourceData] = useState(
    '[\n  {"id": 1, "name": "example", "value": "sample"}\n]',
  );

  const {
    currentProject,
    endpoints,
    resources,
    loading,
    error,
    loadProject,
    loadProjectEndpoints,
    loadProjectResources,
    createEndpoint,
    updateEndpoint,
    createResource,
    updateResource,
    deleteResource,
    deleteEndpoint,
  } = useProject();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EndpointFormData>({
    defaultValues: {
      method: 'GET',
      statusCode: 200,
      delay: 0,
      preferDynamicResponse: false,
    },
  });

  const {
    register: registerResource,
    handleSubmit: handleSubmitResource,
    formState: { errors: resourceErrors },
    reset: resetResource,
    setValue: setResourceValue,
  } = useForm<ResourceFormData>({
    defaultValues: {
      name: '',
      data: resourceData,
    },
  });

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
      loadProjectEndpoints(projectId);
      loadProjectResources(projectId);
    }
  }, [projectId]);

  const handleCreateEndpoint = async (data: EndpointFormData) => {
    if (!projectId) return;

    try {
      let parsedResponseData;
      try {
        parsedResponseData = JSON.parse(responseData);
      } catch {
        parsedResponseData = responseData;
      }

      await createEndpoint(projectId, {
        ...data,
        responseData: parsedResponseData,
      });
      setCreateEndpointOpen(false);
      reset();
      setResponseData('{\n  "message": "Hello World"\n}');
    } catch {
      // Error is handled by context
    }
  };

  const handleUpdateEndpoint = async (data: EndpointFormData) => {
    if (!editingEndpoint) return;
    if (!projectId) return;

    try {
      let parsedResponseData;
      try {
        parsedResponseData = JSON.parse(responseData);
      } catch {
        parsedResponseData = responseData;
      }

      await updateEndpoint(projectId, editingEndpoint._id, {
        ...data,
        responseData: parsedResponseData,
      });
      setCreateEndpointOpen(false);
      reset();
      setResponseData('{\n  "message": "Hello World"\n}');
      setIsEditingEndpoint(false);
      setEditingEndpoint(null);
    } catch {
      // Error is handled by context
    }
  };

  const handleCreateResource = async (data: ResourceFormData) => {
    if (!projectId) return;

    try {
      let parsedResourceData;
      try {
        parsedResourceData = JSON.parse(resourceData);
      } catch {
        parsedResourceData = resourceData;
      }

      await createResource(projectId, data.name, parsedResourceData);
      setCreateResourceOpen(false);
      resetResource();
      setResourceData('[\n  {"id": 1, "name": "example", "value": "sample"}\n]');
    } catch {
      // Error is handled by context
    }
  };
  const handleDeleteResource = async (data: { name: string }) => {
    if (!projectId) return;

    try {
      await deleteResource(projectId, data.name);
    } catch {
      // Error is handled by context
    }
  };

  const handleUpdateResource = async (data: ResourceFormData) => {
    if (!projectId) return;
    const resourceNameToUpdate = editingResourceName || data.name;

    try {
      let parsedResourceData;
      try {
        parsedResourceData = JSON.parse(resourceData);
      } catch {
        parsedResourceData = resourceData;
      }

      await updateResource(projectId, resourceNameToUpdate, parsedResourceData);
      setCreateResourceOpen(false);
      resetResource();
      setResourceData('[\n  {"id": 1, "name": "example", "value": "sample"}\n]');
      setIsEditingResource(false);
      setEditingResourceName(null);
    } catch {
      // Error is handled by context
    }
  };

  const openEditEndpointDialog = (endpoint: Endpoint) => {
    setIsEditingEndpoint(true);
    setEditingEndpoint(endpoint);
    reset({
      method: endpoint.method,
      path: endpoint.path,
      description: endpoint.description || '',
      statusCode: endpoint.statusCode,
      delay: endpoint.delay,
      preferDynamicResponse: endpoint.preferDynamicResponse,
    });
    setResponseData(JSON.stringify(endpoint.responseData, null, 2));
    setCreateEndpointOpen(true);
  };

  const openEditResourceDialog = (resourceName: string) => {
    const resourceArray = (resources && resources[resourceName]) || [];
    setIsEditingResource(true);
    setEditingResourceName(resourceName);
    setResourceValue('name', resourceName);
    setResourceData(JSON.stringify(resourceArray, null, 2));
    setCreateResourceOpen(true);
  };

  if (!currentProject) {
    return (
      <Layout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Typography>Loading...</Typography>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
            {truncateString(currentProject.projectName, 100)}
          </Typography>
          {currentProject.description && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {currentProject.description}
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip label={`${endpoints.length} endpoints`} variant="outlined" />
            {/* <Chip label={`${Object.keys(resources).length} resources`} variant="outlined" /> */}
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            aria-label="project tabs"
          >
            <Tab label="Endpoints" icon={<Api />} iconPosition="start" />
            <Tab label="Resources" icon={<Storage />} iconPosition="start" />
            <Tab label="Settings" icon={<Settings />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Endpoints Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography variant="h6">API Endpoints</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setCreateEndpointOpen(true)}
            >
              Add Endpoint
            </Button>
          </Box>

          {endpoints.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Api sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  No endpoints yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Create your first API endpoint to get started
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setCreateEndpointOpen(true)}
                >
                  Add Endpoint
                </Button>
              </CardContent>
            </Card>
          ) : (
            <List>
              {endpoints.map((endpoint) => (
                <Card key={endpoint._id} sx={{ mb: 2 }}>
                  <ListItem>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      <Chip
                        label={endpoint.method}
                        color={endpoint.method === 'GET' ? 'success' : 'primary'}
                        size="small"
                        sx={{ minWidth: 60 }}
                      />
                    </Box>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" fontWeight="medium">
                            {endpoint.path}
                          </Typography>
                          <Chip label={endpoint.statusCode} size="small" variant="outlined" />
                          {endpoint.delay > 0 && (
                            <Chip
                              label={`${endpoint.delay}ms`}
                              size="small"
                              variant="outlined"
                              color="warning"
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" fontWeight="medium">
                            {endpoint.description + ', '}
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {'Test endpoint at '}
                            <Link
                              onClick={() => {
                                navigator.clipboard.writeText(this.state.textToCopy);
                              }}
                            >
                              {'http://localhost:3000/api/v1/mock/projects/' +
                                projectId +
                                endpoint.path}
                            </Link>
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton>
                        {endpoint.isActive ? (
                          <PauseIcon color="error" />
                        ) : (
                          <PlayArrow color="success" />
                        )}
                      </IconButton>
                      <IconButton onClick={() => openEditEndpointDialog(endpoint)}>
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => {
                          if (projectId) {
                            deleteEndpoint(endpoint._id, projectId);
                          }
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Card>
              ))}
            </List>
          )}
        </TabPanel>

        {/* Resources Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography variant="h6">Data Resources</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setCreateResourceOpen(true)}
            >
              Add Resource
            </Button>
          </Box>

          {resources && Object.keys(resources).length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Storage sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  No resources yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Create data resources to share across your endpoints
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setCreateResourceOpen(true)}
                >
                  Add Resource
                </Button>
              </CardContent>
            </Card>
          ) : (
            <List>
              {resources &&
                Object.keys(resources).length > 0 &&
                Object.entries(resources).map(([resourceName, resourceData]) => (
                  <Card key={resourceName} sx={{ mb: 2 }}>
                    <ListItem>
                      <ListItemText
                        primary={resourceName}
                        secondary={`${resourceData.length} items`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton onClick={() => openEditResourceDialog(resourceName)}>
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => {
                            handleDeleteResource({ name: resourceName });
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </Card>
                ))}
            </List>
          )}
        </TabPanel>

        {/* Settings Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Project Settings
          </Typography>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Project settings will be available in a future update.
              </Typography>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Create/Edit Endpoint Dialog */}
        <Dialog
          open={createEndpointOpen}
          onClose={() => {
            setCreateEndpointOpen(false);
            setIsEditingEndpoint(false);
            setEditingEndpoint(null);
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>{isEditingEndpoint ? 'Edit Endpoint' : 'Create New Endpoint'}</DialogTitle>
          <form
            onSubmit={handleSubmit(isEditingEndpoint ? handleUpdateEndpoint : handleCreateEndpoint)}
          >
            <DialogContent>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  select
                  label="Method"
                  {...register('method', { required: 'Method is required' })}
                  error={!!errors.method}
                  helperText={errors.method?.message}
                  sx={{ minWidth: 120 }}
                >
                  {HTTP_METHODS.map((method) => (
                    <MenuItem key={method} value={method}>
                      {method}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  label="Path"
                  placeholder="/api/users"
                  {...register('path', { required: 'Path is required' })}
                  error={!!errors.path}
                  helperText={errors.path?.message}
                />
              </Box>

              <TextField
                fullWidth
                label="Description (optional)"
                multiline
                rows={2}
                {...register('description')}
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  select
                  label="Status Code"
                  {...register('statusCode', {
                    required: 'Status code is required',
                  })}
                  error={!!errors.statusCode}
                  helperText={errors.statusCode?.message}
                  sx={{ minWidth: 200 }}
                >
                  {STATUS_CODES.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Delay"
                  {...register('delay', { required: 'Delay is required' })}
                  error={!!errors.delay}
                  helperText={errors.delay?.message}
                  sx={{ minWidth: 150 }}
                >
                  {DELAY_PRESETS.map((preset) => (
                    <MenuItem key={preset.value} value={preset.value}>
                      {preset.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <FormControlLabel
                control={<Switch {...register('preferDynamicResponse')} defaultChecked={false} />}
                label="Use dynamic response data"
                sx={{ mb: 2 }}
              />

              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Response Data
              </Typography>
              <Box
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                <Editor
                  height="300px"
                  defaultLanguage="json"
                  value={responseData}
                  onChange={(value) => setResponseData(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                  }}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setCreateEndpointOpen(false);
                  setIsEditingEndpoint(false);
                  setEditingEndpoint(null);
                }}
              >
                Cancel
              </Button>
              <LoadingButton type="submit" variant="contained" loading={loading}>
                {isEditingEndpoint ? 'Update Endpoint' : 'Create Endpoint'}
              </LoadingButton>
            </DialogActions>
          </form>
        </Dialog>

        {/* Create/Edit Resource Dialog */}
        <Dialog
          open={createResourceOpen}
          onClose={() => {
            setCreateResourceOpen(false);
            setIsEditingResource(false);
            setEditingResourceName(null);
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>{isEditingResource ? 'Edit Resource' : 'Create New Resource'}</DialogTitle>
          <form
            onSubmit={handleSubmitResource(
              isEditingResource ? handleUpdateResource : handleCreateResource,
            )}
          >
            <DialogContent>
              <TextField
                fullWidth
                label="Resource Name"
                placeholder="e.g., products, users, orders"
                {...registerResource('name', {
                  required: 'Resource name is required',
                })}
                error={!!resourceErrors.name}
                helperText={resourceErrors.name?.message || 'Name for your resource collection'}
                sx={{ mb: 3 }}
                disabled={isEditingResource}
              />

              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Resource Data (JSON Array)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Enter the data as a JSON array. Each object in the array represents one item in your
                resource.
              </Typography>
              <Box
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                <Editor
                  height="300px"
                  defaultLanguage="json"
                  value={resourceData}
                  onChange={(value) => setResourceData(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                  }}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setCreateResourceOpen(false);
                  setIsEditingResource(false);
                  setEditingResourceName(null);
                }}
              >
                Cancel
              </Button>
              <LoadingButton type="submit" variant="contained" loading={loading}>
                {isEditingResource ? 'Update Resource' : 'Create Resource'}
              </LoadingButton>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Layout>
  );
}
