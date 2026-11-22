using Accounting_System_DAL.DTO;
using Accounting_System_DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace Accounting_System_DAL
{
    public class ProviderDL : IProviderDL
    {
        private readonly softwareContext softwareContextDB;
        private static int _lastCardNumber = -1;

        public ProviderDL(softwareContext _softwareContextDB)
        {
            this.softwareContextDB = _softwareContextDB;
            if (_lastCardNumber == -1)
            {
                _lastCardNumber = softwareContextDB.Providers.
                    Max(p => (int?)p.ProviderCardNumber) ?? 1;
            }
        }

        public async Task<List<ProvidersDTO>> GetProvidersAsync()

        {
            var a = await softwareContextDB.Providers.ToListAsync();
            foreach (var provider in a)
            {
                Console.WriteLine($"ProviderId: {provider.ProviderId}, " +
                                  $"ProviderName: {provider.ProviderName}, " +
                                  $"ProviderPhoneNumber: {provider.ProviderPhoneNumber}, " +
                                  $"ProviderAddress: {provider.ProviderAddress}, " +
                                  $"ProviderEmail: {provider.ProviderEmail}, " +
                                  $"ProviderContactName: {provider.ProviderContactName}, " +
                                  $"ProviderCompanyNumber: {provider.ProviderCardNumber}");
            }

            return a.Select(p => new ProvidersDTO(p)).ToList();
        }

        public async Task<ProvidersDTO> GetProviderAsync(int id)
        {
            Provider provider = await softwareContextDB.Providers.Where(p => p.ProviderId == id).FirstOrDefaultAsync();

            if (provider != null)
            {
                return new ProvidersDTO(provider);
            }
            else
            {
                return null;
            }
            
        }

        public async Task<int> InsertproviderAsync(ProvidersDTO provider)
        {
            _lastCardNumber++;
            Provider providerNew = new Provider() 
            { 
                ProviderName = provider.ProviderName,
                ProviderAddress = provider.ProviderAddress,
                ProviderCardNumber = _lastCardNumber,
                ProviderContactName = provider.ProviderContactName,
                ProviderEmail = provider.ProviderEmail,
                ProviderPhoneNumber = provider.ProviderPhoneNumber,
                CategoryId = provider.CategoryId

            };
            softwareContextDB.Providers.Add(providerNew);
             await softwareContextDB.SaveChangesAsync();
            return providerNew.ProviderId;
        }

        public async Task<string> UpdateProviderAsync(int id, ProvidersDTO provider)
        {
            Provider providerUpdate = softwareContextDB.Providers.FirstOrDefault(p => p.ProviderId == id);
            if(providerUpdate != null)
            {
                providerUpdate.ProviderName = provider.ProviderName;
                providerUpdate.ProviderPhoneNumber = provider.ProviderPhoneNumber;
                providerUpdate.ProviderCardNumber = provider.ProviderCardNumber;
                providerUpdate.ProviderAddress = provider.ProviderAddress;
                providerUpdate.ProviderEmail = provider.ProviderEmail;
                providerUpdate.ProviderContactName = provider.ProviderContactName;
                providerUpdate.CategoryId = provider.CategoryId;
                await softwareContextDB.SaveChangesAsync();
                return "Success";
            }
            return "No Success";
        }

        public async Task<string> DeleteProviderAsync(int id)
        {
            string msg = "Success";
            try
            {
                softwareContextDB.Remove(softwareContextDB.Providers.FirstOrDefault(p => p.ProviderId == id));
                await softwareContextDB.SaveChangesAsync();
            }
            catch(Exception ex)
            {
                msg = "Faild";
            }
            return msg;
        }
    }
}