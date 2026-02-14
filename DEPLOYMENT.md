# Deployment Guide

## 🚀 Deployment Options

### Option 1: Azure Deployment (Recommended for .NET)

#### Backend Deployment to Azure App Service

1. **Create Azure Resources**:
```bash
# Install Azure CLI
az login

# Create resource group
az group create --name MediaPortalRG --location eastus

# Create App Service plan
az appservice plan create --name MediaPortalPlan --resource-group MediaPortalRG --sku B1 --is-linux

# Create web app
az webapp create --name MediaPortalAPI --resource-group MediaPortalRG --plan MediaPortalPlan --runtime "DOTNET|8.0"
```

2. **Configure Database**:
```bash
# Create Azure SQL Database
az sql server create --name mediaportalsqlserver --resource-group MediaPortalRG --location eastus --admin-user sqladmin --admin-password YourPassword123!

az sql db create --resource-group MediaPortalRG --server mediaportalsqlserver --name MediaPortalDB --service-objective S0
```

3. **Update Connection String**:
Edit `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=tcp:mediaportalsqlserver.database.windows.net,1433;Initial Catalog=MediaPortalDB;Persist Security Info=False;User ID=sqladmin;Password=YourPassword123!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
  }
}
```

4. **Update Program.cs** to use SQL Server:
```csharp
// Replace this line:
options.UseInMemoryDatabase("MediaPortalDB")

// With this:
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
```

5. **Deploy Backend**:
```bash
cd backend
dotnet publish -c Release
cd bin/Release/net8.0/publish

# Deploy using Azure CLI
az webapp deployment source config-zip --resource-group MediaPortalRG --name MediaPortalAPI --src publish.zip
```

#### Frontend Deployment to Azure Static Web Apps

1. **Create Static Web App**:
```bash
az staticwebapp create --name MediaPortalFrontend --resource-group MediaPortalRG --location eastus --sku Free
```

2. **Update API Base URL** in `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = 'https://mediaportalapi.azurewebsites.net/api';
```

3. **Build and Deploy**:
```bash
cd frontend
npm run build

# Deploy using Azure CLI
az staticwebapp deploy --name MediaPortalFrontend --resource-group MediaPortalRG --app-location ./dist
```

---

### Option 2: Docker Deployment

#### Create Docker Files

**Backend Dockerfile** (`backend/Dockerfile`):
```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["MediaPortal.csproj", "./"]
RUN dotnet restore "MediaPortal.csproj"
COPY . .
RUN dotnet build "MediaPortal.csproj" -c Release -o /app/build
RUN dotnet publish "MediaPortal.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENTRYPOINT ["dotnet", "MediaPortal.dll"]
```

**Frontend Dockerfile** (`frontend/Dockerfile`):
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf** (`frontend/nginx.conf`):
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**docker-compose.yml** (root directory):
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=Server=db;Database=MediaPortalDB;User=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourStrong@Passw0rd
    ports:
      - "1433:1433"
    volumes:
      - sqldata:/var/opt/mssql

volumes:
  sqldata:
```

**Deploy with Docker**:
```bash
docker-compose up -d
```

---

### Option 3: Heroku Deployment

#### Backend to Heroku

1. **Install Heroku CLI** and login:
```bash
heroku login
```

2. **Create Heroku app**:
```bash
cd backend
heroku create mediaportal-api
```

3. **Add buildpack**:
```bash
heroku buildpacks:set https://github.com/jincod/dotnetcore-buildpack
```

4. **Deploy**:
```bash
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

#### Frontend to Vercel/Netlify

**Vercel**:
```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

**Netlify**:
```bash
cd frontend
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

---

### Option 4: AWS Deployment

#### Backend to AWS Elastic Beanstalk

```bash
# Install AWS CLI and EB CLI
pip install awsebcli

cd backend
eb init -p "64bit Amazon Linux 2 v2.5.0 running .NET 6" MediaPortal-API --region us-east-1
eb create mediaportal-api-env
eb deploy
```

#### Frontend to AWS S3 + CloudFront

```bash
cd frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://mediaportal-frontend --delete

# Create CloudFront distribution
aws cloudfront create-distribution --origin-domain-name mediaportal-frontend.s3.amazonaws.com
```

---

## 🔧 Production Configuration Checklist

### Backend
- [ ] Switch from In-Memory DB to SQL Server/PostgreSQL
- [ ] Enable HTTPS
- [ ] Configure production connection strings
- [ ] Set up environment variables
- [ ] Add health check endpoint
- [ ] Enable logging (Application Insights, Serilog)
- [ ] Configure rate limiting
- [ ] Set up API authentication (JWT)
- [ ] Enable response caching
- [ ] Configure CORS for production domain

### Frontend
- [ ] Update API base URL to production
- [ ] Enable production build optimizations
- [ ] Add error boundaries
- [ ] Set up analytics (Google Analytics)
- [ ] Configure CDN for static assets
- [ ] Add service worker for PWA
- [ ] Set up monitoring (Sentry)
- [ ] Enable compression
- [ ] Add robots.txt and sitemap.xml

### Database
- [ ] Set up automated backups
- [ ] Configure replication (if needed)
- [ ] Set up connection pooling
- [ ] Add database indexes
- [ ] Configure maintenance windows
- [ ] Set up monitoring and alerts

### Security
- [ ] SSL/TLS certificates
- [ ] Firewall rules
- [ ] DDoS protection
- [ ] Regular security updates
- [ ] Penetration testing
- [ ] Security headers
- [ ] API key rotation
- [ ] Secrets management (Azure Key Vault, AWS Secrets Manager)

---

## 📊 Monitoring & Maintenance

### Application Monitoring
- Use Application Insights (Azure)
- Use CloudWatch (AWS)
- Use New Relic or Datadog

### Logs
- Centralize logging
- Set up log rotation
- Configure alerts for errors

### Performance
- Set up APM (Application Performance Monitoring)
- Monitor response times
- Track database query performance

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

**.github/workflows/deploy.yml**:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup .NET
        uses: actions/setup-dotnet@v1
        with:
          dotnet-version: '8.0.x'
      - name: Build
        run: |
          cd backend
          dotnet build --configuration Release
      - name: Publish
        run: |
          cd backend
          dotnet publish -c Release -o publish
      - name: Deploy to Azure
        uses: azure/webapps-deploy@v2
        with:
          app-name: 'MediaPortalAPI'
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: backend/publish

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install and Build
        run: |
          cd frontend
          npm install
          npm run build
      - name: Deploy to Azure Static Web Apps
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/frontend"
          output_location: "dist"
```

---

## 🆘 Troubleshooting

### Common Issues

**CORS errors in production**:
- Update CORS policy in `Program.cs` with production domain

**Database connection fails**:
- Check connection string
- Verify firewall rules
- Ensure database server is accessible

**Frontend can't reach API**:
- Verify API URL in `api.js`
- Check CORS configuration
- Verify API is running

**Deployment fails**:
- Check build logs
- Verify all dependencies are installed
- Check configuration files

---

## 📞 Support

For deployment assistance:
1. Check deployment platform documentation
2. Review application logs
3. Verify all environment variables
4. Test locally with production configuration
