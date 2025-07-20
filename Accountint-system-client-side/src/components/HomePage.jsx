import { Box, Button } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { setIsInSupliers } from '../redux/SuppliersSlice';

const HomePage = () => {
  const dispatch = useDispatch();

  const handleActive = (s) => {
    dispatch(setIsInSupliers(s));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#2e3166',
        padding: 2,
        paddingTop: '20vh',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: { xs: 4, sm: 6, md: 10, lg: 12 }, 
          flexWrap: 'wrap', 
        }}
      >
        <NavLink to="/Expenses" style={{ textDecoration: 'none' }} onClick={() => handleActive(true)}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#F3BBB3',
              color: 'black',
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
              fontWeight: 'bold',
              borderRadius: '35px',
              width: { xs: '200px', sm: '220px', md: '230px' },
              height: { xs: '50px', sm: '55px', md: '60px' },
              '&:hover': {
                backgroundColor: '#D19793',
              },
            }}
          >
            הוצאות
          </Button>
        </NavLink>

        <NavLink to="/InCome" style={{ textDecoration: 'none' }} onClick={() => handleActive(false)}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#F3BBB3',
              color: 'black',
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
              fontWeight: 'bold',
              borderRadius: '35px',
              width: { xs: '200px', sm: '220px', md: '230px' },
              height: { xs: '50px', sm: '55px', md: '60px' },
              '&:hover': {
                backgroundColor: '#D19793',
              },
            }}
          >
            הכנסות
          </Button>
        </NavLink>
      </Box>
    </Box>
  );
};

export default HomePage;
