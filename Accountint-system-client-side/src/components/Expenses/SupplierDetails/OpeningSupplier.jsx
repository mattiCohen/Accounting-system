import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextField, Box, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { addSupplier, fetchSuppliers } from '../../../redux/suppliersThunk';
import { addCustomer, fetchCustomers } from "../../../redux/customersThunk";
import { fetchCategories } from "../../../redux/CategoryThunk";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useRef } from "react";


const OpeningSupplier = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const isSupplier = useSelector(state => state.Suppliers.IsInSupliers);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error, isLoading } = useSelector(state => isSupplier ? state.Suppliers : state.Customers);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [formDisabled, setFormDisabled] = useState(false);

 const [categoryId, setCategoryId] = useState("");

const categories = useSelector(
    (state) => state.category?.categories ?? []
);
const filteredCategories = categories.filter(
    c => c.categoryClassification === (isSupplier ? 2 : 1)
);
useEffect(() => {
    dispatch(fetchCategories());
}, [dispatch]);

 const refs = {
        supplierName: useRef(),
        supplierPhone: useRef(),
        supplierEmail: useRef(),
        supplierNumCard: useRef(),
        supplierAddress: useRef(),
        // supplierContactName: useRef(),
        button: useRef(),
    };

    // פונקציה שמעבירה לפוקוס הבא
    const handleKeyDown = (e, nextField) => {
        if (e.key === "Enter") {
            e.preventDefault(); // מונע שליחה אוטומטית של טופס
            refs[nextField]?.current?.focus();
        }
    };
    const textFieldSx = {
        backgroundColor: '#F3BBB3',
        direction: 'rtl',
        '& .MuiOutlinedInput-root': {
            direction: 'rtl',
            '& input': {
                textAlign: 'right',
            },
            '& .MuiOutlinedInput-notchedOutline legend': {
                textAlign: 'right',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#fff',
            },
        },
    };

    const inputProps = {
        style: {
            textAlign: 'right',
            direction: 'rtl',
        },
    };

    const inputLabelProps = {
        shrink: true,
        sx: {
            direction: 'rtl',
            transformOrigin: 'top right',
            right: '2.2rem',
            left: 'unset',
            color: 'black',
            fontSize: '1.6rem',
            '&.Mui-focused': {
                color: '#fff',
                fontSize: { xs: '21px', sm: '25px' },
            },
        },
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
        setFormDisabled(false);
    };

    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setFormDisabled(true);
        setOpenSnackbar(true);
    };

    const [supplierName, setSupplierName] = useState("");
    const [supplierPhone, setSupplierPhone] = useState("");
    const [supplierEmail, setSupplierEmail] = useState("");
    const [supplierAddress, setSupplierAddress] = useState("");
    const [supplierContactName, setSupplierContactName] = useState("");

    const openSupplier = async (e) => {
        e.preventDefault();

        const newSupplier = isSupplier ? {

            providerName: supplierName.toString(),
            providerPhoneNumber: supplierPhone.toString(),
            providerAddress: supplierAddress.toString(),
            providerEmail: supplierEmail.toString(),
            providerContactName: supplierContactName.toString(),
            providerCardNumber: 0,
            categoryId: categoryId ? Number(categoryId) : null
        } : {

            customerName: supplierName.toString(),
            customerPhoneNumber: supplierPhone.toString(),
            customerAddress: supplierAddress.toString(),
            customerEmail: supplierEmail.toString(),
            customerContactName: supplierContactName.toString(),
            customerCardNumber: 0,
            categoryId: categoryId ? Number(categoryId) : null
        };

        if (
            !supplierName

        ) {
            console.log("שדות ריקים, לא ניתן להוסיף");
            setSnackbarSeverity("error");
            showSnackbar("שדות ריקים, לא ניתן להוסיף");
            return;
        }

        try {
            if (isSupplier) {

                await dispatch(addSupplier(newSupplier)).unwrap();
                await dispatch(fetchSuppliers()).unwrap();
            } else {

                await dispatch(addCustomer(newSupplier)).unwrap();
                await dispatch(fetchCustomers()).unwrap();
            }
            setSnackbarSeverity("success");
            showSnackbar("הוסף בהצלחה");
            setSupplierName("");
            setSupplierPhone("");
            setSupplierEmail("");
            setSupplierAddress("");
            setSupplierContactName("");
            setCategoryId("");

            // navigate(isSupplier ? "/Expenses/SupplierDetails" : "/InCome/CustomerDetails");

            setTimeout(() => {
                navigate(isSupplier ? "/Expenses/SupplierDetails" : "/InCome/CustomerDetails");
            }, 1000);


        } catch (error) {
            console.error("שגיאה בהוספה:", error);
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem", color: "black" }}>
                <CircularProgress style={{ color: "black" }} />
            </div>
        );

    }

    if (error) {
        return (
            <div style={{ display: "flex", alignItems: "center", color: "black", marginTop: "1rem" }}>
                <ErrorOutlineIcon style={{ marginRight: "0.5rem" }} />
                <span>שגיאת מערכת</span>
            </div>
        );
    }
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh'
        }}>
            <div style={{
                padding: '2rem',
                backgroundColor: '#D19793',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '4%',
                width: '80%',
                borderRadius: '2.7%',
            }}>
                <Typography variant="h4" sx={{
                    color: 'black',
                    fontWeight: 'bold',
                    marginBottom: '4%',
                    fontSize: { xs: '1.5rem', sm: '2rem' }
                }}>
                    פתיחת {isSupplier ? "ספק" : "לקוח"}
                </Typography>

                <form onSubmit={openSupplier} style={{ width: '100%', maxWidth: '600px' }}>
                    <Box dir="rtl" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                         {/* <TextField
                            label="מ'ס כרטיס"
                            value={supplierNumCard}
                            readOnly
                            // onChange={e => setSupplierNumCard(e.target.value)}
                            fullWidth
                            variant="outlined"
                            disabled={formDisabled}
                           sx={textFieldSx}
                            InputProps={{ sx: { direction: 'rtl', textAlign: 'right' } }}
                            inputProps={inputProps}
                            InputLabelProps={inputLabelProps}
                        />  */}
                        <TextField
                            label= {isSupplier ? "שם ספק" : "שם לקוח"} 
                            value={supplierName}
                            onChange={e => setSupplierName(e.target.value)}
                            fullWidth
                            variant="outlined"
                            disabled={formDisabled}
                            sx={textFieldSx}
                            InputProps={{ sx: { direction: 'rtl', textAlign: 'right' } }}
                            inputProps={inputProps}
                            InputLabelProps={inputLabelProps}
                            inputRef={refs.supplierName}
                            onKeyDown={(e) => handleKeyDown(e, "supplierAddress")}
                        />
                        <TextField
                            label="כתובת"
                            value={supplierAddress}
                            onChange={e => setSupplierAddress(e.target.value)}
                            fullWidth
                            variant="outlined"
                            disabled={formDisabled}
                            sx={textFieldSx}
                            InputProps={{ sx: { direction: 'rtl', textAlign: 'right' } }}
                            inputProps={inputProps}
                            InputLabelProps={inputLabelProps}
                            inputRef={refs.supplierAddress}
                            onKeyDown={(e) => handleKeyDown(e, "supplierPhone")}
                        />
                        <TextField
                            label="טלפון"
                            value={supplierPhone}
                            type="number"
                            onChange={e => setSupplierPhone(e.target.value)}
                            fullWidth
                            variant="outlined"
                            disabled={formDisabled}
                            sx={textFieldSx}
                            InputProps={{ sx: { direction: 'rtl', textAlign: 'right' } }}
                            inputProps={inputProps}
                            InputLabelProps={inputLabelProps}
                            inputRef={refs.supplierPhone}
                            onKeyDown={(e) => handleKeyDown(e, "supplierEmail")}
                        />
                        <TextField
                            label="מייל"
                            value={supplierEmail}
                            onChange={e => setSupplierEmail(e.target.value)}
                            fullWidth
                            variant="outlined"
                            disabled={formDisabled}
                            sx={textFieldSx}
                            InputProps={{ sx: { direction: 'rtl', textAlign: 'right' } }}
                            inputProps={inputProps}
                            InputLabelProps={inputLabelProps}
                            inputRef={refs.supplierEmail}
                            onKeyDown={(e) => handleKeyDown(e, "button")}
                        />
                        
                        {/* <TextField
                            label="שם איש קשר"
                            value={supplierContactName}
                            onChange={e => setSupplierContactName(e.target.value)}
                            fullWidth
                            variant="outlined"
                            disabled={formDisabled}
                            sx={textFieldSx}
                            InputProps={{ sx: { direction: 'rtl', textAlign: 'right' } }}
                            inputProps={inputProps}
                            InputLabelProps={inputLabelProps}
                            inputRef={refs.supplierContactName}
                            onKeyDown={(e) => handleKeyDown(e, "button")}
                        /> */
                        <FormControl fullWidth disabled={formDisabled}>
    <InputLabel
        id="category-label"
        sx={{ color: "black" }}
    >
        קטגוריית ברירת מחדל
    </InputLabel>

    <Select
        labelId="category-label"
        value={categoryId}
        label="קטגוריית ברירת מחדל"
        onChange={(e) => setCategoryId(e.target.value)}
        sx={textFieldSx}
    >
        <MenuItem value="">
            ללא קטגוריה
        </MenuItem>

        {filteredCategories.map((category) => (
            <MenuItem
                key={category.categoryId}
                value={category.categoryId}
            >
                {category.categoryName}
            </MenuItem>
        ))}
    </Select>
</FormControl>
                        }
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Button
                                type="submit"
                                disabled={formDisabled}
                                variant="contained"
                                sx={{
                                    marginTop: '7%',
                                    width: { xs: '80%', sm: '70%' },
                                    backgroundColor: '#F3BBB3',
                                    fontSize: { xs: '14px', sm: '20px' },
                                    '&:hover': { backgroundColor: '#F7C6C2' },
                                    '&:active': { backgroundColor: '#F7C6C2' }
                                }}
                                inputref={refs.button}
                            >
                                הוסף
                            </Button>
                        </Box>
                    </Box>
                </form>
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <MuiAlert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </MuiAlert>
                </Snackbar>
            </div>
        </div>
    );
};

export default OpeningSupplier;
