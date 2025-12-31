# Cloud-Based Content Management System (CMS)

A modern, cloud-based Content Management System built with Flask, SQLite/PostgreSQL, and Bootstrap. This system provides a comprehensive solution for managing content, users, categories, and media files.

## Features

- **User Authentication & Authorization**: Role-based access control (Admin, Editor, Author)
- **Content Management**: Create, edit, delete, and publish posts
- **Category Management**: Organize content with categories
- **Media Library**: Upload and manage media files
- **Dashboard**: Real-time statistics and overview
- **Responsive Design**: Mobile-friendly Bootstrap interface
- **Cloud-Ready**: Designed for deployment on Heroku, AWS, or similar platforms

## Technology Stack

- **Backend**: Flask (Python)
- **Database**: SQLite (Development) / PostgreSQL (Production)
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Authentication**: Flask-Login
- **ORM**: SQLAlchemy

## Installation

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cms
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - Linux/Mac:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run the application**
   ```bash
   python app.py
   ```

6. **Access the application**
   - Open your browser and navigate to: `http://localhost:5000`
   - Default admin credentials:
     - Username: `admin`
     - Password: `admin123`

## Project Structure

```
cms/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── templates/            # HTML templates
│   ├── base.html
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── posts.html
│   ├── post_form.html
│   ├── categories.html
│   ├── category_form.html
│   ├── users.html
│   ├── media.html
│   ├── 404.html
│   └── 500.html
├── static/               # Static files
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── uploads/          # Media uploads directory
└── cms.db               # SQLite database (created on first run)
```

## Features Overview

### User Roles

- **Admin**: Full system access, user management
- **Editor**: Can edit and publish all posts
- **Author**: Can create and edit own posts

### Content Management

- Create, edit, and delete posts
- Draft, publish, or archive posts
- Rich text content support
- Category assignment
- Featured images
- SEO-friendly slugs

### Dashboard

- Total posts statistics
- Published vs. draft counts
- User statistics
- Recent posts overview
- Quick actions

## Deployment

### Heroku Deployment

1. Create a `Procfile`:
   ```
   web: gunicorn app:app
   ```

2. Update `requirements.txt` to include:
   ```
   gunicorn==21.2.0
   ```

3. Set up Heroku PostgreSQL addon

4. Update `app.py` to use environment variables for database URI

### AWS Deployment

1. Use AWS Elastic Beanstalk or EC2
2. Set up RDS PostgreSQL instance
3. Configure environment variables
4. Set up S3 for media storage (optional)

## Security Features

- Password hashing with Werkzeug
- SQL injection prevention (SQLAlchemy ORM)
- XSS protection (template escaping)
- CSRF protection (Flask-WTF recommended for production)
- Role-based access control
- Secure file uploads

## Future Enhancements

- Mobile application
- AI/ML-based content suggestions
- Advanced analytics
- Multi-language support
- API endpoints
- Real-time notifications
- Advanced media management
- Content versioning
- SEO optimization tools

## License

This project is developed for educational purposes.

## Contact

For questions or support, please refer to the project documentation.
# complaint-management-system
# complaint-management-system
