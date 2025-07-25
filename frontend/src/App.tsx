import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

// Components
import Layout from './components/Layout/Layout';
import Navigation from './components/Layout/Navigation';

// Pages
import CmsDashboard from './pages/CmsDashboard';
import DiscoveryPage from './pages/DiscoveryPage';
import ShowDetails from './pages/ShowDetails';
import CreateShow from './pages/CreateShow';
import EditShow from './pages/EditShow';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'none',
        },
      },
    },
  },
});

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navigation />
              <Layout>
                <Routes>
                  {/* CMS Routes */}
                  <Route path="/cms" element={<CmsDashboard />} />
                  <Route path="/cms/shows/create" element={<CreateShow />} />
                  <Route path="/cms/shows/:id/edit" element={<EditShow />} />
                  
                  {/* Discovery Routes */}
                  <Route path="/discovery" element={<DiscoveryPage />} />
                  <Route path="/discovery/shows/:id" element={<ShowDetails />} />
                  
                  {/* Default redirect */}
                  <Route path="/" element={<Navigate to="/discovery" replace />} />
                  <Route path="*" element={<Navigate to="/discovery" replace />} />
                </Routes>
              </Layout>
            </Box>
          </Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App; 