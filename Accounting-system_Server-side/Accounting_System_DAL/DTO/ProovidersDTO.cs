using Accounting_System_DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Accounting_System_DAL.DTO
{
    public class ProvidersDTO
    {
        public int ProviderId { get; set; }
        public string ProviderName { get; set; }
        public string ProviderPhoneNumber { get; set; }
        public string ProviderAddress { get; set; }
        public string ProviderEmail { get; set; }
        public string ProviderContactName { get; set; }
        public int ProviderCardNumber { get; set; }
      

        public ProvidersDTO(Provider p)
        {
            if(p != null)
            {
                ProviderId = p.ProviderId;
                ProviderName = p.ProviderName;
                ProviderPhoneNumber = p.ProviderPhoneNumber;  
                ProviderAddress = p.ProviderAddress;  
                ProviderEmail = p.ProviderEmail;
                ProviderContactName = p.ProviderContactName;
                ProviderCardNumber = p.ProviderCardNumber??0;
            }
        }
    }
}
