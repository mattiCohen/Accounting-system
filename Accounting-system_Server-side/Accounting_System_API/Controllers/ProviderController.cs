using Accounting_System_BLL;
using Accounting_System_DAL.DTO;
using Microsoft.AspNetCore.Mvc;

namespace Accounting_System_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProviderController:ControllerBase
    {
        private readonly IProviderBLL providerBLL;

        public ProviderController(IProviderBLL _providerBLL)
        {
            this.providerBLL = _providerBLL;
        }

        [HttpGet]
        public async Task<List<ProvidersDTO>> GetProviders()
        {
            return await providerBLL.GetProvidersAsync();
        }

        [HttpGet("{id}")]
        public async Task<ProvidersDTO> GetProvider(int id)
        {
            return await providerBLL.GetProviderAsync(id);
        }

        [HttpPost]
        public async Task<int> AddProvider(ProvidersDTO provider)
        {
            return await providerBLL.InsertProviderAsync(provider);
        }

        [HttpPut]
        public async Task<string> UpdateProvider([FromQuery] int id,[FromBody] ProvidersDTO provider)
        {
            return await providerBLL.UpdateProviderAsync(id, provider);
        }

        [HttpDelete]
        public async Task<string> DeleteProvider(int id)
        {
            return await providerBLL.DeleteProviderAsync(id);
        }
    }
}
