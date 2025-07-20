using Accounting_System_DAL.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Accounting_System_BLL
{
    public interface ICardBLL
    {
        Task<List<CardDTO>> GetCardsAsync();
        Task<CardDTO> GetCardAsync(int id);
        Task<int> InsertCardAsync(CardDTO card);
        Task<string> UpdateCardAsync(int id, CardDTO card);
        Task<string> DeleteCardAsync(int id);
    }
}
