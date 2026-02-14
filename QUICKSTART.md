# Quick Start Guide - Media Portal

## Get Started in 5 Minutes! 🚀

### Step 1: Start the Backend API

Open a terminal and run:

```bash
cd backend
dotnet restore
dotnet run
```

✅ API running at: http://localhost:5000
✅ Swagger docs at: http://localhost:5000/swagger

### Step 2: Start the Frontend

Open a NEW terminal and run:

```bash
cd frontend
npm install
npm run dev
```

✅ App running at: http://localhost:3000

### Step 3: Explore the App! 🎉

Open your browser and visit: http://localhost:3000

You'll see:
- **Home Page**: Latest articles, videos, and Q&A
- **Articles**: Browse and read tech articles
- **Videos**: Watch tutorial videos
- **Q&A**: Ask questions and provide answers

## What's Included?

The app comes pre-loaded with sample data:
- 4 articles on various tech topics
- 3 tutorial videos
- 3 questions with answers

## Common Issues & Solutions

### Issue: Port already in use
**Solution**: Change the port in `vite.config.js` or `Program.cs`

### Issue: CORS errors
**Solution**: Ensure both servers are running and check CORS settings in `Program.cs`

### Issue: API not found
**Solution**: Verify backend is running and check the API_BASE_URL in `frontend/src/services/api.js`

## Next Steps

1. **Customize the data**: Edit `backend/Data/SeedData.cs`
2. **Add new features**: Extend the models and services
3. **Style it your way**: Modify `frontend/src/index.css`
4. **Add authentication**: Implement user login/registration
5. **Switch to real DB**: Replace In-Memory DB with SQL Server

## Need Help?

- Check the full README.md for detailed documentation
- Visit Swagger UI to test API endpoints directly
- Review the code comments for implementation details

Happy coding! 💻
