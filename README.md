# Ylabs Assignment

## Start a dev server

### Install dependencies

```bash
pnpm install
```

### Setup environment variables

Copy the example environment variables and fill in the values

```bash
cp .env.example .env
```

### Setup Database

Start the database

```bash
docker-compose up
```

Run database migrations

```bash
pnpm run prisma:migrate
```

### Start the server

```bash
pnpm start:dev
```

The server will be running on http://localhost:3000 and Swagger UI will be running on http://localhost:3000/api

## Bonus Sections

### Swagger UI / OpenAPI

The postman collection can be found in [openapi-specs.json](https://github.com/prashunchitkr/y-assignment/blob/main/openapi-specs.json) extracted from `/api-json` endpoint which can be imported in postman to test the API.

### Postgres Triggers, PG Notify / Listen

A trigger is created during Prisma migration that can be found [here](https://github.com/prashunchitkr/y-assignment/blob/main/prisma/migrations/20230509065537_add_project_notification_trigger/migration.sql)

There is a separate service `pgnotification.service.ts` that listens to the notification channel and sends the notification to the client.
At this moment, it only logs the matched projects to the console.

### String Similarity Algorithm

I have not implemented this feature here. However if I had enough time, I would have used [cosine similarity algorithm](https://en.wikipedia.org/wiki/Cosine_similarity) to find the similarity between the project name/description and the search query. It can find the similarity between two vectors and can be used to find the similarity between two strings represented as vectors. To represent strings as vectors, we can use the [Bag of Words](https://en.wikipedia.org/wiki/Bag-of-words_model) model or a [word2vec](https://en.wikipedia.org/wiki/Word2vec) model. We can add a column in the database to store the embeddings of the project name and then use the Cosine similarity algorithm to find the similarity between the search query and the project name.

I found a Postgres extension which can trivialize the storing embeddings and starching similar records based on the cosine similarity called [pgvector](https://github.com/pgvector/pgvector). It seems to have nice integration with [Prisma](https://github.com/pgvector/pgvector-node#prisma) as well.

For the actual implementation, I would create text embeddings for the project name and/or description and store it in separate column. And in search or any other use case, I would the postgres extension to query the similar records based on the embeddings.

## Rooms for improvement

- Datagen could be done for unit tests to generate sample data. Which would reduce the size of the unit tests.
- Only dev environment is containerized. Entire app can be containerized for production.
- “A university must have at least one professor and at least one student”, this created a chicken and an egg problem while creating the create API for professor and student. So I decided to go with the approach a professor and student might not have any university associated to them. But when creating a university, at least one student and professor ids should be provided.
- Strings hardcoded couldve been stored as constants in a separate file. Which would make it easier to change them if needed in the future.
