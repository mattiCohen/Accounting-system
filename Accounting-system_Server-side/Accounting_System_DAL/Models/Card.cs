using System;
using System.Collections.Generic;

namespace Accounting_System_DAL.Models
{
    public partial class Card
    {
        public Card()
        {
            Customerinvoices = new HashSet<Customerinvoice>();
            Providerinvoices = new HashSet<Providerinvoice>();
        }

        public int CardId { get; set; }
        public string CardName { get; set; } = null!;
        public int CategoryId { get; set; }

        public virtual Category ?CategoryNavigation { get; set; } //=null!
        public virtual ICollection<Customerinvoice> Customerinvoices { get; set; }
        public virtual ICollection<Providerinvoice> Providerinvoices { get; set; }
    }
}
