
# G8Keeper API
## Reference document
##### Table of Contents  
- [G8Keeper API](#g8keeper-api)
    - [DEVELOPER NOTES](#developer-notes)
    - [KEYS & VALUES](#keys-values)
    - [RASPBERRY](#raspberry)
    - [1. AUTHENTICATING](#1-authenticating)
    - [2. LANDING:](#2-landing)
    - [3. ACCOUNT SETTINGS:](#3-account-settings)
    - [4. DASHBOARD:](#4-dashboard)
    - [5. REALM SETTINGS:](#5-realm-settings)
    - [6. VEHICLES](#6-vehicles)
    - [7. CAMERAS](#7-cameras)
    - [8. RULES](#8-rules)
    - [9. LOGS](#9-logs)


### DEVELOPER NOTES
---

```
DEMO HTML https://kooliprojekt-raimoj.c9users.io/test/landing.html

Ideed:
Reeglitesse ühe korra pääsud. Auto pääseb vaid ühe korra sisse. ehk siis ajutine luba.

```
### KEYS & VALUES
---
Format of the keys are consistent throughout the API.
All id's are numbers.

| Key                               | Value                     | Example
| ---                               | ---                       | -----
| first_name                        | string                    | 'Jaan'
| last_name                         | string                    | 'Tatikas'
| email                             | string                    | 'john.smith@example.com'
| role                              | string                    | 'ADMIN';'USER'
| password                          | string                    | 'Str0nkPassw0rd'
| accepted                          | boolean                   | 1;0;true;false
| mon, tue, wed, thu, fri, sat, sun | boolean                   | 1;0;true;false
| begin_date                        | string                    | '2017-12-31'
| end_date                          | string                    | '2017-12-31'
| begin_time                        | string                    | '09:59:30'
| end_time                          | string                    | '09:59:30'
| plate                             | string                    | '123ABC'
| make                              | string                    | 'Audi'
| model                             | string                    | 'Testarossa'
| asset_tag                         | string                    | 'C123123'
| alias                             | string                    | 'Peavärav'
| ip_address                        | string                    | '192.168.13.37'
| input                             | string                    | 'Ferrari'

### RASPBERRY
---

|Method     | Resource                  | Description                           | Keys               | Response
| ------    | ------                    | ------                                | -----              | -----
| POST      | /recognize/{asset_tag}    | Whether or not open the gate          |                    |


```
Example:
curl -i -X POST -H "Content-Type: multipart/form-data" -F "image=@temp/image.jpg" https://example.com/v1/recognize/C100001

```
### 1. AUTHENTICATING 
---
 Example: https://www.example.com/v1/login

|Method     | Resource                  | Description                           | Keys                                  | Response
| ------    | ------                    | ------                                | -----                                 | -----
| POST      | /login                    | Authenticate and login                | email, password                       | {success, message}
| PUT       | /logout                   | Log out and end session               | ...                                   | {success, message}
| GET       | /status                   | Logged in status                      | ...                                   | `{message, user}` or ` {message}`

### 2. LANDING:
---
![landing-view](https://raw.githubusercontent.com/RaimoJohanson/apelsin/master/Prototype/landing.png)

|Method     | Resource                          | Description                           | Keys                                                | Response              
| ------    | ------                            | ------                                | -----                                               | -----   
| GET       | /realms                           | List of available realms to user      |                                                         | [{ ... }]  
| POST      | /realms                           | Add realm. Creator will be admin      |'name','country','region','city','street','street_number'| 

### 3. ACCOUNT SETTINGS:
---
![account_settings-view](https://raw.githubusercontent.com/RaimoJohanson/apelsin/master/Prototype/account_settings.png)

|Method     | Resource                    | Description                           | Keys                                                | Response   
| ------    | ------                      | ------                                | -----                                               | -----   
| GET       | /users/{user_id}            | Get specified user                    |                                                     | [{ ... }]
| PUT       | /users/{user_id}            | Modify existing user                  |'first_name', 'last_name','email', 'role','password' | 
| DELETE    | /users/{user_id}            | Delete existing user                  |                                                     |

### 4. DASHBOARD:
---
![dashboard-view](https://raw.githubusercontent.com/RaimoJohanson/apelsin/master/Prototype/dashboard.png)

```
DASHBOARD: Tee lihtsalt 3 päringut:

Archive       => GET  v1/realms/{realm_id}/logs?limit=5&order=desc
Cameras       => GET  v1/realms/{realm_id}/cameras
Statistics    => GET  v1/realms/{realm_id}/statistics/today

```
### 5. REALM SETTINGS:
---

![realm_settings-view](https://raw.githubusercontent.com/RaimoJohanson/apelsin/master/Prototype/realm_settings.png)
Example: https://www.example.com/v1/realms

|Method     | Resource                          | Description                           | Keys                                                    | Response              
| ------    | ------                            | ------                                | -----                                                   | -----      
| GET       | /realms/{realm_id}                | Realm data                            |                                                         |
| PUT       | /realms/{realm_id}                | Modify existing realm                 |'name','country','region','city','street','street_number'| 
| DELETE    | /realms/{realm_id}                | Delete existing realm                 |                                                         |

![realm_users-view](https://raw.githubusercontent.com/RaimoJohanson/apelsin/master/Prototype/realm_users.png)

|Method     | Resource                          | Description                           | Keys                                                | Response              
| ------    | ------                            | ------                                | -----                                               | -----   
| GET       | /users?                           | Search account                        | email                                               | [{ ... }]
| GET       | /realms/{realm_id}/users          | List of users                         |                                                     | [{ ... }]
| GET       | /realms/{realm_id}/users/{user_id}| Get specified user                    |                                                     | [{ ... }]
| POST      | /realms/{realm_id}/users          | Add existing user                     |'role','user_id'                                     | 
| PUT       | /realms/{realm_id}/users/{user_id}| Modify existing user                  |'role'                                               | 
| DELETE    | /realms/{realm_id}/users/{user_id}| Delete existing user                  |                                                     |

### 6. VEHICLES
---
![vehicles-view](https://raw.githubusercontent.com/RaimoJohanson/apelsin/master/Prototype/vehicles.png)
Example: https://www.example.com/api/v1/realms/1/vehicles
Common: /v1/realms/{realm_id}

|Method     | Resource                  | Description                           | Keys                                  | Response              
| ------    | ------                    | ------                                | -----                                 | -----   
| GET       | /vehicles                 | List of vehicles                      |                                       | [{ ... }]
| GET       | /vehicles/{vehicle_id}    | Get specified vehicle                 |                                       | [{ ... }]
| POST      | /vehicles                 | Add new vehicle                       |'plate', 'make', 'model'               | 
| PUT       | /vehicles/{vehicle_id}    | Modify existing vehicle               |'plate', 'make', 'model'               | 
| DELETE    | /vehicles/{vehicle_id}    | Delete existing vehicle               |                                       |

### 7. CAMERAS
---
![cameras-view](https://raw.githubusercontent.com/RaimoJohanson/apelsin/master/Prototype/cameras.png)
Example: https://www.example.com/api/v1/realms/1/cameras
Common: /v1/realms/{realm_id}

|Method     | Resource                  | Description                           | Keys                                  | Response              
| ------    | ------                    | ------                                | -----                                 | -----   
| GET       | /cameras                  | List of cameras                       |                                       | [{ ... }]   
| POST      | /cameras                  | Add new camera                        |'asset_tag', 'alias', 'ip_address'     | 
| PUT       | /cameras/{camera_id}      | Modify existing camera                |'asset_tag', 'alias', 'ip_address'     | 
| DELETE    | /cameras/{camera_id}      | Delete existing camera                |                                       |

### 8. RULES
---
![rules-view](https://raw.githubusercontent.com/RaimoJohanson/apelsin/master/Prototype/rules.png)
Example: https://www.example.com/api/v1/realms/1/rules

<dl>
  <dt>Basics</dt>
  <dd>
  Reegleid otsitakse tuvastatud numbrimärgi järgi.
  Sõidukil võib olla nii keelav kui ka lubav reegel. 
  Lubava reegli puhul väljaspool reegli kehtivust ei lubata sõidukil väravast läbi sõita.
  Algselt on kõik lisatud numbrimärgid(sõidukid) lubatud läbi värava. 
  Reegli puudumisel tuleb põjenduseks:  ```reason: 'Default decision'```
  .
  </dd>
 
</dl>


|Method     | Resource                      | Description                           | Keys                                  | Response              
| ------    | ------                        | ------                                | -----                                 | -----   
| GET       | /rules                        | List of rules                         |                                       | [{ ... }]  
| GET       | /rules/{rule_id}              | Get specified rule                    |                                       | [{ ... }]  
| POST      | /rules                        | Add new rule                          | Example: Parameters                   | 
| PUT       | /rules/{rule_id}              | Modify existing rule                  |                                       | 
| DELETE    | /rules/{rule_id}              | Delete existing rule                  |                                       |
| GET       | /vehicles?input               | Autocomplete vehicle within spec. realm. Will search for 'plate','model','make'   | input  | [{ ... }]

Parameters: 'accepted', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun', 'begin_date', 'end_date', 'begin_time', 'end_time', 'plate'

### 9. LOGS
---
![logs-view](https://raw.githubusercontent.com/RaimoJohanson/apelsin/master/Prototype/logs.png)
Example: https://www.example.com/api/v1/realms/1/logs
Common: /v1/realms/{realm_id}

|Method     | Resource                  | Description                           | Keys                                  | Response              
| ------    | ------                    | ------                                | -----                                 | -----   
| GET       | /logs                     | List of log entries                   | Paginator => Example                  | Paginator => Example
| GET       | /logs/{log_id}            | Get specified entry                   |                                       | { ... }

Paginator query example: ```?limit=10&page=1```
Response example:
```
{
"limit":10,
  "page":1,
  "total_pages":11,
  "data":[{...}]
}

```
