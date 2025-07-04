# Family Tree Application

<img src="https://wakapi-qt1b.onrender.com/api/badge/fahad/interval:any/project:Xenogram" 
     alt="Wakapi Time Tracking" 
     title="Spent more than that amount of time spent on this project">

A modern full-stack application for creating, visualizing, and sharing family trees built with Next.js, TypeScript, Prisma, tRPC, and TailwindCSS.

## Features

- **Interactive Family Tree Visualization**: Visually explore your family relationships
- **Comprehensive Family Member Management**: Add detailed information about each family member
- **Relationship Management**: Define various types of relationships (biological, adopted, etc.)
- **Partnership Tracking**: Record marriages and other partnerships
- **Life Events Timeline**: Document important life events for each family member
- **Media Support**: Add photos and documents to family member profiles
- **Secure Authentication**: Powered by NextAuth with multiple login options

## Tech Stack

- **Frontend**:
  - Next.js 14 with App Router
  - React 18
  - TypeScript
  - TailwindCSS for styling
  
- **Backend**:
  - tRPC for type-safe API
  - Prisma ORM
  - PostgreSQL database
  
- **Authentication**:
  - NextAuth.js with Google and Email providers

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/family-tree.git
   cd family-tree
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/familytree"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   
   # OAuth Providers (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # Email Provider (optional)
   EMAIL_SERVER="smtp://user:password@smtp.example.com:587"
   EMAIL_FROM="no-reply@example.com"
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses a relational database with the following main models:

- **User**: Authentication and user profile information
- **FamilyTree**: Container for a set of related family members
- **FamilyMember**: Individual person in a family tree
- **Relationship**: Parent-child relationships between family members
- **Partnership**: Marriage or partnership between family members
- **MemberEvent**: Life events for family members (birth, graduation, etc.)

## Deployment

This application can be deployed on Vercel, Netlify, or any other Next.js-compatible hosting platform.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [tRPC](https://trpc.io/)
- [TailwindCSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)
