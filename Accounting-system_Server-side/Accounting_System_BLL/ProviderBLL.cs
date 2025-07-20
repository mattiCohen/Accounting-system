using Accounting_System_DAL;
using Accounting_System_DAL.DTO;

namespace Accounting_System_BLL
{
    public class ProviderBLL: IProviderBLL
    {
        private readonly IProviderDL providerDL;

        public ProviderBLL(IProviderDL _providerDL)
        {
            this.providerDL = _providerDL;
        }

        public async Task<List<ProvidersDTO>> GetProvidersAsync()

        {
            return await providerDL.GetProvidersAsync();
        }

        public async Task<ProvidersDTO> GetProviderAsync(int id)
        {
            return await providerDL.GetProviderAsync(id);
        }

        public async Task<int> InsertProviderAsync(ProvidersDTO provider)
        {
            return await providerDL.InsertproviderAsync(provider);
        }

        public async Task<string> UpdateProviderAsync(int id, ProvidersDTO provider)
        {
            return await providerDL.UpdateProviderAsync(id, provider);
        }

        public async Task<string> DeleteProviderAsync(int id)
        {
            return await providerDL.DeleteProviderAsync(id);
        }
    }
}