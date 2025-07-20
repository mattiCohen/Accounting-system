using Accounting_System_DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Accounting_System_DAL.DTO
{
    public class CardDTO
    {
        public int CardId { get; set; }
        public string CardName { get; set; }
        public int CategoryId { get; set; }
        public CategoryDTO CategoryNavigation { get; set; }

        public CardDTO(Card c)
        {
            if (c != null)
            {
                CardId = c.CardId;
                CardName = c.CardName;
                CategoryId = c.CategoryId;
                CategoryNavigation = new CategoryDTO(c.CategoryNavigation);
                
            }
        }
    }
}
