import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  fetchProviderInvoices,
  deleteProviderInvoices,
  deleteProviderInvoicesByDateRange,
  deleteProvidersInvoicesByDateRange
} from "../redux/providerInvoicesThunk";
import {
  fetchCustomerInvoices,
  deleteCustomerInvoices,
  deleteCustomerInvoicesByDateRange,
  deleteCustomersInvoicesByDateRange
} from "../redux/customerInvoicesThunk";
import { fetchSuppliers } from "../redux/suppliersThunk";
import { fetchCustomers } from "../redux/customersThunk";
import {
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Autocomplete,
  TextField,
  Snackbar,
  Alert
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DateButton from "./Expenses/InvoiceAndPayment/DateButton";

const parsePickerDate = (v) => {
  if (!v) return null;
  if (v instanceof Date && !isNaN(v)) return v;

  if (typeof v === "string" && /^\d{2}\/\d{2}\/\d{4}$/.test(v)) {
    const [dd, mm, yyyy] = v.split("/").map(Number);
    return new Date(yyyy, mm - 1, dd, 0, 0, 0, 0);
  }

  const d = new Date(v);
  return isNaN(d) ? null : d;
};

const toIsoDateTime = (v, endOfDay = false) => {
  const d = parsePickerDate(v);
  if (!d) throw new Error(`Invalid date: ${v}`);
  if (endOfDay) d.setHours(23, 59, 59, 999);
  else d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

const MaintenancePage = () => {
  const dispatch = useDispatch();

  const suppliers = useSelector(state => state.Suppliers.supplierDetailsList || []);
  const customers = useSelector(state => state.Customers.customersDetailsList || []);
  const suppliersState = useSelector(state => state.Suppliers);
  const customersState = useSelector(state => state.Customers);
  const [successMsg, setSuccessMsg] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [mode, setMode] = useState("suppliers");
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [inputValue, setInputValue] = useState("");

  const startObj = parsePickerDate(startDate);
  const endObj = parsePickerDate(endDate);
  const hasBoth = !!startObj && !!endObj;
  const dateError =
    hasBoth && endObj < startObj
      ? "טווח התאריכים שגוי: תאריך הסיום קטן מתאריך ההתחלה."
      : "";
  const isDateRangeValid = hasBoth && !dateError;

  const entityList = mode === "suppliers" ? suppliers : customers;
  const { error, isLoading } = mode === "suppliers" ? suppliersState : customersState;

  useEffect(() => {
    if (mode === "suppliers") {
      dispatch(fetchSuppliers());
      dispatch(fetchProviderInvoices());
    } else {
      dispatch(fetchCustomers());
      dispatch(fetchCustomerInvoices());
    }
  }, [mode, dispatch]);

  const handleDeleteAllForEntity = async () => {
    if (!selectedEntity) return;
    if (!window.confirm("האם אתה בטוח שברצונך למחוק את כל הנתונים עבור גורם זה?")) return;

    if (mode === "suppliers") {
      await dispatch(deleteProviderInvoices(selectedEntity.value)).unwrap();
      await dispatch(fetchProviderInvoices()).unwrap();
      setSuccessMsg("המחיקה בוצעה בהצלחה!");
      setOpenSnackbar(true);
    } else {
      await dispatch(deleteCustomerInvoices(selectedEntity.value)).unwrap();
      await dispatch(fetchCustomerInvoices()).unwrap();
      setSuccessMsg("המחיקה בוצעה בהצלחה!");
      setOpenSnackbar(true);
    }
  };

  const handleDeleteByDateRangeForEntity = async () => {
    if (!selectedEntity || !startDate || !endDate) return;
    if (!window.confirm("האם אתה בטוח שברצונך למחוק את כל הנתונים בטווח תאריכים זה עבור גורם זה?")) return;

    if (mode === "suppliers") {
      await dispatch(deleteProviderInvoicesByDateRange({
        id: selectedEntity.value,
        startDate: toIsoDateTime(startDate, false),
        endDate: toIsoDateTime(endDate, true)
      })).unwrap();
      await dispatch(fetchProviderInvoices()).unwrap();
      setSuccessMsg("המחיקה בוצעה בהצלחה!");
      setOpenSnackbar(true);
    } else {
      await dispatch(deleteCustomerInvoicesByDateRange({
        id: selectedEntity.value,
        startDate: toIsoDateTime(startDate, false),
        endDate: toIsoDateTime(endDate, true)
      })).unwrap();
      await dispatch(fetchCustomerInvoices()).unwrap();
      setSuccessMsg("המחיקה בוצעה בהצלחה!");
      setOpenSnackbar(true);
    }
  };

  const handleDeleteByDateRangeAll = async () => {
    if (!startDate || !endDate) return;
    if (!window.confirm("האם אתה בטוח שברצונך למחוק את כל הנתונים בטווח תאריכים זה עבור כולם?")) return;

    if (mode === "suppliers") {
      await dispatch(deleteProvidersInvoicesByDateRange({
        startDate: toIsoDateTime(startDate, false),
        endDate: toIsoDateTime(endDate, true)
      })).unwrap();
      await dispatch(fetchProviderInvoices()).unwrap();
      setSuccessMsg("המחיקה בוצעה בהצלחה!");
      setOpenSnackbar(true);
    } else {
      await dispatch(deleteCustomersInvoicesByDateRange({
        startDate: toIsoDateTime(startDate, false),
        endDate: toIsoDateTime(endDate, true)
      })).unwrap();
      await dispatch(fetchCustomerInvoices()).unwrap();
      setSuccessMsg("המחיקה בוצעה בהצלחה!");
      setOpenSnackbar(true);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress style={{ color: "black" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", color: "black", mt: 2 }}>
        <ErrorOutlineIcon sx={{ mr: 1 }} />
        <span>שגיאת מערכת</span>
      </Box>
    );
  }

  const options = entityList.map(item => ({
    label: mode === "suppliers" ? item.providerName : item.customerName,
    value: mode === "suppliers" ? item.providerId : item.customerId
  }));

  return (
    <Box
      sx={{
        backgroundColor: "#D19793",
        borderRadius: "0.75rem",
        p: 3,
        mt: 3,
        maxWidth: "800px",
        mx: "auto"
      }}
    >

      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
        תחזוקה - מחיקות
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>

        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(e, val) => val && setMode(val)}
          color="primary"
        >
          <ToggleButton value="suppliers">ספקים</ToggleButton>
          <ToggleButton value="customers">לקוחות</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Autocomplete
          options={options}
          getOptionLabel={(option) => option.label}
          value={selectedEntity || null}
          onChange={(event, newValue) => setSelectedEntity(newValue)}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
          sx={{ direction: "rtl", flex: 1 }}
          renderInput={(params) => <TextField {...params} label={mode === "suppliers" ? "בחר ספק" : "בחר לקוח"} />}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <Typography
              variant="subtitle2"
              dir="rtl"
              sx={{ mb: 0.5, fontWeight: "bold" }}>
              תאריך סיום
            </Typography>
            <DateButton date={endDate} setDate={setEndDate} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <Typography
              variant="subtitle2"
              dir="rtl"
              sx={{ mb: 0.5, fontWeight: "bold" }}>
              תאריך התחלה
            </Typography>
            <DateButton date={startDate} setDate={setStartDate} />
          </Box>
        </Box>

        {dateError && (
          <Typography sx={{ color: "red", fontSize: "0.875rem" }}>
            {dateError}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#F7C6C2", color: "black" , '&:hover': {
    backgroundColor: '#D19793',
    
  },
  '&:focus': {
          outline: 'none',
          boxShadow: 'none',
        },
  '&:active': {
    backgroundColor: '#B86F6A', 
    color: '#242650ff' ,
   },}}
          disabled={!selectedEntity}
          onClick={handleDeleteAllForEntity}
        >
          מחיקת כל ה{mode === "suppliers" ? "תשלומים" : "חשבוניות"} עבור {selectedEntity?.label || ""}
        </Button>

        <Button
          variant="contained"
          sx={{ backgroundColor: "#F7C6C2", color: "black" , '&:hover': {
              backgroundColor: '#D19793',
            },
            '&:focus': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
            '&:active': {
              backgroundColor: '#B86F6A', 
              color: '#242650ff' ,
             },}}
          disabled={!selectedEntity || !isDateRangeValid}
          onClick={handleDeleteByDateRangeForEntity}
        >
          מחיקת כל {mode === "suppliers" ? "תשלומי" : "חשבוניות"} בין {startDate} ל־{endDate} עבור {selectedEntity?.label || ""}
        </Button>

        <Button
          variant="contained"
          sx={{ backgroundColor: "#F7C6C2", color: "black" , '&:hover': {
              backgroundColor: '#D19793',
              
            },
            '&:focus': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
            '&:active': {
              backgroundColor: '#B86F6A', 
              color: '#242650ff' ,
             },}}
          disabled={!isDateRangeValid}
          onClick={handleDeleteByDateRangeAll}
        >
          מחיקת כל {mode === "suppliers" ? "תשלומי" : "חשבוניות"} בין {startDate} ל־{endDate} עבור כל ה{mode === "suppliers" ? "ספקים" : "לקוחות"}
        </Button>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          {successMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MaintenancePage;
