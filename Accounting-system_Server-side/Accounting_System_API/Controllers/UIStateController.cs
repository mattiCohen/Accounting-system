using Accounting_System_DAL.AppState;
using Microsoft.AspNetCore.Mvc;

namespace Accounting_System_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UIStateController : ControllerBase
    {
        private readonly IUIStateService _uiState;

        public UIStateController(IUIStateService uiState)
        {
            _uiState = uiState;
        }

        [HttpGet]
        public ActionResult<bool> GetState() => Ok(_uiState.IsProvider);

        [HttpPut]
        public IActionResult SetState([FromQuery] bool isProvider)
        {
            _uiState.IsProvider = isProvider;
            return Ok();
        }
    }

}
