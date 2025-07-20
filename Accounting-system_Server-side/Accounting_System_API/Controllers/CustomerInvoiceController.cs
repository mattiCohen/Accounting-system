using Accounting_System_BLL;
using Accounting_System_DAL.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Accounting_System_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerInvoiceController : ControllerBase
    {
        private readonly ICustomerInvoiceBLL customerInvoiceBLL;

        public CustomerInvoiceController(ICustomerInvoiceBLL _customerInvoiceBLL)
        {
            this.customerInvoiceBLL = _customerInvoiceBLL;
        }

        [HttpGet]
        public async Task<List<CustomerinvoiceDTO>> GetCustomerInvoices()
        {
            return await customerInvoiceBLL.GetCustomerInvoicesAsync();
        }

        [HttpGet("{id}")]
        public async Task<CustomerinvoiceDTO> GetCustomerInvoice(int id)
        {
            return await customerInvoiceBLL.GetCustomerInvoiceAsync(id);
        }

        [HttpPost]
        public async Task<int> GetCustomerInvoice(CustomerinvoiceDTO customerInvoice)
        {
            return await customerInvoiceBLL.InsertCustomerInvoiceAsync(customerInvoice);
        }

        [HttpPut]
        public async Task<string> UpdateCustomerInvoice(int id, CustomerinvoiceDTO customerInvoice)
        {
            return await customerInvoiceBLL.UpdateCustomerInvoiceAsync(id, customerInvoice);
        }

        [HttpDelete]
        public async Task<string> DeleteCustomerInvoice(int id)
        {
            return await customerInvoiceBLL.DeleteCustomerInvoiceAsync(id);
        }
        [HttpDelete("all")]
        public async Task<string> DeleteCustomerInvoices(int id)
        {
            return await customerInvoiceBLL.DeleteCustomerInvoicesAsync(id);
        }
        [HttpDelete("allByYear")]
        public async Task<string> DeleteCustomerByYearInvoices(int id,int year)
        {
            return await customerInvoiceBLL.DeleteCustomerInvoicesByYearAsync(id,year);
        }
        [HttpDelete("ByYear")]
        public async Task<string> DeleteCustomersByYearInvoices(int year)
        {
            return await customerInvoiceBLL.DeleteCustomersInvoicesByYearAsync(year);
        }
    }
}
