# E-Commerce Frontend - Render Deployment

## Quick Deploy to Render

1. **Push your code to GitHub** (already done)

2. **Create a new Static Site on Render:**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Static Site"
   - Connect your GitHub repository: `Darshan3311/ecommerce-frontend`
   - Configure the following settings:

### Build Settings
```
Name: ecommerce-frontend
Branch: main
Build Command: npm install && npm run build
Publish Directory: build
```

### Environment Variables
Add these in Render dashboard:
```
NODE_VERSION=18
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

**Important:** Replace `your-backend-url.onrender.com` with your actual backend deployment URL.

3. **Deploy:**
   - Click "Create Static Site"
   - Render will automatically build and deploy your app
   - Your frontend will be live at: `https://ecommerce-frontend-xxx.onrender.com`

## Auto-Deploy
Render will automatically redeploy whenever you push to the `main` branch.

## Custom Domain (Optional)
- Go to your Static Site settings
- Add your custom domain under "Custom Domains"
- Update DNS records as instructed by Render

## Troubleshooting
- If build fails, check the build logs in Render dashboard
- Ensure `REACT_APP_API_URL` points to your deployed backend
- Clear cache and rebuild if needed
