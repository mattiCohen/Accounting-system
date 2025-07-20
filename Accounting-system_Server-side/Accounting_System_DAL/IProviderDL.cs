using Accounting_System_DAL.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Accounting_System_DAL
{
    public interface IProviderDL
    {
        Task<List<ProvidersDTO>> GetProvidersAsync();
        Task<ProvidersDTO> GetProviderAsync(int id);
        Task<int> InsertproviderAsync(ProvidersDTO provider);
        Task<string> UpdateProviderAsync(int id, ProvidersDTO provider);
        Task<string> DeleteProviderAsync(int id);
    }
}
