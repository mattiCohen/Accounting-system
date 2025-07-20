using System;
using System.Collections.Generic;

namespace Accounting_System_DAL.Models
{
    public partial class Category
    {
        public Category()
        {
            Cards = new HashSet<Card>();
        }

        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = null!;
        public int CategoryClassification { get; set; }

        public virtual Classification CategoryClassificationNavigation { get; set; } //= null!;
        public virtual ICollection<Card> Cards { get; set; }
    }
}
