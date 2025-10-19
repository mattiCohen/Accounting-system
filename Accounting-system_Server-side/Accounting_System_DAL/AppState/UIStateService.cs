using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Accounting_System_DAL.AppState
{
    public class UIStateService : IUIStateService
    {
        public bool IsProvider { get; set; } = false; // default
    }

}
