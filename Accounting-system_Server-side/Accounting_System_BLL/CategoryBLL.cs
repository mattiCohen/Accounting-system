using Accounting_System_DAL;
using Accounting_System_DAL.DTO;

namespace Accounting_System_BLL
{
    public class CategoryBLL: ICategoryBLL
    {
        private readonly ICategoryDL categoryDL;

        public CategoryBLL(ICategoryDL _categoryDL)
        {
            this.categoryDL = _categoryDL;
        }

        public async Task<List<CategoryDTO>> GetCategoriesAsync()
        {
            return await categoryDL.GetCategoriesAsync();
        }

        public async Task<CategoryDTO> GetCategoryAsync(int id)
        {
            return await categoryDL.GetCategoryAsync(id);
        }

        public async Task<int> InsertCategoryAsync(CategoryDTO category)
        {
            return await categoryDL.InsertCategoryAsync(category);
        }

        public async Task<string> UpdateCategoryAsync(int id, CategoryDTO category)
        {
            return await categoryDL.UpdateCategoryAsync(id, category);
        }

        public async Task<string> DeleteCategoryAsync(int id)
        {
            return await categoryDL.DeleteCategoryAsync(id);
        }
    }
}