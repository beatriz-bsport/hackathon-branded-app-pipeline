## Preliminary tasks
[] Créer l'upsell pointeuse / rajouter dans le resolve des upsell

#### Staff ajouter la permission:
[] pointeuse staff
[] pointeuse pour un autre staff

```json
  {
    ...
    "clockIn": {
      "selfClockIn": true,
      "clockInForOther": false,
      "canAccessHistory": false,
    },
    ...
  }
```

#### Migration des permissions dans le sous objet "clockIn"
[] Ajouter la permission selfClockIn par défault a tous
[] Ajouter la permission clockInForOther et canAccessHistory a true pour les mangaer et owner et false au reste

## Endpoints "clockIn"

### [GET] clockIn/last

#### Return
case ongoing

```json
  {
    "last_clock_in": "2022-10-22::18:40",
    "last_clock_out": null,
  }
```

case worday finished

```json
  {
    "lastClockIn": "2022-10-22::18:40",
    "lastClockout": "2022-10-22::18:40",
  }
```

### [POST] clockIn / clockout ? 
#### Params
**userId** ?: number | null

#### Return

```json
  {
    "lastClockIn": "2022-10-22::18:40",
    "lastClockout": "2022-10-22::18:40",
  }
```

### [EDIT] /{:clockInId}

#### Params
**date_start**: "YYYY-MM-DD::HH:MM"
**date_end**: "YYYY-MM-DD::HH:MM"

#### Return

```json
  {}
```

### [DELETE] /{:clockInId}

#### Return

```json
  {}
```

### [GET] /getStaffsAttendanceRealTime
#### Params 
**page**: number
**page_size**: number

#### Return

```json
  {
    "next_page": 3,
    "previous_page": 1,
    "count": 4222, // user count
    "results": [{
      "firstname": "Toto",
      "lastname": "Dupont",
      "email": "Dupont",
      "userId": 12,
      "role": "",
      "lastClockIn": "2022-10-22::18:40",
      "ongoing": true,
    }],
  }
```

### [GET] /getStaffsAttendanceHistory

#### Params
**page**: number
**page_size**: number
**date_start**: "YYYY-MM-DD::HH:MM"
**date_end**: "YYYY-MM-DD::HH:MM"
**user_id** ?: number | null

#### Return

```json
  {
    "next_page": 3,
    "previous_page": 1,
    "count": 4222, // user count
    "results": [{
      "user": 42,
      "total": 12.8, // in base 10 NOT in base hour
      "details": [{
        "id": 42,
        "clock_in": "2022-10-22::18:40",
        "clock_out": "2022-10-22::19:40",
      }, ...]
    }, ...],
  }
```

### [GET ou POST ] /exportStaffAttendanceHistory

#### Params

**user_id** ?: number
**date_start**: "YYYY-MM-DD::HH:MM"
**date_end**: "YYYY-MM-DD::HH:MM"


#### Response header

```json
{
  "x-background-task-uuid": 42424
}
```

#### Return

```json
  {
    "link": "toto.csv"
  }
```
