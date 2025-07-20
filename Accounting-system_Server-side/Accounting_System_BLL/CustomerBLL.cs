using Accounting_System_DAL.DTO;
using Accounting_System_DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Accounting_System_BLL
{
    public class CustomerBLL : ICustomerBLL
    {
        private readonly ICustomerDL customerDL;

        public CustomerBLL(ICustomerDL _customerDL)
        {
            this.customerDL = _customerDL;
        }

        public async Task<List<CustomerDTO>> GetCustomersAsync()
        {
            return await customerDL.GetCustomersAsync();
        }

        public async Task<CustomerDTO> GetCustomerAsync(int id)
        {
            return await customerDL.GetCustomerAsync(id);
        }

        public async Task<int> InsertCustomerAsync(CustomerDTO customer)
        {
            return await customerDL.InsertCustomerAsync(customer);
        }

        public async Task<string> UpdateCustomerAsync(int id, CustomerDTO customer)
        {
            return await customerDL.UpdateCustomerAsync(id, customer);
        }

        public async Task<string> DeleteCustomerAsync(int id)
        {
            return await customerDL.DeleteCustomerAsync(id);
        }
    }
}
