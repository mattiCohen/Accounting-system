import { useDispatch, useSelector } from "react-redux";
import InvoiceAndPayment from "./InvoiceAndPayment";
import { Typography, Box, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, TablePagination, useMediaQuery, Autocomplete, TextField } from '@mui/material';
import { useEffect, useRef, useState } from "react";
import { fetchProviderInvoices } from "../../../redux/providerInvoicesThunk";
import { fetchCustomerInvoices } from "../../../redux/customerInvoicesThunk";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { deleteProviderInvoice, updateProviderInvoice } from "../../../redux/providerInvoicesThunk";
import { deleteCustomerInvoice, updateCustomerInvoice } from "../../../redux/customerInvoicesThunk";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useNavigate } from "react-router-dom";
import { fetchCustomers } from "../../../redux/customersThunk";
import { fetchSuppliers } from "../../../redux/suppliersThunk";
import { fetchCategories } from "../../../redux/CategoryThunk";
import { addCard } from "../../../redux/CardThunk";
import { fetchCards } from "../../../redux/CardThunk";

const formatDateToDDMMYYYY = (dateStr) => {
  if (!dateStr) return "";

  const date = new Date(dateStr); // parse C# DateTime string
  if (isNaN(date)) return "";

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // month is 0-indexed
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const InvoicesAndPayment = ({ yearBegin, yearEnd, supplier, selectedCategory, isPrinting }) => {
  const IsInSuppliers = useSelector(state => state.Suppliers.IsInSupliers);
  const allInvoicesAndPayments = useSelector(state =>
    IsInSuppliers
      ? state.providerInvoices.providerInvoicesList
      : state.customerInvoices.customerInvoicesList
  );
  const suppliers = useSelector(state => state.Suppliers.supplierDetailsList);
  const customers = useSelector(state => state.Customers.customersDetailsList);
  const categories = useSelector(state => state.category.categories);
  const { error, isLoading } = useSelector((state) => {
    if (IsInSuppliers) {
      return state.Suppliers || state.providerInvoices;
    } else {
      return state.Customers || state.customerInvoices;
    }
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const totalSumRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [filteredInvoicesAndPayments, setFilteredInvoicesAndPayments] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInvoice, setEditedInvoice] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const list = IsInSuppliers ? suppliers : customers;
  const cards = useSelector(state => state.cards.cards);
  const options = list.map(item => ({
    label: (IsInSuppliers ? item.providerCardNumber : item.customerCardNumber)?.toString(),
    value: item.providerId || item.customerId
  }));
  const currentOption = options.find(opt => opt.value === editedInvoice.id) || null;

  const paginatedRows = filteredInvoicesAndPayments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const style = {
    width: '100%',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: 'inherit',
    fontFamily: 'inherit',
    textAlign: 'center',
    padding: '8px 0', // תואם padding של התא
    outline: 'none',
    color: 'inherit', // ישתמש בצבע הטקסט של התא
  }

  const handleRowClick = (invoiceId, invoiceData) => {
    if (isEditing && selectedInvoice === invoiceId) {
      return;
    } if (selectedInvoice === invoiceId) {
      setSelectedInvoice(null);
      setIsEditing(false);
      setEditedInvoice({});
    } else {
      setSelectedInvoice(invoiceId);

      setEditedInvoice({
        invoiceId: IsInSuppliers ? invoiceData.providerInvoiceId : invoiceData.customerInvoiceId || "",
        id: IsInSuppliers ? invoiceData.providerId : invoiceData.customerId || "",
        cardNumber: IsInSuppliers ? (invoiceData.provider.providerCardNumber || 0) : invoiceData.customerNavigation.customerCardNumber || 0,
        date: IsInSuppliers ? invoiceData.providerInvoiceDate.split('T')[0] : invoiceData.customerInvoiceDate.split('T')[0] || "",
        paymentDate: IsInSuppliers ? invoiceData.providerInvoicePaymentDate.split('T')[0] : invoiceData.customerInvoiceMaturityDate.split('T')[0] || "",
        sum: IsInSuppliers ? invoiceData.providerInvoiceSum : invoiceData.customerInvoiceSum || 0,
        details: IsInSuppliers ? invoiceData.providerInvoiceDetails : invoiceData.customerInvoiceDetails || "",
        invoiceNumber: IsInSuppliers ? invoiceData.providerInvoiceNumber : invoiceData.customerInvoiceNumber,
        cardId: invoiceData.cardId,
        name: IsInSuppliers ? invoiceData.provider.providerName : invoiceData.customerNavigation.customerName,
        category: IsInSuppliers
          ? invoiceData.card?.categoryNavigation?.categoryName
          : invoiceData.cardNavigation?.categoryNavigation?.categoryName,
        categoryId: IsInSuppliers
          ? invoiceData.card?.categoryId
          : invoiceData.cardNavigation.categoryId,
      });
    }
  };

  const handleEditChange = (field, value) => {
    setEditedInvoice(prev => ({ ...prev, [field]: value }));
  };
  useEffect(() => {
  }, [isPrinting]);

  const handleDelete = async () => {
    if (!selectedInvoice) return;
    if (!window.confirm("האם אתה בטוח שברצונך למחוק את החשבונית?")) return;

    try {
      if (IsInSuppliers) {
        await dispatch(deleteProviderInvoice(selectedInvoice)).unwrap();
        await dispatch(fetchProviderInvoices()).unwrap();
      } else {
        await dispatch(deleteCustomerInvoice(selectedInvoice)).unwrap();
        await dispatch(fetchCustomerInvoices()).unwrap();
      }
      setSnackbarMessage("החשבונית נמחקה בהצלחה!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      setSelectedInvoice(null);
    } catch (error) {
      setSnackbarMessage("שגיאה בעדכון החשבונית");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      console.error("Error deleting invoice:", error);
    }
  };



  const handleSave = async () => {
    const isCard = cards.find(card =>
      card.cardName === editedInvoice.name &&
      card.categoryId === editedInvoice.categoryId
    );
    let cardId = 0;
    if (!isCard) {
      console.log("כרטיס לא קיים");
      const addedCard = await dispatch(addCard({
        cardName: editedInvoice.name,
        categoryId: editedInvoice.categoryId,
        categoryNavigation: {
          categoryId: editedInvoice.categoryId,
          categoryName: "",
          categoryClassification: 0,
          categoryClassificationNavigation: {
            classificationId: 0,
            classificationName: ""
          }
        }
      })).unwrap();
      cardId = addedCard.cardId;
    } else {
      console.log("כרטיס קיים כבר");
      cardId = isCard.cardId;
    }
    editedInvoice.cardId = cardId;

    try {
      let updated = {};
      if (IsInSuppliers) {
        updated = {
          providerInvoiceId: editedInvoice.invoiceId,
          providerId: editedInvoice.id,
          cardId: editedInvoice.cardId,
          providerInvoiceSum: editedInvoice.sum,
          providerInvoiceDate: editedInvoice.date,
          providerInvoicePaymentDate: editedInvoice.paymentDate,
          providerInvoiceDetails: editedInvoice.details,
          providerInvoiceNumber: editedInvoice.invoiceNumber,
          card: {
            cardId: editedInvoice.cardId,
            cardName: editedInvoice.name,
            categoryId: editedInvoice.categoryId,
            categoryNavigation: {
              categoryId: editedInvoice.categoryId,
              categoryName: "",
              categoryClassification: 0,
              categoryClassificationNavigation: {
                classificationId: 0,
                classificationName: ""
              }
            }
          },
          provider: {
            providerId: editedInvoice.id,
            providerName: "",
            providerPhoneNumber: "",
            providerAddress: "",
            providerEmail: "",
            providerContactName: "",
            providerCardNumber: editedInvoice.cardNumber
          }
        }

        await dispatch(updateProviderInvoice({
          id: editedInvoice.invoiceId,
          invoiceData: updated
        })).unwrap();
        await dispatch(fetchProviderInvoices()).unwrap();
      } else {
        updated = {
          customerInvoiceId: editedInvoice.invoiceId,
          customerId: editedInvoice.id,
          cardId: editedInvoice.cardId,
          customerInvoiceSum: editedInvoice.sum,
          customerInvoiceDate: editedInvoice.date,
          customerInvoiceMaturityDate: editedInvoice.paymentDate,
          customerInvoiceDetails: editedInvoice.details,
          customerInvoiceNumber: editedInvoice.invoiceNumber,
          customerNavigation: {
            customerId: editedInvoice.id,
            customerName: "",
            customerPhoneNumber: "",
            customerAddress: "",
            customerEmail: "",
            customerContactName: "",
            customerCardNumber: editedInvoice.cardNumber
          },
          cardNavigation: {
            cardId: editedInvoice.cardId,
            cardName: editedInvoice.name,
            categoryId: editedInvoice.categoryId,
            categoryNavigation: {
              categoryId: editedInvoice.categoryId,
              categoryName: "",
              categoryClassification: 0,
              categoryClassificationNavigation: {
                classificationId: 0,
                classificationName: ""
              }
            }
          }
        }
        await dispatch(updateCustomerInvoice({
          id: editedInvoice.invoiceId,
          invoiceData: updated
        })).unwrap();
        await dispatch(fetchCustomerInvoices()).unwrap();
      }
      setIsEditing(false);
      setSelectedInvoice(null);
      setSnackbarMessage("החשבונית עודכנה בהצלחה!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error updating invoice:", error);
      setSnackbarMessage("שגיאה בעדכון החשבונית");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);

    }
  };


  const totalSum = filteredInvoicesAndPayments.reduce(
    (acc, item) => acc + (IsInSuppliers ? item.providerInvoiceSum : item.customerInvoiceSum),
    0
  );

  const scrollToTotalSum = () => {
    totalSumRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
    if (IsInSuppliers) {
      dispatch(fetchSuppliers()).unwrap();
    } else {
      dispatch(fetchCustomers()).unwrap();
    }
    dispatch(fetchCategories()).unwrap();
  }, [IsInSuppliers, dispatch]);

  const parseDateSafely = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  };
  const handleAdd = () => {
    if (IsInSuppliers) {
      navigate("/Expenses/InvoicesAndPayments");
    } else {
      navigate("/InCome/InvoicesAndPayments");
    }
  }
  const parseDateInvoice = (dateStr) => {
    if (!dateStr) return null;
    return dateStr.split('T')[0];
  };
  useEffect(() => {
    dispatch(fetchCards()).unwrap();
  }
    , [dispatch]);


  useEffect(() => {
    const startDate = parseDateSafely(yearBegin);
    const endDate = parseDateSafely(yearEnd);

    const filtered = allInvoicesAndPayments.filter((invoice) => {
      const invoiceDateRaw = IsInSuppliers
        ? invoice.providerInvoiceDate
        : invoice.customerInvoiceDate;

      const invoiceSupplierId = IsInSuppliers
        ? invoice.providerId
        : invoice.customerId;

      const parsedDateInvoice = parseDateInvoice(invoiceDateRaw);

      const inRange = parsedDateInvoice && parsedDateInvoice >= startDate && parsedDateInvoice <= endDate;
      const supplierMatch = !supplier || invoiceSupplierId === supplier.value;
      const categoryMatch =
        !selectedCategory ||
        (IsInSuppliers
          ? invoice.card?.categoryId === selectedCategory
          : invoice.cardNavigation?.categoryId === selectedCategory);

      return inRange && supplierMatch && categoryMatch;
    });

    setFilteredInvoicesAndPayments(filtered);
  }, [yearBegin, yearEnd, supplier, allInvoicesAndPayments, IsInSuppliers, selectedCategory]);

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
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
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
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MuiAlert
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>

        <Paper sx={{
          width: '95%',
          mx: 'auto',
          overflow: 'auto',
          borderRadius: '22px',
        }}>
          <TableContainer >
            <Table stickyHeader sx={{ borderCollapse: 'collapse' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#F7C6C2', borderBottom: '1px solid #D19793', textAlign: 'center' }}>מספר כרטיס</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#F7C6C2', borderBottom: '1px solid #D19793', textAlign: 'center' }}>{IsInSuppliers ? "ספק" : "לקוח"}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#F7C6C2', borderBottom: '1px solid #D19793', textAlign: 'center' }}>תאריך</TableCell>
                  {IsInSuppliers ? <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#F7C6C2', borderBottom: '1px solid #D19793', textAlign: 'center' }}>תאריך לתשלום</TableCell> :
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#F7C6C2', borderBottom: '1px solid #D19793', textAlign: 'center' }}>תאריך לפרעון</TableCell>}
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#F7C6C2', borderBottom: '1px solid #D19793', textAlign: 'center' }}>סכום</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#F7C6C2', borderBottom: '1px solid #D19793', textAlign: 'center' }}>פרטים</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#F7C6C2', borderBottom: '1px solid #D19793', textAlign: 'center' }}>אסמכתא</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#F7C6C2', borderBottom: '1px solid #D19793', textAlign: 'center' }}>קטגוריה</TableCell>
                </TableRow>
              </TableHead>
              <TableBody >
                {(isPrinting ? filteredInvoicesAndPayments : paginatedRows).map((item) => {
                  const invoiceId = IsInSuppliers ? item.providerInvoiceId : item.customerInvoiceId;
                  const isSelected = selectedInvoice === invoiceId;

                  return (
                    <TableRow key={invoiceId} sx={{ backgroundColor: isSelected ? '#D19793' : '#F8D5D1', cursor: 'pointer' }}
                      onClick={() => handleRowClick(invoiceId, item)}
                    >
                      <TableCell align="center" >
                        {isSelected && isEditing ? (
                          <Autocomplete
                            options={options}
                            getOptionLabel={(option) => String(option?.label)}
                            value={
                              editedInvoice.cardNumber !== undefined
                                ? { label: String(editedInvoice.cardNumber ?? "0"), value: editedInvoice.id }
                                : null
                            }

                            onChange={(e, newValue) => {
                              if (newValue) {
                                handleEditChange("id", newValue.value);
                                handleEditChange("cardNumber", newValue.label);
                              }
                            }}
                            renderInput={(params) => <TextField {...params} variant="standard" size="small" onClick={(e) => {
                              if (isEditing) e.stopPropagation();
                            }} />}
                          />
                        ) : (
                          IsInSuppliers ? item.provider.providerCardNumber : item.customerNavigation.customerCardNumber
                        )}
                      </TableCell>

                      <TableCell align="center" >
                        {isSelected && isEditing ? (
                          <Autocomplete
                            value={list.find(item => item[IsInSuppliers ? "providerId" : "customerId"] === editedInvoice.id) || null}
                            options={list}
                            getOptionLabel={(option) => IsInSuppliers ? option.providerName : option.customerName}
                            onChange={(e, newVal) => {
                              if (newVal) {
                                handleEditChange("id", IsInSuppliers ? newVal.providerId : newVal.customerId);
                                handleEditChange("name", IsInSuppliers ? newVal.providerName : newVal.customerName);
                                handleEditChange(
                                  "cardNumber",
                                  IsInSuppliers ? newVal.providerCardNumber : newVal.customerCardNumber
                                );
                              }
                            }}
                            renderInput={(params) => <TextField {...params} variant="standard" size="small" onClick={(e) => {
                              if (isEditing) e.stopPropagation();
                            }} />}
                          />
                        ) : (
                          IsInSuppliers ? item.provider.providerName : item.customerNavigation.customerName
                        )}
                      </TableCell>

                      <TableCell align="center">
                        {isSelected && isEditing ? (
                          <input
                            style={style}
                            type="date"
                            value={editedInvoice.date || ''}
                            onChange={(e) =>
                              handleEditChange(
                                "date", e.target.value
                              )
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : IsInSuppliers ? formatDateToDDMMYYYY(item.providerInvoiceDate) : formatDateToDDMMYYYY(item.customerInvoiceDate)}
                      </TableCell>

                      <TableCell align="center">
                        {isSelected && isEditing ? (
                          <input
                            style={style}
                            type="date"
                            value={editedInvoice.paymentDate || ''}
                            onChange={(e) =>
                              handleEditChange(
                                "paymentDate", e.target.value
                              )
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : IsInSuppliers ? formatDateToDDMMYYYY(item.providerInvoicePaymentDate) : formatDateToDDMMYYYY(item.customerInvoiceMaturityDate)}
                      </TableCell>

                      <TableCell align="center">
                        {isSelected && isEditing ? (
                          <input
                            style={style}
                            type="number"
                            value={editedInvoice.sum || 0}
                            onChange={(e) =>
                              handleEditChange(
                                "sum", e.target.value
                              )
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : IsInSuppliers ? item.providerInvoiceSum.toLocaleString() : item.customerInvoiceSum.toLocaleString()}
                      </TableCell>

                      <TableCell align="center">
                        {isSelected && isEditing ? (
                          <input
                            style={style}
                            value={editedInvoice.details || ''}
                            onChange={(e) =>
                              handleEditChange(
                                "details",
                                e.target.value
                              )
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : IsInSuppliers ? item.providerInvoiceDetails : item.customerInvoiceDetails}
                      </TableCell>

                      <TableCell align="center">
                        {isSelected && isEditing ? (
                          <input
                            style={style}
                            value={editedInvoice.invoiceNumber || ''}
                            onChange={(e) =>
                              handleEditChange(
                                "invoiceNumber",
                                e.target.value
                              )
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : IsInSuppliers ? item.providerInvoiceNumber : item.customerInvoiceNumber}
                      </TableCell>
                      <TableCell align="center" >
                        {isSelected && isEditing ? (
                          <Autocomplete
                            value={
                              editedInvoice.categoryId
                                ? {
                                  label: categories.find(c => c.categoryId === editedInvoice.categoryId)?.categoryName || "",
                                  value: editedInvoice.categoryId
                                }
                                : null
                            }
                            options={categories.map(cat => ({
                              label: cat.categoryName,
                              value: cat.categoryId
                            }))}
                            onChange={(e, newVal) => {
                              handleEditChange("categoryId", newVal?.value || 0);
                            }}
                            renderInput={(params) => (
                              <TextField {...params} variant="standard" size="small" onClick={(e) => {
                                if (isEditing) e.stopPropagation();
                              }} />
                            )}
                          />
                        ) : (
                          IsInSuppliers
                            ? item.card?.categoryNavigation?.categoryName
                            : item.cardNavigation?.categoryNavigation?.categoryName)}
                      </TableCell>


                    </TableRow>
                  );
                })}
              </TableBody>

            </Table>
          </TableContainer>
          <TablePagination
            className="no-print"
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={filteredInvoicesAndPayments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            sx={{
              backgroundColor: '#F7C6C2'
            }}
          />

        </Paper>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', my: 2 }}>
          <Button variant="contained" color="error" onClick={handleDelete}
            disabled={!selectedInvoice}
            className="no-print"
            sx={{
              '&:hover': {
                backgroundColor: 'white',
                color: '#38016eff',

              },
              '&:focus': {
                outline: 'none',
                boxShadow: 'none',
              },
              '&:active': {
                backgroundColor: '#aba7a7ff',
                color: '#242650ff',
              },
              backgroundColor: '#2e3166',
              width: '8rem',
              marginRight: '1.5rem',
            }}
          >
            מחק
          </Button>
          <Button variant="contained" color="error" onClick={handleAdd}
            className="no-print"
            sx={{
              '&:hover': {
                backgroundColor: 'white',
                color: '#38016eff',

              },
              '&:focus': {
                outline: 'none',
                boxShadow: 'none',
              },
              '&:active': {
                backgroundColor: '#aba7a7ff',
                color: '#242650ff',
              },
              backgroundColor: '#2e3166',
              width: '8rem',
              marginRight: '1.5rem',
            }}
          >
            חדש
          </Button>
          <Button
            className="no-print"
            sx={{
              '&:hover': {
                backgroundColor: 'white',
                color: '#2e3166',

              },
              '&:focus': {
                outline: 'none',
                boxShadow: 'none',
              },
              '&:active': {
                backgroundColor: '#aba7a7ff',
                color: '#242650ff',
              },
              backgroundColor: '#2e3166',
              width: '8rem',
            }}
            variant="contained"
            onClick={() => {
              if (!isEditing) {
                setIsEditing(true);  // מתחיל עריכה
              } else {
                handleSave();        // שומר שינויים
              }
            }}
            disabled={!selectedInvoice}
          >
            {isEditing ? "שמור" : "ערוך"}
          </Button>

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
        <button
          onClick={scrollToTotalSum}
          style={{
            position: 'fixed',
            bottom: '2rem',
            backgroundColor: '#2e3166',
            color: 'white',
            borderRadius: '27px',
            fontWeight: 'bold',
            padding: '0.5rem 1rem',
            zIndex: 1300,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          הצג סכום סופי
        </button>
      )}
    </Box>
  );
};

export default InvoicesAndPayment;
