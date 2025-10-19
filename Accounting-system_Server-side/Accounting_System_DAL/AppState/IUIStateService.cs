using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Accounting_System_DAL.AppState
{
    public interface IUIStateService
    {
        bool IsProvider { get; set; }
    }

}
