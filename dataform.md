data form for each kind of data transformed:

``
event: {
    name: xxxx,
    location: {
        lo: 1,
        la: 2
    },
    date: 2019-01-01
}
``

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
    ename: xxxxx
}
``

``
chat: {
    uid: xxxx,
    msg: xxxx
}
``

socket event definition:
* 'put story': upload a story
* 'put event': upload an event
* 'get story by id': given a user id, get all his stories
* 'get story randomly': randomly get some stories
* 'get events': get all events
* 'get events by id': given a user id, get all events he's uploaded
* 'get events by location': given a location, get all events around it