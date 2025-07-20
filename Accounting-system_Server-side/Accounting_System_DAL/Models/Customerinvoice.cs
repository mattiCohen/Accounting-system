using System;
using System.Collections.Generic;

namespace Accounting_System_DAL.Models
{
    public partial class Customerinvoice
    {
        public int CustomerInvoiceId { get; set; }
        public int CustomerId { get; set; }
        public int CardId { get; set; }
        public float CustomerInvoiceSum { get; set; }
        public DateTime CustomerInvoiceDate { get; set; }
        public DateTime CustomerInvoiceMaturityDate { get; set; }
        public string? CustomerInvoiceDetails { get; set; }
        public string? CustomerInvoiceNumber { get; set; }

        public virtual Card ?CardNavigation { get; set; } //= null!;
        public virtual Customer ?CustomerNavigation { get; set; }// = null!;
    }
}