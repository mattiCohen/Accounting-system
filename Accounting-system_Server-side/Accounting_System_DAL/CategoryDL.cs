using Accounting_System_DAL.DTO;
using Accounting_System_DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace Accounting_System_DAL
{
    public class CategoryDL : ICategoryDL
    {
        private readonly softwareContext softwareContextDB;

        public CategoryDL(softwareContext _softwareContextDB)
        {
            this.softwareContextDB = _softwareContextDB;
        }

        public async Task<List<CategoryDTO>> GetCategoriesAsync()
        {
            List<Category> c = await softwareContextDB.Categories.Where(c => c.CategoryName.Length > 0)
                .Include(category => category.CategoryClassificationNavigation).ToListAsync();
            return c.Select(category => new CategoryDTO(category)).ToList();
        }

        public async Task<CategoryDTO> GetCategoryAsync(int id)
        {
            Category category = await softwareContextDB.Categories.Where(c => c.CategoryId == id).Include(category => category.CategoryClassificationNavigation).FirstOrDefaultAsync();
            if (category != null)
            {
                return new CategoryDTO(category);
            }
            return null;
        }

        public async Task<int> InsertCategoryAsync(CategoryDTO category)
        {
            Category categoryNew = new Category()
            {
                CategoryName = category.CategoryName,
                CategoryClassification = category.CategoryClassification 
            };
            softwareContextDB.Categories.Add(categoryNew);
            return await softwareContextDB.SaveChangesAsync();
            //TODO - לבדוק איך מחזירם את הid שנוסף לדטבייס
        }

        public async Task<string> UpdateCategoryAsync(int id, CategoryDTO category)
        {
            Category categoryUpdate = softwareContextDB.Categories.Where(c => c.CategoryId == id)
                .Include(category  => category.CategoryClassificationNavigation).FirstOrDefault();
            if(categoryUpdate != null)
            {
                categoryUpdate.CategoryName = category.CategoryName;
                categoryUpdate.CategoryClassification = category.CategoryClassification;
                await softwareContextDB.SaveChangesAsync();
                return "Success";
            }
            return "No Success";
        }

        public async Task<string> DeleteCategoryAsync(int id)
        {
            string msg = "Success";
            try
            {
                softwareContextDB.Remove(softwareContextDB.Categories.FirstOrDefault(c => c.CategoryId == id));
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