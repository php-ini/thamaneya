import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Skeleton,
  Alert,
  Grid,
} from '@mui/material';
import { ArrowBack, PlayArrow, Edit } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';

import apiService from '../services/api';
import { formatDuration, formatDate } from '../utils/formatters';

const ShowDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: show,
    isLoading,
    error,
  } = useQuery(['show-details', id], () => apiService.getShowDetails(id!), {
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Box>
        <Skeleton variant="rectangular" height={400} />
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="text" height={32} />
          <Skeleton variant="text" height={24} />
          <Skeleton variant="text" height={24} />
        </Box>
      </Box>
    );
  }

  if (error || !show) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Failed to load show details. Please try again.
      </Alert>
    );
  }

  return (
    <>
      <Helmet>
        <title>{show.title} - Thamaneya</title>
        <meta name="description" content={show.description} />
      </Helmet>

      <Box>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Back
        </Button>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <Box
                sx={{
                  height: 400,
                  bgcolor: 'grey.200',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <PlayArrow sx={{ fontSize: 64, color: 'grey.500' }} />
                {show.duration && (
                  <Chip
                    label={formatDuration(show.duration)}
                    size="medium"
                    sx={{
                      position: 'absolute',
                      bottom: 16,
                      right: 16,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                    }}
                  />
                )}
              </Box>
              <CardContent>
                <Typography variant="h4" component="h1" gutterBottom>
                  {show.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {show.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {show.category && (
                    <Chip label={show.category} color="primary" />
                  )}
                  {show.language && (
                    <Chip label={show.language} variant="outlined" />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Published: {show.publishDate ? formatDate(show.publishDate) : 'Not specified'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Show Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Duration
                    </Typography>
                    <Typography variant="body1">
                      {show.duration ? formatDuration(show.duration) : 'Not specified'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Category
                    </Typography>
                    <Typography variant="body1">
                      {show.category || 'Not specified'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Language
                    </Typography>
                    <Typography variant="body1">
                      {show.language || 'Not specified'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(show.createdAt)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(show.updatedAt)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ShowDetails; 