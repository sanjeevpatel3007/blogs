# Modern Blog Application

A feature-rich blog platform built with Next.js, offering a modern UI and powerful content management capabilities.

## 🌟 Features

- **User Authentication**
  - Secure login and registration system
  - JWT-based authentication
  - Protected routes and content

- **Blog Management**
  - Create, edit, and delete blog posts
  - Rich text editing capabilities
  - Image upload support
  - Tag management system
  - AI-powered content generation

- **Content Organization**
  - Tag-based filtering
  - Featured posts section
  - Recent posts showcase
  - User dashboard
  - Post analytics (views tracking)

- **Modern UI/UX**
  - Responsive design
  - Clean and intuitive interface
  - Tailwind CSS styling
  - Loading states and animations
  - Toast notifications

## 📸 Screenshots

### Home Page
![image](https://github.com/user-attachments/assets/a86d285d-a47c-487e-a1b0-48452e38f1a2)

*Hero section with featured and recent posts*


## 🚀 Tech Stack

- **Frontend**
  - Next.js 15.1.7
  - React 18.2.0
  - Tailwind CSS
  - React Hot Toast
  - Heroicons

- **Backend**
  - Next.js API Routes
  - MongoDB with Mongoose
  - JWT Authentication
  - Bcrypt.js
  - Cloudinary (Image Storage)

- **AI Integration**
  - Google Generative AI

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/blogss.git
   cd blogss
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   GOOGLE_AI_API_KEY=your_google_ai_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Development

- **install dependencies **
  ```bash
  npm install
  ```

- **Local server run**
  ```bash
  npm run dev
  ```

- **Building for Production**
  ```bash
  npm run build
  ```

- **Starting Production Server**
  ```bash
  npm start
  ```



## 📝 Project Structure

```
blogss/
├── app/
│   ├── api/           # API routes
│   ├── blog/          # Blog pages
│   ├── components/    # Reusable components
│   ├── dashboard/     # Dashboard pages
│   ├── login/         # Authentication pages
│   └── register/      # User registration
├── lib/               # Utility functions
├── models/            # Database models
├── public/            # Static assets
└── services/         # Business logic
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- MongoDB for database services
- Cloudinary for image hosting
- Google for AI capabilities
