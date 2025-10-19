import { BrowserRouter, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, Button } from '@mui/material';
import './App.css';
import ExpensesHomePage from './components/Expenses/ExpensesHomePage';
import HomePage from './components/HomePage';
import SettingsPage from './components/SettingsPage';
import MaintenancePage from './components/MaintenancePage';
import { fetchIsInSuppliers } from "./redux/suppliersThunk";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackClick = () => {
    if (location.pathname === '/') {
      navigate('/');
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      onClick={handleBackClick}
      variant="text"
      sx={sx}
    >
      חזור
    </Button>
  );
}

const sx = {
  color: 'black',
  fontSize: '1rem',
  '&:hover': {
    backgroundColor: '#D19793',

  },
  '&:focus': {
    outline: 'none',
    boxShadow: 'none',
  },
  '&:active': {
    backgroundColor: '#B86F6A',
    color: '#242650ff',
  },
}

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchIsInSuppliers()); // loads last value from C#
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#242650ff',
        }}
      >
        <AppBar position="sticky" sx={{ backgroundColor: '#F3BBB3' }}>
          <Toolbar
            className="no-print"
            sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}
          >
            <BackButton />

            <NavLink to="/" style={{ textDecoration: 'none' }}>
              <Button variant="text" sx={sx}>דף הבית</Button>
            </NavLink>

            <NavLink to="/settings" style={{ textDecoration: 'none' }}>
              <Button variant="text" sx={sx}>הגדרות</Button>
            </NavLink>

            <NavLink to="/maintenance" style={{ textDecoration: 'none' }}>
              <Button variant="text" sx={sx}>תחזוקה</Button>
            </NavLink>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1,
            paddingTop: '70px',
          }}
        >
          <img
            src="/images/פאנסי (1).png"
            alt="Fancy Image"
            className="logo"
            style={{
              width: '20vw',
              maxWidth: '300px',
              minWidth: '150px',
              height: 'auto',
            }}
          />
        </Box>

        <Box sx={{ flexGrow: 1, padding: 2 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/Expenses/*" element={<ExpensesHomePage />} />
            <Route path="/InCome/*" element={<ExpensesHomePage />} />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
}

export default App;
