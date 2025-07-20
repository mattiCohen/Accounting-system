import { BrowserRouter, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar } from '@mui/material';
import './App.css';
import ExpensesHomePage from './components/Expenses/ExpensesHomePage';
import HomePage from './components/HomePage';
import SettingsPage from './components/SettingsPage';

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
    <NavLink onClick={handleBackClick}>
      <img
        src="/images/curved-arrow.png"
        alt="Arrow Left"
        style={{
          width: '4rem',
          height: '4rem',
          marginLeft: '10vw',
        }}
      />
    </NavLink>
  );
}

function App() {
  return (
    <BrowserRouter >
      <Box
      
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#2e3166',
        }}
      >
        <AppBar position="sticky" sx={{ backgroundColor: '#F3BBB3' }}>
          <Toolbar 
          className="no-print"
          sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <BackButton />

            <NavLink to="/">
              <img
                src="/images/home (1).png"
                alt="Home"
                style={{
                  width: '3rem',
                  height: '3rem',
                  marginRight: '10vw',
                }}
              />
            </NavLink>
             <NavLink to="/settings">
              <img
                src="/images/הגדרות.png"
                alt="הגדרות מערכת"
                style={{
                  width: '3rem',
                  height: '3rem',
                }}
              />
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
            <Route path="/settings" element={<SettingsPage/>} />
            <Route path="/Expenses/*" element={<ExpensesHomePage />} />
            <Route path="/InCome/*" element={<ExpensesHomePage />} />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
}

export default App;
