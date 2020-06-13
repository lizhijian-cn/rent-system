import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Mock from 'mockjs'

const mock = new MockAdapter(axios)
const Random = Mock.Random
const data = Mock.mock({
    'user': [{
        'id': '0',
        'username': 'zhijian',
        'password': '123456',
        'role': 'ROLE_TENANT',
        'email': '13261806700@163.com',
        'activated': true,
        'name': '菜菜鸡',
        'address': '这是一串地址',
        'telephone': '13261806700',
        'balance': 1000
    }, {
        'id': '1',
        'username': 'staff',
        'password': '123456',
        'role': 'ROLE_STAFF',       
    }],
    'room|5': [{
        id: '@increment()',
        roomNumber: '@increment(100)',
        'type|1': [1, 2, 4],
        'lived': 0,
        rent: '@integer(30, 100)',
        'checkList': [],
        'status': 0,
        repaired: '@boolean()'
    }],
    'apply|5': [{
        'id': '',
        'userId': '',
        'roomid': '',
        'username': 'zhijian',
        'roomNumber': '@integer(100, 400)',
        'rentType|1': ['shortRent', 'longRent'],
        startDay: '@date()',
        time: '@integer(1, 5)',
        livedTime: '',
        passed: '@boolean()',
        payed: '@boolean()', 
        cost: '@integer(500, 2000)',// 短租：总，长租：每月租金
    }],
    'ticket': []
})

mock.onPost('/account/login').reply(config => {
    const body = JSON.parse(config.data)
    const index = data.user.findIndex(v => v.username === body.username && v.password === body.password)
    
    if (index != -1) return [200, data.user[index]]
    else return [600, { msg: '用户名或密码错误' }]
})
mock.onGet('/user').reply(config => {
    const params = config.params
    return [200, data.user[params.id]]
})

const computeStatus = item => {
    item.status = item.repaired ? 2 :
                  item.lived < item.type ? 0 : 1    
}

data.room.forEach(item => {
    item.id--
    item.checkList = [0, 1]
    item.lived = Math.floor(item.type / 2)
    computeStatus(item)
})

mock.onGet('/room/list').reply(config => {
    const { type, status, checkList, page = 1, limit = 20, sort } = config.params

    let mockList = data.room.filter(item => {
        if (type && item.type !== +type) return false
        if (checkList && !checkList.every(v => item.checkList.includes(v))) return false
        if (status && item.status !== status) return false
        return true
    })
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return [200, { total: mockList.length, items: pageList }]
})

mock.onPost('/room/update').reply(config => {
    const query = JSON.parse(config.data)
    computeStatus(query)
    const index = data.room.findIndex(v => v.id === query.id)
    data.room[index] = query

    return [200, {}]
})
mock.onPost('/room/add').reply(config => {
    const query = JSON.parse(config.data)
    computeStatus(query)
    query.id = Random.increment()
    data.room.push(query)
    return [200, {}]
})
mock.onPost('/room/remove').reply(config => {
    const query = JSON.parse(config.data)
    const index = data.room.findIndex(v => v.id === query.id)
    data.room.splice(index, 1)
    return [200, {}]
})

mock.onGet('/apply/list').reply(config => {
    return [200, {
        items: data.apply,
        total: data.apply.length
    }]
})
mock.onPost('/ticket/add').reply(config => {
    const query = JSON.parse(config.data)
    query.id = Random.increment()
    const index = data.user.findIndex(v => v.id === query.userId)
    query.username = data.user[index].username
    query.replied = false
    query.reply = ''
    data.ticket.push(query)
    return [200, {}]
})

mock.onGet('/ticket/list').reply(config => {
    return [200, {
        items: data.ticket,
        total: data.ticket.length
    }]
})

mock.onGet('/ticket/details').reply(config => {
    const params = config.params
    console.log(params)
    const index = data.ticket.findIndex(v => v.id === params.id)
    console.log(data.ticket[index])
    return [200, data.ticket[index]]
})