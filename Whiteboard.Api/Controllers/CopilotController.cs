using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Whiteboard.Api.Models;
using Whiteboard.Api.Services;
using Whiteboard.Data;
using Whiteboard.Data.Entities;
using Microsoft.AspNetCore.SignalR;
using Whiteboard.Api.Hubs;

namespace Whiteboard.Api.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class CopilotController : ControllerBase
    {
        private readonly ICopilotService _copilotService;

        public CopilotController(ICopilotService copilotService)
        {
            _copilotService = copilotService;
        }

        [HttpPost("ask")]
        public async Task<IActionResult> AskCopilot([FromBody] CopilotDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Query))
                return BadRequest("Query cannot be empty.");

            var response = await _copilotService.GetCopilotResponseAsync(request.Query);
            return Ok(new { response });
        }
    }
}
