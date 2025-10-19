# Build stage
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

# ����� ���� csproj ��� ������
COPY Accounting_System_API/*.csproj ./Accounting_System_API/
COPY Accounting_System_BLL/*.csproj ./Accounting_System_BLL/
COPY Accounting_System_DAL/*.csproj ./Accounting_System_DAL/

RUN ls -R /src

# Restore �� �� ������� ����� (API)
RUN dotnet restore Accounting_System_API/Accounting_System_API.csproj

# ����� �� ������
COPY . .

# Build �-publish �� ������� �����
WORKDIR /src/Accounting_System_API
RUN dotnet publish "Accounting_System_API.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 80
ENTRYPOINT ["dotnet", "Accounting_System_API.dll"]
