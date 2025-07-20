using Accounting_System_BLL;
using Accounting_System_DAL.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Accounting_System_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
            private readonly ICategoryBLL categoryBLL;

            public CategoryController(ICategoryBLL _categoryBLL)
            {
                this.categoryBLL = _categoryBLL;
            }

            [HttpGet]
            public async Task<List<CategoryDTO>> GetCategories()
            {
                return await categoryBLL.GetCategoriesAsync();
            }

            [HttpGet("{id}")]
            public async Task<CategoryDTO> GetCategory(int id)
            {
                return await categoryBLL.GetCategoryAsync(id);
            }

            [HttpPost]
            public async Task<int> InsertCategories(CategoryDTO category)
            {
                return await categoryBLL.InsertCategoryAsync(category);
            }

            [HttpPut]
            public async Task<string> UpdateCategory(int id, CategoryDTO category)
            {
                return await categoryBLL.UpdateCategoryAsync(id, category);
            }

            [HttpDelete]
            public async Task<string> DeleteCategory(int id)
            {
                return await categoryBLL.DeleteCategoryAsync(id);
            }
    }
}
