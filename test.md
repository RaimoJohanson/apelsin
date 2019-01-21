# Table of Contents
- [Quick reference](#quick-reference)
- [Common](#common)
- [ATC](#ATC)
- [Drugs](#drugs)
- [Gravbase](#gravbase)

---
## Quick reference
All available endpoints

| Method | URL | More info  |
| ---    | --- |---|
| GET   | /atc  | [List of all ATC](#list-atc) |
| GET   | /atc/search  | [Search ATC](#search-atc) |
| GET   | /drugs  | [List of all drugs](#list-of-all-drugs) |
| GET   | /drugs/:id  | [Get specified drug by ID](#get-specified-drug-by-id) |
| GET   | /drugs/autocomplete  | [Autocomplete for drugs](#autocomplete-for-drugs) |
| POST   | /drugs/search | [Search drugs](#search-drugs) |

---

## Common

#### Pagination 
Query strings
| parameter     | description           |
| ------------- | -------------         |
| page          | page                  |
| limit         | results per page      |
| sortBy        | sort by parameter     |
| sortMethod    | sort method           |
---

## ATC

#### List ATC

`GET /atc`

##### Query strings
1. `code` - ATC code value
2. 
##### Example
Request: `GET /atc?code=R03CC02`
Response:

```
{
    "parents": [
        {
            "id": 1024,
            "key": "R",
            "name_eng": "RESPIRATORY SYSTEM",
            "name_est": "HINGAMISSÜSTEEM"
        },
        {...}
    ],
    "list": [
        {
            "id": 4795,
            "key": "R03CC02",
            "name_eng": "Salbutamol",
            "name_est": null
        },
        {...}
    ],
    "last_level": false
}
```

#### Search ATC

`GET /atc/search`

##### Query strings
- [Pagination](#Pagination) is available.
- `search` - search keyword

##### Example
Request: `GET /atc/search?search=BEETABLOKAATORID`
Request with pagination: `GET /atc?search=BEETABLOKAATORID&page=1&limit=5&sortMethod=desc&sortBy=name_est`
Response:
```
{
    "page": "1",
    "list": [
        {
            "id": 350,
            "key": "C07",
            "name_eng": "BETA BLOCKING AGENTS",
            "name_est": "BEETABLOKAATORID",
            "created_at": "2018-08-16T13:22:12.496Z",
            "updated_at": "2018-08-16T13:22:12.496Z"
        },
        {...},
    ]
}
```
---

## DRUGS

#### Get specified drug by ID

`GET /drug/:id`

#### List of all drugs

`GET /drug`
##### Example
Response:

```
[
    {
        "id": 1443776,
        "name": "SEVOFLURANE BAXTER 100%",
        "drugform_name": "inhalatsiooniaur, vedelik"
    },
    {...}
]
```

#### Autocomplete for drugs
`GET /drug/autocomplete`

##### Query strings
- `value` - search keyword

##### Example
Request: `GET /drug/autocomplete?value=IBUPROFEN`
Response:

```
[
    {
        "id": 1434552,
        "name": "IBUPROFEN MEPHA 200MG",
        "tugevus": "200mg",
        "kogusPakendis": "10TK",
        "drugform_name": "õhukese polümeerikattega tablett"
    },
    {...}
]
```

#### Search drugs

`POST /drug/search`
##### Query strings
1. `type` - type of search value
    Possible values: `drug`, `substance`
2. `substance_est_id` substance_est_id
3. `id` drug id
4. `name` name of requested drug
##### Example
Payload:
```
[{
	"type": "substance",
	"substance_est_id": 12810,
	"name": "beetaagalsidaas",
	"id": 16
}]
```
Response:

```
[
    {
        "request": "beetaagalsidaas",
        "drugs": [
            {
                "id": 1109708,
                "name": "FABRAZYME inj",
                "licence_until": null,
                "drugform_name": "süstelahus"
            },
            {...}
        ]
    }
]
```

---
## GRAVBASE

---

## LACTBASE

---

## RHK10

