#Comment




#TODO 
Add pagination to getAllPosts

Filter posts by category or visibility

Auto-unpin old pinned posts

Add support for soft deletes






.env


# This was inserted by `prisma init`:
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

# DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
# DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"

# db here matches the docker-compose service name
# Prisma and the app will resolve the hostname db from Docker network
DATABASE_URL="postgresql://postgres:password@db:5432/gym_db"
PORT=4000
RESEND_API_KEY=re_CqLgBwf7_PabBs8BrwTrxhRCqWUV8dGTC
JWT_SECRET=GymSAAS1234


