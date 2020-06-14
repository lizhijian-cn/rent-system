import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
const mock = new MockAdapter(axios)

import Mock from 'mockjs'
const Random = Mock.Random

let userId = 1
let roomId = 1
let applyId = 1
let ticketId = 1

const users = [
    {
        id: userId++,
        username: 'tenant',
        password: '000000',
        role: 'ROLE_TENANT',
        email: '13261806700@163.com',
        activated: true,
        name: '菜菜鸡',
        address: '北京市海淀区学院路37号北京航空航天大学学院路校区',
        telephone: '13261806700',
        balance: 1000
    },
    {
        id: userId++,
        username: 'staff',
        password: '000000',
        role: 'ROLE_STAFF',
        email: '13261806700@163.com',
        activated: false,
        name: '强强鸭',
        address: '北京市海淀区学院路37号北京航空航天大学学院路校区',
        telephone: '13261806700',
        balance: 0
    }
]
// 基本价格60
// 0: '独立阳台', 20
// 1: '独卫', 20
// 2: '洗衣机' 20
// 0: 未满
// 1: 已满
// 2: 维修中
const rooms = [
    {
        id: roomId++,
        roomNumber: 101,
        type: 1,
        lived: 0,
        checkList: [0, 1, 2],
        rent: '',
        repaired: false,
        status: ''
    },
    {
        id: roomId++,
        roomNumber: 102,
        type: 1,
        lived: 1,
        checkList: [0],
        rent: '',
        repaired: false,
        status: ''
    },
    {
        id: roomId++,
        roomNumber: 103,
        type: 2,
        lived: 0,
        checkList: [2],
        rent: '',
        repaired: false,
        status: ''
    },
    {
        id: roomId++,
        roomNumber: 104,
        type: 2,
        lived: 1,
        checkList: [0, 2],
        rent: '',
        repaired: false,
        status: ''
    },
    {
        id: roomId++,
        roomNumber: 201,
        type: 4,
        lived: 2,
        checkList: [0, 1, 2],
        rent: '',
        repaired: false,
        status: ''
    },
    {
        id: roomId++,
        roomNumber: 202,
        type: 4,
        lived: 0,
        checkList: [1, 2],
        rent: '',
        repaired: true,
        status: ''
    },
    {
        id: roomId++,
        roomNumber: 203,
        type: 4,
        lived: 3,
        checkList: [0, 1],
        rent: '',
        repaired: false,
        status: ''
    }
]
const handleRoom = room => {
    room.rent = (60 + 20 * room.checkList.length) / room.type
    room.status = room.repaired ? 3 :
                  room.lived < room.type ? 1 : 2
}
rooms.forEach(handleRoom)

// time 天/月
const applies = [
    {
        id: applyId++,
        userId: 1,
        username: '',
        roomId: 3,
        roomNumber: '',
        rentType: 'shortRent',
        startDay: Date.now(),
        time: 5,
        passed: false,
        payed: false,
        cost: ''
    },
    {
        id: applyId++,
        userId: 1,
        username: '',
        roomId: 4,
        roomNumber: '',
        rentType: 'longRent',
        startDay: Date.now(),
        time: 2,
        passed: true,
        payed: false,
        cost: ''
    },
    {
        id: applyId++,
        userId: 1,
        username: '',
        roomId: 6,
        roomNumber: '',
        rentType: 'shortRent',
        startDay: Date.now(),
        time: 2,
        passed: true,
        payed: true,
        cost: ''
    },
    {
        id: applyId++,
        userId: 1,
        username: '',
        roomId: 2,
        roomNumber: '',
        rentType: 'shortRent',
        startDay: Date.now(),
        time: 12,
        passed: false,
        payed: false,
        cost: ''
    }
]

const handleApply = apply => {
    const userIndex = users.findIndex(x => x.id === apply.userId)
    const roomIndex = rooms.findIndex(x => x.id === apply.roomId)
    apply.username = users[userIndex].username
    apply.roomNumber = rooms[roomIndex].roomNumber

    const rent = rooms[roomIndex].rent
    if (apply.rentType === 'shortType') {
        apply.cost = rent * apply.time
    } else {
        apply.cost = rent * apply.time * 15 // 每个月的租金，和短租比减半
    }
}
applies.forEach(handleApply)

