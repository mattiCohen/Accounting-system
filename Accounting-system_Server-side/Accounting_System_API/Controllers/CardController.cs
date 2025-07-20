using Accounting_System_BLL;
using Accounting_System_DAL.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Accounting_System_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CardController : ControllerBase
    {
        private readonly ICardBLL cardBLL;

        public CardController(ICardBLL _cardBLL)


        {
            this.cardBLL = _cardBLL;
        }

        [HttpGet]
        public async Task<List<CardDTO>> GetCards()
        {
            return await cardBLL.GetCardsAsync();
        }

        [HttpGet("{id}")]
        public async Task<CardDTO> GetCard(int id)
        {
            return await cardBLL.GetCardAsync(id);
        }

        [HttpPost]
        public async Task<int> InsertCard(CardDTO card)
        {
            return await cardBLL.InsertCardAsync(card);
        }

        [HttpPut]
        public async Task<string> UpdateCard(int id, CardDTO card)
        {
            return await cardBLL.UpdateCardAsync(id, card);
        }

        [HttpDelete]
        public async Task<string> DeleteCard(int id)
        {
            return await cardBLL.DeleteCardAsync(id);
        }
    }
}
