
import InvoicesAndPayments from "./InvoiceAndPayment/InvoicesAndPayments";
import SupplierDetails from "./SupplierDetails/SupplierDetails";
import InvoiceReport from "./InvoiceReport";
import PaymentReport from "./PaymentReport";
import SupplierCard from "./SupplierCard";
import Expenses from "./Expenses";
import { Routes, Route } from 'react-router-dom';
import OpeningSupplier from "./SupplierDetails/OpeningSupplier";
import SupplierUpdate from "./SupplierDetails/SupplierUpdate";
import AddInvoiceOrPayment from "./InvoiceAndPayment/AddInvoiceOrPayment";


const ExpensesHomePage = () => {

    return (

        <div>

            <Routes>

                <Route path="/" element={<Expenses />}></Route>
                <Route path="InvoicesAndPayments" element={<AddInvoiceOrPayment />}></Route>
                <Route path="SupplierDetails/" element={<SupplierDetails />} />
                <Route path="SupplierDetails/OpeningSupplier" element={<OpeningSupplier />} />
                <Route path="SupplierDetails/SupplierUpdate/:id" element={<SupplierUpdate />} />
                <Route path="InvoiceReport" element={<SupplierCard/>}></Route>
                <Route path="PaymentReport" element={<SupplierCard />}></Route>
                <Route path="SupplierCard" element={<SupplierCard />}></Route>
                <Route path="CustomerCard" element={<SupplierCard />}></Route>
                <Route path="CustomerDetails/" element={<SupplierDetails />} />
                <Route path="CustomerDetails/CustomerUpdate/:id" element={<SupplierUpdate />} />
                <Route path="CustomerDetails/OpeningCustomer" element={<OpeningSupplier/>} />
                
            </Routes>
        </div>
    );
};

export default ExpensesHomePage;