import { useDispatch, useSelector } from "react-redux";
import { updateSupplier, fetchOneSupplier, fetchSuppliers } from "../../../redux/suppliersThunk";
import { useEffect, useState } from "react";
import { Button, TextField, Box, Typography } from '@mui/material';
import { useNavigate, useParams } from "react-router-dom";
import { fetchOneCustomer, updateCustomer, fetchCustomers } from "../../../redux/customersThunk";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useRef } from "react";
import CardNumberButton from "../InvoiceAndPayment/CardNumberButton";

const SupplierUpdate = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const numericId = parseInt(id);
    const IsInsupplier1 = useSelector(state => state.Suppliers.IsInSupliers);
    const { error, isLoading } = useSelector(state => IsInsupplier1 ? state.Suppliers : state.Customers);
    const [formDisabled, setFormDisabled] = useState(false);

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
            fontSize: '1.4rem',
            '&.Mui-focused': {
                color: '#fff',
                fontSize: { xs: '21px', sm: '25px' },
            },
        },
    };

    const refs = {
        supplierName: useRef(),
        supplierPhone: useRef(),
        supplierEmail: useRef(),
        supplierNumCard: useRef(),
        supplierAddress: useRef(),
        button: useRef(),
    };

    // פונקציה שמעבירה לפוקוס הבא
    const handleKeyDown = (e, nextField) => {
        if (e.key === "Enter") {
            e.preventDefault(); // מונע שליחה אוטומטית של טופס
            refs[nextField]?.current?.focus();
        }
    };
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
        setFormDisabled(false);
    };

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const showSnackbar = (message, severity = "success") => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setFormDisabled(true);
        setOpenSnackbar(true);
    };

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [numCard, setNumCard] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (!numericId) return;

        if (!IsInsupplier1) {
            dispatch(fetchOneCustomer(numericId));
        } else {
            dispatch(fetchOneSupplier(numericId));
        }
    }, [dispatch, IsInsupplier1, numericId]);

    const currentCustomer = useSelector(state => state.Customers.currentCustomer);
    const currentSupplier = useSelector(state => state.Suppliers.currentSupplier);
    const newSupplier = IsInsupplier1 ? currentSupplier : currentCustomer;

    useEffect(() => {

        if (!newSupplier) return;
        const nameFromStore = IsInsupplier1 ? newSupplier.providerName : newSupplier.customerName;
        const phoneFromStore = IsInsupplier1 ? newSupplier.providerPhoneNumber : newSupplier.customerPhoneNumber;
        const emailFromStore = IsInsupplier1 ? newSupplier.providerEmail : newSupplier.customerEmail;
        const addressFromStore = IsInsupplier1 ? newSupplier.providerAddress : newSupplier.customerAddress;
        const numCardFromStore = IsInsupplier1
            ? newSupplier.providerCardNumber
            : newSupplier.customerCardNumber;

        const idFromStore = IsInsupplier1
            ? newSupplier.providerId
            : newSupplier.customerId;

        setNumCard(numCardFromStore ? { label: numCardFromStore.toString(), value: idFromStore } : null);
        setName(nameFromStore || "");
        setPhone(phoneFromStore || "");
        setEmail(emailFromStore || "");
        setAddress(addressFromStore || "");
    }, [newSupplier, IsInsupplier1]);

    const updateSupplier1 = async (e) => {
        e.preventDefault();
        let updatedSupplier = null;
        if (IsInsupplier1) {
            updatedSupplier =
            {
                ProviderId: numericId,
                ProviderName: name,
                ProviderPhoneNumber: phone,
                ProviderAddress: address,
                ProviderEmail: email,
                ProviderContactName: "",
                ProviderCardNumber: numCard?.label || ""
            }
            try {

                await dispatch(updateSupplier({ id: numericId, SupplierData: updatedSupplier })).unwrap();
                await dispatch(fetchSuppliers()).unwrap();
                // navigate("/Expenses/SupplierDetails");
                showSnackbar("העדכון בוצע בהצלחה", "success");
                setTimeout(() => navigate("/Expenses/SupplierDetails"), 3000);
            }
            catch (error) {
                console.error("Error updating supplier:", error);
                showSnackbar("שגיאה בעדכון הספק", "error");
            }
        }
        else {
            updatedSupplier =
            {
                CustomerId: numericId,
                CustomerName: name,
                CustomerPhoneNumber: phone,
                CustomerAddress: address,
                CustomerEmail: email,
                CustomerContactName: "",
                CustomerCardNumber: numCard?.label || ""
            }
            try {
                await dispatch(updateCustomer({ id: numericId, CustomerData: updatedSupplier })).unwrap();
                await dispatch(fetchCustomers()).unwrap();
                // navigate("/InCome/CustomerDetails");
                showSnackbar("העדכון בוצע בהצלחה", "success");
                setTimeout(() => navigate("/InCome/CustomerDetails"), 1000);
            }
            catch (error) {
                console.error("Error updating customer:", error);
                showSnackbar("העדכון בוצע בהצלחה", "success");
                setTimeout(() => navigate("/InCome/CustomerDetails"), 1000);
            }
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
            minHeight: '100vh',
            padding: '2rem'
        }}>
            <div style={{
                padding: '2rem',
                backgroundColor: '#D19793',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: '2.7%',
                width: '100%',
                maxWidth: '800px',
                boxSizing: 'border-box',
            }}>
                <Typography variant="h4" sx={{
                    color: 'black',
                    fontWeight: 'bold',
                    marginBottom: '4%',
                    fontSize: { xs: '1.5rem', sm: '2rem' }
                }}>
                    עדכון פרטי {IsInsupplier1 ? "ספק" : "לקוח"}
                </Typography>

                <form onSubmit={updateSupplier1} style={{ width: '100%' }}>
                    <Box dir="rtl" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                        <CardNumberButton
                            selectedCard={numCard}
                            setSelectedCard={()=> { }}
                    sx={{ ...textFieldSx, pointerEvents: 'none' }}
                            isSupplierCard={IsInsupplier1}
                        />


                        <TextField label={IsInsupplier1 ? "שם ספק" : "שם לקוח"} value={name}
                            onChange={(e) => setName(e.target.value)} fullWidth variant="outlined"

                            disabled={formDisabled}
                            sx={textFieldSx}
                            InputProps={{ sx: { direction: 'rtl', textAlign: 'right' } }}
                            inputProps={inputProps}
                            InputLabelProps={inputLabelProps}
                            inputRef={refs.supplierName}
                            onKeyDown={(e) => handleKeyDown(e, "supplierAddress")}
                        />


                        <TextField label="כתובת" value={address}
                            onChange={(e) => setAddress(e.target.value)} fullWidth variant="outlined"
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
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            fullWidth
                            variant="outlined"
                            sx={textFieldSx}
                            InputProps={{ sx: { direction: 'rtl', textAlign: 'right' } }}
                            inputProps={inputProps}
                            InputLabelProps={inputLabelProps}
                            disabled={formDisabled}
                            inputRef={refs.supplierPhone}
                            onKeyDown={(e) => handleKeyDown(e, "supplierEmail")}
                        />



                        <TextField label="מייל" value={email}
                            onChange={(e) => setEmail(e.target.value)} fullWidth variant="outlined"
                            disabled={formDisabled}
                            sx={textFieldSx}
                            InputProps={{ sx: { direction: 'rtl', textAlign: 'right' } }}
                            inputProps={inputProps}
                            InputLabelProps={inputLabelProps}
                            inputRef={refs.supplierEmail}
                            onKeyDown={(e) => handleKeyDown(e, "button")}

                        />
{/* 
                        <TextField label="שם איש קשר" value={contactName}
                            onChange={(e) => setContactName(e.target.value)} fullWidth variant="outlined"
                            disabled={formDisabled}
                            sx={textFieldSx}
                            InputProps={{ sx: { direction: 'rtl', textAlign: 'right' } }}
                            inputProps={inputProps}
                            InputLabelProps={inputLabelProps}
                            inputRef={refs.supplierContactName}
                            onKeyDown={(e) => handleKeyDown(e, "button")}
                        /> */}

                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Button type="submit"
                                disabled={formDisabled}
                                variant="contained" sx={{
                                    marginTop: '7%',
                                    width: { xs: '80%', sm: '70%' },
                                    backgroundColor: '#F3BBB3',
                                    fontSize: { xs: '14px', sm: '20px' },
                                    '&:hover': { backgroundColor: '#F7C6C2' },
                                    '&:active': { backgroundColor: '#F7C6C2' }
                                }}
                                inputRef={refs.button}
                            >
                                עדכן
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
                    <MuiAlert
                        onClose={handleCloseSnackbar}
                        severity={snackbarSeverity}
                        sx={{ width: '100%' }}
                    >
                        {snackbarMessage}
                    </MuiAlert>
                </Snackbar>


            </div>
        </div>
    );
};

export default SupplierUpdate;
