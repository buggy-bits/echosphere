# EchoSphere - Mock API Service Frontend

A comprehensive, production-ready React application for creating, managing, and configuring custom mock APIs through an intuitive, dark-themed interface.

## ✨ Features

### Authentication System

- Secure JWT-based authentication
- User registration with password strength validation
- Protected routes with automatic token refresh
- Persistent login sessions

### Project Management

- Create and organize mock API projects
- Full CRUD operations on projects
- Search and filter functionality
- Beautiful card-based project grid

### Advanced Endpoint Configuration

- Support for all HTTP methods (GET, POST, PUT, PATCH, DELETE, OPTIONS)
- Custom response data with JSON editor
- Configurable status codes and response delays
- Dynamic response data support
- Custom headers configuration

### Resource Management

- Create and manage shared data resources
- JSON-based data structures
- Import/export functionality
- Cross-endpoint resource sharing

### Modern UI/UX

- Dark theme with Material-UI components
- Responsive design for all device sizes
- Smooth animations and micro-interactions
- Professional sidebar navigation
- Auto-save functionality with visual feedback

## 🚀 Technology Stack

- **Framework**: React 18+ with TypeScript
- **State Management**: Context API with useReducer
- **HTTP Client**: Axios with interceptors
- **Routing**: React Router v6
- **UI Library**: Material-UI v5
- **Form Handling**: React Hook Form with Yup validation
- **Code Editor**: Monaco Editor
- **Build Tool**: Vite

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   │   ├── Layout.tsx
│   │   ├── LoadingButton.tsx
│   │   └── ProtectedRoute.tsx
├── contexts/            # React contexts
│   ├── AuthContext.tsx
│   └── ProjectContext.tsx
├── pages/               # Route components
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ProjectsPage.tsx
│   └── ProjectDetailPage.tsx
├── services/            # API service layer
│   ├── api.ts
│   ├── authService.ts
│   └── projectService.ts
├── types/               # TypeScript definitions
│   └── index.ts
├── constants/           # App constants
│   └── index.ts
├── theme.ts             # Material-UI theme
└── App.tsx              # Main app component
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Modern web browser

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd echosphere-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
# Create .env.development.local
REACT_APP_API_BASE_URL=http://localhost:3000
REACT_APP_API_VERSION=v1
REACT_APP_APP_NAME=EchoSphere
REACT_APP_ENVIRONMENT=development
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

The build files will be generated in the `dist/` directory.

## 🔧 Configuration

### Environment Variables

| Variable                 | Description          | Default                 |
| ------------------------ | -------------------- | ----------------------- |
| `REACT_APP_API_BASE_URL` | Backend API base URL | `http://localhost:3000` |
| `REACT_APP_API_VERSION`  | API version          | `v1`                    |
| `REACT_APP_APP_NAME`     | Application name     | `EchoSphere`            |
| `REACT_APP_ENVIRONMENT`  | Current environment  | `development`           |

### API Integration

The application expects a REST API with the following endpoints:

#### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /api/v1/token/refresh` - Token refresh
- `GET /api/v1/user/me` - Get current user

#### Projects

- `GET /api/v1/projects` - Get all projects
- `POST /api/v1/projects` - Create project
- `PUT /api/v1/projects/:id` - Update project
- `DELETE /api/v1/projects/:id` - Delete project

#### Endpoints

- `GET /api/v1/endpoints?projectId=:id` - Get project endpoints
- `POST /api/v1/endpoints` - Create endpoint
- `PUT /api/v1/endpoints/:id` - Update endpoint
- `DELETE /api/v1/endpoints/:id` - Delete endpoint

#### Resources

- `GET /api/v1/resources?projectId=:id` - Get project resources
- `POST /api/v1/resources` - Create resource
- `PUT /api/v1/resources/:id` - Update resource
- `DELETE /api/v1/resources/:id` - Delete resource

## 🎨 Design System

### Color Palette

- **Primary**: Indigo (#6366f1)
- **Secondary**: Emerald (#10b981)
- **Error**: Red (#ef4444)
- **Warning**: Amber (#f59e0b)
- **Success**: Emerald (#10b981)

### Typography

- **Font Family**: Inter, Roboto, Helvetica, Arial
- **Scale**: H1 (2.5rem) → Body2 (0.875rem)
- **Line Heights**: 120% (headings), 150% (body)

### Components

- **Buttons**: 8px border radius, medium weight
- **Cards**: 12px border radius, subtle borders
- **Inputs**: 8px border radius, focus states
- **Spacing**: 8px grid system

## 🧪 Testing

### Running Tests

```bash
npm run test
```

### Test Coverage

```bash
npm run test:coverage
```

### Linting

```bash
npm run lint
```

## 🚀 Deployment

### Netlify/Vercel

The application is ready for deployment on static hosting platforms:

1. Build the application:

```bash
npm run build
```

2. Deploy the `dist/` directory

### Docker

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue on GitHub
- Email: support@echosphere.dev
- Documentation: [docs.echosphere.dev](https://docs.echosphere.dev)

## 🛣️ Roadmap

- [ ] Real-time collaboration
- [ ] API documentation generator
- [ ] GraphQL endpoint support
- [ ] Advanced response templating
- [ ] Team management features
- [ ] Usage analytics dashboard
