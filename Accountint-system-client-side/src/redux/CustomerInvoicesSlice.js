import { createSlice } from "@reduxjs/toolkit";
import {
    fetchCustomerInvoices,
    fetchOneCustomerInvoice,
    addCustomerInvoice,
    updateCustomerInvoice,
    deleteCustomerInvoice,
    deleteCustomerInvoices
  } from "./customerInvoicesThunk";

const initialState = {

  customerInvoicesList: [],
  currentCustomerInvoice: null,
  createdInvoice: null,
  isInvoice: false,
  isLoading: false,
  error: false
}
const customerInvoicesSlice = createSlice({
  name: "customerInvoices",
  initialState,
  reducers: {},
  
  extraReducers: (builder) => {
    builder
    .addCase(fetchCustomerInvoices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCustomerInvoices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customerInvoicesList = action.payload;
      })
      .addCase(fetchCustomerInvoices.rejected, (state) => {
        state.isLoading = false;
        state.error = true;
      })

      .addCase(fetchOneCustomerInvoice.fulfilled, (state, action) => {
        state.currentCustomerInvoice = action.payload;
      })

      .addCase(fetchOneCustomerInvoice.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })

      .addCase(fetchOneCustomerInvoice.rejected, (state) => {
        state.isLoading = false;
        state.error = true;
      })

      .addCase(addCustomerInvoice.fulfilled, (state, action) => {
        state.customerInvoicesList.push(action.payload);
        state.createdInvoice = action.payload;
      })
       .addCase(addCustomerInvoice.rejected, (state) => {
        state.isLoading = false;
        state.error = true;
      })
       .addCase(addCustomerInvoice.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })

      .addCase(updateCustomerInvoice.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.customerInvoicesList.findIndex(
          (i) => i.CustomerInvoiceId === updated.CustomerInvoiceId
        );
        if (index !== -1) {
          state.customerInvoicesList[index] = updated;
        }
      })

      .addCase(updateCustomerInvoice.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(updateCustomerInvoice.rejected, (state) => {
        state.isLoading = false;
        state.error = true;
      })

      .addCase(deleteCustomerInvoice.fulfilled, (state, action) => {
        state.customerInvoicesList = state.customerInvoicesList.filter(
          (i) => i.CustomerInvoiceId !== action.payload
        );
      })

      .addCase(deleteCustomerInvoice.pending, (state) => {
        state.isLoading = true;
        state.error = false;
      })

      .addCase(deleteCustomerInvoice.rejected, (state) => {
        state.isLoading = false;
        state.error = true;
      })
      //  .addCase(deleteCustomerInvoices.pending, (state) => {
      //   state.isLoading = true;
      //   state.error = false;
      // })
      // .addCase(deleteCustomerInvoices.fulfilled, (state, action) => {
      //   state.customerInvoicesList = state.customerInvoicesList.filter(
      //     (i) => i.CustomerInvoiceId !== action.payload
      //   );
      // });
  },
});

export const { setIsInvoice } = customerInvoicesSlice.actions;
export default customerInvoicesSlice.reducer;