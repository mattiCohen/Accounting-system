
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';  

// שליפת כל הלקוחות
export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/Customer');  // שליחה של בקשה ל-API
      return response.data; // מחזירה את התשובה (רשימת הלקוחות)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message); // אם יש שגיאה, מחזירה אותה
    }
  }
);

//הוספת לקוח

export const addCustomer = createAsyncThunk(
  'customers/addCustomer',
  async (newCustomerData, thunkAPI) => {
    try {
      const response = await api.post('/Customer', newCustomerData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

//עדכון לקוח

export const updateCustomer = createAsyncThunk(
  'customers/updateCustomer',
  async ({ id, CustomerData }, thunkAPI) => {
    try {
      const response = await api.put(`/Customer?id=${id}`, CustomerData); // <-- ID in query string
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  });

  //מחיקת לקוח

  export const deleteCustomer = createAsyncThunk(
    'customers/deleteCustomer',
    async (id, thunkAPI) => {
      try {
        const response = await api.delete(`/Customer?id=${id}`);
        return response.data; // This is the "Success" or "Faild" string from C#
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
      }
    }
  );

  //שליפת לקוח בודד

  export const fetchOneCustomer = createAsyncThunk(
    'customers/fetchOneCustomer',
    async (id, thunkAPI) => {
      try {
        const response = await api.get(`/customer/${id}`);
        return response.data; // מחזיר את פרטי הלקוח
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || error.message); // אם יש שגיאה, מחזיר אותה
      }
    }
  );