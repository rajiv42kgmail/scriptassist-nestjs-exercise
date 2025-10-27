# TaskFlow API - Senior Backend Engineer Coding Challenge

- First of all build the application but while running command build it gives error.
- So I manually installed the respected modules of nestjs.
- After that while ruuning the api for regsistering the user it was giving 500 interval server in response.
- So I added the env JWT SECRET KEY value in .env file and respectively fixed the code.
- Next creating the task api it was giving dueDate error while passing in API paramater.
- As it should passed as IsISO8601 format so I fixed the code.
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
