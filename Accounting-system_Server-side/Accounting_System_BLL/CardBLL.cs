using Accounting_System_DAL.DTO;
using Accounting_System_DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Accounting_System_BLL
{
    public class CardBLL:ICardBLL
    {

        private readonly ICardDL cardDL;

        public CardBLL(ICardDL _cardDL)
        {
            this.cardDL = _cardDL;
        }

        public async Task<List<CardDTO>> GetCardsAsync()
        {
            return await cardDL.GetCardsAsync();
        }

        public async Task<CardDTO> GetCardAsync(int id)
        {
            return await cardDL.GetCardAsync(id);
        }

        public async Task<int> InsertCardAsync(CardDTO card)
        {
            return await cardDL.InsertCardAsync(card);
        }

        public async Task<string> UpdateCardAsync(int id, CardDTO card)
        {
            return await cardDL.UpdateCardAsync(id, card);
        }

        public async Task<string> DeleteCardAsync(int id)
        {
            return await cardDL.DeleteCardAsync(id);
        }
    }
}
