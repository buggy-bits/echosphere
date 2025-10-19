import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Code, Speed, Security, Cloud, ArrowForward, GitHub, Twitter } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Code sx={{ fontSize: 40 }} />,
      title: 'Mock API Creation',
      description:
        'Create realistic mock APIs with custom endpoints, responses, and data structures in minutes.',
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'Instant Setup',
      description:
        'Get your mock APIs running instantly with zero configuration. Perfect for rapid prototyping.',
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Secure & Reliable',
      description:
        'Enterprise-grade security with reliable uptime. Your mock APIs are always available when you need them.',
    },
    {
      icon: <Cloud sx={{ fontSize: 40 }} />,
      title: 'Cloud Hosted',
      description:
        'Fully managed cloud infrastructure. No servers to maintain, just focus on building great applications.',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            <Typography variant="h5" component="div" fontWeight="bold" color="primary">
              EchoSphere
            </Typography>
            <Box>
              {isAuthenticated ? (
                <Button variant="contained" onClick={() => navigate('/projects')} sx={{ mr: 1 }}>
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="outlined" onClick={() => navigate('/auth/login')} sx={{ mr: 1 }}>
                    Login
                  </Button>
                  <Button variant="contained" onClick={() => navigate('/auth/register')}>
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg">
        <Box
          sx={{
            py: { xs: 8, md: 12 },
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 700,
              mb: 3,
              background: 'linear-gradient(45deg, #6366f1 30%, #10b981 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Mock APIs Made Simple
          </Typography>

          <Typography
            variant="h5"
            sx={{
              mb: 4,
              color: 'text.secondary',
              fontWeight: 400,
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            Create, manage, and deploy mock APIs in seconds. Perfect for frontend development,
            testing, and prototyping without backend dependencies.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate(isAuthenticated ? '/projects' : '/auth/register')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: 2,
              }}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/auth/login')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: 2,
              }}
            >
              View Demo
            </Button>
          </Box>
        </Box>

        {/* Features Section */}
        <Box sx={{ py: { xs: 8, md: 12 } }}>
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              mb: 2,
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            Everything you need to mock APIs
          </Typography>

          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              mb: 6,
              color: 'text.secondary',
              fontWeight: 400,
            }}
          >
            Powerful features that make API mocking effortless
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 32px rgba(99, 102, 241, 0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            py: { xs: 8, md: 12 },
            textAlign: 'center',
            background:
              'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
            borderRadius: 3,
            mb: 8,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              fontSize: { xs: '1.8rem', md: '2.2rem' },
            }}
          >
            Ready to accelerate your development?
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mb: 4,
              color: 'text.secondary',
              fontWeight: 400,
            }}
          >
            Join thousands of developers who trust EchoSphere for their API mocking needs.
          </Typography>

          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => navigate(isAuthenticated ? '/projects' : '/auth/register')}
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              borderRadius: 2,
            }}
          >
            Start Building Now
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          py: 4,
          mt: 8,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © 2025 EchoSphere. All rights reserved.
            </Typography>
            <Box>
              <IconButton color="inherit" sx={{ mr: 1 }}>
                <GitHub />
              </IconButton>
              <IconButton color="inherit">
                <Twitter />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
