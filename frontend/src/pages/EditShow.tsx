import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Grid,
  Skeleton,
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

import apiService from '../services/api';
import { UpdateShowDto, ShowCategory, ShowLanguage } from '../types/show';

const EditShow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: show,
    isLoading,
    error,
  } = useQuery(['show', id], () => apiService.getShow(id!), {
    enabled: !!id,
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateShowDto>({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      language: '',
      duration: undefined,
      publishDate: '',
    },
  });

  // Update form when show data is loaded
  React.useEffect(() => {
    if (show) {
      reset({
        title: show.title,
        description: show.description || '',
        category: show.category || '',
        language: show.language || '',
        duration: show.duration,
        publishDate: show.publishDate
          ? new Date(show.publishDate).toISOString().slice(0, 16)
          : '',
      });
    }
  }, [show, reset]);

  const updateMutation = useMutation(
    (data: UpdateShowDto) => apiService.updateShow(id!, data),
    {
      onSuccess: () => {
        toast.success('Show updated successfully');
        queryClient.invalidateQueries(['cms-shows']);
        queryClient.invalidateQueries(['show', id]);
        navigate('/cms');
      },
      onError: () => {
        toast.error('Failed to update show');
      },
    }
  );

  const onSubmit = (data: UpdateShowDto) => {
    let publishDate: string | undefined = undefined;
    if (data.publishDate) {
      let dateString = data.publishDate;
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateString)) {
        dateString += ':00';
      }
      const dateObj = new Date(dateString);
      if (!isNaN(dateObj.getTime())) {
        publishDate = dateObj.toISOString();
      } else {
        alert('Invalid date format. Please select a valid date and time.');
        return;
      }
    }
    const payload = { ...data, publishDate };
    updateMutation.mutate(payload);
  };

  const handleCancel = () => {
    navigate('/cms');
  };

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
        <title>Edit Show - {show.title} - Thamaneya</title>
        <meta name="description" content="Edit show details in the content management system" />
      </Helmet>

      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Show: {show.title}
        </Typography>

        <Card sx={{ maxWidth: 800 }}>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Controller
                    name="title"
                    control={control}
                    rules={{ required: 'Title is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Title"
                        fullWidth
                        error={!!errors.title}
                        helperText={errors.title?.message}
                        required
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select {...field} label="Category">
                          <MenuItem value="">Select Category</MenuItem>
                          {Object.values(ShowCategory).map((category) => (
                            <MenuItem key={category} value={category}>
                              {category}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="language"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Language</InputLabel>
                        <Select {...field} label="Language">
                          <MenuItem value="">Select Language</MenuItem>
                          {Object.values(ShowLanguage).map((language) => (
                            <MenuItem key={language} value={language}>
                              {language}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="duration"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Duration (seconds)"
                        type="number"
                        fullWidth
                        error={!!errors.duration}
                        helperText={errors.duration?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="publishDate"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Publish Date"
                        type="datetime-local"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        error={!!errors.publishDate}
                        helperText={errors.publishDate?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<Save />}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Updating...' : 'Update Show'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default EditShow; 