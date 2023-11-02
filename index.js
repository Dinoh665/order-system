const express = require('express')
const app = express()
const port = 3000
const uuid = require('uuid')
app.use(express.json())

const orders = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params
    const index = orders.findIndex( order => order.id === id)

    if(index < 0){
        return response.status(404).json({error: "order not found"})
    }

    request.orderIndex = index
    request.orderId = id
    
    next()
}

const showMethod = (request, response, next) => {
    const url = request.url
    const method = request.method

    console.log(method)
    console.log(url)

    next()
}

app.get('/order', showMethod, (request, response) => {
    return response.json(orders)
})

app.post('/order', showMethod, (request, response) => {
    
    const { order, name, price } = request.body
    const status = "Em prepraração"

    const newOrder = { id: uuid.v4(), order, name, price, status }

    orders.push(newOrder)

    return response.status(201).json(newOrder)

})

app.put('/order/:id', checkOrderId , showMethod, (request, response) => {

    const {order, name, price, status} = request.body
    const id = request.orderId
    const index = request.orderIndex

    const updateOrder = {id, order, name, price, status}

    orders[index] = updateOrder

    return response.json(updateOrder)

})

app.delete('/order/:id', checkOrderId, showMethod,  (request, response) => {

    const index = request.orderIndex
    orders.splice(index, 1)

    return response.status(204).json()
})

app.get('/order/:id', checkOrderId, showMethod, (request, response) => {

    const index = request.orderIndex

    const showOrder = orders[index]

    return response.json(showOrder)
})

app.patch('/order/:id', checkOrderId, showMethod,  (request, response) => {
    const id = request.orderId;
    const index = request.orderIndex;
    const status = "Pronto";

    orders[index].status = status;

    return response.json(orders[index]);
});




app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`)
})