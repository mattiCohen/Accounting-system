using Accounting_System_DAL;
using Accounting_System_DAL.DTO;

namespace Accounting_System_BLL
{
    public class ProviderInvoiceBLL: IProviderInvoiceBLL
    {
        private readonly IProviderInvoiceDL providerInvoiceDL;

        public ProviderInvoiceBLL(IProviderInvoiceDL _providerInvoiceDL)
        {
            this.providerInvoiceDL = _providerInvoiceDL;
        }

        public async Task<List<ProviderinvoiceDTO>> GetProvidersInvoicesAsync()
        {
            return await providerInvoiceDL.GetProviderInvoicesAsync();
        }

        public async Task<ProviderinvoiceDTO> GetProviderInvoiceAsync(int id)
        {
            return await providerInvoiceDL.GetProviderInvoiceAsync(id);
        }

        public async Task<int> InsertProviderInvoiceAsync(ProviderinvoiceDTO providerInvoice)
        {
            return await providerInvoiceDL.InsertProviderInvoiceAsync(providerInvoice);
        }

        public async Task<string> UpdateProviderInvoiceAsync(int id, ProviderinvoiceDTO providerInvoice)
        {
            return await providerInvoiceDL.UpdateProviderInvoiceAsync(id, providerInvoice);
        }

        public async Task<string> DeleteProviderInvoiceAsync(int id)
        {
            return await providerInvoiceDL.DeleteProviderInvoiceAsync(id);
        }
        public async Task<string> DeleteProviderInvoicesAsync(int id)
        {
            return await providerInvoiceDL.DeleteProviderInvoicesAsync(id);
        }

        public async Task<string> DeleteProviderInvoicesByYearAsync(int id, int year)
        {
            return await providerInvoiceDL.DeleteProviderInvoicesByYearAsync(id,year);
        }

        public async Task<string> DeleteProvidersInvoicesByYearAsync(int year)
        {
            return await providerInvoiceDL.DeleteProvidersInvoicesByYearAsync(year);
        }
    }
}
