using Accounting_System_DAL.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Accounting_System_DAL
{
    public interface ICustomerDL
    {
        Task<List<CustomerDTO>> GetCustomersAsync();
        Task<CustomerDTO> GetCustomerAsync(int id);
        Task<int> InsertCustomerAsync(CustomerDTO customer);
        Task<string> UpdateCustomerAsync(int id, CustomerDTO customer);
        Task<string> DeleteCustomerAsync(int id);
    }
}

    

