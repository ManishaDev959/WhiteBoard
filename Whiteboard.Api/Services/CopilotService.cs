using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Net.Http.Headers;
using System.Net.Http;

using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using System.Net;



namespace Whiteboard.Api.Services
{

    public interface ICopilotService
    {
        Task<string> GetCopilotResponseAsync(string prompt);
    }

    public class CopilotService : ICopilotService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public CopilotService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _config = config;
        }

        public async Task<string> GetCopilotResponseAsync(string prompt)
        {
            var apiKey = _config["OpenAI:ApiKey"];
            _httpClient.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", apiKey);

            var requestBody = new
            {
                model = "gpt-3.5-turbo",

                messages = new[]
                {
            new { role = "system", content = "You are WhiteboardApp Copilot, a helpful assistant." },
            new { role = "user", content = prompt }
        }
            };

            var response = await _httpClient.PostAsJsonAsync("https://api.openai.com/v1/chat/completions", requestBody);

            var raw = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                // return a clear explanation to the frontend instead of throwing
                return $"❌ OpenAI API returned {response.StatusCode}: {raw}";
            }

            try
            {
                using var doc = JsonDocument.Parse(raw);
                var root = doc.RootElement;

                if (!root.TryGetProperty("choices", out var choices))
                {
                    return $"⚠️ Unexpected API response: {raw}";
                }

                var message = choices[0].GetProperty("message").GetProperty("content").GetString();
                return message ?? "⚠️ No content returned from model.";
            }
            catch (Exception ex)
            {
                return $"💥 Error parsing response: {ex.Message}\nRaw: {raw}";
            }
        }



    }
}
