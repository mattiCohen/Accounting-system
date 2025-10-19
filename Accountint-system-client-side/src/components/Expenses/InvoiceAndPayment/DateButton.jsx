import { useState } from 'react';
import { TextField } from '@mui/material';

const isLeapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

const daysInMonth = (month, year) => {
  switch (month) {
    case 2:
      return isLeapYear(year) ? 29 : 28;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    default:
      return 31;
  }
};

const isValidDate = (day, month, year) => {
  if (month < 1 || month > 12) return false;
  if (year < 2020 || year > 2036) return false;
  const maxDay = daysInMonth(month, year);
  if (day < 1 || day > maxDay) return false;
  return true;
};

const formatDateInput = (input) => {
  let numeric = input.replace(/\D/g, '');

  if (numeric.length === 6) {
    const day = numeric.slice(0, 2);
    const month = numeric.slice(2, 4);
    const year = '20' + numeric.slice(4, 6);
    return `${day}/${month}/${year}`;
  }

  if (numeric.length === 8) {
    const day = numeric.slice(0, 2);
    const month = numeric.slice(2, 4);
    const year = numeric.slice(4, 8);
    return `${day}/${month}/${year}`;
  }

  if (numeric.length <= 2) {
    return numeric;
  }
  if (numeric.length <= 4) {
    return numeric.slice(0, 2) + '/' + numeric.slice(2);
  }
  if (numeric.length <= 8) {
    return numeric.slice(0, 2) + '/' + numeric.slice(2, 4) + '/' + numeric.slice(4);
  }

  return input;
};

const isDateInRange = (dateStr, startYear, endYear) => {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(dateStr)) return false;

  const [day, month, year] = dateStr.split('/').map(Number);

  if (!isValidDate(day, month, year)) return false;

  return year >= startYear && year <= endYear;
};

const DateButton = ({ date, setDate, sx }) => {
  const [error, setError] = useState(false);

  const formatDateOnBlur = (input) => {
    let numeric = input.replace(/\D/g, '');

    if (numeric.length === 6) {
      const day = numeric.slice(0, 2);
      const month = numeric.slice(2, 4);
      const year = '20' + numeric.slice(4, 6);
      return `${day}/${month}/${year}`;
    }

    if (numeric.length === 8) {
      const day = numeric.slice(0, 2);
      const month = numeric.slice(2, 4);
      const year = numeric.slice(4, 8);
      return `${day}/${month}/${year}`;
    }

    if (numeric.length <= 2) {
      return numeric;
    }
    if (numeric.length <= 4) {
      return numeric.slice(0, 2) + '/' + numeric.slice(2);
    }
    if (numeric.length <= 8) {
      return numeric.slice(0, 2) + '/' + numeric.slice(2, 4) + '/' + numeric.slice(4);
    }

    return input;
  };

  const handleChange = (e) => {
    const input = e.target.value;
    // לעדכן את הטקסט ללא פורמט (בלי הוספת /)
    const numeric = input.replace(/\D/g, '');

    // פשוט להציב את מה שהוקלד ללא הוספת '/'
    setDate(input);

    setError(false);
  };

  const handleBlur = () => {
    const formatted = formatDateOnBlur(date);
    setDate(formatted);

    if (formatted.length === 10 && !isDateInRange(formatted, 2020, 2036)) {
      setError(true);
    } else {
      setError(false);
    }
  };

  return (
    <TextField
      sx={{ ...sx, '& .MuiInputBase-root': { backgroundColor: '#DA9F9A' } }}
      variant="outlined"
      label="תאריך"
      value={date}
      onChange={handleChange}
      onBlur={handleBlur}
      error={error}
      helperText={error ? 'תאריך לא תקין ' : ''}
      inputProps={{
        maxLength: 10,
        inputMode: 'numeric',
        placeholder: 'dd/mm/yyyy',
      }}
    />
  );
};


export default DateButton;
