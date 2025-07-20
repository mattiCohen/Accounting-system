import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// שליפת כל החשבוניות לספק
export const fetchProviderInvoices = createAsyncThunk(
  'providerInvoices/fetchProviderInvoices',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/ProviderInvoice');
      console.log("Fetching provider invoices", response.data);
      return response.data;
     
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// שליפת חשבונית אחת לספק
export const fetchOneProviderInvoice = createAsyncThunk(
  'providerInvoices/fetchOneProviderInvoice',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/ProviderInvoice/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// הוספת חשבונית לספק
export const addProviderInvoice = createAsyncThunk(
  'providerInvoices/addProviderInvoice',
  async (invoiceData, thunkAPI) => {
    try {
      const response = await api.post('/ProviderInvoice', invoiceData);
      return {
        ...invoiceData,
        ProviderInvoiceId: response.data
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// עדכון חשבונית לספק
export const updateProviderInvoice = createAsyncThunk(
  'providerInvoices/updateProviderInvoice',
  async ({ id, invoiceData }, thunkAPI) => {
    try {
      await api.put(`/ProviderInvoice?id=${id}`, invoiceData);
      return { ...invoiceData, ProviderInvoiceId: id };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// מחיקת חשבונית לספק
export const deleteProviderInvoice = createAsyncThunk(
  'providerInvoices/deleteProviderInvoice',
  async (id, thunkAPI) => {
    try {
      await api.delete(`/ProviderInvoice?id=${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// מחיקת חשבוניות לספק
export const deleteProviderInvoices = createAsyncThunk(
  'providerInvoices/deleteProviderInvoices',
  async (id, thunkAPI) => {
    try {
      await api.delete(`/ProviderInvoice/all?id=${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

//  לפי שנה מחיקת חשבוניות לספק
export const deleteProviderByYearInvoices = createAsyncThunk(
  'providerInvoicesByYear/deleteProviderInvoicesByYear',
  async ({id,year}, thunkAPI) => {
    try {
      await api.delete(`/ProviderInvoice/allByYear?id=${id}&year=${year}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

//  לפי שנה מחיקת חשבוניות לספקים
export const deleteProvidersByYearInvoices = createAsyncThunk(
  'providersInvoicesByYear/deleteProvidersInvoicesByYear',
  async (year, thunkAPI) => {
    try {
     return await api.delete(`/ProviderInvoice/ByYear?year=${year}`);
      
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);