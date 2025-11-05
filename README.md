# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.



### turso

O que é Turso Database

O Turso é um sistema de banco de dados “embedado” (in-process) com compatibilidade com SQLite. 

- turso comands

    $ turso auth login

    $ turso db show develop
     > show .env information
    
Introduction
The Turso CLI gives you everything you need from the command line to manage your database, API tokens, inviting users, and launching the database shell. If you’re waiting for a migration to run, there’s also a relax command. You can also programmatically manage your Turso account, including groups, databases, organizations and invites using the Platform API.
1

Install
Begin by installing the Turso CLI:
Copy

    $ brew install tursodatabase/tap/turso

2

Authenticate
Now signup or login:
Copy

    $ turso auth signup

3

Operate
The Turso CLI provides the following commands:

 Command	Description

    auth - Authenticate and manage API tokens.

    contact - Submit your feedback, ideas and create a meeting with the team.

    db - Create and manage databases, access tokens and connect to the shell.

    dev - Run Turso locally for development.

    group - Create groups for databases with a shared location.

    org - Manage billing and invite members.

    plan - overages, select, show, upgrade
    
    quickstart - Get started with Turso in 5 minutes.

    relax - Take some time out and relax with Turso.

    update - Update to the Turso CLI to the latest version with one command.


 - Show databases

    $ turso db list

 - create a databse

    $ turso db create prodution

 - show all data of database

    $ turso db show prodution

 - start an interactive SQL shell with:

    $ turso db shell production

 - to get a authentication token for the database, run

    $ turso db tokens create production


 ####

 https://docs.turso.tech/tursodb/quickstart

  - install 

    $ npm install @libsql/client


  - Initialize a new client

  In app create a folder 
  
  @turso.ts

    export constant call turso

import { createClient } from "@libsql/client"

export const turso = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
})


####

create file

@ .env

using the correct credentials

####

### install and configure Prisma


https://www.prisma.io/docs

https://www.prisma.io/docs/guides

https://www.prisma.io/docs/guides/react-router-7



2. Install and Configure Prisma
2.1. Install dependencies

To get started with Prisma, you'll need to install a few dependencies:

    Prisma Postgres (recommended)
    Other databases

npm install prisma tsx --save-dev



after install


Once installed, initialize Prisma in your project:

Once installed, initialize Prisma in your project:

npx prisma init --db --output ../app/generated/prisma

remove --db

npx prisma init --output ../app/generated/prisma


### modify .env


DATABASE_URL="file:./database/database.sqlite"

@ prisma/schema.prisma

generator client {
  provider = "prisma-client"
  output   = "../app/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  age int?  
  name  String?
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  authorId  Int
  author    User    @relation(fields: [authorId], references: [id])
}


to create a file sql

create a database and execute the commands

$ npx prisma migrate dev --name init

database created = npx prisma migrate dev --name init


to update the modify

$ npx prisma migrate dev --name add age to user


@ schema.prisma

generator client {
  provider = "prisma-client"
  output   = "../app/generated/prisma"
  previewfeatures = ["driverAdapters"]
}



generate prisma client

  $ npx prisma generate


  @ prisma/prisma.ts


  import { PrismaClient } from '~/generated/prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient
}

const prisma = globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma


### install adapter-libsql

  $ npm install @prisma/adapter-libsql


  ### update changes in @schema.prisma

- will create a table of database

  $ npx prisma db push