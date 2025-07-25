import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box,
  Typography,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import { Edit, Delete, Visibility, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import apiService from '../services/api';
import { Show, QueryShowDto } from '../types/show';
import { formatDuration, formatDate } from '../utils/formatters';
import ConfirmDialog from '../components/Common/ConfirmDialog';

const CmsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Show | null>(null);

  const query: QueryShowDto = {
    page: page + 1,
    limit: pageSize,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  };

  const {
    data: showsData,
    isLoading,
    error,
  } = useQuery(['cms-shows', query], () => apiService.getShows(query));

  const deleteMutation = useMutation(
    (id: string) => apiService.deleteShow(id),
    {
      onSuccess: () => {
        toast.success('Show deleted successfully');
        queryClient.invalidateQueries(['cms-shows']);
        setConfirmDelete(null);
      },
      onError: () => {
        toast.error('Failed to delete show');
      },
    }
  );

  const handleDelete = (show: Show) => {
    setConfirmDelete(show);
  };

  const handleView = (show: Show) => {
    setSelectedShow(show);
  };

  const confirmDeleteShow = () => {
    if (confirmDelete) {
      deleteMutation.mutate(confirmDelete.id);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 150,
      renderCell: (params) => (
        <Box
          sx={{
            px: 1,
            py: 0.5,
            borderRadius: 1,
            bgcolor: 'primary.main',
            color: 'white',
            fontSize: '0.75rem',
          }}
        >
          {params.value || 'N/A'}
        </Box>
      ),
    },
    {
      field: 'language',
      headerName: 'Language',
      width: 120,
    },
    {
      field: 'duration',
      headerName: 'Duration',
      width: 120,
      valueGetter: (params: GridValueGetterParams) => {
        return params.value ? formatDuration(params.value) : 'N/A';
      },
    },
    {
      field: 'publishDate',
      headerName: 'Publish Date',
      width: 150,
      valueGetter: (params: GridValueGetterParams) => {
        return params.value ? formatDate(params.value) : 'N/A';
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 150,
      valueGetter: (params: GridValueGetterParams) => {
        return formatDate(params.value);
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Visibility />}
          label="View"
          onClick={() => handleView(params.row)}
        />,
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={() => navigate(`/cms/shows/${params.row.id}/edit`)}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={() => handleDelete(params.row)}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Content Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/cms/shows/create')}
        >
          Add New Show
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load shows. Please try again.
        </Alert>
      )}

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={showsData?.data || []}
          columns={columns}
          loading={isLoading}
          pagination
          paginationMode="server"
          rowCount={showsData?.total || 0}
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={({ page, pageSize }) => {
            setPage(page);
            setPageSize(pageSize);
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          autoHeight={false}
        />
      </Box>

      {/* Show Details Dialog */}
      <Dialog open={!!selectedShow} onClose={() => setSelectedShow(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Show Details</DialogTitle>
        <DialogContent dividers>
          {selectedShow && (
            <Box>
              <Typography variant="h6" gutterBottom>{selectedShow.title}</Typography>
              <Typography variant="body1" gutterBottom>{selectedShow.description}</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Category:</strong> {selectedShow.category || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Language:</strong> {selectedShow.language || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Duration:</strong> {selectedShow.duration ? formatDuration(selectedShow.duration) : 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Publish Date:</strong> {selectedShow.publishDate ? formatDate(selectedShow.publishDate) : 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Created At:</strong> {formatDate(selectedShow.createdAt)}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Updated At:</strong> {formatDate(selectedShow.updatedAt)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedShow(null)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete Show"
        content={`Are you sure you want to delete "${confirmDelete?.title}"? This action cannot be undone.`}
        onConfirm={confirmDeleteShow}
        onCancel={() => setConfirmDelete(null)}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
      />
    </>
  );
};

export default CmsDashboard; 