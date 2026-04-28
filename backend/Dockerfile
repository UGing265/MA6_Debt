# Sử dụng biến ARG để Docker biết kiến trúc build
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG TARGETARCH
WORKDIR /src

# Copy và Restore (Chạy bằng tốc độ gốc của laptop, cực nhanh và không lỗi)
COPY ["MA6_Debt.sln", "./"]
COPY ["src/API/API.csproj", "src/API/"]
COPY ["src/Application/Application.csproj", "src/Application/"]
COPY ["src/Domain/Domain.csproj", "src/Domain/"]
COPY ["src/Persistence/Persistence.csproj", "src/Persistence/"]

# Restore cho đúng kiến trúc mục tiêu (arm64)
RUN dotnet restore "src/API/API.csproj" -a $TARGETARCH

# Copy code và Build
COPY . .
WORKDIR "/src/src/API"
# Build và Publish cho kiến trúc mục tiêu
RUN dotnet publish "API.csproj" -c Release -o /app/publish -a $TARGETARCH --self-contained false

# Stage cuối cùng (Chỉ stage này mới cần là ARM64)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080
ENTRYPOINT ["dotnet", "API.dll"]