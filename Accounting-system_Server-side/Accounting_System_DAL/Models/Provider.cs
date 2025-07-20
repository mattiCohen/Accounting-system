using System;
using System.Collections.Generic;

namespace Accounting_System_DAL.Models
{
    public partial class Provider
    {
        public Provider()
        {
            Providerinvoices = new HashSet<Providerinvoice>();
        }

        public int ProviderId { get; set; }
        public string? ProviderName { get; set; }
        public string? ProviderPhoneNumber { get; set; }
        public string? ProviderAddress { get; set; }
        public string? ProviderEmail { get; set; }
        public string? ProviderContactName { get; set; }
        public int? ProviderCardNumber { get; set; }

        public virtual ICollection<Providerinvoice> Providerinvoices { get; set; }
    }
}
