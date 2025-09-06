# Overview

This is the FAA™ (Fruitful Automation Assistant) Global Document Processing & Brand Compliance System - a full-stack web application built for managing documents, brands, AI conversations, and compliance monitoring. The system serves as a centralized platform for processing various document types, managing brand portfolios, tracking compliance logs, and automating business processes through AI integration.

The application appears to be designed for enterprise-level document management with emphasis on compliance, brand protection, and automated processing workflows.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Real-time Communication**: WebSocket integration for live updates and notifications
- **Design System**: Dark theme with custom CSS variables and responsive design patterns

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints with real-time WebSocket support
- **File Handling**: Multer middleware for file uploads with 10MB size limits
- **Session Management**: Express sessions with PostgreSQL session store
- **Real-time Features**: WebSocket Server for broadcasting system updates

## Data Storage Solutions
- **Primary Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Management**: Drizzle Kit for migrations and schema updates
- **Connection**: @neondatabase/serverless for optimized serverless connections
- **Storage Strategy**: File uploads stored locally with metadata in database

## Database Schema Design
The system uses six main entities:
- **Users**: Authentication and user management
- **Documents**: File storage with metadata, content extraction, and processing status
- **Gallery**: Image/visual content management with categorization and tagging
- **Conversations**: AI chat history with provider tracking and message archival
- **Brands**: Brand portfolio management with status tracking and compliance monitoring
- **Compliance Logs**: Audit trail for compliance verification and system monitoring
- **Processing Queue**: Automated task management and workflow processing

## Authentication & Authorization
- Basic session-based authentication using Express sessions
- PostgreSQL session store for persistent session management
- User management with secure password handling
- Session-based route protection and user context

## External Dependencies

### Database & ORM
- **PostgreSQL**: Primary database through Neon serverless platform
- **Drizzle ORM**: Type-safe database queries and schema management
- **Drizzle Kit**: Database migrations and schema synchronization

### UI & Styling
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Shadcn/ui**: Pre-built component library for consistent design system
- **Lucide React**: Icon library for consistent iconography

### Development & Build Tools
- **Vite**: Fast build tool and development server with HMR
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

### File Processing & Validation
- **Multer**: Multipart file upload handling for document processing
- **Zod**: Runtime type validation and schema validation
- **Date-fns**: Date manipulation and formatting utilities

### Real-time & Communication
- **WebSocket (ws)**: Real-time bidirectional communication
- **TanStack Query**: Server state management with caching and real-time updates

### Session & Security
- **Connect-pg-simple**: PostgreSQL session store for Express sessions
- **Express**: Web application framework with middleware support

The architecture follows a modern full-stack pattern with TypeScript throughout, emphasizing type safety, real-time capabilities, and scalable document processing workflows.