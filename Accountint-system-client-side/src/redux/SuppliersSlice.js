import { createSlice } from "@reduxjs/toolkit";
import { fetchSuppliers, addSupplier, updateSupplier, deleteSupplier, fetchOneSupplier } from './suppliersThunk';

const initialState = {

    supplierDetailsList: [],
    currentSupplier: null,
    IsInSupliers:false,
    isLoading:false,
    error:false
}
const SuppliersSlice = createSlice({
    name: "Suppliers",
    initialState,
    reducers: {
      setIsInvoice: (state, action) => {
            const { id, isInvoice } = action.payload;
            const invoiceIndex = state.InvoicesAndPaymentsList.findIndex(item => item.id === id);
            if (invoiceIndex !== -1) {
              state.InvoicesAndPaymentsList[invoiceIndex].isInvoice = isInvoice; // No changes needed here
            } else {
              console.error(`Invoice with id ${id} not found!`);
            }
          },     
    setIsInSupliers:(state,action)=>{
        state.IsInSupliers=action.payload;
    }

    },
    extraReducers: (builder) => {
      builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.supplierDetailsList = action.payload; // Update state with the fetched suppliers
      })
      .addCase(fetchSuppliers.rejected, (state) => {
        state.isLoading = false;
        state.error = true; // If there’s an error, set error to true
      });

    // Add Supplier
    builder
      .addCase(addSupplier.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addSupplier.fulfilled, (state, action) => {
        state.isLoading = false;
        state.supplierDetailsList.push(action.payload); // Add the new supplier to the list
      })
      .addCase(addSupplier.rejected, (state) => {
        state.isLoading = false;
        state.error = true; // If there’s an error, set error to true
      });

    // Update Supplier
    builder
      .addCase(updateSupplier.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedSupplier = action.payload;
        const index = state.supplierDetailsList.findIndex(supplier => supplier.id === updatedSupplier.id);
        if (index !== -1) {
          state.supplierDetailsList[index] = updatedSupplier; // Update the supplier details
        }
      })
      .addCase(updateSupplier.rejected, (state) => {
        state.isLoading = false;
        state.error = true; // If there’s an error, set error to true
      });

    // Delete Supplier
    builder
      .addCase(deleteSupplier.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.isLoading = false;
        state.supplierDetailsList = state.supplierDetailsList.filter(
          supplier => supplier.id !== action.payload.id
        ); // Remove the deleted supplier from the list
      })
      .addCase(deleteSupplier.rejected, (state) => {
        state.isLoading = false;
        state.error = true; // If there’s an error, set error to true
      });

    // Fetch One Supplier
    builder
      .addCase(fetchOneSupplier.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOneSupplier.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSupplier = action.payload;
      })
      .addCase(fetchOneSupplier.rejected, (state) => {
        state.isLoading = false;
        state.error = true; // If there’s an error, set error to true
      });
  
      }
});

export const { setIsInvoice, setIsInSupliers } = SuppliersSlice.actions;
export default SuppliersSlice.reducer;