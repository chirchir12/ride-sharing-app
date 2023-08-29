# Ride-Sharing API using NestJS

This repository contains a simplified version of a ride-sharing API built using NestJS, designed to provide user registration, ride request, and driver availability management features. The application utilizes PostgreSQL with PostGIS for spatial data storage. You can run the system manually by installing the required dependencies or use Docker Compose for a streamlined setup.

## Table of Contents

- [Ride-Sharing API using NestJS](#ride-sharing-api-using-nestjs)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Setup and Installation](#setup-and-installation)
    - [Manual Setup](#manual-setup)
      - [Installation](#installation)
      - [Running the app](#running-the-app)
      - [Test](#test)
    - [Using Docker Compose](#using-docker-compose)
  - [API Documentation](#api-documentation)
  - [Pg Admin](#pg-admin)
  - [NB](#nb)
  - [License](#license)

## Features

- **User/Driver Registration:**

  - Users can register using their email, password, name, and phone number.
  - User information is stored securely with password hashing.

- **Authentication and Authorization:**

  - JWT-based authentication is implemented.
  - Users can access their own profile and make ride requests.
  - Drivers can mark themselves as available/unavailable.

- **Ride Request:**
  - Authenticated users can create ride requests with pickup and destination locations.
  - Each ride request has a status ("pending," "accepted," "completed," "canceled").
- **Driver Availability:**

  - Authenticated drivers can toggle their availability status.
  - Available drivers can receive and accept ride requests.
  - Drivers can only accept one ride request at a time.

- **Ride Management:**
  - Get a list of all ride requests.
  - Drivers can accept ride requests and update request status.
  - Mark a ride as completed or canceled.

## Prerequisites

Before you begin, ensure you have the following prerequisites:

- Node.js 18.x
- PostgreSQL with PostGIS extension
- Docker and Docker Compose (optional, for using Docker)

## Setup and Installation

### Manual Setup

1. Clone this repository.
2. Configure the database connection:
   - Rename the `.env.example` file to `.env`.
   - Edit the `.env` file and provide your PostgreSQL database credentials.

#### Installation

```bash
$ npm install
```

#### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

#### Test

```bash
# unit tests
$ npm run test

```

### Using Docker Compose

1. Clone this repository.
2. Configure the database connection:
   - Rename the `.env.example` file to `.env`.
   - Edit the `.env` file and provide your PostgreSQL database credentials.
3. run `docker-compose -up`
4. to run migration, find app docker container id using `docker ps`
5. run `docker exec -it <app_id>  sh`
6. inside container run `npm run migration:run`

## API Documentation

1. http://localhost:4003/api/docs#/ OR speficy your port
2. you can also import postman collection in the root directory of the project to your postman

## Pg Admin

1. please visit http://localhost:5050/
2. use `admin@admin.com` in the email field
3. use `pgadmin4` in the password field
4. create a connection once connected and remember to use `db` in the host connection field

## NB

if you encounter issues running with docker, check if you have postgres installed and run `sudo systemctl stop postgres.service` and run `docker-compose up --build`

## License

Nest is [MIT licensed](LICENSE).
