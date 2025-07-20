using Accounting_System_DAL.DTO;
using Accounting_System_DAL.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Accounting_System_DAL
{
    public class CustomerInvoiceDL : ICustomerInvoiceDL
    {
        private readonly softwareContext softwareContextDB;

        public CustomerInvoiceDL(softwareContext _softwareContextDB)
        {
            this.softwareContextDB = _softwareContextDB;
        }

        public async Task<List<CustomerinvoiceDTO>> GetCustomerInvoicesAsync()
        {
            List<Customerinvoice> c = await softwareContextDB.Customerinvoices.Where(c => c.CardId >= 0)
                .Include(invoice => invoice.CardNavigation.CategoryNavigation.CategoryClassificationNavigation)
                .Include(invoice=>invoice.CustomerNavigation).ToListAsync();
            return c.Select(invoice => new CustomerinvoiceDTO(invoice)).ToList();
        }

        public async Task<CustomerinvoiceDTO> GetCustomerInvoiceAsync(int id)
        {
            //TODO מה קורה כשמגיע נל
            Customerinvoice invoice = await softwareContextDB.Customerinvoices.Where(c => c.CustomerInvoiceId == id)
                .Include(invoice => invoice.CardNavigation.CategoryNavigation.CategoryClassificationNavigation)
                .Include(invoice => invoice.CustomerNavigation).FirstOrDefaultAsync();
            if (invoice != null)
            {
                return new CustomerinvoiceDTO(invoice);
            }
            return null;
        }

        public async Task<int> InsertCustomerInvoiceAsync(CustomerinvoiceDTO CustomerInvoice)
        {
            Customerinvoice invoiceNew = new Customerinvoice()
            {
                CustomerInvoiceId = CustomerInvoice.CustomerInvoiceId,
                CardId = CustomerInvoice.CardId,
                CustomerInvoiceSum = CustomerInvoice.CustomerInvoiceSum,
                CustomerInvoiceDetails = CustomerInvoice.CustomerInvoiceDetails,
                CustomerInvoiceDate = CustomerInvoice.CustomerInvoiceDate,
                CustomerInvoiceNumber = CustomerInvoice.CustomerInvoiceNumber,
                CustomerId = CustomerInvoice.CustomerId

            };
            softwareContextDB.Customerinvoices.Add(invoiceNew);
            return await softwareContextDB.SaveChangesAsync();
            //TODO - לבדוק איך מחזירם את הid שנוסף לדטבייס
        }

        public async Task<string> UpdateCustomerInvoiceAsync(int id, CustomerinvoiceDTO CustomerInvoice)
        {
            Customerinvoice invoiceUpdate = await softwareContextDB.Customerinvoices.Where(c => c.CustomerInvoiceId == id)
                .Include(invoice => invoice.CardNavigation.CategoryNavigation.CategoryClassificationNavigation)
                .Include(invoice=>invoice.CustomerNavigation)
                .FirstOrDefaultAsync();
            if (invoiceUpdate != null)
            {
                invoiceUpdate.CardId = CustomerInvoice.CardId;
                invoiceUpdate.CustomerInvoiceSum = CustomerInvoice.CustomerInvoiceSum;
                invoiceUpdate.CustomerInvoiceDetails = CustomerInvoice.CustomerInvoiceDetails;
                invoiceUpdate.CustomerInvoiceDate = CustomerInvoice.CustomerInvoiceDate;
                invoiceUpdate.CustomerInvoiceNumber = CustomerInvoice.CustomerInvoiceNumber;
                invoiceUpdate.CustomerId = CustomerInvoice.CustomerId;
                await softwareContextDB.SaveChangesAsync();
                return "Success";
            }
            return "No Success";
        }

        public async Task<string> DeleteCustomerInvoiceAsync(int id)
        {
            string msg = "Success";
            try
            {
                softwareContextDB.Remove(softwareContextDB.Customerinvoices.FirstOrDefault(c => c.CustomerInvoiceId == id));
                await softwareContextDB.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                msg = "Faild";
            }
            return msg;
        }
        public async Task<string> DeleteCustomerInvoicesAsync(int id)
        {
            string msg = "Success";
            try
            {
                var invoices = softwareContextDB.Customerinvoices
            .Where(c => c.CustomerNavigation.CustomerId == id)
            .ToList();

                softwareContextDB.Customerinvoices.RemoveRange(invoices);
                await softwareContextDB.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                msg = "Faild";
            }
            return msg;
        }

        public async Task<string> DeleteCustomerInvoicesByYearAsync(int id,int year)
        {
            string msg = "Success";
            try
            {
                var invoices = softwareContextDB.Customerinvoices
             .Where(c => c.CustomerNavigation.CustomerId == id &&
                         c.CustomerInvoiceDate.Year == year)
             .ToList();

                softwareContextDB.Customerinvoices.RemoveRange(invoices);
                await softwareContextDB.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                msg = "Faild";
            }
            return msg;
        }

        public async Task<string> DeleteCustomersInvoicesByYearAsync(int year)
        {
            string msg = "Success";
            try
            {
                var invoices = softwareContextDB.Customerinvoices
             .Where(c => c.CustomerInvoiceDate.Year == year )
                        
             .ToList();

                softwareContextDB.Customerinvoices.RemoveRange(invoices);
                await softwareContextDB.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                msg = "Faild";
            }
            return msg;
        }
    }
}
