using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Whiteboard.Api.Hubs
{
    public class AdminHub : Hub
    {
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
