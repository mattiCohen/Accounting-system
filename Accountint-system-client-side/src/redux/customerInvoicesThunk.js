import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// שליפת כל החשבוניות ללקוח
export const fetchCustomerInvoices = createAsyncThunk(
  'customerInvoices/fetchCustomerInvoices',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/CustomerInvoice');
      console.log("Fetching customer invoices", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// שליפת חשבונית אחת ללקוח
export const fetchOneCustomerInvoice = createAsyncThunk(
  'customerInvoices/fetchOneCustomerInvoice',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/CustomerInvoice/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// הוספת חשבונית ללקוח
export const addCustomerInvoice = createAsyncThunk(
  'customerInvoices/addCustomerInvoice',
  async (invoiceData, thunkAPI) => {
    try {
      const response = await api.post('/CustomerInvoice', invoiceData);
      return {
        ...invoiceData,
        CustomerInvoiceId: response.data // מחזיר ID חדש משרת
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// עדכון חשבונית ללקוח
export const updateCustomerInvoice = createAsyncThunk(
  'customerInvoices/updateCustomerInvoice',
  async ({ id, invoiceData }, thunkAPI) => {
    try {
      const response = await api.put(`/CustomerInvoice?id=${id}`, invoiceData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// מחיקת חשבונית ללקוח
export const deleteCustomerInvoice = createAsyncThunk(
  'customerInvoices/deleteCustomerInvoice',
  async (id, thunkAPI) => {
    try {
      await api.delete(`/CustomerInvoice?id=${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);


// מחיקת חשבונית ללקוח
export const deleteCustomerInvoices = createAsyncThunk(
  'customerInvoices/deleteCustomerInvoices',
  async (id, thunkAPI) => {
    try {
      await api.delete(`/CustomerInvoice/all?id=${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// מחיקת חשבונית ללקוח לפי שנה
export const deleteCustomerInvoicesByYear = createAsyncThunk(
  'customerInvoicesByYear/deleteCustomerInvoicesByYear',
  async ({id,year}, thunkAPI) => {
    try {
      await api.delete(`/CustomerInvoice/allByYear?id=${id}&year=${year}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// מחיקת חשבונית ללקוח לפי שנה
export const deleteCustomersInvoicesByYear = createAsyncThunk(
  'customersInvoicesByYear/deleteCustomersInvoicesByYear',
  async (year, thunkAPI) => {
    try {
     return await api.delete(`/CustomerInvoice/ByYear?year=${year}`);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

