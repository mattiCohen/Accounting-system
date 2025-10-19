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
    public class CustomerDL  :  ICustomerDL
    {
        private static int _lastCardNumber = -1;

            private readonly softwareContext softwareContextDB;

            public CustomerDL(softwareContext _softwareContextDB)
            {
                this.softwareContextDB = _softwareContextDB;
            if (_lastCardNumber == -1)
            {
                _lastCardNumber = softwareContextDB.Customers
                .Max(c => (int?)c.CustomerCardNumber) ?? 1;
            }
        }

            public async Task<List<CustomerDTO>> GetCustomersAsync()
            {


            List<Customer> c = await softwareContextDB.Customers.ToListAsync();
                return  c.Select(customer => new CustomerDTO(customer)).ToList();
            }

            public async Task<CustomerDTO> GetCustomerAsync(int id)
            {
            Customer customer = await softwareContextDB.Customers.Where(c => c.CustomerId == id).FirstOrDefaultAsync();
            if (customer != null) 
            { 
                return new CustomerDTO(customer);
            }
            else
            {
                return null;
            }
            }

            public async Task<int> InsertCustomerAsync(CustomerDTO customer)
            {
            _lastCardNumber++;
            Customer customerNew = new Customer()
            {
                CustomerName = customer.CustomerName,
                CustomerAddress = customer.CustomerAddress,
                CustomerEmail = customer.CustomerEmail,
                CustomerPhoneNumber = customer.CustomerPhoneNumber,
                CustomerContactName = customer.CustomerContactName,
                CustomerCardNumber = _lastCardNumber
            };
                softwareContextDB.Customers.Add(customerNew);
                await softwareContextDB.SaveChangesAsync();
            return customerNew.CustomerId;

            }

            public async Task<string> UpdateCustomerAsync(int id, CustomerDTO customer)
            {
                Customer customerUpdate = softwareContextDB.Customers.FirstOrDefault(c => c.CustomerId == id);
                if (customerUpdate != null)
                {
                customerUpdate.CustomerName = customer.CustomerName;
                customerUpdate.CustomerAddress = customer.CustomerAddress;
                customerUpdate.CustomerEmail = customer.CustomerEmail;
                customerUpdate.CustomerPhoneNumber = customer.CustomerPhoneNumber;
                customerUpdate.CustomerContactName = customer.CustomerContactName;

                    await softwareContextDB.SaveChangesAsync();
                    return "Success";
                }
                return "No Success";
            }

            public async Task<string> DeleteCustomerAsync(int id)
            {
                string msg = "Success";
                try
                {
                    softwareContextDB.Remove(softwareContextDB.Customers.FirstOrDefault(c => c.CustomerId == id));
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

