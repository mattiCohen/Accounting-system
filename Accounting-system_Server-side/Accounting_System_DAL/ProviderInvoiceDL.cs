using Accounting_System_DAL.DTO;
using Accounting_System_DAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Accounting_System_DAL
{
    public class ProviderInvoiceDL : IProviderInvoiceDL
    {
        private readonly softwareContext softwareContextDB;

        public ProviderInvoiceDL(softwareContext _softwareContextDB)
        {
            this.softwareContextDB = _softwareContextDB;
        }

        public async Task<List<ProviderinvoiceDTO>> GetProviderInvoicesAsync()
        {
            List<Providerinvoice> p = await softwareContextDB.Providerinvoices.Where(p => p.CardId >= 0)
                .Include(invoice => invoice.Card.CategoryNavigation.CategoryClassificationNavigation)
                .Include(invoice=>invoice.Provider).ToListAsync();
            return p.Select(invoice => new ProviderinvoiceDTO(invoice)).ToList();
        }

        public async Task<ProviderinvoiceDTO> GetProviderInvoiceAsync(int id)
        {
            //TODO מה קורה כשמגיע נל
            Providerinvoice invoice = await softwareContextDB.Providerinvoices.Where(p => p.ProviderInvoiceId== id)
                .Include(invoice => invoice.Card.CategoryNavigation.CategoryClassificationNavigation)
                .Include(invoice => invoice.Provider).FirstOrDefaultAsync();
            if (invoice != null)
            {
                return new ProviderinvoiceDTO(invoice);
            }
            return null;
        }

        public async Task<int> InsertProviderInvoiceAsync(ProviderinvoiceDTO providerInvoice)
        {
            Providerinvoice invoiceNew = new Providerinvoice()
            {
                ProviderInvoiceId = providerInvoice.ProviderInvoiceId,
                ProviderId = providerInvoice.ProviderId,
                CardId = providerInvoice.CardId,
                ProviderInvoiceSum = providerInvoice.ProviderInvoiceSum,
                ProviderInvoiceDate = providerInvoice.ProviderInvoiceDate,
                ProviderInvoiceDetails = providerInvoice.ProviderInvoiceDetails,
                ProviderInvoiceNumber = providerInvoice.ProviderInvoiceNumber

            };
            softwareContextDB.Providerinvoices.Add(invoiceNew);
            return await softwareContextDB.SaveChangesAsync();
            //TODO - לבדוק איך מחזירם את הid שנוסף לדטבייס
        }

        public async Task<string> UpdateProviderInvoiceAsync(int id, ProviderinvoiceDTO providerInvoice)
        {
            Providerinvoice invoiceUpdate = await softwareContextDB.Providerinvoices.Where(p => p.ProviderInvoiceId == id)
                .Include(invoice => invoice.Card.CategoryNavigation.CategoryClassificationNavigation)
                .Include(invoice=>invoice.Provider)
                .FirstOrDefaultAsync();
            if (invoiceUpdate != null)
            {
                invoiceUpdate.ProviderInvoiceId = providerInvoice.ProviderInvoiceId;
                invoiceUpdate.ProviderId = providerInvoice.ProviderId;
                invoiceUpdate.CardId = providerInvoice.CardId;
                invoiceUpdate.ProviderInvoiceSum = providerInvoice.ProviderInvoiceSum;
                invoiceUpdate.ProviderInvoiceDate = providerInvoice.ProviderInvoiceDate;
                invoiceUpdate.ProviderInvoiceDetails = providerInvoice.ProviderInvoiceDetails;
                await softwareContextDB.SaveChangesAsync();
                return "Success";
            }
            return "No Success";
        }

        public async Task<string> DeleteProviderInvoiceAsync(int id)
        {
            string msg = "Success";
            try
            {
                softwareContextDB.Remove(softwareContextDB.Providerinvoices.FirstOrDefault(p => p.ProviderInvoiceId == id));
                await softwareContextDB.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                msg = "Faild";
            }
            return msg;
        }
        public async Task<string> DeleteProviderInvoicesAsync(int id)
        {
            string msg = "Success";
            try
            {
                var invoices = softwareContextDB.Providerinvoices
            .Where(c => c.Provider.ProviderId == id)
            .ToList();

                softwareContextDB.Providerinvoices.RemoveRange(invoices);
                await softwareContextDB.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                msg = "Faild";
            }
            return msg;
        }
        public async Task<string> DeleteProviderInvoicesByYearAsync(int id, int year)
        {
            string msg = "Success";
            try
            {
                var invoices = softwareContextDB.Providerinvoices
                    .Where(c => c.Provider.ProviderId == id &&
                                c.ProviderInvoiceDate.Year == year)
                    .ToList();

                softwareContextDB.Providerinvoices.RemoveRange(invoices);
                await softwareContextDB.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                msg = "Failed";
            }
            return msg;
        }

        public async Task<string> DeleteProvidersInvoicesByYearAsync(int year)
        {
            string msg = "Success";
            try
            {
                var invoices = softwareContextDB.Providerinvoices
                    .Where(c => c.ProviderInvoiceDate.Year == year)
                    .ToList();

                softwareContextDB.Providerinvoices.RemoveRange(invoices);
                await softwareContextDB.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                msg = "Failed";
            }
            return msg;
        }
    }
}
