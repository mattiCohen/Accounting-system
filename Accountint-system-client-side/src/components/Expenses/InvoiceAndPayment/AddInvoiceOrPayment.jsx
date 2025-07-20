import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, TextField, Button } from '@mui/material';
import ExpenseClassificationButton from './ExpenseClassificationButton';
import SupplierNameButton from "./SupplierNameButton";
import PaymentMethodButton from "./PaymentMethodButton";
import { fetchCards } from "../../../redux/CardThunk";
import { useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { addProviderInvoice } from "../../../redux/providerInvoicesThunk";
import { addCustomerInvoice } from "../../../redux/customerInvoicesThunk";
import { addCard } from "../../../redux/CardThunk";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";


const AddInvoiceOrPayment = () => {

  const isInvoice = useSelector(state => !state.Suppliers.IsInSupliers);
  const cards = useSelector(state => state.cards.cards);
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.cards.loading);
  const isError = useSelector(state => state.cards.error);
  const today = new Date().toISOString().split('T')[0];
  let lastNameSupplier = "";
  let lastNameCustomer = "";
  let classification ="";
  const [reloadFromStorage, setReloadFromStorage] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [formData, setFormData] = useState({

    supplier: null,
    paymentMethod: "",
    amount: 0,
    date: today,
    paymentDate: today,
    details: "",
    reference: "",
    ExpenseClassification: "",

  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData((prev) => ({
      ...prev,
      amount: 0,
      date: today,
      paymentDate: today,
      details: "",
      reference: "",
      ExpenseClassification: "",
      paymentMethod: "",
    }));
  };


  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  const handleSubmit = async () => {

    if (!formData.supplier) {
      setSnackbarSeverity("error");
      isInvoice ? showSnackbar("נא למלא שם לקוח") : showSnackbar("נא למלא שם ספק");
      return;
    }
    if (!formData.ExpenseClassification) {
      setSnackbarSeverity("error");
      isInvoice ? showSnackbar("נא למלא סיווג הכנסה") : showSnackbar("נא למלא סיווג הוצאה");
      return;
    }
    
    const isCard = cards.find(card => card.cardName === formData.supplier.label && card.categoryId === formData.ExpenseClassification);
    let cardId = 0;
    if (!isCard) {
      console.log("כרטיס לא קיים");
      const addedCard = await dispatch(addCard(
        {
          cardName: formData.supplier?.label,
          categoryId: formData.ExpenseClassification,
          categoryNavigation: {
            categoryId: formData.ExpenseClassification,
            categoryName: "",
            categoryClassification: 0,
            categoryClassificationNavigation: {
              classificationId: 0,
              classificationName: ""
            }
          }
        }
      )).unwrap();
      cardId = addedCard.CardId;
    }
    else {
      cardId = isCard.cardId;
    }


    const providerInvoice =
    {
      providerId: formData.supplier.value,
      cardId,
      providerInvoiceSum: parseInt(formData.amount),
      providerInvoiceDate: formData.date.toString(),
      providerInvoicePaymentDate: formData.paymentDate.toString(),
      providerInvoiceDetails: formData.details.toString(),
      providerInvoiceNumber: formData.reference.toString(),
      card: {
        cardId,
        cardName: "",
        categoryId: formData.ExpenseClassification,
        categoryNavigation: {
          categoryId: formData.ExpenseClassification,
          categoryName: "",
          categoryClassification: 0,
          categoryClassificationNavigation: {
            classificationId: 2,
            classificationName: ""
          }
        }
      },
      provider: {
        providerId: 0,
        providerName: "",
        providerPhoneNumber: "",
        providerAddress: "",
        providerEmail: "",
        providerContactName: "",
        providerCardNumber: 0
      }


    }
    const customerInvoice = {
      customerId: formData.supplier.value,
      cardId,
      customerInvoiceSum: parseInt(formData.amount),
      customerInvoiceDate: formData.date.toString(),
      customerInvoiceMaturityDate: formData.paymentDate.toString(),
      customerInvoiceDetails: formData.details.toString(),
      customerInvoiceNumber: formData.reference.toString(),
      customerNavigation: {
        customerId: formData.supplier.value,
        customerName: "",
        customerPhoneNumber: "",
        customerAddress: "",
        customerEmail: "",
        customerContactName: "",
        customerCardNumber: 0
      },
      cardNavigation: {
        cardId,
        cardName: "",
        categoryId: formData.ExpenseClassification,
        categoryNavigation: {
          categoryId: formData.ExpenseClassification,
          categoryName: "",
          categoryClassification: 0,
          categoryClassificationNavigation: {
            classificationId: 1,
            classificationName: ""
          }
        }
      }
    };

    const invoiceData = !isInvoice ? providerInvoice : customerInvoice;
    try {
      if (!isInvoice) {
        
        lastNameSupplier = formData.supplier;
        classification=formData.ExpenseClassification;
        localStorage.setItem("lastNameSupplier", JSON.stringify(lastNameSupplier));
        localStorage.setItem("classification", JSON.stringify(classification));
        await dispatch(addProviderInvoice(invoiceData)).unwrap();
        setSnackbarSeverity("success");
        showSnackbar("התשלום נוסף בהצלחה");
      }
      else {
       
        lastNameCustomer = formData.supplier;
        classification=formData.ExpenseClassification;
        localStorage.setItem("lastNameCustomer", JSON.stringify(lastNameCustomer));
        localStorage.setItem("classification", JSON.stringify(classification));
        await dispatch(addCustomerInvoice(invoiceData)).unwrap();
        setSnackbarSeverity("success");
        showSnackbar("החשבונית נוספה בהצלחה");
      }
      resetForm();
      setReloadFromStorage(prev => !prev);
    }
    catch (error) {
      console.error("שגיאה בהוספת חשבונית:", error);
      setSnackbarSeverity("error");
      showSnackbar("שגיאה בהוספת חשבונית, אנא נסה שוב.");
      if (error?.errors) {
        console.log("Validation Errors:", error.errors);
      }
    }
  };

  useEffect(() => {
    dispatch(fetchCards());
  }, [dispatch]);

  useEffect(() => {
    const savedSupplier = localStorage.getItem("lastNameSupplier");
    const savedCustomer = localStorage.getItem("lastNameCustomer");
    const savedClassification = localStorage.getItem("classification");

    if (!isInvoice && savedSupplier) {
      setFormData((prev) => ({
        ...prev,
        supplier: JSON.parse(savedSupplier)
      }));
    }

    if (isInvoice && savedCustomer) {
      setFormData((prev) => ({
        ...prev,
        supplier: JSON.parse(savedCustomer)
      }));
    }
    setFormData((prev) => ({
        ...prev,
        ExpenseClassification: JSON.parse(savedClassification)
      }));
  }, [isInvoice,reloadFromStorage]);


  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "2rem",
        color: "black"
      }}>
        <CircularProgress style={{ color: "black" }} />
      </div>
    );

  }

  if (isError) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "black",
        marginTop: "1rem"
      }}>
        <ErrorOutlineIcon style={{ marginRight: "0.5rem" }} />
        <span>שגיאת מערכת</span>
      </div>
    );
  }

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#F7C6C2',
      '& fieldset': {
        borderColor: '#F3BBB3',
        borderWidth: '2px',
      },
      '&:hover fieldset': {
        borderColor: '#F3BBB3',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#F3BBB3',
      },
    },
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      marginTop: '1.25rem', 
    }}>
      <Box sx={{
        width: '70%',
        padding: '1.25rem', // ≈ 20px
        backgroundColor: '#F3BBB3',
        marginBottom: '1.25rem',
        borderRadius: '0.5rem',
        boxShadow: '0 0.25rem 0.5rem rgba(0, 0, 0, 0.1)',
        border: '2px solid #D19793'
      }}>
        <Typography variant="h5" sx={{
          color: 'black',
          fontWeight: 'bold',
          marginBottom: '2rem',
          textAlign: 'center',
          fontSize: '1.5rem' // ≈ 24px
        }}>
          פרטי {isInvoice ? "חשבונית" : "תשלום"}
        </Typography>

        <SupplierNameButton
          sx={textFieldStyles}
          selectedName={formData.supplier}
          setSelectedName={(supplier) =>
            setFormData((prev) => ({ ...prev, supplier }))
          }
        />

        <ExpenseClassificationButton
          selectedCategory={formData.ExpenseClassification}
          setSelectedCategory={(ExpenseClassification) =>
            setFormData((prev) => ({ ...prev, ExpenseClassification }))
          }
        />
        {isInvoice && <PaymentMethodButton />}

        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>

          <Typography 
          variant="h6"
            sx={{
              textAlign: 'right',
              color: 'black',
              fontSize: '1.125rem'
            }}
          >סכום
          </Typography>

          <TextField fullWidth 
            type="number"
            variant="outlined"
            sx={textFieldStyles}
            onChange={handleChange}
            value={formData.amount}
            name="amount"
          />

          <Typography
            variant="h6"
            sx={{
              textAlign: 'right',
              color: 'black',
              fontSize: '1.125rem'
            }}
          >
            תאריך
          </Typography>

          <TextField fullWidth
            type="date"
            variant="outlined"
            sx={textFieldStyles}
            onChange={handleChange}
            value={formData.date}
            name="date"
          />


          {isInvoice ? (
            <Box>
              <Typography variant="h6"
                sx={{
                  textAlign: 'right',
                  color: 'black',
                  fontSize: '1.125rem'
                }}>
                תאריך פרעון
              </Typography>
              <TextField fullWidth
                type="date"
                variant="outlined"
                sx={textFieldStyles}
                onChange={handleChange}
                value={formData.paymentDate}
                name="paymentDate"
              />
            </Box>
          ) : (
            <Box>
              <Typography variant="h6"
                sx={{
                  textAlign: 'right',
                  color: 'black',
                  fontSize: '1.125rem'
                }}>
                תאריך לתשלום
              </Typography>
              <TextField fullWidth
                type="date"
                variant="outlined"
                sx={textFieldStyles}
                onChange={handleChange}
                value={formData.paymentDate}
                name="paymentDate"
              />
            </Box>
          )}

          {/* פרטים */}
          <Typography variant="h6"
            sx={{
              textAlign: 'right',
              color: 'black',
              fontSize: '1.125rem'
            }}>
            פרטים
          </Typography>
          <TextField fullWidth
            variant="outlined"
            sx={textFieldStyles}
            onChange={handleChange}
            value={formData.details}
            name="details"
          />
          <Typography
            variant="h6"
            sx={{
              textAlign: 'right',
              color: 'black',
              fontSize: '1.125rem'
            }}>
            אסמכתא
          </Typography>
          <TextField fullWidth
            variant="outlined"
            sx={textFieldStyles}
            onChange={handleChange}
            value={formData.reference}
            name="reference"
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center'
            }}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                width: '40%',
                backgroundColor: '#F8D5D1',
                color: '#000',
                fontSize: '1rem',
                '&:hover': { backgroundColor: '#F7C6C2' }
              }}
              onClick={handleSubmit}

            >
              הוסף
            </Button>
          </Box>
        </Box>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MuiAlert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </Box>
    </Box>
  );
};



export default AddInvoiceOrPayment;
