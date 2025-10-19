import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  InputAdornment,
  Fab,
} from '@mui/material';
import { Add, MoreVert, Edit, Delete, Code, Search, Api } from '@mui/icons-material';
import { Alert } from '@mui/material';
import { useProject } from '../contexts/ProjectContext';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/common/Layout';
import { LoadingButton } from '../components/common/LoadingButton';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Project } from '../types';
import { truncateString } from '../utils/string';

const schema = yup.object({
  name: yup
    .string()
    .required('Project name is required')
    .min(3, 'Name must be at least 3 characters'),
  description: yup.string().optional().default(''),
});

type ProjectFormData = yup.InferType<typeof schema>;

export function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { projects, loading, error, loadProjects, createProject, updateProject, deleteProject } =
    useProject();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProjectFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, project: Project) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  const handleCreateProject = async (data: ProjectFormData) => {
    try {
      await createProject(data.name, data.description);
      setCreateDialogOpen(false);
      reset();
    } catch {
      // Error is handled by context
    }
  };

  const handleEditProject = async (data: ProjectFormData) => {
    if (selectedProject) {
      try {
        await updateProject(selectedProject._id, data);
        setEditDialogOpen(false);
        setSelectedProject(null);
        reset();
      } catch {
        // Error is handled by context
      }
    }
  };

  const handleDeleteProject = async () => {
    if (selectedProject) {
      try {
        await deleteProject(selectedProject._id);
        setDeleteDialogOpen(false);
        setSelectedProject(null);
        handleMenuClose();
      } catch {
        // Error is handled by context
      }
    }
  };

  const openEditDialog = () => {
    if (selectedProject) {
      setValue('name', selectedProject.projectName);
      setValue('description', selectedProject.description || '');
      setEditDialogOpen(true);
      handleMenuClose();
    }
  };

  const openDeleteDialog = () => {
    setDeleteDialogOpen(true);
    // handleMenuClose();
  };

  const filteredProjects =
    (projects.length != 0 &&
      projects?.filter(
        (project) =>
          project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (project.description &&
            project.description.toLowerCase().includes(searchTerm.toLowerCase())),
      )) ||
    [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            Projects
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create and manage your mock API projects
          </Typography>
        </Box>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Search */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 400 }}
          />
        </Box>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
            }}
          >
            <Api sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 1 }}>
              {searchTerm ? 'No projects found' : 'No projects yet'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Create your first project to get started with mock APIs'}
            </Typography>
            {!searchTerm && (
              <Button
                variant="contained"
                size="large"
                startIcon={<Add />}
                onClick={() => setCreateDialogOpen(true)}
              >
                Create Project
              </Button>
            )}
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredProjects.map((project) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={project._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    maxWidth: '300px',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 32px rgba(99, 102, 241, 0.15)',
                    },
                  }}
                  onClick={() => navigate(`/projects/${project._id}`)}
                >
                  <CardContent sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Code color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {truncateString(project.projectName, 24)}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, project)}
                        sx={{ ml: 1 }}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>

                    {project.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2, minHeight: '2.5em' }}
                      >
                        {project.description}
                      </Typography>
                    )}

                    <Typography variant="caption" color="text.secondary">
                      Created {formatDate(project.createdAt)}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      size="small"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projects/${project._id}`);
                      }}
                    >
                      Open Project
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Floating Action Button */}
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
          onClick={() => setCreateDialogOpen(true)}
        >
          <Add />
        </Fab>

        {/* Context Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={openEditDialog}>
            <Edit sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={openDeleteDialog} sx={{ color: 'error.main' }}>
            <Delete sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>

        {/* Create Project Dialog */}
        <Dialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Create New Project</DialogTitle>
          <form onSubmit={handleSubmit(handleCreateProject)}>
            <DialogContent>
              <TextField
                fullWidth
                label="Project Name"
                margin="normal"
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
                autoFocus
              />
              <TextField
                fullWidth
                label="Description (optional)"
                margin="normal"
                multiline
                rows={3}
                {...register('description')}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
              <LoadingButton type="submit" variant="contained" loading={loading}>
                Create
              </LoadingButton>
            </DialogActions>
          </form>
        </Dialog>

        {/* Edit Project Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit Project</DialogTitle>
          <form onSubmit={handleSubmit(handleEditProject)}>
            <DialogContent>
              <TextField
                fullWidth
                label="Project Name"
                margin="normal"
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
                autoFocus
              />
              <TextField
                fullWidth
                label="Description (optional)"
                margin="normal"
                multiline
                rows={3}
                {...register('description')}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
              <LoadingButton type="submit" variant="contained" loading={loading}>
                Update
              </LoadingButton>
            </DialogActions>
          </form>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{selectedProject?.projectName}"? This action cannot
              be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <LoadingButton
              onClick={handleDeleteProject}
              color="error"
              variant="contained"
              loading={loading}
            >
              Delete
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
}
