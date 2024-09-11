# Blog App

This is a **Next.js-based blog application** that allows users to create, edit, delete, and view blog posts. The app supports markdown rendering for post content and utilizes AWS S3 for image uploads via signed URLs. The application handles server-side rendering and API routes efficiently, providing robust post management, authentication features, and user interaction through likes.

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Setup Instructions](#setup-instructions)
   - [Prerequisites](#prerequisites)
   - [Fast Install](#fast-install)
5. [API Endpoints](#api-endpoints)
6. [Key Components](#key-components)
7. [Project Drawbacks](#project-drawbacks)
8. [P.S.](#ps)

## Features

- **Post Management**: Create, view, edit, and delete blog posts.
- **File Upload**: Upload images to AWS S3 using signed URLs.
- **Markdown Rendering**: Render blog post content using markdown.
- **User Interaction**: Users can like any post as many times as they want. *(This is a known flaw, as there's no restriction on the number of likes a user can press.)*
- **Responsive Design**: The application is fully responsive and works on various screen sizes.
- **Full Access**: Any user can create, edit, or delete posts without restrictions.

## Tech Stack

- **Next.js**: Server-side rendering framework.
- **TypeScript**: Strongly typed JavaScript for a better development experience.
- **Prisma**: Database ORM for handling database operations.
- **AWS S3**: For image storage.
- **React**: Used for building UI components.
- **Tailwind CSS**: For styling the application.

## Project Structure

The application follows a modular structure, where each feature has its own set of components and routes. Below is a breakdown of the directory structure:

```bash
prisma/                             
src/
  ├── app/                          
  │   ├── api/
  │   │   ├── posts/                # API routes for managing posts
  │   │   │   ├── [id]/             
  │   │   │   │   └── route.ts      # Handles GET, PUT, and DELETE requests for a single post
  │   │   │   ├── route.ts          # Handles GET (all posts) and POST (create post) requests
  │   │   ├── upload/               
  │   │   │   └── route.ts          # API for S3 URL generation
  │   ├── components/               # Reusable UI components
  │   │   ├── BackButton.tsx        
  │   │   ├── PostCard.tsx
  │   │   ├── PostGrid.tsx
  │   │   └── Search.tsx
  │   ├── context/                  
  │   │   └── SearchContext.tsx     # Context for managing search functionality
  │   ├── lib/                      
  │   │   └── posts.ts              # Functions for fetching posts in server components
  │   ├── posts/                    # Pages related to blog posts
  │   │   ├── [id]/
  │   │   │   ├── Details.tsx       
  │   │   │   └── page.tsx          # Post details page
  │   │   ├── create/               
  │   │   │   ├── CreateForm.tsx
  │   │   │   └── page.tsx          # Post creation page
  │   │   ├── edit/ [id]/           
  │   │       ├── EditForm.tsx
  │   │       └── page.tsx          # Post editing page
  │   ├── layout.tsx                # Main layout for the app
  │   └── page.tsx                  # Main page of the app
```

## Setup Instructions

### Prerequisites

- **Node.js**: 20.x
- **Docker**

### Fast Install

```bash
# Step 1: Clone the repository
git clone https://github.com/MelsovEZ/web-blog.git
cd web-blog

# Step 2: Install dependencies
npm install

# Step 3: Generate Prisma client
npx prisma generate

# Step 4: Deploy the Prisma migrations to your database
npx prisma migrate deploy

# Step 5: Build the Docker containers
docker-compose build

# Step 6: Start the containers in detached mode
docker-compose up -d

# Step 7: Start the application
npm run start
```

Navigate to [http://localhost:3000](http://localhost:3000) in your browser to see the app in action. 

## API Endpoints

### Posts

- `GET /api/posts`: Fetch all posts.
- `GET /api/posts/[id]`: Fetch a single post by ID.
- `POST /api/posts`: Create a new post.
- `PUT /api/posts/[id]`: Update a post by ID.
- `DELETE /api/posts/[id]`: Delete a post by ID.

### Upload

- `POST /api/upload`: Generate a signed URL for uploading images to AWS S3.

## Key Components

### 1. `CreateForm.tsx`
This component handles the form for creating a new post, including title, content (with markdown), and image upload functionality.

### 2. `EditForm.tsx`
This component allows users to edit an existing post. It pre-fills the form fields with the post data fetched from the API.

### 3. `PostCard.tsx`
Displays a preview of each blog post, including title, content, and an image.

### 4. `PostGrid.tsx`
Renders a grid of blog posts for the main blog page.

### 5. `Details.tsx`
This component fetches and displays a full post based on its ID. It uses markdown rendering for the content.

## Project Drawbacks

1. **No Pagination on Initial Load**: Initially, there was no pagination on the main page, which could make the app slow if there are too many posts. Although pagination is now present, it's only for appearance. When the page loads, it still loads all posts and then creates pagination pages.
   
2. **Unlimited Likes**: Any user can like any post as many times as they want because there's no authentication. Implementing proper authentication was time-consuming, so I skipped it. Normally, I'd implement backend authentication using Express or Next.js.

3. **Inefficient API Calls for Likes**: When a user likes a post, the entire post data is sent to the API along with the incremented like count. I know this is inefficient and violates REST principles, but I couldn't think of a better method without breaking REST conventions.

4. **Excessive Try/Catch**: Despite my efforts, I couldn't fully remove try/catch blocks from the components. This is likely due to habit from past coding practices, even though it's considered bad practice.

5. **Overly Complex Forms**: I feel like the forms for creating and editing posts are too bulky, though I'm not entirely sure.

6. **Server Components Not Fully Utilized**: I tried to make components server-side, but almost every one of them ended up being client-side. Fortunately, all pages are server-side, though I'm unsure how beneficial that will be.

## P.S.

The project was very simple, and this time I decided to focus on depth rather than breadth, eliminating all bugs and smoothing out the rough edges. I think I could have implemented authentication if I hadn't accidentally formatted my disk yesterday with the `sudo rm -rf` command, haha. I just wanted to clear out a folder, but I accidentally wrote the wrong symbol and deleted all the data from the disk, lmao. 

<img src="https://github.com/MelsovEZ/web-blog/blob/master/public/hudson.gif" alt="There was a lot left in me..." height="400">