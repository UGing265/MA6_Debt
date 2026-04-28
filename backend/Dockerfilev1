FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy solution and project files first to leverage Docker layer caching
# Build context is the 'backend' folder
COPY ["MA6_Debt.sln", "./"]
COPY ["src/API/API.csproj", "src/API/"]
COPY ["src/Application/Application.csproj", "src/Application/"]
COPY ["src/Domain/Domain.csproj", "src/Domain/"]
COPY ["src/Persistence/Persistence.csproj", "src/Persistence/"]

RUN dotnet restore "src/API/API.csproj"

# Copy the rest of the source code and build
COPY . .
WORKDIR "/app/src/API"
RUN dotnet build "API.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# ASP.NET Core configurations are read at runtime via appsettings.json
# and overridden by environment variables in docker-compose.yml
# (e.g., ConnectionStrings__DefaultConnection)
EXPOSE 8080

ENTRYPOINT ["dotnet", "API.dll"]
