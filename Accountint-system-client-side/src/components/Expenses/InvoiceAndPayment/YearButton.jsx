import { Autocomplete, TextField } from '@mui/material';
import { useState } from 'react';

const years = [
  "2021", "2022", "2023", "2024", "2025", "2026"
];

const YearButton = ({ sx, year, setYear }) => {
  return (
    <Autocomplete
      freeSolo
      options={years}
      value={year}
      onChange={(event, newValue) => {
        // newValue יכול להיות null, אז נטפל בזה
        if (typeof newValue === 'string') {
          setYear(newValue);
        } else if (newValue && newValue.inputValue) {
          setYear(newValue.inputValue);
        } else if (newValue) {
          setYear(newValue);
        } else {
          setYear('');
        }
      }}
      onInputChange={(event, newInputValue) => {
        setYear(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{ ...sx, '& .MuiInputBase-root': { backgroundColor: '#DA9F9A' } }}
          variant="outlined"
          label="שנה"
          inputProps={{
            ...params.inputProps,
            maxLength: 4,
            inputMode: 'numeric',
            pattern: '[0-9]*',
          }}
        />
      )}
    />
  );
};

export default YearButton;
