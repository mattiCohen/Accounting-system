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
import CardNumberButton from "./CardNumberButton";
import { Grid } from "@mui/material";
import { useRef } from "react";
import { fetchCategories } from "../../../redux/CategoryThunk";


const AddInvoiceOrPayment = () => {

  const isInvoice = useSelector(state => !state.Suppliers.IsInSupliers);
  const cards = useSelector(state => state.cards.cards);
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.cards.loading);
  const isError = useSelector(state => state.cards.error);
  const today = new Date().toISOString().split('T')[0];
  let lastNameSupplier = "";
  let lastNameCustomer = "";
  let classification = "";
  const [reloadFromStorage, setReloadFromStorage] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const suppliers = useSelector(state => state.Suppliers.supplierDetailsList);
  const customers = useSelector(state => state.Customers.customersDetailsList);
  const allCategory = useSelector(state => state.category.categories);
  const entitiesList = isInvoice ? customers : suppliers;
  const [formData, setFormData] = useState({
    supplier: null,
    numCardSupplier: null,
    amount: "",
    date: today,
    paymentDate: today,
    details: "",
    reference: "",
    ExpenseClassification: null,
  });

  const refs = {
    supplier: useRef(),
    cardNumber: useRef(),
    expenseClassification: useRef(),
    amount: useRef(),
    date: useRef(),
    paymentDate: useRef(),
    details: useRef(),
    reference: useRef(),
    button: useRef()
  };
  const handleKeyDown = (e, nextField) => {
    if (e.key === "Enter") {
      e.preventDefault(); // מונע שליחה אוטומטית של טופס
      refs[nextField]?.current?.focus();
    }
  };
  const handleEntityChange = (entityId) => {
    const entity = entitiesList.find(e =>
      (!isInvoice ? e.providerId : e.customerId) === entityId
    );
    if (!entity) return;

    const supplierOption = {
      label: !isInvoice ? entity.providerName : entity.customerName,
      value: !isInvoice ? entity.providerId : entity.customerId
    };

    const cardOption = {
      label: (!isInvoice ? entity.providerCardNumber : entity.customerCardNumber)?.toString(),
      value: !isInvoice ? entity.providerId : entity.customerId
    };

    setFormData((prev) => ({
      ...prev,
      supplier: supplierOption,
      numCardSupplier: cardOption
    }));
  };




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
      amount: "",
      date: today,
      paymentDate: today,
      details: "",
      reference: "",
      paymentMethod: "",
    }));
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  const handleSubmit = async () => {
    if (!formData.supplier && !formData.numCardSupplier) {
      setSnackbarSeverity("error");
      isInvoice ? showSnackbar("נא למלא שם לקוח") : showSnackbar("נא למלא שם ספק");
      return;
    }
    if (!formData.ExpenseClassification) {
      setSnackbarSeverity("error");
      isInvoice ? showSnackbar("נא למלא סיווג הכנסה") : showSnackbar("נא למלא סיווג הוצאה");
      return;
    }

    if (!formData.amount || formData.amount <= 0) {
      showSnackbar("נא למלא סכום תקין");
      setSnackbarSeverity("error");
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
      cardId = addedCard.cardId;
    }
    else {
      console.log("כרטיס קיים", isCard.cardId);
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
        classification = formData.ExpenseClassification;
        localStorage.setItem("lastNameSupplier", JSON.stringify(lastNameSupplier));
        localStorage.setItem("classificationSupplier", JSON.stringify(classification));
        localStorage.setItem("lastCardSupplier", JSON.stringify(formData.numCardSupplier));
        await dispatch(addProviderInvoice(invoiceData)).unwrap();
        setSnackbarSeverity("success");
        showSnackbar("התשלום נוסף בהצלחה");
      }
      else {
        lastNameCustomer = formData.supplier;
        classification = formData.ExpenseClassification;
        localStorage.setItem("lastNameCustomer", JSON.stringify(lastNameCustomer));
        localStorage.setItem("classificationCustomer", JSON.stringify(classification));
        localStorage.setItem("lastCardSupplier", JSON.stringify(formData.numCardSupplier));
        await dispatch(addCustomerInvoice(invoiceData)).unwrap();
        console.log("תאריך פרעון לאחר יצוירת חשבויות", invoiceData.customerInvoiceMaturityDate, invoiceData.customerInvoiceDate);
        setSnackbarSeverity("success");
        showSnackbar("החשבונית נוספה בהצלחה");
      }
      resetForm();
      setReloadFromStorage(prev => !prev);
    }
    catch (error) {
      console.log("Validation Errors:", error?.response?.data);
      setSnackbarSeverity("error");
      showSnackbar("שגיאה בהוספת חשבונית, אנא נסה שוב.");
      if (error?.errors) {
        console.log("Validation Errors:", error.errors);
      }
    }
  };

  useEffect(() => {
    dispatch(fetchCards());
    dispatch(fetchCategories()).then((res) => {
      if (res?.payload) {
        localStorage.setItem("allCategories", JSON.stringify(res.payload));
      }
    });
  }, [dispatch]);

  // 2. טען ברירת מחדל מה-localStorage
  useEffect(() => {
    const savedSupplier = localStorage.getItem("lastNameSupplier");
    const savedCustomer = localStorage.getItem("lastNameCustomer");
    const savedCard = localStorage.getItem("lastCardSupplier");

    // הבחירה האחרונה של סיווג לפי מצב (ספק/לקוח)
    const savedKey = isInvoice ? "classificationCustomer" : "classificationSupplier";
    const savedClassification = localStorage.getItem(savedKey);

    if (!isInvoice && savedSupplier) {
      setFormData((prev) => ({
        ...prev,
        supplier: JSON.parse(savedSupplier),
        numCardSupplier: savedCard ? JSON.parse(savedCard) : null,
      }));
    }

    if (isInvoice && savedCustomer) {
      setFormData((prev) => ({
        ...prev,
        supplier: JSON.parse(savedCustomer),
        numCardSupplier: savedCard ? JSON.parse(savedCard) : null,
      }));
    }

    // בדוק שהסיווג באמת קיים בקטגוריות
    if (savedClassification) {
      const parsed = JSON.parse(savedClassification);
      const validCategory = allCategory.find(c => c.categoryId === parsed);

      setFormData((prev) => ({
        ...prev,
        ExpenseClassification: validCategory ? parsed : ""
      }));
    }
  }, [isInvoice, allCategory, reloadFromStorage]);


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
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        marginTop: '1.25rem',
      }}
    >
      <Box
        sx={{
          width: '90%',
          padding: '1.25rem',
          backgroundColor: '#F3BBB3',
          marginBottom: '1.25rem',
          borderRadius: '0.5rem',
          boxShadow: '0 0.25rem 0.5rem rgba(0, 0, 0, 0.1)',
          border: '2px solid #D19793',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: 'black',
            fontWeight: 'bold',
            marginBottom: '2rem',
            textAlign: 'center',
            fontSize: '1.5rem',
          }}
        >
          פרטי {isInvoice ? 'חשבונית' : 'תשלום'}
        </Typography>

        <Grid container spacing={2} sx={{ marginBottom: '1rem' }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              sx={{ textAlign: 'right', color: 'black', fontSize: '1.2rem', marginBottom: 1 }}
            >
              סכום
            </Typography>
            <TextField
              fullWidth
              type="number"
              variant="outlined"
              sx={textFieldStyles}
              onChange={handleChange}
              value={formData.amount}
              name="amount"
              inputRef={refs.amount}
              onKeyDown={(e) => handleKeyDown(e, "reference")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <ExpenseClassificationButton
              selectedCategory={formData.ExpenseClassification}
              setSelectedCategory={(ExpenseClassification) =>
                setFormData((prev) => ({ ...prev, ExpenseClassification }))
              }
              sx={textFieldStyles}
              isSupplierCard={false}
              inputRef={refs.expenseClassification}
              onKeyDown={(e) => handleKeyDown(e, "amount")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <SupplierNameButton
              sx={textFieldStyles}
              selectedName={formData.supplier}
              setSelectedName={(supplier) => {
                if (supplier) {
                  handleEntityChange(supplier.value);
                } else {
                  setFormData((prev) => ({
                    ...prev,
                    supplier: null,
                    numCardSupplier: null,
                  }));
                }
              }}
              inputRef={refs.supplier}
              onKeyDown={(e) => handleKeyDown(e, "numCard")}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <CardNumberButton
              sx={textFieldStyles}
              selectedCard={formData.numCardSupplier}
              setSelectedCard={(card) => {
                if (card) {
                  handleEntityChange(card.value);
                } else {
                  setFormData((prev) => ({
                    ...prev,
                    supplier: null,
                    numCardSupplier: null,
                  }));
                }
              }}
              isSupplierCard={false}
              inputRef={refs.numCard}
              onKeyDown={(e) => handleKeyDown(e, "expenseClassification")}
            />
          </Grid>

        </Grid>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography sx={{ textAlign: 'right', color: 'black', fontSize: '1.2rem', marginBottom: 1 }}>
              תאריך
            </Typography>
            <TextField
              fullWidth
              type="date"
              variant="outlined"
              sx={textFieldStyles}
              onChange={handleChange}
              value={formData.date}
              name="date"
              inputRef={refs.date}
              onKeyDown={(e) => handleKeyDown(e, "amount")}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography sx={{ textAlign: 'right', color: 'black', fontSize: '1.2rem', marginBottom: 1 }}>
              {isInvoice ? 'תאריך פרעון' : 'תאריך לתשלום'}
            </Typography>
            <TextField
              fullWidth
              type="date"
              variant="outlined"
              sx={textFieldStyles}
              onChange={handleChange}
              value={formData.paymentDate}
              name="paymentDate"
              inputRef={refs.paymentDate}
              onKeyDown={(e) => handleKeyDown(e, "date")}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography sx={{ textAlign: 'right', color: 'black', fontSize: '1.2rem', marginBottom: 1 }}>
              פרטים
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              sx={textFieldStyles}
              onChange={handleChange}
              value={formData.details}
              name="details"
              inputRef={refs.details}
              onKeyDown={(e) => handleKeyDown(e, "paymentDate")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography sx={{ textAlign: 'right', color: 'black', fontSize: '1.2rem', marginBottom: 1 }}>
              אסמכתא
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              sx={textFieldStyles}
              onChange={handleChange}
              value={formData.reference}
              name="reference"
              inputRef={refs.reference}
              onKeyDown={(e) => handleKeyDown(e, "details")}
            />
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}
          sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            sx={{
              height: '56px',
              width: '200px',
              backgroundColor: '#F8D5D1',
              borderRadius: '30px',
              color: '#000',
              fontSize: '1.3rem',
              '&:hover': { backgroundColor: '#F7C6C2' },
              marginTop: '1.35rem',
            }}
            onClick={handleSubmit}
          >
            הוסף
          </Button>
        </Grid>


        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <MuiAlert
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </Box>
    </Box>
  );

};



export default AddInvoiceOrPayment;
