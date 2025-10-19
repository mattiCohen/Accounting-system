import {
  Typography,
  CircularProgress,
  TextField,
  Autocomplete
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

const CardNumberButton = ({ sx, selectedCard, setSelectedCard, isSupplierCard }) => {
  const IsInSupplier = useSelector(state => state.Suppliers.IsInSupliers);
  const suppliers = useSelector(state => state.Suppliers.supplierDetailsList);
  const customers = useSelector(state => state.Customers.customersDetailsList);
  const { error, isLoading } = useSelector(state =>
    IsInSupplier ? state.Suppliers : state.Customers
  );

  const dispatch = useDispatch();
  const list = IsInSupplier ? suppliers : customers;

  const options = list.map(item => ({
    label: (IsInSupplier ? item.providerCardNumber : item.customerCardNumber)?.toString() || '',
    value: IsInSupplier ? item.providerId : item.customerId
  }));

  const [inputValue, setInputValue] = useState('');


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
          fontSize: '1.125rem',
          marginRight: isSupplierCard ? '2.8rem' : undefined,
        }}
      >
        מספר כרטיס {IsInSupplier ? 'ספק' : 'לקוח'}
      </Typography>

      <Autocomplete
        options={options}
        getOptionLabel={(option) => option?.label || option?.name || ""}
        value={selectedCard || null}
        onChange={(event, newValue) => setSelectedCard(newValue)}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            sx={{ textAlign: 'right', direction: 'rtl', ...sx }}
          />
        )}
        sx={{ direction: 'rtl' }}
      />
    </div>
  );
};

export default CardNumberButton;
