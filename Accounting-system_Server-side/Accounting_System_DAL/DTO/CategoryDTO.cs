using Accounting_System_DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Accounting_System_DAL.DTO
{
    public class CategoryDTO
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public int CategoryClassification { get; set; }
        public ClassificationDTO CategoryClassificationNavigation { get; set; }

        public CategoryDTO(Category c)
        {
            if(c != null)
            {
                CategoryId = c.CategoryId;
                CategoryName = c.CategoryName;
                CategoryClassification = c.CategoryClassification;

                CategoryClassificationNavigation = new ClassificationDTO(c.CategoryClassificationNavigation);
            }
        }
    }
}
