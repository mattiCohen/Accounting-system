import { createSlice } from "@reduxjs/toolkit";
import {
    fetchProviderInvoices,
    fetchOneProviderInvoice,
    addProviderInvoice,
    updateProviderInvoice,
    deleteProviderInvoice,
    deleteProviderInvoices
  } from "./providerInvoicesThunk";

const initialState = {

  providerInvoicesList: [],
  isInvoice: false,
  currentProviderInvoice: null,
  isLoading: false,
  error: false
}
const providerInvoicesSlice = createSlice({
  name: "providerInvoices",
  initialState,
  reducers: {
    setIsInvoice: (state, action) => {
      const { id, isInvoice } = action.payload;
      const invoiceIndex = state.providerInvoicesList.findIndex(item => item.id === id);
      if (invoiceIndex !== -1) {
        state.providerInvoicesList[invoiceIndex].isInvoice = isInvoice ? true : false;
      } else {
        console.error(`Invoice with id ${id} not found!`);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProviderInvoices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProviderInvoices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.providerInvoicesList = action.payload;
      })
      .addCase(fetchProviderInvoices.rejected, (state) => {
        state.isLoading = false;
        state.error = true;
      })

      .addCase(fetchOneProviderInvoice.fulfilled, (state, action) => {
        state.currentProviderInvoice = action.payload;
      })

      .addCase(addProviderInvoice.fulfilled, (state, action) => {
        state.providerInvoicesList.push(action.payload);
      })

      .addCase(updateProviderInvoice.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.providerInvoicesList.findIndex(
          (i) => i.ProviderInvoiceId === updated.ProviderInvoiceId
        );
        if (index !== -1) {
          state.providerInvoicesList[index] = updated;
        }
      })

      .addCase(deleteProviderInvoice.fulfilled, (state, action) => {
        state.providerInvoicesList = state.providerInvoicesList.filter(
          (i) => i.ProviderInvoiceId !== action.payload
        );
      })

      //  .addCase(deleteProviderInvoices.fulfilled, (state, action) => {
      //   state.providerInvoicesList = state.providerInvoicesList.filter(
      //     (i) => i.ProviderInvoiceId !== action.payload
      //   );
      // });
  },
});

export const { setIsInvoice} = providerInvoicesSlice.actions;
export default providerInvoicesSlice.reducer;