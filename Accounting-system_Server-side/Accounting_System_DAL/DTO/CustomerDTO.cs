using Accounting_System_DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Accounting_System_DAL.DTO
{
    public class CustomerDTO
    {
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string CustomerPhoneNumber { get; set; }
        public string CustomerAddress { get; set; }
        public string CustomerEmail { get; set; }
        public string CustomerContactName { get; set; }
        public int CustomerCardNumber { get; set; }

        public CustomerDTO(Customer c)
        {
            if (c != null)
            {
                CustomerId = c.CustomerId;
                CustomerName = c.CustomerName;
                CustomerPhoneNumber = c.CustomerPhoneNumber;
                CustomerAddress = c.CustomerAddress;
                CustomerEmail = c.CustomerEmail;
                CustomerContactName = c.CustomerContactName;
                CustomerCardNumber = c.CustomerCardNumber??0;
            }
        }
    }
}
