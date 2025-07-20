import {
  Typography,
  CircularProgress,
  TextField,
  Autocomplete
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchSuppliers } from '../../../redux/suppliersThunk';
import { fetchCustomers } from '../../../redux/customersThunk';

const SupplierNameButton = ({ sx, selectedName, setSelectedName }) => {
  const IsInsupplier1 = useSelector(state => state.Suppliers.IsInSupliers);
  const suppliers = useSelector(state => state.Suppliers.supplierDetailsList);
  const customers = useSelector(state => state.Customers.customersDetailsList);
  const { error, isLoading } = useSelector(state =>
    IsInsupplier1 ? state.Suppliers : state.Customers
  );

  const dispatch = useDispatch();
  const list = IsInsupplier1 ? suppliers : customers;

   const options = list.map(item => ({
    label: IsInsupplier1 ? item.providerName : item.customerName,
    value: IsInsupplier1 ? item.providerId : item.customerId
  }));
  
  const [inputValue, setInputValue] = useState('');


  useEffect(() => {
    if (IsInsupplier1) {
      dispatch(fetchSuppliers());
    } else {
      dispatch(fetchCustomers());
    }
  }, [IsInsupplier1, dispatch]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', color: 'black' }}>
        <CircularProgress style={{ color: 'black' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', color: 'black', marginTop: '1rem' }}>
        <ErrorOutlineIcon style={{ marginRight: '0.5rem' }} />
        <span>שגיאת מערכת</span>
      </div>
    );
  }

 

  return (
    <div>
      <Typography
        variant="h6"
        sx={{
          textAlign: 'right',
          color: 'black',
          mb: 1.5,
          fontSize: '1.125rem'
        }}
      >
        שם {IsInsupplier1 ? 'ספק' : 'לקוח'}
      </Typography>

      <Autocomplete
        options={options}
        getOptionLabel={(option) => option.label}
        value={selectedName || null}
        onChange={(event, newValue) => {
          setSelectedName(newValue);
        }}
        inputValue={inputValue}
        onInputChange={(event,newInputValue) => setInputValue(newInputValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label=""
            variant="outlined"
            sx={{ textAlign: 'right', direction: 'rtl', ...sx }}
          />
        )}
        sx={{ direction: 'rtl', ...sx }}
      />
    </div>
  );
};

export default SupplierNameButton;
