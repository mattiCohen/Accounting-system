using Accounting_System_BLL;
using Accounting_System_DAL;
using Accounting_System_DAL.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", builder =>
        builder.WithOrigins("http://localhost:5173") // ������ �� �-React ���
               .AllowAnyMethod()
               .AllowAnyHeader());
});

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddControllers().AddNewtonsoftJson();//���� �� ����� ����� ����� ���� �� ������
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<softwareContext>(options =>
            options.UseMySql(
            builder.Configuration.GetConnectionString("DefaultConnection"),
    ServerVersion.Parse("8.0.26-mysql")));


//����� �� ����� ���� - ���� �� ����� �� ����� ����
builder.Services.AddScoped(typeof(ICategoryDL), typeof(CategoryDL));
builder.Services.AddScoped(typeof(ICategoryBLL), typeof(CategoryBLL));
builder.Services.AddScoped(typeof(ICustomerDL), typeof(CustomerDL));
builder.Services.AddScoped(typeof(ICustomerBLL), typeof(CustomerBLL));
builder.Services.AddScoped(typeof(ICardDL), typeof(CardDL));
builder.Services.AddScoped(typeof(ICardBLL), typeof(CardBLL));
builder.Services.AddScoped(typeof(ICustomerInvoiceDL), typeof(CustomerInvoiceDL));
builder.Services.AddScoped(typeof(ICustomerInvoiceBLL), typeof(CustomerInvoiceBLL));
builder.Services.AddScoped(typeof(IProviderInvoiceDL), typeof(ProviderInvoiceDL));
builder.Services.AddScoped(typeof(IProviderInvoiceBLL), typeof(ProviderInvoiceBLL));
builder.Services.AddScoped(typeof(IProviderDL), typeof(ProviderDL));
builder.Services.AddScoped(typeof(IProviderBLL), typeof(ProviderBLL));

builder.Services.AddControllersWithViews()
              .AddNewtonsoftJson(options =>
          options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("AllowLocalhost"); // ����� �-CORS ������

app.UseAuthorization();

app.MapControllers();

app.Run();
