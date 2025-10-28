# TaskFlow API - Senior Backend Engineer Coding Challenge

**Core Problems:**
- First of all build the application but while running command build it gives error.
- So I manually installed the respected modules of nestjs.
- After that while running the api for registering the user it was giving 500 interval server in response.
- So I added the env JWT SECRET KEY value in .env file and respectively fixed the code.
- Next creating the task api it was giving dueDate error while passing in API paramater.
- As it should passed as IsISO8601 format so I fixed the code.
- Path is regarding the IsISO8601 fix for dueDate: src/modules/tasks/dto/create-task.dto.ts
- Implemented task batch jobs and here is the API format for testing:

1. For update:
{
  "operation": "update",
  "data": [
    { "id": "76019720-c1e6-47d6-ab7f-582d4d14a2ac", "status": "COMPLETED" },
    { "id": "c926c756-f82f-4042-9782-c8dcf79e8ede", "status": "PENDING" }
  ]
}

2. For create:


{
  "operation": "create",
  "data": [
    { 
     "id": "76019720-c1e6-47d6-ab7f-582d4d14a2ac",
      "title": "test123",
      "description": "test2134",
      "status": "PENDING",
      "priority": "MEDIUM",
      "dueDate": "2025-12-31T23:59:59.000Z",
      "userId": "cd56160b-7c91-4baf-9016-2842cc103239"
 }
  ]
}

3. For delete:

{
  "operation": "delete",
  "data": [
    { "id": "76019720-c1e6-47d6-ab7f-582d4d14a2ac" },
    { "id": "798890c5-648a-40c8-b958-8880b5985bb4" }
  ]
}

Overview of architecture:

1. Framework & Technology Stack

Uses NestJS, a Node.js framework built on TypeScript, providing modules, controllers, providers, dependency injection, etc.
NestJS Documentation
+1

Likely uses TypeScript + Node, with the Nest CLI or scaffolding.

The folder structure will follow Nest’s conventions: modules, controllers, services/providers, maybe DTOs (data-transfer objects), pipes/guards/interceptors if used.

2. Layered Architecture

Here’s how the typical layers map and probably how this project is structured:

a) Incoming Request Layer

Controllers: handle HTTP requests (e.g., routes like /users, /tasks, etc).

They delegate to services for business logic.

They handle request/response, validation maybe via DTOs.

b) Business Logic / Service Layer

Providers/Services: contain the core business logic, orchestrate operations, call repositories or external APIs.

They are injectable via Nest’s DI system.

c) Persistence / Data Access Layer

Might have repositories or data access services which interact with a database (SQL or NoSQL).

Entities/Models define the data structure (if using an ORM like TypeORM or Prisma).

The architecture isolates database operations from controllers.

d) Shared/Utility Layer

Modules: Nest modules group related functionality (e.g., UserModule, AuthModule).

Utility or common modules (logging, configuration, error handling) may exist.

Configuration and environment variables (via @nestjs/config or similar) may be used to abstract environment differences.

3. Modular Structure & Nest Modules

Each feature likely corresponds to a module. For example:

src/
app.module.ts
users/
users.module.ts
users.controller.ts
users.service.ts
users.entity.ts
dto/
auth/
auth.module.ts
auth.service.ts
auth.controller.ts


AppModule is the root module that imports other modules.

Dependency injection ensures that services can use other services by injecting them.

4. Data Modeling & DTOs

DTOs (Data Transfer Objects) define and validate the shape of incoming/outgoing data.

Entities (if ORM) define the database tables or collections.

Validation decorators (from class-validator + class-transformer) may be used to ensure correctness of inputs.

5. Error Handling, Validation & Middleware

Validation is typically done via Pipes (for request body validation) in NestJS.

Guards may be used for auth/permissions.

Interceptors may handle logging, transformation, serialization.

Global exception filters may catch and format errors.

6. Configuration & Environment

A configuration module  load environment variables (.env).

Database connections, host/port, API keys, etc are abstracted.

7. Deployment & Build

Build script: Transpile TypeScript to JavaScript (via tsc or nest build) then run via Node.

The package.json scripts will likely include start, start:dev, build.

Environment differentiations (development/production) via config.

8. Possible Enhancements / Exercise Focus

Since this is an exercise project, possibilities include:

CRUD endpoints for one or more entities (e.g., tasks, users).

Authentication/authorization flow.

Unit/integration tests for controllers/services.

Proper error handling and status codes.

Use of migrations or ORM abstractions.

Using modules to separate concerns — making the system extensible.

9. Summary Diagram
   [ HTTP Request ]
   ↓
   Controller → Service → Repository/Database
   ↑                   ↓
   (DTOs, Validation)     (Entities/Models)


Modules group the above, configuration and utilities cross-cut.


**Performance Improvements:**
* Used pagination for large result sets for getting tasks results to avoid heavy memory usage.
* API is on GET /tasks for pagination.

**Security Improvements:**
* Used class-validator, class-transformer to validate DTOs, and avoided injection risks (SQL injection, NoSQL injection). I ensured incoming data is cleaned.
* Managed JWT securely(short expiration, refresh tokens, secure storage).
* Used environment variables for secrets and never commit them to the repo.
* Used strong password hashing.
* I didn't stored secrets in version control. Used environment variables, secret management. For example, hide  API keys. I ensured the .env is excluded and not in version control.
* I validated headers, query parameters, ensure unexpected combinations don’t cause logic issues.
* I ensured sensitive data in DB or storage is encrypted where required (depending on regulatory needs).
* SQL query was written in proper format so that sql injection or vulnerabilities should not be performed on application.