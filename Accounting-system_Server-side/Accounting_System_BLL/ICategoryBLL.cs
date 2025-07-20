using Accounting_System_DAL.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Accounting_System_BLL
{
    public interface ICategoryBLL
    {
        Task<List<CategoryDTO>> GetCategoriesAsync();
        Task<CategoryDTO> GetCategoryAsync(int id);
        Task<int> InsertCategoryAsync(CategoryDTO category);
        Task<string> UpdateCategoryAsync(int id, CategoryDTO category);
        Task<string> DeleteCategoryAsync(int id);
    }
}
