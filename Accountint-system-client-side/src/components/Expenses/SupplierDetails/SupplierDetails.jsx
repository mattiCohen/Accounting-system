import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Paper, Typography, Box } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { NavLink } from "react-router-dom";
import { useEffect } from 'react';
import { fetchSuppliers, deleteSupplier } from '../../../redux/suppliersThunk';
import { fetchCustomers, deleteCustomer } from '../../../redux/customersThunk';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const SupplierDetails = () => {
  const dispatch = useDispatch();
  const IsInSupliers = useSelector(state => state.Suppliers.IsInSupliers)
  const ListOfDetails = useSelector(state => IsInSupliers ? state.Suppliers.supplierDetailsList : state.Customers.customersDetailsList)
  const { error, isLoading } = useSelector(state => IsInSupliers ? state.Suppliers : state.Customers)
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleRowClick = (id) => {
    setSelectedRow(id === selectedRow ? null : id);
  };

  const handleDelete = async () => {
    if (selectedRow !== null) {
      const isSure = window.confirm("האם אתה בטוח שברצונך למחוק?");
    if (!isSure) return;
      try {
        if (IsInSupliers) {
          await dispatch(deleteSupplier(selectedRow)).unwrap();
          await dispatch(fetchSuppliers()).unwrap();
        }
        else {
          await dispatch(deleteCustomer(selectedRow)).unwrap();
          await dispatch(fetchCustomers()).unwrap();
        }
        setSelectedRow(null);
      }
      catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };
  useEffect(() => {
    if (IsInSupliers)
      dispatch(fetchSuppliers());  // שולחת את הבקשה ברגע שהקומפוננטה נטענת
    else dispatch(fetchCustomers());
  }, [dispatch]);

  if (isLoading) {
      return (
      <div style={{ display: "flex",
       justifyContent: "center",
        marginTop: "2rem" ,
        color: "black"}}>
            <CircularProgress style={{ color: "black" }} />
          </div>
      );
  
    }

   if (error) {
    return (
       <div style={{
         display: "flex",
         alignItems: "center",
         justifyContent: "center",
         color: "black",
         marginTop: "1rem" }}>
      <ErrorOutlineIcon style={{ marginRight: "0.5rem" }} />
      <span>שגיאת מערכת</span>
    </div>
    );
  }
  const columns = IsInSupliers
    ? [
      { label: "מ'ס כרטיס", dataKey: "numCard", width: "20%" },
      { label: "שם ספק", dataKey: "name", width: "25%" },
      { label: "כתובת", dataKey: "address", width: "25%" },
      { label: "טלפון", dataKey: "phone", width: "15%" },
      { label: "מייל", dataKey: "email", width: "15%" }
    ]
    : [
      { label: "מ'ס כרטיס", dataKey: "numCard", width: "20%" },
      { label: "שם לקוח", dataKey: "name", width: "30%" },
      { label: "כתובת", dataKey: "address", width: "30%" },
      { label: "טלפון", dataKey: "phone", width: "20%" },
      { label: "מייל", dataKey: "email", width: "20%" }
    ];

  function createData(supplierData) {
    if (!supplierData) {
      console.log("ריק לחלוטין")
      return {}
    }
    if (IsInSupliers) {
      return {
        id: supplierData.providerId,
        numCard: supplierData.providerCardNumber,
        name: supplierData.providerName,
        phone: supplierData.providerPhoneNumber,
        address: supplierData.providerAddress,
        email: supplierData.providerEmail
      }
    }
    else {
      return {
        id: supplierData.customerId,
        name: supplierData.customerName,
        phone: supplierData.customerPhoneNumber,
        address: supplierData.customerAddress,
        email: supplierData.customerEmail,
        numCard: supplierData.customerCardNumber,
      };
      

    }
  }

  const rows = ListOfDetails.map(createData);

  function fixedHeaderContent() {
    return (
      <TableRow>
        {columns.map((column, index) => (
          <TableCell
            key={column.dataKey}
            variant="head"
            align="center"
            style={{
              width: column.width,
              fontWeight: 'bold',
              padding: '0.8rem 1rem',
              backgroundColor: '#F7C6C2',
              borderBottom: '1px solid #D19793', // צבע קו תחתון תואם
              textAlign: 'center',
              borderRight: index !== columns.length - 1 ? '1px solid #D19793' : 'none' // הוספת גבול בין העמודות
            }}
          >
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    );
  }

  function rowContent(_index, row) {
    return (
      <TableRow
        key={row.id}
        onClick={() => handleRowClick(row.id)}
        style={{
          backgroundColor: row.id === selectedRow ? '#D19793' : '#F8D5D1',
          cursor: 'pointer',
        }}
      >
        {columns.map((column) => (
          <TableCell
            key={`${row.id}-${column.dataKey}`}
            align="center"
            style={{
              padding: '1rem 1rem',
              borderBottom: '1px solid #D19793', // צבע קו תחתון תואם
              textAlign: 'center'
            }}
          >
            {row[column.dataKey]}
          </TableCell>
        ))}
      </TableRow>
    );
  }

  function ReactTable() {
    return (
      <Paper sx={{ width: '100%', overflow: 'auto', borderRadius: '22px' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table
            stickyHeader
            aria-label="sticky table"
            sx={{ borderCollapse: 'collapse' }}>
            <TableHead>
              {fixedHeaderContent()}
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => rowContent(null, row))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(+e.target.value);
            setPage(0);
          }}
          sx={{
            backgroundColor: '#F7C6C2'
          }}
        />
      </Paper>
    );
  }

  return (
    <Box sx={{
      width: '100%',
      maxWidth: '1200px',
      mx: 'auto',
      px: { xs: '2rem', sm: '4rem' },
      py: { xs: '2rem', sm: '3rem' }
    }}>
      <div style={{
        backgroundColor: '#D19793',
        borderRadius: '22px',
        padding: '2rem'
      }}>
        <Typography variant="h5" sx={{
          color: 'black',
          fontWeight: 'bold',
          mb: 3,
          textAlign: 'center',
          fontSize: { xs: '1.2rem', sm: '1.5rem' }
        }}>
          רשימת {IsInSupliers ? "ספקים" : "לקוחות"}
        </Typography>

        <ReactTable />

        {/* כפתור מחיקה */}
        <Button
          onClick={handleDelete}
          disabled={selectedRow === null}
          variant="contained"
          color="error"
          sx={{
            width: { xs: '100%', sm: '30%' },
            my: { xs: '1.5rem', sm: '2rem' },
            mr: { sm: '2rem' },
            backgroundColor: '#F8D5D1',
            color: '#000',
            '&:hover': { backgroundColor: '#F7C6C2' }
          }}
        >
          מחק
        </Button>

        {/* כפתור עדכון */}
        <NavLink
          to={selectedRow !== null && IsInSupliers ? `SupplierUpdate/${selectedRow}` : `CustomerUpdate/${selectedRow}`}
          onClick={(e) => {
            if (selectedRow === null) e.preventDefault();
          }}
          style={{ textDecoration: 'none' }}
        >

          <Button
            variant="contained"
            color="primary"
            disabled={selectedRow === null}
            sx={{
              width: { xs: '100%', sm: '30%' },
              my: { xs: '1.5rem', sm: '2rem' },
              mr: { sm: '2rem' },
              backgroundColor: '#F8D5D1',
              color: '#000',
              '&:hover': { backgroundColor: '#F7C6C2' }
            }}
          >
            עדכן
          </Button>
        </NavLink>

        {/* כפתור הוספה */}
        <NavLink
          to={IsInSupliers ? "OpeningSupplier" : "OpeningCustomer"}
          style={{ textDecoration: 'none' }}
        >
          <Button
            variant="contained"
            color="success"
            sx={{
              width: { xs: '100%', sm: '30%' },
              my: { xs: '1.5rem', sm: '2rem' },
              backgroundColor: '#F8D5D1',
              color: '#000',
              '&:hover': { backgroundColor: '#F7C6C2' }
            }}
          >
            הוסף {IsInSupliers ? "ספק" : "לקוח"}
          </Button>
        </NavLink>
      </div>

    </Box>

  );
};

export default SupplierDetails;
