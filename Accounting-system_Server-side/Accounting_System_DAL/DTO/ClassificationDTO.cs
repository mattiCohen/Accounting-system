using Accounting_System_DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Accounting_System_DAL.DTO
{
    public class ClassificationDTO
    {
        public int ClassificationId { get; set; }
        public string ClassificationName { get; set; }

        public ClassificationDTO(Classification c)
        {
            if(c != null)
            {
                ClassificationId = c.ClassificationId;
                ClassificationName = c.ClassificationName;
            }
        }
    }
}
