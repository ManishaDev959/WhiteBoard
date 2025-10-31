using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Whiteboard.Api.Hubs
{
    public class AdminHub : Hub
    {
          // ✅ Broadcast new user registration event
        public async Task NotifyUserRegistered(string name, DateTime registeredAt)
        {
            await Clients.All.SendAsync("UserRegistered", new
            {
                name,
                registeredAt
            });
        }
    }
}
