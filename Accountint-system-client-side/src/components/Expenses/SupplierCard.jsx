import { useSelector } from "react-redux";
import SupplierNameButton from "./InvoiceAndPayment/SupplierNameButton";
import DateButton from "./InvoiceAndPayment/DateButton";
import { Box, Typography, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import InvoicesAndPayment from "./InvoiceAndPayment/InvoicesAndPayments";
import PrintIcon from '@mui/icons-material/Print';
import CardNumberButton from "./InvoiceAndPayment/CardNumberButton";
import { formatDate } from "../../utils/formatDate";
import ExpenseClassificationButton from "./InvoiceAndPayment/ExpenseClassificationButton";

const SupplierCard = () => {
    const IsInsupplier1 = useSelector(state => state.Suppliers.IsInSupliers);
    const [supplier, setSupplier] = useState(null);
    const [cardNumber, setCardNumber] = useState(null);
    const suppliers = useSelector(state => state.Suppliers.supplierDetailsList);
    const customers = useSelector(state => state.Customers.customersDetailsList);
    const entitiesList = IsInsupplier1 ? suppliers : customers;
    const [showForAllSupplier, setShowForAllSuppliers] = useState(false);
    const currentDate = new Date();
    const nextYearDate = new Date();
    nextYearDate.setFullYear(currentDate.getFullYear() + 1);
    const formattedDate = formatDate(new Date());
    const formattedNextYearDate = formatDate(nextYearDate);
    const [dateEnd, setYearEnd] = useState(formattedNextYearDate);
    const [dateBegin, setYearBegin] = useState(formattedDate.toString());
    const [showAllInvoices, setShowAllInvoices] = useState(false);
    const boxRef = useRef(null);
    const [isPrint, setIsPrint] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(""); // default = all


    const handleEntityChange = (entityId) => {
        const entity = entitiesList.find(e =>
            (IsInsupplier1 ? e.providerId : e.customerId) === entityId
        );
        if (!entity) return;

        const supplierOption = {
            label: IsInsupplier1 ? entity.providerName : entity.customerName,
            value: IsInsupplier1 ? entity.providerId : entity.customerId
        };

        const cardOption = {
            label: (IsInsupplier1 ? entity.providerCardNumber : entity.customerCardNumber)?.toString(),
            value: IsInsupplier1 ? entity.providerId : entity.customerId
        };

        setSupplier(supplierOption);
        setCardNumber(cardOption);
    };

    const allSuppliers = () => {
        setShowForAllSuppliers(true);
        setSupplier(null);
        setCardNumber(null);
    };

    const show = () => {
        if (IsInsupplier1 && !showForAllSupplier) {
            allSuppliers();
        }
        if (dateBegin === "" || dateEnd === "") {
            alert("נא לבחור שנה התחלה ושנה סיום");
            return;
        }

        const parseDate = (str) => {
            const [day, month, year] = str.split('/').map(Number);
            return new Date(year, month - 1, day);
        };

        if (parseDate(dateBegin) >= parseDate(dateEnd)) {
            alert("טווח תאריכים לא תקין");
            return;
        }
        // טריק: מאפס ל-false ואז מחזיר ל-true כדי שה-useEffect יופעל שוב
        setShowAllInvoices(false);
        setTimeout(() => setShowAllInvoices(true), 0);
    };

    const getSupplierText = () => {

        if (supplier) {
            if (IsInsupplier1) {
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
        if (showAllInvoices) {
            boxRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [showAllInvoices]);

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

            {isPrint && <Typography variant="h5" sx={{
                color: 'black',
                fontWeight: 'bold',
                marginBottom: '20px',
                textAlign: 'center',
                width: '100%',
            }}>מהשנים {dateBegin} עד {dateEnd} של {getSupplierText()}</Typography>}
            <Box
                className="no-print">
            </Box>
            <Box 
            className="no-print"
            sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2, // רווח בין האלמנטים
            }}>
                <Box sx={{ flex: '1 1 30%' }}>
                    <SupplierNameButton
                        sx={{
                            backgroundColor: '#DA9F9A',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#D19793',
                            },
                            width: '70%',
                            fontSize: '1rem',
                        }}
                        selectedName={supplier}
                        setSelectedName={(supplier) => {
                            if (supplier) {
                                handleEntityChange(supplier.value);
                            } else {
                                setCardNumber(null);
                                setSupplier(null);
                            }
                        }}
                    />
                </Box>
                <Box sx={{ flex: '1 1 30%' }}>
                    <CardNumberButton
                        sx={{
                            backgroundColor: '#DA9F9A',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#D19793',
                            },
                            width: '70%',
                            fontSize: '1rem',
                            marginRight: '3rem',
                        }}
                        selectedCard={cardNumber}
                        setSelectedCard={(card) => {
                            if (card) {
                                handleEntityChange(card.value);
                            } else {
                                setCardNumber(null);
                                setSupplier(null);
                            }
                        }}
                        isSupplierCard={true}

                    /></Box>
                <Box sx={{ flex: '1 1 30%' }}>
                    <Typography color='black' fontSize='1.25rem' textAlign='right' marginRight='6.7rem'>שנה</Typography>
                    <Box sx={{
                        border: '2px solid #F3BBB3',
                        borderRadius: '4px',
                        padding: '8px',
                    }}>
                        <DateButton
                            sx={{ '& .MuiInputBase-root': { backgroundColor: '#DA9F9A' }, width: '70%' }}
                            date={dateBegin}
                            setDate={setYearBegin}
                        />
                    </Box>
                </Box>

                <Box sx={{ flex: '1 1 30%' }}>
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
                            width: '70%',
                            fontSize: '1.25rem',
                            padding: '0.6rem',
                            borderRadius: '23px',
                            marginTop: '2.3rem',
                            marginLeft: '6rem',
                        }} >
                        הצג
                    </Button>
                </Box>

                <Box sx={{ flex: '1 1 30%' }} >
                    <ExpenseClassificationButton
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        sx={{ backgroundColor: '#DA9F9A', borderRadius: '4px', width: '67.5%', marginLeft: '3rem' }}
                        isSupplierCard={true}
                    />
                </Box>
                <Box >
                    <Button
                        className="no-print"
                        onClick={() => {
                            setIsPrint(true);
                            setTimeout(() => window.print(), 0);
                        }}
                        sx={{
                            position: 'fixed',
                            top: '0.17rem',
                            marginTop: '0.5rem',
                            marginLeft: '12%',
                            minWidth: '0',
                            color: 'black',
                            boxShadow: 'none',
                            zIndex: 9999,
                            '&:hover': {
                                backgroundColor: '#D19793',

                            },
                            '&:focus': {
                                outline: 'none',
                                boxShadow: 'none',
                            },
                            '&:active': {
                                backgroundColor: '#B86F6A',
                            },
                        }}
                    >
                        <PrintIcon sx={{ fontSize: '2rem' }} />
                    </Button>


                    <Box sx={{ flex: '1 1 30%' }}>
                        <Typography color='black' fontSize='1.25rem' textAlign='right' marginRight='6.7rem'
                        >עד שנה</Typography>
                        <Box sx={{
                            border: '2px solid #F3BBB3',
                            borderRadius: '4px',
                            width: '100%',
                            marginRight: '7rem',

                        }}>
                            <DateButton
                                sx={{ '& .MuiInputBase-root': { backgroundColor: '#DA9F9A' } }}
                                date={dateEnd}
                                setDate={setYearEnd}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box
                className="printable"
                ref={boxRef}
                sx={{ width: '100%', scrollMarginTop: '4.5rem' }}>
                {showAllInvoices && (
                    <InvoicesAndPayment
                        yearBegin={dateBegin}
                        yearEnd={dateEnd}
                        supplier={supplier}
                        selectedCategory={selectedCategory}
                        isPrinting={isPrint}
                    />
                )}
            </Box>
        </Box>
    );
};

export default SupplierCard;
