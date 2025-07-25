import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Skeleton,
  Alert,
  Pagination,
  Stack,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { Search, PlayArrow, Info, Clear } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

import apiService from '../services/api';
import { Show, QueryShowDto } from '../types/show';
import { formatDuration } from '../utils/formatters';

const DiscoveryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  const query: QueryShowDto = {
    search: searchTerm || undefined,
    category: selectedCategory || undefined,
    language: selectedLanguage || undefined,
    page,
    limit,
    sortBy: sortBy,
    sortOrder: sortOrder,
  };

  const {
    data: showsData,
    isLoading,
    error,
    refetch,
  } = useQuery(['discovery-shows', query], () => apiService.searchShows(query), {
    keepPreviousData: true,
  });

  const { data: categories = [] } = useQuery(
    'discovery-categories',
    () => apiService.getDiscoveryCategories(),
    { staleTime: 5 * 60 * 1000 } // 5 minutes
  );

  const { data: languages = [] } = useQuery(
    'discovery-languages',
    () => apiService.getDiscoveryLanguages(),
    { staleTime: 5 * 60 * 1000 } // 5 minutes
  );

  const handleSearch = () => {
    setPage(1);
    refetch();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLanguage('');
    setPage(1);
  };

  const handleShowClick = (show: Show) => {
    navigate(`/discovery/shows/${show.id}`);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const totalPages = showsData ? Math.ceil(showsData.total / limit) : 0;

  return (
    <Box>
      <Helmet>
        <title>Discover Shows - Thamaneya</title>
        <meta name="description" content="Discover and browse shows in the Thamaneya content library" />
      </Helmet>

      <Typography variant="h4" component="h1" gutterBottom>
        Discover Shows
      </Typography>

      {/* Search and Filter Section */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search shows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                label="Language"
              >
                <MenuItem value="">All Languages</MenuItem>
                {languages.map((language) => (
                  <MenuItem key={language} value={language}>
                    {language}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="outlined"
              onClick={handleClearFilters}
              fullWidth
              startIcon={<Clear />}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Results Section */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load shows. Please try again.
        </Alert>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {showsData?.total || 0} shows found
            </Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort by"
              >
                <MenuItem value="createdAt">Date Added</MenuItem>
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="duration">Duration</MenuItem>
                <MenuItem value="category">Category</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {showsData?.data.length === 0 ? (
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No shows found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search criteria or filters.
              </Typography>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {showsData?.data.map((show) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={show.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      },
                    }}
                    onClick={() => navigate(`/discovery/shows/${show.id}`)}
                  >
                    <Box
                      sx={{
                        height: 200,
                        bgcolor: 'grey.200',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      <PlayArrow sx={{ fontSize: 48, color: 'grey.500' }} />
                      {show.duration && (
                        <Chip
                          label={formatDuration(show.duration)}
                          size="small"
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            bgcolor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                          }}
                        />
                      )}
                    </Box>
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" component="h2" gutterBottom noWrap>
                        {show.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                        {show.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 'auto' }}>
                        {show.category && (
                          <Chip label={show.category} size="small" color="primary" />
                        )}
                        {show.language && (
                          <Chip label={show.language} size="small" variant="outlined" />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Pagination */}
          {showsData && showsData.total > limit && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={Math.ceil(showsData.total / limit)}
                page={page}
                onChange={(_, newPage) => setPage(newPage)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default DiscoveryPage; 