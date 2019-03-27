data form for each kind of data transformed:

``
story: {
    uid: xxxx,
    text: null,
    imgs: {
        i1: fdsfsdfasfas,
        i2: fsfsdfasdf,
        i3: fdfaf
    },
    datetime: 2010-09-09 12:00:00,
    location: {
        lo: 1,
        la: 2
    },
    ename: xxxxx,
    newevent: true
}
``

`newevent` is a boolean variable, indicating if this event name is a new one
If this field is true, the `location` must not be empty, and will be the location
for this event

``
chat: {
    uid: xxxx,
    msg: xxxx
}
``

``
resp_status: {
    err: xxxxx,
    code: 1
}
``

socket event definition:
* 'put story': upload a story (together with an event info if there is a new one)
    * data uploaded: `story` defined above
    * data downloaded: `resp_status`
* 'get story by user': given a user id, get all his stories
    * data uploaded: a pure user name (unique)
    * data downloaded: one json string that contains multiple `story` field
* 'get story randomly': randomly get one story
    * data uploaded: doesn't matter, maybe a "*"
    * data downloaded: one json string contains one `story`
* 'get all events': get all events
    * data uploaded: doesn't matter, maybe a "*"
    * data downloaded: one json string that contains an array of event names,
        e.g. '["xx1", "xx2"]'
* 'get events by location': given a location, get all events around it
    * data uploaded: one json string contains two element la and lo, e.g. 
        '{"la": 100.11, "lo": 22.22}'
    * data downloaded: same as the above
* 'chat': chat in one single chat room