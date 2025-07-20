using Accounting_System_BLL;
using Accounting_System_DAL.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Accounting_System_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProviderInvoiceController : ControllerBase
    {
        private readonly IProviderInvoiceBLL providerInvoiceBLL;

        public ProviderInvoiceController(IProviderInvoiceBLL _providerInvoiceBLL)
        {
            this.providerInvoiceBLL = _providerInvoiceBLL;
        }

        [HttpGet]
        public async Task<List<ProviderinvoiceDTO>> GetProviderInvoices()
        {
            return await providerInvoiceBLL.GetProvidersInvoicesAsync();
        }

        [HttpGet("{id}")]
        public async Task<ProviderinvoiceDTO> GetCustomerInvoice(int id)
        {
            return await providerInvoiceBLL.GetProviderInvoiceAsync(id);
        }

        [HttpPost]
        public async Task<int> InsertProviderInvoiceAsync(ProviderinvoiceDTO providerInvoice)
        {
            return await providerInvoiceBLL.InsertProviderInvoiceAsync(providerInvoice);
        }

        [HttpPut]
        public async Task<string> UpdateProviderInvoiceAsync(int id, ProviderinvoiceDTO providerInvoice)
        {
            return await providerInvoiceBLL.UpdateProviderInvoiceAsync(id, providerInvoice);
        }

        [HttpDelete]
        public async Task<string> DeleteProviderInvoiceAsync(int id)
        {
            return await providerInvoiceBLL.DeleteProviderInvoiceAsync(id);
        }
        [HttpDelete("all")]
        public async Task<string> DeleteProviderInvoicesAsync(int id)
        {
            return await providerInvoiceBLL.DeleteProviderInvoicesAsync(id);
        }
        [HttpDelete("allByYear")]
        public async Task<string> DeleteProviderInvoicesByYearAsync(int id,int year)
        {
            return await providerInvoiceBLL.DeleteProviderInvoicesByYearAsync(id,year);
        }
        [HttpDelete("ByYear")]
        public async Task<string> DeleteProvidersInvoicesByYearAsync( int year)
        {
            return await providerInvoiceBLL.DeleteProvidersInvoicesByYearAsync(year);
        }
    }
}
