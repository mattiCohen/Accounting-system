import { FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';

const PaymentMethodButton = () => {
  
  return (
    <div>
      <Typography
        variant="h6"
        sx={{
          textAlign: 'right',
          color: 'black',
          mb: 1.5, // רווח מתחת לטקסט
          fontSize:'1.125rem'
        }}
      >
        צורת תשלום
      </Typography>

      <FormControl
        fullWidth
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#F7C6C2',
            '& fieldset': {
              borderColor: '#F3BBB3',
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderColor: '#F3BBB3',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#F3BBB3',
            },
          },
        }}
      >
        <InputLabel />
        <Select defaultValue="" sx={{textAlign:'right'}}>
          <MenuItem value="מזומן">מזומן</MenuItem>
          <MenuItem value="אשראי">אשראי</MenuItem>
          <MenuItem value="שיק">שיק</MenuItem>
          <MenuItem value="העברה בנקאית">העברה בנקאית</MenuItem>
          <MenuItem value="הוראת קבע">הוראת קבע</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default PaymentMethodButton;
