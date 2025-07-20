import { configureStore } from "@reduxjs/toolkit";
import SuppliersReduser from "./SuppliersSlice";
import CustomersReduser from "./CustomersSlice";
import CustomerInvoicesReducer from './CustomerInvoicesSlice';
import ProviderInvoicesReducer from './ProviderInvoicesSlice';
import CardReducer from './CardSlice';
import CategoryReducer from "./CategorySlice";

const store = configureStore({
    reducer: {
        Suppliers: SuppliersReduser,
        Customers: CustomersReduser,
        customerInvoices: CustomerInvoicesReducer,
        providerInvoices: ProviderInvoicesReducer,
        cards: CardReducer,
        category: CategoryReducer,
    },
});

export default store;