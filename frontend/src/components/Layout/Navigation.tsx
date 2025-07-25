import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { AdminPanelSettings, Explore } from '@mui/icons-material';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getCurrentTab = () => {
    if (location.pathname.startsWith('/cms')) return 0;
    if (location.pathname.startsWith('/discovery')) return 1;
    return 1; // Default to discovery
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue === 0) {
      navigate('/cms');
    } else {
      navigate('/discovery');
    }
  };

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 0, mr: 4, fontWeight: 'bold' }}
        >
          Thamaneya
        </Typography>

        <Box sx={{ flexGrow: 1 }}>
          <Tabs
            value={getCurrentTab()}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-selected': {
                  color: 'white',
                },
              },
            }}
          >
            <Tab
              icon={<AdminPanelSettings />}
              label={isMobile ? '' : 'CMS'}
              iconPosition="start"
            />
            <Tab
              icon={<Explore />}
              label={isMobile ? '' : 'Discovery'}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {location.pathname.startsWith('/cms') && (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => navigate('/cms/shows/create')}
              sx={{ color: 'white' }}
            >
              Add Show
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 