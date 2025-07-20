using Accounting_System_DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Accounting_System_DAL.DTO
{
    public class CustomerinvoiceDTO
    {
        public int CustomerInvoiceId { get; set; }
        public int CustomerId { get; set; }
        public int CardId { get; set; }
        public float CustomerInvoiceSum { get; set; }
        public DateTime CustomerInvoiceDate { get; set; }
        public DateTime CustomerInvoiceMaturitDate { get; set; }
        public string? CustomerInvoiceDetails { get; set; }
        public string? CustomerInvoiceNumber { get; set; }
        public CustomerDTO ?CustomerNavigation { get; set; }// = null!;
        public CardDTO ?CardNavigation { get; set; } //= null!;


        public CustomerinvoiceDTO(Customerinvoice c)
        {
            if (c != null)
            {
                CustomerInvoiceId = c.CustomerInvoiceId;
                CustomerId = c.CustomerId;
                CardId = c.CardId;
                CustomerInvoiceSum = c.CustomerInvoiceSum;
                CustomerInvoiceDate = c.CustomerInvoiceDate;
                CustomerInvoiceMaturitDate = c.CustomerInvoiceMaturityDate;
                CustomerInvoiceDetails = c.CustomerInvoiceDetails;
                CustomerInvoiceNumber = c.CustomerInvoiceNumber;
                CustomerNavigation = new CustomerDTO(c.CustomerNavigation);
                CardNavigation = new CardDTO(c.CardNavigation);
            }
        }
    }
}
