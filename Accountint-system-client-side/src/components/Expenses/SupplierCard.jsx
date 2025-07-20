import { useSelector } from "react-redux";
import SupplierNameButton from "./InvoiceAndPayment/SupplierNameButton";
import YearButton from "./InvoiceAndPayment/YearButton";
import { Box, Typography, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import InvoicesAndPayment from "./InvoiceAndPayment/InvoicesAndPayments";
import PrintIcon from '@mui/icons-material/Print';

const SupplierCard = () => {
    const IsInsupplier1 = useSelector(state => state.Suppliers.IsInSupliers);
    const [supplier, setSupplier] = useState(null);
    const currentYear = new Date().getFullYear();
    const [showForAllSupplier, setShowForAllSuppliers] = useState(false);
    const [yearBegin, setYearBegin] = useState(currentYear.toString());
    const [yearEnd, setYearEnd] = useState((currentYear + 1).toString());
    const [showAllInvoices, setShowAllInvoices] = useState(false);
    const boxRef = useRef(null);
    const [isPrint, setIsPrint] = useState(false);


    const scroll = () => {
        boxRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const allSuppliers = () => {
        setShowForAllSuppliers(true);
        setSupplier(null);
    };

    const show = () => {
        if (!supplier && !showForAllSupplier) {
            alert(IsInsupplier1 ? "נא לבחור שם ספק" : "נא לבחור שם לקוח");
            return;
        }
        if (yearBegin === "" || yearEnd === "") {
            alert("נא לבחור שנה התחלה ושנה סיום");
            return;
        }
        if (yearBegin >= yearEnd) {
            alert("טווח תאריכים לא תקין");
            return;
        }
        setShowAllInvoices(true);
        scroll();
    };

const getSupplierText = () => {
   
  if (supplier) {
     if(IsInsupplier1){
    return " הספק " + supplier.label; 
  }
  else {
    return " הלקוח " + supplier.label; 

  }
}
  if (showForAllSupplier) {
    return IsInsupplier1 ? "כל הספקים" : "כל הלקוחות"; 
  }
  return ""; 
};

     useEffect(() => {
    const handleAfterPrint = () => {
      setIsPrint(false);
    };

    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []); 
    return (
        <Box 
       
        sx={{
            padding: '2rem',
            backgroundColor: '#F3BBB3',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            marginBottom: '1.25rem',
            marginTop: '4%',
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            width: '95%',
            '@media (max-width: 768px)': {
                width: '100%',
                padding: '15px',
            },
            '@media (max-width: 600px)': {
                width: '100%',
                padding: '10px',
            }
        }}>
            <Typography variant="h5" 
            
            sx={{
                color: 'black',
                fontWeight: 'bold',
                marginBottom: '20px',
                textAlign: 'center',
                width: '100%',
            }}>
                דוח כרטסת - {IsInsupplier1 ? "ספקים" : "לקוחות"}
            </Typography>
            
           { isPrint &&<Typography variant="h5" sx={{
                color: 'black',
                fontWeight: 'bold',
                marginBottom: '20px',
                textAlign: 'center',
                width: '100%',
            }}>מהשנים {yearBegin} עד {yearEnd} של { getSupplierText()}</Typography>}
            <Box 
            className="no-print"
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                '@media (max-width: 768px)': {
                    flexDirection: 'column',
                    alignItems: 'center',
                }
            }}>
                {/* צד שמאל */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 5,
                    alignItems: 'flex-start',
                    width: '48%',
                    '@media (max-width: 768px)': {
                        width: '100%',
                        alignItems: 'center',
                    }
                }}>
                    <Box sx={{ width: '60%' }}>
                        <SupplierNameButton
                            sx={{
                                backgroundColor: '#DA9F9A',
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: '#D19793',
                                },
                                width: '100%',
                                fontSize: '1rem',
                            }}
                            selectedName={supplier}
                            setSelectedName={(supplier) => setSupplier(supplier)}
                        />
                    </Box>
                    <Button
                        className="no-print"
                        sx={{
                            backgroundColor: '#DA9F9A',
                            color: 'black',
                            '&:hover': {
                                backgroundColor: '#D89C97',
                            },
                            width: '60%',
                            fontSize: '1.2rem',
                            padding: '0.6rem',
                            '@media (max-width: 600px)': {
                                width: '85%',
                            }
                        }}
                        onClick={allSuppliers}
                    >
                        כל ה{IsInsupplier1 ? "ספקים" : "לקוחות"}
                    </Button>
                </Box>

                {/* צד ימין */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    alignItems: 'flex-end',
                    width: '48%',
                    '@media (max-width: 768px)': {
                        width: '100%',
                        alignItems: 'center',
                    }
                }}>
                    <Box sx={{ width: '50%' }}>
                        <Typography color='black' fontSize='1.25rem' sx={{ textAlign: 'right' }}>שנה</Typography>
                        <Box sx={{
                            width: '100%',
                            border: '2px solid #F3BBB3',
                            borderRadius: '4px',
                            padding: '8px',
                        }}>
                            <YearButton
                                sx={{ '& .MuiInputBase-root': { backgroundColor: '#DA9F9A' } }}
                                year={yearBegin}
                                setYear={setYearBegin}
                            />
                        </Box>
                    </Box>

                    <Box sx={{ width: '50%' }}>
                        <Typography color='black' fontSize='1.25rem' sx={{ textAlign: 'right' }}>עד שנה</Typography>
                        <Box sx={{
                            width: '100%',
                            border: '2px solid #F3BBB3',
                            borderRadius: '4px',
                            padding: '8px',
                        }}>
                            <YearButton
                                sx={{ '& .MuiInputBase-root': { backgroundColor: '#DA9F9A' } }}
                                year={yearEnd}
                                setYear={setYearEnd}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* כפתור הצג ממורכז */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                mt: 2
            }}>


                <Button
                    className="no-print"
                    onClick={() => {
                        setIsPrint(true);
                       setTimeout(() => window.print(), 0);
                         }}
                    sx={{
                        position: 'fixed',
                        top: '10px',
                        left: '10px',
                        minWidth: '0',
                        padding: '10px',
                        backgroundColor: 'transparent',
                        color: 'black',
                        boxShadow: 'none',
                        '&:hover': {
                            backgroundColor: '#eee',
                        },
                        zIndex: 9999
                    }}
                >
                    <PrintIcon />
                </Button>


                <Button
                    className="no-print"
                    variant="contained"
                    onClick={show}
                    sx={{
                        backgroundColor: '#DA9F9A',
                        color: 'black',
                        '&:hover': {
                            backgroundColor: '#D89C97',
                        },
                        marginBottom: '1.25rem',
                        width: '250px',
                        fontSize: '1.25rem',
                        padding: '0.6rem',
                        '@media (max-width: 600px)': {
                            width: '85%',
                        }
                    }}
                >
                    הצג
                </Button>
            </Box>

            <Box 
            
             ref={boxRef} 
             sx={{ width: '100%', scrollMarginTop: '4.5rem' }}>
                {showAllInvoices && (
                    <InvoicesAndPayment
                        yearBegin={yearBegin}
                        yearEnd={yearEnd}
                        supplier={supplier}
                    />
                )}
            </Box>
        </Box>
    );
};

export default SupplierCard;
