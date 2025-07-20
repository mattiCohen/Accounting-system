using Accounting_System_DAL.DTO;
using Accounting_System_DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Accounting_System_DAL
{
    public class CardDL:ICardDL
    {
        private readonly softwareContext softwareContextDB;

        public CardDL(softwareContext _softwareContextDB)
        {
            this.softwareContextDB = _softwareContextDB;
        }

        public async Task<List<CardDTO>> GetCardsAsync()
        {
            List<Card> c = await softwareContextDB.Cards.Where(c => c.CardName.Length >= 0).Include(card => card.CategoryNavigation.CategoryClassificationNavigation).ToListAsync();
            return c.Select(card => new CardDTO(card)).ToList();
        }

        public async Task<CardDTO> GetCardAsync(int id)
        {
            Card card = await softwareContextDB.Cards.Where(c => c.CardId == id).Include(card => card.CategoryNavigation).FirstOrDefaultAsync();
            if (card != null)
            {
                return new CardDTO(card);
            }
            return null;
        }

        public async Task<int> InsertCardAsync(CardDTO card)
        {
            Card cardNew = new Card() { 
                CardName = card.CardName,
                CategoryId=card.CategoryId
                  };
            softwareContextDB.Cards.Add(cardNew);
            await softwareContextDB.SaveChangesAsync();
            return cardNew.CardId;
           
        }

        public async Task<string> UpdateCardAsync(int id, CardDTO card)
        {
            Card cardUpdate = softwareContextDB.Cards.Where(c => c.CardId == id).Include(card => card.CategoryNavigation).FirstOrDefault();
            if (cardUpdate != null)
            {
                cardUpdate.CardName = card.CardName;
                cardUpdate.CategoryId = card.CategoryId;
                await softwareContextDB.SaveChangesAsync();
                return "Success";
            }
            return "No Success";
        }

        public async Task<string> DeleteCardAsync(int id)
        {
            string msg = "Success";
            try
            {
                softwareContextDB.Remove(softwareContextDB.Cards.FirstOrDefault(c => c.CardId == id));
                await softwareContextDB.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                msg = "Faild";
            }
            return msg;
        }
    }
}
