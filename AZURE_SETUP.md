# ☁️ Azure Setup Guide — Islamic Dawah Portal

This guide walks you through setting up Azure resources for hosting the Islamic Dawah Portal.

## Prerequisites

- [Azure account](https://azure.microsoft.com/free/) (free tier available)
- [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) installed
- Your GitHub repository pushed and up-to-date

---

## Step 1: Login to Azure

```bash
az login
```

## Step 2: Create Resource Group

```bash
az group create --name IslamicDawahPortalRG --location eastus
```

## Step 3: Create App Service (Backend API)

```bash
# Create App Service plan (B1 = Basic tier, ~$13/mo; F1 = Free tier)
az appservice plan create \
  --name IslamicDawahPlan \
  --resource-group IslamicDawahPortalRG \
  --sku F1 \
  --is-linux

# Create the web app
az webapp create \
  --name islamic-dawah-api \
  --resource-group IslamicDawahPortalRG \
  --plan IslamicDawahPlan \
  --runtime "DOTNETCORE:8.0"
```

> ⚠️ The app name `islamic-dawah-api` must be globally unique. Change it if taken.

## Step 4: Create Azure SQL Database (Optional)

If you want persistent data in production:

```bash
# Create SQL Server
az sql server create \
  --name islamicdawah-sql \
  --resource-group IslamicDawahPortalRG \
  --location eastus \
  --admin-user sqladmin \
  --admin-password "<YourStrongPassword123!>"

# Create database (Basic tier, ~$5/mo)
az sql db create \
  --resource-group IslamicDawahPortalRG \
  --server islamicdawah-sql \
  --name IslamicDawahDB \
  --service-objective Basic

# Allow Azure services to connect
az sql server firewall-rule create \
  --resource-group IslamicDawahPortalRG \
  --server islamicdawah-sql \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

## Step 5: Create Static Web App (Frontend)

```bash
az staticwebapp create \
  --name islamic-dawah-frontend \
  --resource-group IslamicDawahPortalRG \
  --location eastus2 \
  --sku Free
```

## Step 6: Configure App Settings

Set the backend's environment variables in Azure:

```bash
# Set CORS origins (replace with your Static Web App URL)
az webapp config appsettings set \
  --name islamic-dawah-api \
  --resource-group IslamicDawahPortalRG \
  --settings \
    AllowedOrigins__0="https://islamic-dawah-frontend.azurestaticapps.net" \
    Jwt__Key="<YourSecureJwtKey_AtLeast32Characters>" \
    ASPNETCORE_ENVIRONMENT="Production"

# Set database connection string (if using Azure SQL)
az webapp config connection-string set \
  --name islamic-dawah-api \
  --resource-group IslamicDawahPortalRG \
  --connection-string-type SQLAzure \
  --settings DefaultConnection="Server=tcp:islamicdawah-sql.database.windows.net,1433;Initial Catalog=IslamicDawahDB;Persist Security Info=False;User ID=sqladmin;Password=<YourStrongPassword123!>;Encrypt=True;TrustServerCertificate=False;"
```

## Step 7: Get Deployment Credentials for GitHub

### Backend (App Service Publish Profile)

```bash
az webapp deployment list-publishing-profiles \
  --name islamic-dawah-api \
  --resource-group IslamicDawahPortalRG \
  --xml
```

Copy the entire XML output → Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:
- Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
- Value: Paste the XML

### Frontend (Static Web Apps Token)

```bash
az staticwebapp secrets list \
  --name islamic-dawah-frontend \
  --resource-group IslamicDawahPortalRG
```

Copy the `apiKey` value → GitHub repo → **Settings** → **Secrets** → **New repository secret**:
- Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
- Value: Paste the API key

## Step 8: Update Workflow App Name

In `.github/workflows/main.yml`, update this line if you used a different name:

```yaml
AZURE_WEBAPP_NAME: islamic-dawah-api    # Your actual Azure App Service name
```

## Step 9: Deploy! 🚀

```bash
git add .
git commit -m "Configure Azure deployment"
git push origin main
```

Go to your GitHub repo → **Actions** tab to monitor the deployment.

---

## 🔗 Your Live URLs

After deployment:
- **Frontend**: `https://islamic-dawah-frontend.azurestaticapps.net`
- **Backend API**: `https://islamic-dawah-api.azurewebsites.net/api`
- **Swagger (dev)**: `https://islamic-dawah-api.azurewebsites.net/swagger`

---

## 💡 Cost Summary

| Resource | Tier | Monthly Cost |
|---|---|---|
| App Service Plan | F1 (Free) | $0 |
| Static Web App | Free | $0 |
| Azure SQL DB | Basic (optional) | ~$5 |
| **Total** | | **$0 – $5** |

---

## 🧹 Cleanup (Delete All Resources)

To remove everything and stop billing:

```bash
az group delete --name IslamicDawahPortalRG --yes --no-wait
```
