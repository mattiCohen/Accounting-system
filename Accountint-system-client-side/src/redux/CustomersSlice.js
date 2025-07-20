import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  fetchOneCustomer
} from './customersThunk';

const initialState = {

  customersDetailsList: [],
  currentCustomer: null,
  isLoading: false,
  error: false
}
const CustomersSlice = createSlice({
  name: "Customers",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      // Fetch all customers
      .addCase(fetchCustomers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customersDetailsList = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state) => {
        state.isLoading = false;
        state.error = true;
      })

      // Add customer
      .addCase(addCustomer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customersDetailsList.push(action.payload);
      })
      .addCase(addCustomer.rejected, (state) => {
        state.isLoading = false;
        state.error = true;
      })

      // Update customer
      .addCase(updateCustomer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload;
        const index = state.customersDetailsList.findIndex(c => c.id === updated.id);
        if (index !== -1) {
          state.customersDetailsList[index] = updated;
        }
      })
      .addCase(updateCustomer.rejected, (state) => {
        state.isLoading = false;
        state.error = true;
      })

      // Delete customer
      .addCase(deleteCustomer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedId = action.meta.arg; // the id we sent
        state.customersDetailsList = state.customersDetailsList.filter(c => c.id !== deletedId);
      })
      .addCase(deleteCustomer.rejected, (state) => {
        state.isLoading = false;
        state.error = true;
      })

      // Fetch one customer
      .addCase(fetchOneCustomer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOneCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCustomer = action.payload;
      })
      .addCase(fetchOneCustomer.rejected, (state) => {
        state.isLoading = false;
        state.error = true;
      });
  }
});

export const { setIsInvoice} = CustomersSlice.actions;
export default CustomersSlice.reducer;