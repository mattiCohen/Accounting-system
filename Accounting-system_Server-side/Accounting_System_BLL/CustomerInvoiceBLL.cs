using Accounting_System_DAL;
using Accounting_System_DAL.DTO;

namespace Accounting_System_BLL
{
    public class CustomerInvoiceBLL:ICustomerInvoiceBLL
    {
        private readonly ICustomerInvoiceDL customerInvoiceDL;

        public CustomerInvoiceBLL(ICustomerInvoiceDL _customerInvoiceDL)
        {
            this.customerInvoiceDL = _customerInvoiceDL;
        }

        public async Task<List<CustomerinvoiceDTO>> GetCustomerInvoicesAsync()
        {
            return await customerInvoiceDL.GetCustomerInvoicesAsync();
        }

        public async Task<CustomerinvoiceDTO> GetCustomerInvoiceAsync(int id)
        {
            return await customerInvoiceDL.GetCustomerInvoiceAsync(id);
        }

        public async Task<int> InsertCustomerInvoiceAsync(CustomerinvoiceDTO customerInvoice)
        {
            return await customerInvoiceDL.InsertCustomerInvoiceAsync(customerInvoice);
        }

        public async Task<string> UpdateCustomerInvoiceAsync(int id, CustomerinvoiceDTO customerInvoice)
        {
            return await customerInvoiceDL.UpdateCustomerInvoiceAsync(id, customerInvoice);
        }

        public async Task<string> DeleteCustomerInvoiceAsync(int id)
        {
            return await customerInvoiceDL.DeleteCustomerInvoiceAsync(id);
        }
        public async Task<string> DeleteCustomerInvoicesAsync(int id)
        {
            return await customerInvoiceDL.DeleteCustomerInvoicesAsync(id);
        }

        public async Task<string> DeleteCustomerInvoicesByYearAsync(int id, int year)
        {
            return await customerInvoiceDL.DeleteCustomerInvoicesByYearAsync(id,year); 
        }

        public async Task<string> DeleteCustomersInvoicesByYearAsync(int year)
        {
            return await customerInvoiceDL.DeleteCustomersInvoicesByYearAsync( year);        }
    }
}
