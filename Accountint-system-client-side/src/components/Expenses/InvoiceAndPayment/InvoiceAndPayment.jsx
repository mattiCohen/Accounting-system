import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, TextField, Button } from '@mui/material';
import {deleteCustomerInvoice,fetchCustomerInvoices,updateCustomerInvoice} from "../../../redux/customerInvoicesThunk";
import {deleteProviderInvoice,fetchProviderInvoices,updateProviderInvoice} from "../../../redux/providerInvoicesThunk";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useState } from "react";



const InvoiceAndPayment = ({ item }) => {

  const isInvoice = !useSelector(state => state.Suppliers.IsInSupliers);
  
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [newInvoice,setNewInvoice]=useState({
    sum:isInvoice?item.customerInvoiceSum:item.providerInvoiceSum,
    name:isInvoice?item.customerNavigation.customerName:item.provider.providerName,
    date:isInvoice?item.customerInvoiceDate.split('T')[0]:item.providerInvoiceDate.split('T')[0],
    paymentDate:isInvoice?item.customerInvoiceMaturitDate.split('T')[0]:item.providerInvoicePaymentDate.split('T')[0],
    details:isInvoice?item.customerInvoiceDetails:item.providerInvoiceDetails,
    reference:isInvoice?item.customerInvoiceNumber:item.providerInvoiceNumber
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewInvoice((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

   const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  
const dispatch=useDispatch();

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

const updateInvoiceOrpayment=async()=>{
 if (!window.confirm("אתה בטוח שברצונך לעדכן?")) return;
 let updated={};

 if(isInvoice){
  updated={
      customerInvoiceId:item.customerInvoiceId,
      customerInvoiceDate:newInvoice.date,
      customerInvoiceDetails:newInvoice.details,
      customerInvoiceMaturitDate:newInvoice.paymentDate,
      customerInvoiceNumber:newInvoice.reference,
      customerInvoiceSum:newInvoice.sum,
      
  }
    await dispatch(updateCustomerInvoice({id:item.customerInvoiceId,invoiceData:updated})).unwrap();
    await dispatch(fetchCustomerInvoices()).unwrap();
 }
  else{

    updated={
      providerInvoiceId:item.providerInvoiceId,
      providerInvoiceDate:newInvoice.date,
      providerInvoiceDetails:newInvoice.details,
      providerInvoiceMaturitDate:newInvoice.paymentDate,
      providerInvoiceNumber:newInvoice.reference,
      providerInvoiceSum:newInvoice.sum,
      
  }
    await dispatch(updateProviderInvoice({id:item.providerInvoiceId,invoiceData:updated})).unwrap();
    await dispatch(fetchProviderInvoices()).unwrap();
}
};

const deleteInvoiceOrpayment=async()=>{

  const isSure = window.confirm("האם אתה בטוח שברצונך למחוק?");
  if (!isSure )return;
   
if(isInvoice){
  try{
  
  await dispatch(deleteCustomerInvoice(item.customerInvoiceId)).unwrap();
   setSnackbarSeverity("success");
   showSnackbar("התשלום נמחק בהצלחה");
  await dispatch(fetchCustomerInvoices()).unwrap();
  
  }
  catch(error){
    setSnackbarSeverity("error");
    showSnackbar("שגיאה");
  }
  
}
else{

  try{

  await dispatch(deleteProviderInvoice(item.providerInvoiceId)).unwrap();
  await dispatch(fetchProviderInvoices()).unwrap();
  setSnackbarSeverity("success");
  showSnackbar("התשלום נמחק בהצלחה");
        
  }
  catch(error){
    showSnackbar("שגיאה");
  }
  
}
}


  return (
    <Box 
    className="invoice-card"
    sx={{
      width: { xs: '100%', sm: 'calc(50% - 1rem)', md: 'calc(33.33% - 1rem)' },
      padding: '1.25rem',
      backgroundColor: '#F3BBB3',
      marginBottom: '1.25rem',
      borderRadius: '0.5rem',
      boxSizing: 'border-box',
      boxShadow: '0 0.25rem 0.5rem rgba(0, 0, 0, 0.1)',
      border: '2px solid #D19793'
    }}>
      <Typography variant="h5" sx={{
        color: 'black',
        fontWeight: 'bold',
        marginBottom: '2rem',
        textAlign: 'right',
        fontSize: '1.5rem'
      }}>
        פרטי {isInvoice ? "חשבונית" : "תשלום"}
      </Typography>

      <Box>
        <Box>
        <Button 
        className="no-print"
      sx={{color:'black',
      boxShadow: '0 0.25rem 0.5rem rgba(0, 0, 0, 0.1)',
      border: '1px solid #D19793',
      backgroundColor:'#F7C6C2',
      marginBottom:'1rem',
      '&:hover':{
        backgroundColor:'#D19793',
        transform:'scale(0.98)',
        border: '1px solid #F7C6C2',
      },
          }}
        onClick={deleteInvoiceOrpayment}>
                  מחק
        </Button>
</Box>
<Box>
           <Button 
            className="no-print"
      sx={{color:'black',
      boxShadow: '0 0.25rem 0.5rem rgba(0, 0, 0, 0.1)',
      border: '1px solid #D19793',
      backgroundColor:'#F7C6C2',
       '&:hover':{
        backgroundColor:'#D19793',
        transform:'scale(0.98)',
        border: '1px solid #F7C6C2',
      },
          }}
        onClick={updateInvoiceOrpayment}>
                  עדכן
        </Button>
      </Box>
      </Box>

      <Box sx={{ display: 'flex',
         flexDirection: 'column',
          gap: '1rem' }}>
        <Typography
          variant="h6"
          sx={{
            textAlign: 'right',
            color: 'black',
            fontSize: '1.125rem'
          }}
        >{isInvoice ? "שם לקוח" : "שם ספק"}</Typography>

        <TextField 
        name="name"
        fullWidth
          variant="outlined"
          sx={textFieldStyles}
          value={newInvoice.name}
          onChange={handleChange}
        />
      </Box>


      <Box sx={{ display: 'flex',
         flexDirection: 'column', 
         gap: '1rem' }}>

        <Typography
          variant="h6"
          sx={{
            textAlign: 'right',
            color: 'black',
            fontSize: '1.125rem'
          }}
        >סכום</Typography>

        <TextField 
        name="sum"
        fullWidth
          type="number"
          variant="outlined"
          sx={textFieldStyles}
          value={newInvoice.sum}
          onChange={handleChange}
        />


        <Typography variant="h6"
          sx={{
            textAlign: 'right',
            color: 'black',
            fontSize: '1.125rem'
          }}>תאריך</Typography>

        <TextField fullWidth
          name="date"
          variant="outlined"
          sx={textFieldStyles}
          value={newInvoice.date}
          onChange={handleChange}
        />

        {isInvoice ? (
          <Box>
            <Typography
              variant="h6"
              sx={{
                textAlign: 'right',
                color: 'black',
                fontSize: '1.125rem'
              }}>תאריך פרעון</Typography>

            <TextField
              name="paymentDate"
              fullWidth
              variant="outlined"
              sx={textFieldStyles}
              value={newInvoice.paymentDate}
              onChange={handleChange}
            />

          </Box>
        ) : (
          <Box>
            <Typography
              variant="h6"
              sx={{
                textAlign: 'right',
                color: 'black',
                fontSize: '1.125rem'
              }}>תאריך לתשלום</Typography>
            <TextField
              fullWidth
              variant="outlined"
              sx={textFieldStyles}
              value={newInvoice.paymentDate} 
              onChange={handleChange}
               />
          </Box>
        )}

        <Typography variant="h6"
          sx={{
            textAlign: 'right',
            color: 'black',
            fontSize: '1.125rem'
          }}>פרטים</Typography>

        <TextField
          name="details"
          fullWidth
          variant="outlined"
          sx={textFieldStyles}
          value={newInvoice.details} 
          onChange={handleChange}
          />


        <Typography variant="h6"
          sx={{
            textAlign: 'right',
            color: 'black',
            fontSize: '1.125rem'
          }}>אסמכתא</Typography>

        <TextField
          name="reference"
          fullWidth
          variant="outlined"
          sx={textFieldStyles}
          value={newInvoice.reference}
          onChange={handleChange}
        />
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
    
  );
};



export default InvoiceAndPayment;
