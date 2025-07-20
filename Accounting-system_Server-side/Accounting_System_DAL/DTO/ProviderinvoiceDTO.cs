using Accounting_System_DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Accounting_System_DAL.DTO
{
    public class ProviderinvoiceDTO
    {
        public int ProviderInvoiceId { get; set; }
        public int ProviderId { get; set; }
        public int CardId { get; set; }
        public float ProviderInvoiceSum { get; set; }
        public DateTime ProviderInvoiceDate { get; set; }
        public DateTime ProviderInvoicePaymentDate { get; set; }
        public string? ProviderInvoiceDetails { get; set; }
        public string? ProviderInvoiceNumber { get; set; }
        public CardDTO Card { get; set; } //= null!;
        public ProvidersDTO Provider { get; set; } //= null!;


        public ProviderinvoiceDTO(Providerinvoice p)
        {
            if (p != null)
            {
                ProviderInvoiceId = p.ProviderInvoiceId;
                ProviderId = p.ProviderId; 
                CardId = p.CardId;  
                ProviderInvoiceSum = p.ProviderInvoiceSum;
                ProviderInvoiceDate = p.ProviderInvoiceDate; 
                ProviderInvoicePaymentDate = p.ProviderInvoicePaymentDate;
                ProviderInvoiceDetails = p.ProviderInvoiceDetails;
                Card=new CardDTO(p.Card);
                Provider = new ProvidersDTO(p.Provider);
            }
        }
    }
}
