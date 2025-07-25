import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
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
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

import apiService from '../services/api';
import { CreateShowDto, ShowCategory, ShowLanguage } from '../types/show';

const CreateShow: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateShowDto>({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      language: '',
      duration: undefined,
      publishDate: '',
    },
  });

  const createMutation = useMutation(
    (data: CreateShowDto) => apiService.createShow(data),
    {
      onSuccess: () => {
        toast.success('Show created successfully');
        queryClient.invalidateQueries(['cms-shows']);
        navigate('/cms');
      },
      onError: () => {
        toast.error('Failed to create show');
      },
    }
  );

  const onSubmit = (data: CreateShowDto) => {
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
    createMutation.mutate(payload);
  };

  const handleCancel = () => {
    navigate('/cms');
  };

  return (
    <>
      <Helmet>
        <title>Create New Show - Thamaneya</title>
        <meta name="description" content="Create a new show in the content management system" />
      </Helmet>

      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Show
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
                      {isSubmitting ? 'Creating...' : 'Create Show'}
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

export default CreateShow; 