import { NavLink } from "react-router-dom";
import { Button, Box, Typography } from '@mui/material';
import { useSelector } from "react-redux";

const Expenses = () => {
  
  const isInSupplier1 = useSelector(state => state.Suppliers.IsInSupliers);

  // עיצוב כפתור אחיד
  const buttonStyle = {
    backgroundColor: '#F3BBB3',
    width: { xs: '140px', sm: '160px', md: '170px', lg: '190px' },
    height: { xs: '45px', sm: '50px', md: '50px', lg: '55px' },
    borderRadius: '55px',
    fontSize: { xs: '14px', sm: '15px', md: '16px', lg: '17px' },
    color: 'black',
    '&:hover': {
      backgroundColor: '#D19793',
    },
    '&:active': {
      backgroundColor: 'linear-gradient(45deg, #e0e0e0 30%, #bdbdbd 90%)',
    },
    '&:focus': {
      backgroundColor: 'linear-gradient(45deg, #e0e0e0 30%, #bdbdbd 90%)',
      boxShadow: '0 0 5px 2px rgba(243, 187, 179, 0.5)',
    }
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#2e3166',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <hr style={{ width: '100%', border: '1px solid #F3BBB3', margin: '10px 0' }} />
      <Typography
        variant="h4"
        sx={{
          color: '#F3BBB3',
          fontWeight: 'bold',
          marginBottom: '0.2rem',
          marginTop:'0.2rem',
          textAlign: 'center'
        }}
      >
        {isInSupplier1 ? "ספקים" : "לקוחות"}
      </Typography>
      <hr style={{
        width: '100%',
        border: '1px solid #F3BBB3',
        margin: '1rem 0',
        marginBottom: '1.3rem'
      }} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 3, sm: 4, md: 6, lg: 8 },
          width: 'auto',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 3
        }}
      >

        {/* שורה ראשונה */}
        <Box sx={{ display: 'flex', gap: { xs: 2, sm: 4, md: 6, lg: 8 },
         flexWrap: 'wrap', justifyContent: 'center' }}>
          <NavLink to={isInSupplier1 ? "/Expenses/InvoicesAndPayments" : "/InCome/InvoicesAndPayments"} 
          style={{ textDecoration: 'none' }}>
            <Button sx={buttonStyle}>
              {!isInSupplier1  ?" חשבוניות ":" תשלומים "}
            </Button>
          </NavLink>

          <NavLink to={isInSupplier1 ? "/Expenses/SupplierDetails" : "/Income/CustomerDetails"} style={{ textDecoration: 'none' }}>
            <Button sx={buttonStyle}>
              פרטי {isInSupplier1 ? "ספקים" : "לקוחות"}
            </Button>
          </NavLink>
        </Box>

     
        <Box sx={{ display: 'flex', 
          gap: { xs: 2, sm: 4, md: 6, lg: 8 },
           flexWrap: 'wrap', 
           justifyContent: 'center' }}>
          {/* {!isInSupplier1&&
          <NavLink to={isInSupplier1 ? "/Expenses/InvoiceReport" : "/Income/InvoiceReport"} style={{ textDecoration: 'none' }}>
            <Button sx={buttonStyle}>
              דוח חשבוניות
            </Button>
          </NavLink> }
          {isInSupplier1&&
          <NavLink to={isInSupplier1 ? "/Expenses/PaymentReport" : "/Income/PaymentReport"} style={{ textDecoration: 'none' }}>
            <Button sx={buttonStyle}>
              דוח תשלומים
            </Button>
          </NavLink>
          } */}
     
          <NavLink to={isInSupplier1 ? "/Expenses/PaymentReport" : "/InCome/InvoiceReport"} style={{ textDecoration: 'none' }}>
            <Button sx={buttonStyle}>
              דוח {isInSupplier1 ? "תשלומים" : "חשבוניות"}
            </Button>
          </NavLink>
        </Box>
      </Box>
    </div>
  );
};

export default Expenses;
