import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextField, Box, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { addSupplier, fetchSuppliers } from '../../../redux/suppliersThunk';
import { addCustomer, fetchCustomers } from "../../../redux/customersThunk";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";


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
    const [supplierNumCard, setSupplierNumCard] = useState("");
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
            providerCardNumber: supplierNumCard
        } : {
            
            customerName: supplierName.toString(),
            customerPhoneNumber: supplierPhone.toString(),
            customerAddress: supplierAddress.toString(),
            customerEmail: supplierEmail.toString(),
            customerContactName: supplierContactName.toString(),
            customerCardNumber: supplierNumCard
        };
        
        if (
            !supplierName ||
            !supplierNumCard 
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
            setSupplierNumCard("");
            setSupplierAddress("");
            setSupplierContactName("");

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
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            label="מ'ס כרטיס"
                            value={supplierNumCard}
                            type="number"
                            onChange={e => setSupplierNumCard(e.target.value)}
                            fullWidth
                            variant="outlined"
                            sx={{ backgroundColor: '#F3BBB3' }}
                            disabled={formDisabled}
                            InputLabelProps={{ sx: { fontSize: { xs: '16px', sm: '20px' } } }}
                        />
                        <TextField
                            label="שם ספק"
                            value={supplierName}
                            onChange={e => setSupplierName(e.target.value)}
                            fullWidth
                            variant="outlined"
                            sx={{ backgroundColor: '#F3BBB3' }}
                            disabled={formDisabled}
                            InputLabelProps={{ sx: { fontSize: { xs: '16px', sm: '20px' } } }}
                        />
                        <TextField
                            label="כתובת"
                            value={supplierAddress}
                            onChange={e => setSupplierAddress(e.target.value)}
                            fullWidth
                            variant="outlined"
                            sx={{ backgroundColor: '#F3BBB3' }}
                            disabled={formDisabled}
                            InputLabelProps={{ sx: { fontSize: { xs: '16px', sm: '20px' } } }}
                        />
                        <TextField
                            label="טלפון"
                            value={supplierPhone}
                            type="number"
                            onChange={e => setSupplierPhone(e.target.value)}
                            fullWidth
                            variant="outlined"
                            sx={{ backgroundColor: '#F3BBB3' }}
                            disabled={formDisabled}
                            InputLabelProps={{ sx: { fontSize: { xs: '16px', sm: '20px' } } }}
                        />
                        <TextField
                            label="מייל"
                            value={supplierEmail}
                            onChange={e => setSupplierEmail(e.target.value)}
                            fullWidth
                            variant="outlined"
                            sx={{ backgroundColor: '#F3BBB3' }}
                            disabled={formDisabled}
                            InputLabelProps={{ sx: { fontSize: { xs: '16px', sm: '20px' } } }}
                        />
                        <TextField
                            label="שם איש קשר"
                            value={supplierContactName}
                            onChange={e => setSupplierContactName(e.target.value)}
                            fullWidth
                            variant="outlined"
                            sx={{ backgroundColor: '#F3BBB3' }}
                            disabled={formDisabled}
                            InputLabelProps={{ sx: { fontSize: { xs: '16px', sm: '20px' } } }}
                        />
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
