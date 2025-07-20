using Accounting_System_DAL.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Accounting_System_DAL
{
    public interface IProviderInvoiceDL
    {
        Task<List<ProviderinvoiceDTO>> GetProviderInvoicesAsync();
        Task<ProviderinvoiceDTO> GetProviderInvoiceAsync(int id);
        Task<int> InsertProviderInvoiceAsync(ProviderinvoiceDTO providerInvoice);
        Task<string> UpdateProviderInvoiceAsync(int id, ProviderinvoiceDTO providerInvoice);
        Task<string> DeleteProviderInvoiceAsync(int id);
        Task<string> DeleteProviderInvoicesAsync(int id);
        Task<string> DeleteProviderInvoicesByYearAsync(int id, int year);
        Task<string> DeleteProvidersInvoicesByYearAsync(int year);


    }
}
