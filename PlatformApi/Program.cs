using PlatformApi.Data;
using Pgvector.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;
using PlatformApi.Repositories;
using PlatformApi.DTOs;
using PlatformApi.Models;
using PlatformApi.Services;
using System.Text.Json.Serialization;
using PlatformApi.Services.ImageStorage;
using PlatformApi.Services.Embedding;
using PlatformApi.Services.LLM;
using PlatformApi.Services.RAG;
using PlatformApi.Services.Orders;
using PlatformApi.Services.Users;


var builder = WebApplication.CreateBuilder(args);

builder.Services
        .AddControllers()
        .AddJsonOptions(options =>
        {
                options.JsonSerializerOptions.Converters.Add(
                        new JsonStringEnumConverter()
                );
        });


builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(
                builder.Configuration.GetConnectionString(
                        "DefaultConnection"
                ),
                o => o.UseVector()
        )
);
    

builder.Services.AddHttpClient<IEmbeddingService, EmbeddingService>(
        client =>
        {
                client.BaseAddress = new Uri("http://localhost:8000");
                client.Timeout = TimeSpan.FromSeconds(60);
        }
);


builder.Services.AddHttpClient<ILLMService, OllamaService>(
        client =>
        {
                client.BaseAddress =
                        new Uri("http://localhost:11434");
        
                client.Timeout =
                        TimeSpan.FromMinutes(5);
        });


builder.Services.AddScoped<IRagService, RagService>();

builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddScoped<IProductRepository, ProductRepository>();

builder.Services.AddScoped<IProductService, ProductService>();

builder.Services.AddScoped<
        IImageStorageService,
        LocalImageStorageService>();


builder.Services
        .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
        .AddCookie(options =>
        {
                options.LoginPath = "/auth/login";
                options.LogoutPath = "/auth/logout";
                options.ExpireTimeSpan = TimeSpan.FromMinutes(30);
                // Important for React + API
                options.Cookie.HttpOnly = true;

                options.Cookie.SameSite =
                        SameSiteMode.Lax;
                
        });

builder.Services.AddCors(options =>
{
        options.AddPolicy("AllowReactApp", builder =>
        {
                builder.WithOrigins("http://localhost:5173") 
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
        });
});

builder.Services.AddScoped<IOrderRepository, OrderRepository>();

builder.Services.AddScoped<IAddressRepository, AddressRepository>();

builder.Services.AddScoped<IOrderService, OrderService>();

builder.Services.AddScoped<IUserService, UserService>();


builder.Services.AddAuthorization();

var app = builder.Build();

app.UseCors("AllowReactApp");


app.UseAuthentication();
app.UseAuthorization();
app.UseStaticFiles();
app.MapControllers();

app.Run();