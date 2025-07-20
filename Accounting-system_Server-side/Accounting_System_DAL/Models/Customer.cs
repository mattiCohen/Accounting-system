using System;
using System.Collections.Generic;

namespace Accounting_System_DAL.Models
{
    public partial class Customer
    {
        public Customer()
        {
            Customerinvoices = new HashSet<Customerinvoice>();
        }

        public int CustomerId { get; set; }
        public string? CustomerName { get; set; }
        public string? CustomerPhoneNumber { get; set; }
        public string? CustomerAddress { get; set; }
        public string? CustomerEmail { get; set; }
        public string? CustomerContactName { get; set; }
        public int? CustomerCardNumber { get; set; }

        public virtual ICollection<Customerinvoice> Customerinvoices { get; set; }
    }
}
