import { useSelector } from "react-redux";
import SupplierNameButton from "./InvoiceAndPayment/SupplierNameButton";
import YearButton from "./InvoiceAndPayment/YearButton";
import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";

const InvoiceReport = () => {
    
    const IsInsupplier1 = useSelector(state=>state.Suppliers.IsInSupliers);
    const [supplier, setSupplier] = useState(null);
    const [yearBegin, setYearBegin] = useState("");
    const [yearEnd, setYearEnd] = useState("");
    return (
        <Box sx={{
            padding: '2rem',
            backgroundColor: '#F3BBB3',  // רקע של הכרטיס
            borderRadius: '8px',
            boxSizing: 'border-box',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            marginBottom: '1.25rem',
            marginTop: '4%',
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            flexDirection: 'column',
            gap: 3,
            width: '90%',
            '@media (max-width: 600px)': {
                width: '100%',
                padding: '15px',
            }
        }}>
            <Typography variant="h5" sx={{
                color: 'black',
                fontWeight: 'bold',
                marginBottom: '1.25rem',
                textAlign: 'center',
                width: '100%',
            }}>
                דוח חשבוניות - {IsInsupplier1?"ספקים" :"לקוחות"}
            </Typography>

            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                '@media (max-width: 600px)': {
                    flexDirection: 'column',  // במידה ויש מסך קטן, הכפתורים יהיו בעמודה
                    alignItems: 'center',
                }
            }}>
                {/* צד שמאל: כפתור ספק והצג */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 5,
                    alignItems: 'flex-start',
                    width: '48%',
                    '@media (max-width: 600px)': {
                        width: '100%',  // רוחב מלא במכשירים קטנים
                        alignItems: 'center',
                    }
                }}>
                    <Box sx={{ width: '60%' }}>
                        <SupplierNameButton sx={{
                            backgroundColor: '#DA9F9A',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#D19793',
                            },
                            width: '100%',
                            fontSize: '1.25rem',
                        }} 
                        selectedName={supplier}
                        setSelectedName={(supplier) => setSupplier(supplier)}
                        />
                    </Box>

                    <Button variant="contained" sx={{
                        backgroundColor: '#D19793',
                        color: 'black',
                        '&:hover': {
                            backgroundColor: '#D19793',
                        },
                        marginBottom: '20px',
                        width: '60%',
                        fontSize: '1.25rem',
                        padding: '12px',
                        '@media (max-width: 600px)': {
                            width: '80%',  // על מסכים קטנים הכפתור יהיה רחב יותר
                        }
                    }}>
                        הצג
                    </Button>
                </Box>

               
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    alignItems: 'flex-end',
                    width: '48%',
                    '@media (max-width: 600px)': {
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
                            <YearButton sx={{
                                '& .MuiInputBase-root': {
                                    backgroundColor: '#DA9F9A',
                                }
                            }}
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
                            <YearButton sx={{
                                '& .MuiInputBase-root': {
                                    backgroundColor: '#DA9F9A',
                                }
                            }}
                            year={yearEnd}
                            setYear={setYearEnd}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* כרטיס נוסף */}
            <Box sx={{
                padding: '1.25rem',
                backgroundColor: '#F7C6C2',
                borderRadius: '8px',
                boxSizing: 'border-box',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                marginBottom: '2rem',
                marginTop: '4%',
                marginLeft: 'auto',
                marginRight: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                flexDirection: 'column',
                gap: 3,
                width: '90%',
                border: '2px solid #D19793',
                '@media (max-width: 600px)': {
                    width: '100%',
                }
            }}>
            </Box>
        </Box>
    );
};

export default InvoiceReport;
