
# <img src="https://metrito-public.s3.sa-east-1.amazonaws.com/metrito-vector.svg" width="200" style="margin: 20px" />

## Introduction

Metrito is a powerful and intuitive Software as a Service (SaaS) platform designed to streamline your marketing data analytics experience. By leveraging our state-of-the-art technology, users can effortlessly create customized dashboards that consolidate and visualize data from multiple sources, such as Facebook Ads, Google Ads, and other marketing tools.

## Features

- Customizable dashboard templates
- Data source integration (Facebook Ads, Google Ads, etc.)
- Real-time data visualization and analytics
- Robust modern stack (NodeJS, Express, TypeScript, Mongo, Redis, etc.)
- ClickHouse Data Warehouse for fast and efficient storage
- Redis for proficient job management

## Prerequisites

- Node.js
- npm (Node Package Manager)
- Git
- Docker & docker-compose for run redis and database in local machine

## Installation

1. Clone the repository: ``git clone https://github.com/metrito/metrito_server.git``
2. Change to the project directory: ``cd metrito_server``
3. Install the required dependencies: ``npm install``
4. If you are using a custom database or API keys, follow the Configuration steps below.
5. For database setup, use ``npx prisma generate``.
6. Finally, run ``npm run prepare`` to prepare the husky integration.

 ## Configuration

1. Copy the example configuration file: ``.env.example``
2. Open the .env file and update the following variables according to your specific environment
3. Replace the placeholders with your own database connection string and API keys.

## Usage in Development Mode

- Start the development server: ``npm run dev``

## Usage in Production Mode

- Build the production bundle: ``npm run build``
- Start the production server: ``npm run start``

## 🔐 Copyright
#### Copyright © 2023 - Metrito - All Rights Reserved

Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited without the express written permission from the copyright holder.

Written by José Matheus Barbosa and contributed by the metrito team: Felipe Oliveira, Luca Frederice and Yan David, 2021 - 2024


