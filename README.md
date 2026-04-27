# HackMate - College Project & Team Finder Application

HackMate is a comprehensive web application designed to help college students find project teammates and hackathon partners. Students can post project ideas, list required skills, and send/receive team join requests. A smart skill-based matching algorithm suggests the most compatible teammates.

## 🚀 Features

### Core Functionality
- **User Profiles**: Complete profiles with skills, college, year, and social links
- **Project Management**: Create, browse, and manage project postings
- **Smart Matching**: AI-powered algorithm to match users with projects based on skills
- **Team Requests**: Send and receive requests to join projects
- **Real-time Messaging**: WebSocket-based chat system for team communication
- **Hackathon Board**: Browse and post upcoming hackathon opportunities

### Advanced Features
- **Skill-based Matching Algorithm**: 30% minimum threshold with college/year bonuses
- **Real-time Notifications**: Instant updates for messages and requests
- **Responsive Design**: Mobile-friendly UI using Tailwind CSS
- **JWT Authentication**: Secure token-based authentication system
- **RESTful API**: Complete backend API with all CRUD operations

## 🛠 Tech Stack

### Backend
- **Python 3.11** with **Django 4.2**
- **Django REST Framework** with JWT authentication (`djangorestframework-simplejwt`)
- **Django ORM** with MySQL backend
- **MySQL** database
- **Django Channels** with WebSocket support for real-time messaging
- **pip** / **pipenv** build tool

### Frontend
- **React.js** with modern hooks
- **Tailwind CSS** for styling
- **React Router v6** for navigation
- **Axios** for API calls
- **SockJS + STOMP** for WebSocket communication

## 📋 Prerequisites

- **Python 3.11** or higher
- **MySQL 8.0** or higher
- **Node.js 16** or higher
- **pip** or **pipenv**

## 🚀 Quick Start

### 1. Database Setup

Create a MySQL database named `hackmate`:

```sql
CREATE DATABASE hackmate;
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd HackMate/backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Apply database migrations
python manage.py migrate

# Run the Django development server
python manage.py runserver
```

The backend will start on `http://localhost:8000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

The frontend will start on `http://localhost:3000`

> Make sure the backend is running on `http://localhost:8000` before starting the frontend.

## 📁 Project Structure

```
HackMate/
├── backend (Django)
│   ├── hackmate/
│   │   ├── settings.py      # Project settings
│   │   ├── urls.py          # Root URL config
│   │   ├── asgi.py          # ASGI config (WebSocket)
│   │   └── wsgi.py
│   ├── apps/
│   │   ├── users/           # User profiles & auth
│   │   ├── projects/        # Project management
│   │   ├── requests/        # Team join requests
│   │   ├── messages/        # Real-time messaging
│   │   ├── matching/        # Skill-based matching
│   │   └── hackathons/      # Hackathon board
│   ├── requirements.txt
│   └── manage.py
├── frontend (React)
│   ├── src/
│   │   ├── api/           # API client (Axios)
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── hooks/         # Custom hooks
│   │   └── pages/         # Page components
│   └── package.json
└── README.md
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. **Registration**: Create account with email, password, and profile details
2. **Login**: Receive JWT token valid for 24 hours
3. **Authorization**: Token sent with each API request in `Authorization: Bearer <token>` header

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update profile
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/search` - Search users by filters

### Projects
- `GET /api/projects` - Browse all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/{id}` - Get project details
- `PUT /api/projects/{id}` - Update project (owner only)
- `DELETE /api/projects/{id}` - Delete project (owner only)

### Team Requests
- `POST /api/requests` - Send join request
- `GET /api/requests/received` - Get received requests
- `GET /api/requests/sent` - Get sent requests
- `PUT /api/requests/{id}/accept` - Accept request
- `PUT /api/requests/{id}/reject` - Reject request

### Matching
- `GET /api/match/project/{id}` - Get matched users for project
- `GET /api/match/users/me` - Get matched projects for current user

### Messages
- `GET /api/messages/{userId}` - Get conversation
- `POST /api/messages` - Send message
- `GET /api/messages/inbox` - Get all conversations

### Hackathons
- `GET /api/hackathons` - List all hackathons
- `POST /api/hackathons` - Post new hackathon

## 🧪 Testing

Run the matching algorithm tests:

```bash
python manage.py test apps.matching.tests
```

## 📊 Database Schema

### Users Table
- Basic profile information (name, email, password)
- Academic details (branch, year, college)
- Skills and social links
- Availability preferences

### Projects Table
- Project details (title, description, type)
- Required skills and team size
- Status (OPEN/CLOSED) and ownership

### Team Requests Table
- Request management between users and projects
- Status tracking (PENDING/ACCEPTED/REJECTED)

### Messages Table
- Real-time messaging between users
- Read/unread status tracking

### Hackathons Table
- Hackathon details and dates
- Registration links and team size limits

## 🔧 Configuration

### Database Configuration
Update `hackmate/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'hackmate',
        'USER': 'your_username',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

### JWT Configuration
```python
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=24),
    'SECRET_KEY': 'your-secret-key',
}
```

## 🎨 UI Components

### Pages
- **Landing**: Hero section with features overview
- **Dashboard**: User statistics and recommendations
- **Browse Projects**: Filter and search projects
- **Project Detail**: Full project info and team requests
- **Smart Match**: AI-powered matching interface
- **Messages**: Real-time chat interface
- **Profile**: User profile management
- **Hackathons**: Hackathon board and posting

### Components
- **Navbar**: Navigation with auth state
- **ProjectCard**: Project listing component
- **UserCard**: User profile component
- **SkillBadge**: Skill display component
- **MatchScoreBar**: Visual match score indicator

## 🚀 Deployment

### Backend Deployment
1. Collect static files: `python manage.py collectstatic`
2. Deploy to your preferred server (AWS, Heroku, Railway, etc.)
3. Configure environment variables for database and JWT secret

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy the build folder to static hosting
3. Configure API endpoint to your backend URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL is running
   - Check database credentials in `settings.py`
   - Verify database exists and run `python manage.py migrate`

2. **CORS Issues**
   - Frontend must be on `localhost:3000`
   - Check `CORS_ALLOWED_ORIGINS` in `settings.py`

3. **JWT Token Issues**
   - Clear browser localStorage
   - Check token expiration (24 hours) in `SIMPLE_JWT` settings
   - Verify `SECRET_KEY` configuration

4. **WebSocket Connection Issues**
   - Ensure Django Channels is configured in `asgi.py`
   - Check `CHANNEL_LAYERS` setting in `settings.py`
   - Verify Redis is running if used as channel layer backend

## 📞 Support

For support and questions, please open an issue on the GitHub repository or contact the development team.

---

**Happy Coding! 🚀**
