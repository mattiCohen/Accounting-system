// redux/suppliersThunk.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';  // מייבאת את ה-axios

// שליפת כל הספקים
export const fetchSuppliers = createAsyncThunk(
  'suppliers/fetchSuppliers',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/provider');  // שליחה של בקשה ל-API
      return response.data; // מחזירה את התשובה (רשימת הספקים)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message); // אם יש שגיאה, מחזירה אותה
    }
  }
);


//הוספת ספק

export const addSupplier = createAsyncThunk(
  'suppliers/addSupplier',
  async (newSupplierData, thunkAPI) => {
    try {
      const response = await api.post('/provider', newSupplierData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
//עדכון ספק

export const updateSupplier = createAsyncThunk(
  'suppliers/updateSupplier',
  async ({ id, SupplierData }, thunkAPI) => {
    try {
      const response = await api.put(`/provider?id=${id}`, SupplierData); // <-- ID in query string
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  });

  //מחיקת ספק

  export const deleteSupplier = createAsyncThunk(
    'suppliers/deleteSupplier',
    async (id, thunkAPI) => {
      try {
        const response = await api.delete(`/provider?id=${id}`);
        return response.data; // This is the "Success" or "Faild" string from C#
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
      }
    }
  );

  //שליפת ספק בודד

// שליפת ספק בודד
export const fetchOneSupplier = createAsyncThunk(
  'suppliers/fetchOneSupplier',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/provider/${id}`);
      return response.data;  // מחזירה את פרטי הספק
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message); // אם יש שגיאה, מחזירה אותה
    }
  }
);
