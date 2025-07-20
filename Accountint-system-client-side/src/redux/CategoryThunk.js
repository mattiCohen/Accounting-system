import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api'; // your axios instance

export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/Category');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  'category/fetchCategoryById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/Category/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addCategory = createAsyncThunk(
  'category/addCategory',
  async (category, { rejectWithValue }) => {
    try {
      const response = await api.post('/Category', category);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  'category/updateCategory',
  async ({ id, category }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/Category?id=${id}`, category);
      return { id, category: response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/Category?id=${id}`);
return {
  data: response.data,
  status: response.status,
};    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
