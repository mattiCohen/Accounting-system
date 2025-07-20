import api from "../api";
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCards = createAsyncThunk(
  'cards/fetchCards',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/Card');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchOneCard = createAsyncThunk(
  'cards/fetchOneCard',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/Card/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addCard = createAsyncThunk(
  'cards/addCard',
  async (cardData, thunkAPI) => {
    try {
      console.log('Adding card with data:', cardData);
      const response = await api.post('/Card', cardData);
      console.log('Card added successfully:', response.data);
      return {
        ...cardData,
        CardId: response.data // מחזיר ID חדש משרת
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCard = createAsyncThunk(
  'cards/updateCard',
  async ({ id, cardData }, thunkAPI) => {
    try {
      const response = await api.put(`/Card?id=${id}`, cardData);
      return response.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCard = createAsyncThunk(
  'cards/deleteCard',
  async (id, thunkAPI) => {
    try {
      await api.delete(`/Card?id=${id}`);
      return id; // מחזיר את ה-ID של הכרטיס שנמחק
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);