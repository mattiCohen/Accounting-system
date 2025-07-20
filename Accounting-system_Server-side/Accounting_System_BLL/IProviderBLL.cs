using Accounting_System_DAL.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Accounting_System_BLL
{
    public interface IProviderBLL
    {
        Task<List<ProvidersDTO>> GetProvidersAsync();
        Task<ProvidersDTO> GetProviderAsync(int id);
        Task<int> InsertProviderAsync(ProvidersDTO provider);
        Task<string> UpdateProviderAsync(int id, ProvidersDTO provider);
        Task<string> DeleteProviderAsync(int id);
    }
}
