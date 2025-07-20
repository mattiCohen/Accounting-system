using Accounting_System_BLL;
using Accounting_System_DAL.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Accounting_System_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerBLL customerBLL;

        public CustomerController(ICustomerBLL _customerBLL)
        {
            this.customerBLL = _customerBLL;
        }

        [HttpGet]
        public async Task<List<CustomerDTO>> GetCustomers()
        {
            return await customerBLL.GetCustomersAsync();
        }

        [HttpGet("{id}")]
        public async Task<CustomerDTO> GetCustomer(int id)
        {
            return await customerBLL.GetCustomerAsync(id);
        }

        [HttpPost]
        public async Task<int> GetCustomers(CustomerDTO customer)
        {
            return await customerBLL.InsertCustomerAsync(customer);
        }

        [HttpPut]
        public async Task<string> UpdateCustomer([FromQuery] int id, [FromBody]CustomerDTO customer)
        {
            return await customerBLL.UpdateCustomerAsync(id, customer);
        }

        [HttpDelete]
        public async Task<string> DeleteCustomer(int id)
        {
            return await customerBLL.DeleteCustomerAsync(id);
        }
    }
}
