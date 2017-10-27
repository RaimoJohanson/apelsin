
# AUTOMAATVÄRAV API

## Reference document

### KEYS & VALUES
Format of the keys are consistent throughout the API.

| Key                   | Value                     | Example
| ---                   | ---                       | -----
| email                 | string                    | john.smith@example.com
| password              | string                    | Str0nkPassw0rd


### AUTHENTICATING & SETTINGS
---
 Example: https://www.example.com/api/v1/login

|Method     | Resource              | Description                     | Keys                  | Response
| ------    | ------                | ------                          | -----                 | -----
| POST      | /login                | Authenticate and login          | email, password       | {success, message}
| PUT       | /logout               | Log out and end session         | ...                   | {success, message}



### 2. MAIN:
---
 
Example: https://www.example.com/1234

|Method     | Resource                  | Description                           | Keys                      | Response              
| ------    | ------                    | ------                                | -----                     | -----   
| GET       | /                         | List of available realms              |                           | [{}]      
| GET       | /:rid                     | Dashboard                             |                           | 


### 3. VEHICLES
Example: https://www.example.com/api/v1/projects

|Method     | Resource                  | Description                           | Keys                      | Response              
| ------    | ------                    | ------                                | -----                     | -----   
| GET       | /:rid/vehicles            | List of vehicles                      | name                      | [{ ... }]   
