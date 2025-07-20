import { useDispatch, useSelector } from "react-redux";
import InvoiceAndPayment from "./InvoiceAndPayment";
import { Typography, Box, Button } from '@mui/material';
import { useEffect, useRef, useState } from "react";
import { fetchProviderInvoices, deleteProviderInvoices,deleteProviderByYearInvoices ,deleteProvidersByYearInvoices} from "../../../redux/providerInvoicesThunk";
import { fetchCustomerInvoices, deleteCustomerInvoices,deleteCustomerInvoicesByYear,deleteCustomersInvoicesByYear } from "../../../redux/customerInvoicesThunk";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const InvoicesAndPayment = ({ yearBegin, yearEnd, supplier }) => {

  const IsInSuppliers = useSelector(state => state.Suppliers.IsInSupliers);
  const allInvoicesAndPayments = useSelector(state => IsInSuppliers ?
     state.providerInvoices.providerInvoicesList : 
     state.customerInvoices.customerInvoicesList);
  const { error, isLoading } = useSelector((state) => {
    if (IsInSuppliers) {
      return state.Suppliers || state.providerInvoices;
    }
    else {
      return state.Customers || state.customerInvoices;
    }
  })
  const dispatch = useDispatch();

const buttonStyle = {
  width: '48%', 
  height: { xs: '2.2rem', sm: '2.5rem', md: '2.7rem', lg: '3rem' },
  fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' },
  color: 'black',
  paddingX: '1.5rem',
  boxShadow: '0 0.25rem 0.5rem rgba(0, 0, 0, 0.1)',
  border: '1px solid #D19793',
  backgroundColor: '#F7C6C2',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  textAlign: 'center',
  '&:hover': {
    backgroundColor: '#D19793',
    transform: 'scale(0.98)',
    border: '1px solid #F7C6C2',
  },
};

const totalSumRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
   const scrollToTotalSum = () => {
    totalSumRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [filteredInvoicesAndPayments, setFilteredInvoicesAndPayments] = useState([]);
    const totalSum = filteredInvoicesAndPayments.reduce(
  (acc, item) => acc + (IsInSuppliers ? item.providerInvoiceSum : item.customerInvoiceSum),
  0
);
  const deleteAllForSupplier = async() => {
    const confirm = window.confirm("האם אתה בטוח שברצונך למחוק את כל הנתונים?");
  if (!confirm) return;
    if (IsInSuppliers) {
     await dispatch(deleteProviderInvoices(supplier?.value)).unwrap();
     await dispatch(fetchProviderInvoices()).unwrap();
    }
    else {
     await dispatch(deleteCustomerInvoices(supplier?.value)).unwrap();
     await dispatch(fetchCustomerInvoices()).unwrap();
    }
  }
   const deleteAllByYear = async() => {
    
    const confirm = window.confirm("האם אתה בטוח שברצונך למחוק את כל הנתונים?");
  if (!confirm) return;
    if (IsInSuppliers) {
     await dispatch(deleteProvidersByYearInvoices(yearBegin)).unwrap();
     await dispatch(fetchProviderInvoices()).unwrap();
    }
    else {
     await dispatch(deleteCustomersInvoicesByYear(yearBegin)).unwrap();
     await dispatch(fetchCustomerInvoices()).unwrap();
    }
  }
   const deleteByYearForSupplier = async() => {
    
    const confirm = window.confirm("האם אתה בטוח שברצונך למחוק את כל הנתונים?");
  if (!confirm) return;
    if (IsInSuppliers) {
     await dispatch(deleteProviderByYearInvoices({id:supplier?.value,year:yearBegin})).unwrap();
     await dispatch(fetchProviderInvoices()).unwrap();
    }
    else {
     await dispatch(deleteCustomerInvoicesByYear({id:supplier?.value,year:yearBegin})).unwrap();
     await dispatch(fetchCustomerInvoices()).unwrap();
    }
  }

useEffect(() => {
  const fetchData = async () => {
    try {
      if (IsInSuppliers) {
        await dispatch(fetchProviderInvoices()).unwrap();
      } else {
        await dispatch(fetchCustomerInvoices()).unwrap();
      }
    } catch (err) {
      console.error("Error fetching invoices:", err);
    }
  };

  fetchData();
}, [IsInSuppliers, dispatch]);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  
  useEffect(() => {
    if(supplier){
    setFilteredInvoicesAndPayments(
      allInvoicesAndPayments.filter((item) => {
        if (IsInSuppliers) {
         
          return item.provider?.providerId === supplier?.value
            && item.providerInvoiceDate >= yearBegin
            && item.providerInvoiceDate < yearEnd;
        }
        else {
         
          return item.customerNavigation?.customerId === supplier?.value
            && item.customerInvoiceDate >= yearBegin
            && item.customerInvoiceDate < yearEnd;
        }
      }));}
      else{
        setFilteredInvoicesAndPayments(allInvoicesAndPayments);
      }

  }, [IsInSuppliers, allInvoicesAndPayments, supplier, yearBegin, yearEnd]);


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
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',

      }}
    >
      <Box
        sx={{
          backgroundColor: '#D19793',
          borderRadius: '0.75rem',
          width: '98%',
          pb: '2rem',
          top: '8%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            mb: '4rem',
            width: '100%',
            mt: '3rem',
            px: '2rem',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: 'black',
              fontWeight: 'bold',
              textAlign: 'center',
              width: { xs: '100%', sm: '50%' },
              mt: { xs: '1.5rem', sm: 0 },
            }}
          >
            {IsInSuppliers ? "חשבוניות - ספקים" : "חשבוניות - לקוחות"}
          </Typography>
        </Box>
