import { useSelector } from "react-redux";
import SupplierNameButton from "./InvoiceAndPayment/SupplierNameButton";
import YearButton from "./InvoiceAndPayment/YearButton";
import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";

const PaymentReport = () => {

    const IsInsupplier1 = useSelector(state => state.Suppliers.IsInSupliers);
    const [supplier, setSupplier] = useState(null);
    const [yearBegin, setYearBegin] = useState("");
    const [yearEnd, setYearEnd] = useState("");
    return (
        <Box sx={{
            padding: '2rem',
            backgroundColor: '#F3BBB3',
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
            '@media (max-width: 1200px)': {  // מחשבים ניידים וקטנים יותר
                width: '95%',
            },
            '@media (max-width: 768px)': {  // טאבלטים ומסכים בינוניים
                width: '100%',
                padding: '15px',
            },
            '@media (max-width: 600px)': {  // סמארטפונים
                width: '100%',
                padding: '10px',
            }
        }}>
            <Typography variant="h5" sx={{
                color: 'black',
                fontWeight: 'bold',
                marginBottom: '1.25rem',
                textAlign: 'center',
                width: '100%',
            }}>
                דוח תשלומים - {IsInsupplier1 ? "ספקים" : "לקוחות"}
            </Typography>

            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                '@media (max-width: 768px)': {
                    flexDirection: 'column',  // במכשירים קטנים יותר הכפתורים יהיו בעמודה
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
                    '@media (max-width: 768px)': {
                        width: '100%',
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
                        marginBottom: '1.25rem',
                        width: '60%',
                        fontSize: '1.25rem',
                        padding: '0.6rem',
                        '@media (max-width: 600px)': {
                            width: '80%',  // כפתור רחב יותר בסמארטפונים
                        }
                    }}>
                        הצג
                    </Button>
                </Box>

                {/* צד ימין: כפתורי שנה */}
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
                    {/* כפתור שנה */}
                    <Box sx={{ width: '50%' }}>
                        <Typography color='black' fontSize='1.25rem' sx={{ textAlign: 'right' }}>שנה</Typography>

                        <Box sx={{
                            width: '100%',
                            border: '2px solid #F3BBB3',
                            borderRadius: '4px',
                            padding: '0.4rem',
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

                    {/* כפתור עד שנה */}
                    <Box sx={{ width: '50%' }}>
                        <Typography color='black' fontSize='1.25rem' sx={{ textAlign: 'right' }}>עד שנה</Typography>

                        <Box sx={{
                            width: '100%',
                            border: '2px solid #F3BBB3',
                            borderRadius: '4px',
                            padding: '0.3rem',
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

export default PaymentReport;
