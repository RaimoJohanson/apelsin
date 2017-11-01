
# G8Keeper API

## Reference document

### KEYS & VALUES
Format of the keys are consistent throughout the API.

| Key                               | Value                     | Example
| ---                               | ---                       | -----
| email                             | string                    | 'john.smith@example.com'
| password                          | string                    | 'Str0nkPassw0rd'
| vehicle_id                        | integer                   | 47
| accepted                          | boolean                   | 1;0;true;false
| mon, tue, wed, thu, fri, sat, sun | boolean                   | 1;0;true;false
| begin_date                        | date(string)              | '2017-12-31'
| end_date                          | date(string)              | '2017-12-31'
| begin_time                        | time(string)              | '09:59:30'
| end_time                          | time(string)              | '09:59:30'



### 1. AUTHENTICATING & SETTINGS
---
 Example: https://www.example.com/v1/login

|Method     | Resource                  | Description                           | Keys                                  | Response
| ------    | ------                    | ------                                | -----                                 | -----
| POST      | /login                    | Authenticate and login                | email, password                       | {success, message}
| PUT       | /logout                   | Log out and end session               | ...                                   | {success, message}



### 2. MAIN:
---
 
Example: https://www.example.com/v1/realms

|Method     | Resource                  | Description                           | Keys                                  | Response              
| ------    | ------                    | ------                                | -----                                 | -----   
| GET       | /realms                   | List of available realms              |                                       | [{}]      
| GET       | /realms/{realm_id}        | Dashboard                             |                                       | {}


### 3. VEHICLES
Example: https://www.example.com/api/v1/realms/1/vehicles
Common: /v1/realms/{realm_id}

|Method     | Resource                  | Description                           | Keys                                  | Response              
| ------    | ------                    | ------                                | -----                                 | -----   
| GET       | /vehicles                 | List of vehicles                      |                                       | [{ ... }]   
| POST      | /vehicles                 | Add new vehicle                       |'plate', 'make', 'model'               | 
| PUT       | /vehicles/{vehicle_id}    | Modify existing vehicle               |'plate', 'make', 'model'               | 
| DELETE    | /vehicles/{vehicle_id}    | Delete existing vehicle               |                                       |

### 4. CAMERAS
Example: https://www.example.com/api/v1/realms/1/cameras
Common: /v1/realms/{realm_id}

|Method     | Resource                  | Description                           | Keys                                  | Response              
| ------    | ------                    | ------                                | -----                                 | -----   
| GET       | /cameras                  | List of cameras                       |                                       | [{ ... }]   
| POST      | /cameras                  | Add new camera                        |'asset_tag', 'alias', 'ip_address'     | 
| PUT       | /cameras/{camera_id}      | Modify existing camera                |'asset_tag', 'alias', 'ip_address'     | 
| DELETE    | /cameras/{camera_id}      | Delete existing camera                |                                       |

### 5. RULES
Example: https://www.example.com/api/v1/realms/1/rules
Common: /v1/realms/{realm_id}

|Method     | Resource                  | Description                           | Keys                                  | Response              
| ------    | ------                    | ------                                | -----                                 | -----   
| GET       | /rules                    | List of rules                         |                                       | [{ ... }]  
| GET       | /rules/{rule_id}          | Get specified rule                    |                                       | [{ ... }]  
| POST      | /rules                    | Add new rule                          | Example: Keys                         | 
| PUT       | /rules/{rule_id}          | Modify existing rule                  |                                       | 
| DELETE    | /rules/{rule_id}          | Delete existing rule                  |                                       |

Keys: 'accepted', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun', 'begin_date', 'end_date', 'begin_time', 'end_time', 'vehicle_id'

### 6. LOGS
Example: https://www.example.com/api/v1/realms/1/logs
Common: /v1/realms/{realm_id}

|Method     | Resource                  | Description                           | Keys                                  | Response              
| ------    | ------                    | ------                                | -----                                 | -----   
| GET       | /logs                     | List of log entries                   |                                       | [{ ... }]  
| GET       | /logs/{log_id}            | Get specified entry                   |                                       | { ... }