const tickets = [
    {
        id: ticketId++,
        userId: 1,
        username: '',
        applyRepaire: true,
        title: '房屋103马桶漏水',
        content: "<p>This is content.</p>\n<div>\n<div>mock.onPost('/ticket/add').reply(config&nbsp;=&gt;&nbsp;{</div>\n<div>&nbsp;&nbsp;&nbsp;&nbsp;const&nbsp;{&nbsp;userId,&nbsp;applyRepaire,&nbsp;title,&nbsp;content&nbsp;}&nbsp;=&nbsp;JSON.parse(config.data)</div>\n<div>&nbsp;&nbsp;&nbsp;&nbsp;const&nbsp;newTicket&nbsp;=&nbsp;{</div>\n<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id:&nbsp;ticketId++,</div>\n<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;userId,</div>\n<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;applyRepaire,</div>\n<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;title,</div>\n<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;content,</div>\n<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;replied:&nbsp;false</div>\n<div>&nbsp;&nbsp;&nbsp;&nbsp;}</div>\n<div>&nbsp;&nbsp;&nbsp;&nbsp;handleTicket(newTicket)</div>\n<div>&nbsp;&nbsp;&nbsp;&nbsp;tickets.push(newTicket)</div>\n<div>&nbsp;&nbsp;&nbsp;&nbsp;return&nbsp;success()</div>\n<div>})</div>\n</div>",
        replied: false,
        reply: ''
    },
    {
        id: ticketId++,
        userId: 1,
        applyRepaire: false,
        title: '房屋102的床太硬了',
        content: "<p>This is content.</p>\n<div>\n<div>mock.onPost('/ticket/add').reply(config&nbsp;=&gt;&nbsp;{</div>\n<div>&nbsp;&nbsp;&nbsp;&nbsp;const&nbsp;{&nbsp;userId,&nbsp;applyRepaire,&nbsp;title,&nbsp;content&nbsp;}&nbsp;=&nbsp;JSON.parse(config.data)</div>\n<div>&nbsp;&nbsp;&nbsp;&nbsp;const&nbsp;newTicket&nbsp;=&nbsp;{</div>\n<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id:&nbsp;ticketId++,</div>\n<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;userId,</div>\n<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;applyRepaire,</div>\n<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;title,</div>\n<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;content,</div>\n<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;replied:&nbsp;false</div>\n<div>&nbsp;&nbsp;&nbsp;&nbsp;}</div>\n<div>&nbsp;&nbsp;&nbsp;&nbsp;handleTicket(newTicket)</div>\n<div>&nbsp;&nbsp;&nbsp;&nbsp;tickets.push(newTicket)</div>\n<div>&nbsp;&nbsp;&nbsp;&nbsp;return&nbsp;success()</div>\n<div>})</div>\n</div>",
        replied: true,
        reply: '感谢您的建议！我们已为该床更换了床垫，感谢您的理解与支持！'
    }
]
const handleTicket = ticket => {
    const userIndex = users.findIndex(x => x.id === ticket.userId)
    ticket.username = users[userIndex].username
}
tickets.forEach(handleTicket)

const error = (message = undefined) => [600, { message }]
const success = (data = {}) => [200, data]

// user api
// username, password
mock.onGet('/user/login').reply(config => {
    const { username, password } = config.params
    const index = users.findIndex(x => x.username === username && x.password === password)
    
    if (index === -1) 
        return error('用户名或密码错误')
    
    return success(users[index])
})

// username, password, role
mock.onPost('/user/register').reply(config => {
    const { username, password, role } = JSON.parse(config.data)
    const index = users.findIndex(x => x.username === username)

    if (index !== -1)
        return error('用户名重复')
    
    users.push({
        id: userId++,
        username,
        password,
        role
    })
    return success()
})
// userId, oldpassword, newpassword
mock.onPost('/user/password/update').reply(config => {
    const { id, oldPassword, password } = JSON.parse(config.data)

    const index = users.findIndex(x => x.id === id && x.password === oldPassword)
    if (index === -1)
        return error('密码错误')
    users[index].password = password
    return success()
})

mock.onPost('/user/balance/update').reply(config => {
    const { id, password, cost } = JSON.parse(config.data)
    const index = users.findIndex(x => x.id === id && x.password === password)
    if (index === -1)
        return error('密码错误')
    const balance = users[index].balance
    users[index].balance = JSON.parse(balance) + JSON.parse(cost)
    return success()
})

mock.onPost('/user/update').reply(config => {
    const { id, email, name, address, telephone } = JSON.parse(config.data)
    const index = users.findIndex(x => x.id === id)
    
    let user = users[index]
    if (user.email !== email) {
        user.email = email
        user.activated = false
    }
    user.name = name
    user.address = address
    user.telephone = telephone
    return success()
})
mock.onGet('/user').reply(config => {
    const { id } = config.params
    
    const index = users.findIndex(x => x.id === id)
    console.log(users[index])
    return success(users[index])
})
mock.onPost('/user/email/active').reply(config => {
    return error('todo')
})

mock.onGet('/user/list').reply(config => {
    const { page = 1, limit = 20, sort } = config.params
    
    const mockList = users
    // const mockList = users.filter(x => x.role === 'ROLE_TENANT')
    const pageList = mockList.filter((x, index) => index < limit * page && index >= limit * (page - 1))

    return success({
        total: mockList.length,
        items: pageList
    })
})

