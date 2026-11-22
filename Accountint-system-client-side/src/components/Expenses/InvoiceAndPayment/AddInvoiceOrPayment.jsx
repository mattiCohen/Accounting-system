import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, TextField, Button } from '@mui/material';
import ExpenseClassificationButton from './ExpenseClassificationButton';
import SupplierNameButton from "./SupplierNameButton";
import PaymentMethodButton from "./PaymentMethodButton";
import { fetchCards } from "../../../redux/CardThunk";
import { useEffect, useMemo, useRef, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {
  addProviderInvoice,
  deleteProviderInvoice,
  updateProviderInvoice,
  fetchProviderInvoices,
} from "../../../redux/providerInvoicesThunk";
import {
  addCustomerInvoice,
  deleteCustomerInvoice,
  updateCustomerInvoice,
  fetchCustomerInvoices,
} from "../../../redux/customerInvoicesThunk";
import { addCard } from "../../../redux/CardThunk";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CardNumberButton from "./CardNumberButton";
import { Grid } from "@mui/material";
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
  const isValidCategory = (categoryId) =>
  categoryId != null &&
  (allCategory ?? []).some(c =>
    c.categoryId === categoryId &&
    c.categoryClassification === (isInvoice ? 1 : 2)
  );

  // רשימות החשבוניות/תשלומים מהשרת, לצורך ניווט אחורה וקדימה
  const providerInvoicesList = useSelector(state => state.providerInvoices.providerInvoicesList);
  const customerInvoicesList = useSelector(state => state.customerInvoices.customerInvoicesList);

  // -1 = מצב "רשומה חדשה". כל ערך אחר הוא אינדקס ברשימה הממוינת (list) למטה
  const [currentIndex, setCurrentIndex] = useState(-1);

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
  numCardSupplier: cardOption,
  ExpenseClassification: isValidCategory(entity.categoryId)
    ? entity.categoryId
    : prev.ExpenseClassification
}));
  };


  // רשימת הרשומות (חשבוניות/תשלומים) ממוינת מהחדש לישן, לצורך ניווט
  const getInvoiceId = (item) => (isInvoice ? item.customerInvoiceId : item.providerInvoiceId);

  const list = useMemo(() => {
    const raw = isInvoice ? customerInvoicesList : providerInvoicesList;
    if (!raw) return [];
    return [...raw].sort((a, b) => getInvoiceId(b) - getInvoiceId(a));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInvoice, customerInvoicesList, providerInvoicesList]);


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

  const clearEntityFields = () => {
    setFormData((prev) => ({
      ...prev,
      supplier: null,
      numCardSupplier: null,
      ExpenseClassification: null,
    }));
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  // טוען רשומה קיימת מהרשימה חזרה לתוך הטופס לצורך צפייה/עריכה
  const loadItemIntoForm = (item) => {
    const entityId = isInvoice ? item.customerId : item.providerId;
    handleEntityChange(entityId);

    const categoryId =
      (isInvoice ? item.cardNavigation?.categoryId : item.card?.categoryId) ??
      cards.find(c => c.cardId === item.cardId)?.categoryId ??
      null;

    setFormData((prev) => ({
      ...prev,
      amount: (isInvoice ? item.customerInvoiceSum : item.providerInvoiceSum)?.toString() ?? "",
      date: (isInvoice ? item.customerInvoiceDate : item.providerInvoiceDate)?.split('T')[0] || today,
      paymentDate: (isInvoice ? item.customerInvoiceMaturityDate : item.providerInvoicePaymentDate)?.split('T')[0] || today,
      details: (isInvoice ? item.customerInvoiceDetails : item.providerInvoiceDetails) || "",
      reference: (isInvoice ? item.customerInvoiceNumber : item.providerInvoiceNumber) || "",
      ExpenseClassification: categoryId,
    }));
  };

  const handleNewClick = () => {
    setCurrentIndex(-1);
    resetForm();
    clearEntityFields();
  };

  // מעבר לרשומה ישנה יותר (אחורה בהיסטוריה)
  const goToPrevious = () => {
    if (currentIndex + 1 < list.length) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      loadItemIntoForm(list[newIndex]);
    }
  };

  // מעבר לרשומה חדשה יותר (קדימה), עד לחזרה למצב "רשומה חדשה"
  const goToNext = () => {
    if (currentIndex === -1) return;
    const newIndex = currentIndex - 1;
    if (newIndex === -1) {
      handleNewClick();
    } else {
      setCurrentIndex(newIndex);
      loadItemIntoForm(list[newIndex]);
    }
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

    if (!formData.amount || formData.amount === "0") {
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
    const isEditing = currentIndex !== -1;

    try {
      if (isEditing) {
        // ------- עדכון רשומה קיימת -------
        const currentItem = list[currentIndex];
        const invoiceId = getInvoiceId(currentItem);

        if (!isInvoice) {
          await dispatch(updateProviderInvoice({ id: invoiceId, invoiceData })).unwrap();
          await dispatch(fetchProviderInvoices()).unwrap();
          setSnackbarSeverity("success");
          showSnackbar("התשלום עודכן בהצלחה");
        } else {
          await dispatch(updateCustomerInvoice({ id: invoiceId, invoiceData })).unwrap();
          await dispatch(fetchCustomerInvoices()).unwrap();
          setSnackbarSeverity("success");
          showSnackbar("החשבונית עודכנה בהצלחה");
        }
        handleNewClick();
      }
      else {
        // ------- יצירת רשומה חדשה (ההתנהגות המקורית) -------
        if (!isInvoice) {
          lastNameSupplier = formData.supplier;
          classification = formData.ExpenseClassification;
          localStorage.setItem("lastNameSupplier", JSON.stringify(lastNameSupplier));
          localStorage.setItem("classificationSupplier", JSON.stringify(classification));
          localStorage.setItem("lastCardSupplier", JSON.stringify(formData.numCardSupplier));
          localStorage.setItem("lastDateSupplier", formData.date);
          localStorage.setItem("lastPaymentDateSupplier", formData.paymentDate);
          await dispatch(addProviderInvoice(invoiceData)).unwrap();
          await dispatch(fetchProviderInvoices()).unwrap();
          setSnackbarSeverity("success");
          showSnackbar("התשלום נוסף בהצלחה");
        }
        else {
          lastNameCustomer = formData.supplier;
          classification = formData.ExpenseClassification;
          localStorage.setItem("lastNameCustomer", JSON.stringify(lastNameCustomer));
          localStorage.setItem("classificationCustomer", JSON.stringify(classification));
          localStorage.setItem("lastCardSupplier", JSON.stringify(formData.numCardSupplier));
          localStorage.setItem("lastDateCustomer", formData.date);
          localStorage.setItem("lastPaymentDateCustomer", formData.paymentDate);
          await dispatch(addCustomerInvoice(invoiceData)).unwrap();
          await dispatch(fetchCustomerInvoices()).unwrap();
          console.log("תאריך פרעון לאחר יצוירת חשבויות", invoiceData.customerInvoiceMaturityDate, invoiceData.customerInvoiceDate);
          setSnackbarSeverity("success");
          showSnackbar("החשבונית נוספה בהצלחה");
        }
        resetForm();
        setReloadFromStorage(prev => !prev);
      }
    }
    catch (error) {
      console.log("Validation Errors:", error?.response?.data);
      setSnackbarSeverity("error");
      showSnackbar(isEditing ? "שגיאה בעדכון, אנא נסה שוב." : "שגיאה בהוספת חשבונית, אנא נסה שוב.");
      if (error?.errors) {
        console.log("Validation Errors:", error.errors);
      }
    }
  };

  const handleDelete = async () => {
    if (currentIndex === -1) return;
    if (!window.confirm("האם אתה בטוח שברצונך למחוק?")) return;

    const currentItem = list[currentIndex];
    const invoiceId = getInvoiceId(currentItem);

    try {
      if (isInvoice) {
        await dispatch(deleteCustomerInvoice(invoiceId)).unwrap();
        await dispatch(fetchCustomerInvoices()).unwrap();
      } else {
        await dispatch(deleteProviderInvoice(invoiceId)).unwrap();
        await dispatch(fetchProviderInvoices()).unwrap();
      }
      setSnackbarSeverity("success");
      showSnackbar(isInvoice ? "החשבונית נמחקה בהצלחה" : "התשלום נמחק בהצלחה");
      handleNewClick();
    } catch (error) {
      setSnackbarSeverity("error");
      showSnackbar("שגיאה במחיקה, אנא נסה שוב.");
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

  // טעינת רשימת החשבוניות/תשלומים לצורך ניווט אחורה/קדימה
  useEffect(() => {
    if (isInvoice) {
      dispatch(fetchCustomerInvoices());
    } else {
      dispatch(fetchProviderInvoices());
    }
  }, [dispatch, isInvoice]);

  // מעבר בין ספק/לקוח מאפס את מצב הניווט חזרה ל"רשומה חדשה"
  useEffect(() => {
    setCurrentIndex(-1);
  }, [isInvoice]);

  // 2. טען ברירת מחדל מה-localStorage (רק במצב "רשומה חדשה")
  useEffect(() => {
    if (currentIndex !== -1) return;

    const savedSupplier = localStorage.getItem("lastNameSupplier");
    const savedCustomer = localStorage.getItem("lastNameCustomer");
    const savedCard = localStorage.getItem("lastCardSupplier");
    const savedDate = localStorage.getItem(
      isInvoice ? "lastDateCustomer" : "lastDateSupplier"
    );

    const savedPaymentDate = localStorage.getItem(
      isInvoice ? "lastPaymentDateCustomer" : "lastPaymentDateSupplier"
    );
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
    // קטגוריית ברירת מחדל: קודם של הספק/לקוח, ואם אין - האחרונה שנבחרה
const savedEntityRaw = isInvoice ? savedCustomer : savedSupplier;
const savedEntity = savedEntityRaw ? JSON.parse(savedEntityRaw) : null;
const entity = savedEntity && (entitiesList ?? []).find(e =>
  (isInvoice ? e.customerId : e.providerId) === savedEntity.value
);
const lastClassification = savedClassification ? JSON.parse(savedClassification) : null;

const categoryToUse = isValidCategory(entity?.categoryId)
  ? entity.categoryId
  : isValidCategory(lastClassification) ? lastClassification : "";

setFormData((prev) => ({
  ...prev,
  ExpenseClassification: categoryToUse,
  date: savedDate || today,
  paymentDate: savedPaymentDate || today,
}));
}, [isInvoice, allCategory, entitiesList, reloadFromStorage, currentIndex]);

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

  // בדיוק אותו עיצוב וצבעים של כפתור "הוסף" המקורי - משמש גם לעדכון/מחיקה/חדש
  const actionButtonStyles = {
    height: '56px',
    minWidth: '160px',
    backgroundColor: '#F8D5D1',
    borderRadius: '30px',
    color: '#000',
    fontSize: '1.3rem',
    '&:hover': { backgroundColor: '#F7C6C2' },
    marginTop: '1.35rem',
  };

  const isEditing = currentIndex !== -1;
  const isPreviousDisabled = currentIndex + 1 >= list.length;
  const isNextDisabled = currentIndex === -1;

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
            marginBottom: '1rem',
            textAlign: 'center',
            fontSize: '1.5rem',
          }}
        >
          פרטי {isInvoice ? 'חשבונית' : 'תשלום'}
        </Typography>

        {/* פס ניווט בין רשומות קודמות */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <Button
            onClick={goToPrevious}
            disabled={isPreviousDisabled}
            startIcon={<ArrowBackIosNewIcon />}
            sx={{
              color: 'black',
              backgroundColor: '#F7C6C2',
              borderRadius: '20px',
              '&:hover': { backgroundColor: '#F3BBB3' },
              '&.Mui-disabled': { backgroundColor: '#F3BBB3', opacity: 0.5 },
            }}
          >
            הקודם
          </Button>

          <Typography sx={{ color: 'black', fontWeight: 'bold', minWidth: '140px', textAlign: 'center' }}>
            {isEditing ? `רשומה ${currentIndex + 1} מתוך ${list.length}` : 'רשומה חדשה'}
          </Typography>

          <Button
            onClick={goToNext}
            disabled={isNextDisabled}
            endIcon={<ArrowForwardIosIcon />}
            sx={{
              color: 'black',
              backgroundColor: '#F7C6C2',
              borderRadius: '20px',
              '&:hover': { backgroundColor: '#F3BBB3' },
              '&.Mui-disabled': { backgroundColor: '#F3BBB3', opacity: 0.5 },
            }}
          >
            הבא
          </Button>
        </Box>

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

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <Button
            variant="contained"
            sx={actionButtonStyles}
            onClick={handleSubmit}
          >
            {isEditing ? 'עדכן' : 'הוסף'}
          </Button>

          {isEditing && (
            <>
              <Button
                variant="contained"
                sx={actionButtonStyles}
                onClick={handleDelete}
              >
                מחק
              </Button>

              <Button
                variant="contained"
                sx={actionButtonStyles}
                onClick={handleNewClick}
              >
                רשומה חדשה
              </Button>
            </>
          )}
        </Box>


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