<Box
  sx={{
    display: "flex",
    flexDirection: "column", // אחד מעל השני
    alignItems: "flex-start", // יישור לשמאל
    gap: "1rem", // רווח בין כפתורים
    px: "2rem",
    mb: "2rem",
  }}
>

       {supplier&& <Button className="no-print"
          sx={buttonStyle}
          onClick={deleteAllForSupplier}
        >
         מחיקת כל ה{IsInSuppliers ? "תשלומים" : "חשבוניות"} עבור ה{IsInSuppliers ? "ספק" : "לקוח"} {supplier?.label} 
        </Button>}
        {supplier&&
        <Button className="no-print"
          sx={buttonStyle}
          onClick={deleteByYearForSupplier}
        >
           מחיקת כל {IsInSuppliers ? "תשלומי" : "חשבוניות"} שנת {yearBegin} עבור ה{IsInSuppliers ? "ספק" : "לקוח"} {supplier?.label} 
        </Button>}
          {<Button className="no-print"
          sx={buttonStyle}
          onClick={deleteAllByYear}
        >
      מחיקת כל {IsInSuppliers ? "תשלומי" : "חשבוניות"} שנת {yearBegin} עבור כל ה{IsInSuppliers ? "ספקים" : "לקוחות"} 
        </Button>}
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.25rem',
            justifyContent: 'space-between',
            px: '1.25rem',

          }}
        >
         
          {filteredInvoicesAndPayments.map((item) => (

            <InvoiceAndPayment
              key={IsInSuppliers ? item.providerInvoiceId : item.customerInvoiceId}
              item={item}
            ></InvoiceAndPayment>

          ))}
          {/* {
            filteredInvoicesAndPayments.map((item) => (
              totalSum += IsInSuppliers ? item.providerInvoiceSum : item.customerInvoiceSum
            ))
          } */}
          

        </Box>
       <Typography
       className="final-sum"
  ref={totalSumRef}
  sx={{
    color: "#2e3166",
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: 'white',
    width: '20%', 
    height: '3rem',
    marginLeft: '38%', 
    borderRadius: '22px',
    display: 'flex', 
    alignItems: 'center',
    justifyContent: 'center',
    
  }}
>
  ₪ סך הכל: {totalSum.toLocaleString()}
</Typography>

      </Box>
       

      {showScrollButton && (
  <Button className="no-print"
    onClick={scrollToTotalSum}
    variant="contained"
    startIcon={<span style={{ transform: "rotate(90deg)", fontSize: "1.2rem" }}>➤</span>}
     sx={{
    position: 'fixed',
    bottom: '2rem',
    backgroundColor: '#2e3166',
    color: 'white',
    borderRadius: '27px',
    fontWeight: 'bold',
    zIndex: 1300,
    textTransform: 'none',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    '&:hover': {
      backgroundColor: 'white',
      color: '#2e3166',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
    '&:focus': {
      outline: 'none',
      boxShadow: 'none',
    },
    '&:active': {
      backgroundColor: '#2e3166',
      color: 'white',
      boxShadow: 'none',
    },
  }}
  >
    הצג סכום סופי
  </Button>
)}

    </Box>
  );
};

export default InvoicesAndPayment;
