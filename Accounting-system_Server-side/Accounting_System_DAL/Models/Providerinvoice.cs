using System;
using System.Collections.Generic;

namespace Accounting_System_DAL.Models
{
    public partial class Providerinvoice
    {
        public int ProviderInvoiceId { get; set; }
        public int ProviderId { get; set; }
        public int CardId { get; set; }
        public float ProviderInvoiceSum { get; set; }
        public DateTime ProviderInvoiceDate { get; set; }
        public DateTime ProviderInvoicePaymentDate { get; set; }
        public string? ProviderInvoiceDetails { get; set; }
        public string? ProviderInvoiceNumber { get; set; }


        public virtual Card ?Card { get; set; } //= null!;
        public virtual Provider ?Provider { get; set; }// = null!;
    }
}
