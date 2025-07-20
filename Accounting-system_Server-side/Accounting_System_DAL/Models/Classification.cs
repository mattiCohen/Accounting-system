using System;
using System.Collections.Generic;

namespace Accounting_System_DAL.Models
{
    public partial class Classification
    {
        public Classification()
        {
            Categories = new HashSet<Category>();
        }

        public int ClassificationId { get; set; }
        public string? ClassificationName { get; set; }

        public virtual ICollection<Category> Categories { get; set; }
    }
}
