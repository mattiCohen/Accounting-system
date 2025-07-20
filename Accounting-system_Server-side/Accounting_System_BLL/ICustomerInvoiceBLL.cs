using Accounting_System_DAL.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Accounting_System_BLL
{
    public interface ICustomerInvoiceBLL
    {
        Task<List<CustomerinvoiceDTO>> GetCustomerInvoicesAsync();
        Task<CustomerinvoiceDTO> GetCustomerInvoiceAsync(int id);
        Task<int> InsertCustomerInvoiceAsync(CustomerinvoiceDTO customerInvoice);
        Task<string> UpdateCustomerInvoiceAsync(int id, CustomerinvoiceDTO customerInvoice);
        Task<string> DeleteCustomerInvoiceAsync(int id);
        Task<string> DeleteCustomerInvoicesAsync(int id);
        Task<string> DeleteCustomerInvoicesByYearAsync(int id,int year);
        Task<string> DeleteCustomersInvoicesByYearAsync(int year);
    }
}