// room api
mock.onPost('/room/add').reply(config => {
    const { roomNumber, type, checkList } = JSON.parse(config.data)
    const index = rooms.findIndex(x => x.roomNumber === roomNumber)

    if (index !== -1)
        return error('房间号重复')

    const newRoom = {
        id: roomId++,
        roomNumber,
        type,
        checkList,
        lived: 0,
        repaired: false
    }
    handleRoom(newRoom)
    rooms.push(newRoom)
    return success()
})

mock.onPost('/room/update').reply(config => {
    const { id, type, lived, checkList, repaired } = JSON.parse(config.data)
    
    const roomIndex = rooms.findIndex(x => x.id === id)
    const room = rooms[roomIndex]
    room.type = type
    room.lived = lived
    room.checkList = checkList
    room.repaired = repaired
    handleRoom(room)
    return success()
})

mock.onPost('/room/remove').reply(config => {
    return error('不需要删除功能')
})

mock.onGet('/room/list').reply(config => {
    const { type, status, checkList, minRent, maxRent, page = 1, limit = 20, sort } = config.params
    console.log(rooms)
    const mockList = rooms.filter(x => {
        if (type && x.type !== +type) return false
        if (checkList && !checkList.every(v => x.checkList.includes(v))) return false
        if (status && x.status !== status) return false
        if (minRent && x.rent < minRent) return false
        if (maxRent && x.rent > maxRent) return false
        return true        
    })
    const pageList = mockList.filter((x, index) => index < limit * page && index >= limit * (page - 1))

    return success({
        total: mockList.length,
        items: pageList
    })
})

mock.onPost('/apply/add').reply(config => {
    const { userId, username, roomId, rentType, startDay, time } = JSON.parse(config.data)
    if (!userId) { // 客服
        const userIndex = users.findIndex(x => x.username === username)
        if (userIndex === -1)
            return error('该用户不存在')
        if (users[userIndex].role !== 'ROLE_TENANT')
            return error('该用户的身份不是租户')
        userId = users[userIndex].id
    }
    const dupIndex = applies.findIndex(x => x.userId === userId && x.roomId === roomId)
    if (dupIndex !== -1) 
        return error('不允许重复租房')

    const roomIndex = rooms.findIndex(x => x.id === roomId)
    const room = rooms[roomIndex]
    if (room.status === 3)
        return error('该房屋正在维修中，无法出租')
    if (room.status === 2) 
        return error('该房间已满')
    room.lived++
    handleRoom(room)
    const newApply = {
        id: applyId++,
        userId,
        roomId,
        rentType,
        startDay,
        time,
        passed: false,
        payed: false
    }
    handleApply(newApply)
    applies.push(newApply)
    return success()
})
mock.onPost('/apply/pass').reply(config => {
    const { id } = JSON.parse(config.data)
    const index = applies.findIndex(x => x.id === id)
    applies[index].passed = true
    return success()
})
mock.onPost('/apply/pay').reply(config => {
    const { id, userId, cost } = JSON.parse(config.data)
    const applyIndex = applies.findIndex(x => x.id === id)
    const userIndex = users.findIndex(x => x.id === userId)
    const user = users[userIndex]
    if (user.balance < cost) 
        return error('余额不足，请到个人中心充值')
    user.balance -= cost
    applies[applyIndex].payed = true
    return success()
})

mock.onGet('/apply/list').reply(config => {
    const { userId, username, roomNumber, rentType, passed, payed, page = 1, limit = 20, sort } = config.params
    const mockList = applies.filter(x => {
        if (username && x.username !== username) return false
        if (userId && x.userId !== userId) return false
        if (roomNumber && x.roomNumber !== roomNumber) return false
        if (rentType && x.rentType === rentType) return false
        if (passed && x.passed === passed) return false
        if (payed && x.payed === payed) return false
        return true        
    })
    const pageList = mockList.filter((x, index) => index < limit * page && index >= limit * (page - 1))

    return success({
        total: mockList.length,
        items: pageList
    })
})

mock.onPost('/ticket/add').reply(config => {
    const { userId, applyRepaire, title, content } = JSON.parse(config.data)
    const newTicket = {
        id: ticketId++,
        userId,
        applyRepaire,
        title,
        content,
        replied: false
    }
    handleTicket(newTicket)
    tickets.push(newTicket)
    return success()
})
mock.onGet('/ticket').reply(config => {
    const { id } = config.params
    const index = tickets.findIndex(x => x.id === id)
    return success(tickets[index])
})
mock.onPost('/ticket/reply/add').reply(config => {
    const { ticketId, reply } = JSON.parse(config.data)
    const index = tickets.findIndex(x => x.id === ticketId)
    const ticket = tickets[index]
    ticket.replied = true
    ticket.reply = reply
    return success()
})

mock.onGet('/ticket/list').reply(config => {
    const { page = 1, limit = 20, sort } = config.params
    const mockList = tickets
    const pageList = mockList.filter((x, index) => index < limit * page && index >= limit * (page - 1))

    return success({
        total: mockList.length,
        items: pageList
    })
})