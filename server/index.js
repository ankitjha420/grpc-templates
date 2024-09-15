const grpc = require('@grpc/grpc-js')
const greets = require('../server/proto/greet_pb')
const service = require('../server/proto/greet_grpc_pb')
// const calculation = require('../server/proto/calculator_pb')
// const calculationService = require('../server/proto/calculator_grpc_pb')

/**
* Implements the Greet RPC method
*/
function greet (call, callback) {
    const greeting = new greets.GreetResponse()
    greeting.setResult(
        'Hello, ' + call.request.getGreeting().getFirstName() + ' ' + call.request.getGreeting().getLastName()
    )
    callback(null, greeting)
}

/**
* Implements the GreetManyTimes RPC method
*/
function greetManyTimes(call, callback) {
    const firstName = call.request.getGreetmanytimes().getFirstName()
    const lastName = call.request.getGreetmanytimes().getLastName()
    const name = firstName + ' ' + lastName

    let count = 0

    function sendResponse() {
        if (count >= 10) {
            call.end()
            return
        }

        const greetManyTimesResponse = new greets.GreetManyTimesResponse()
        greetManyTimesResponse.setResult(`Hello, ${name} - ${count + 1}`)

        call.write(greetManyTimesResponse)
        count++

        // Schedule the next response
        setTimeout(sendResponse, 1000)
    }

    // Start sending responses
    sendResponse()
}

/**
* Implements the Calculate RPC method
*/
function calculate(call, callback) {
    const calculation = new calculator.CalculationResponse()
    const operator = call.request.getOperator()
    let result = 0
    if (operator === '+') {
        result = call.request.getA() + call.request.getB()
    }
    else if (operator === '-') {
        result = call.request.getA() - call.request.getB()
    }
    else if (operator === '*') {
        result = call.request.getA() * call.request.getB()
    }
    else {
        result = call.request.getA() / call.request.getB()
    }
    calculation.setResult(result)
    callback(null, calculation)
}

function longGreet(call, callback) {
    call.on('data', (request) => {
        const fullName = request.getGreet().getFirstName() + ' ' + request.getGreet().getLastName()
        console.log('hello', fullName)
    })
    call.on('error', error => {
        console.log(error)
    })
    call.on('end', () => {
        console.log('Client streaming ended')
        const response = new greets.LongGreetResponse()
        response.setResult('Long greet client streaming...')
        callback(null, response)
    })
}

function main() {
    const server = new grpc.Server()
    // server.addService(service.GreetServiceService, {greet: greet})
    server.addService(service.GreetServiceService, {
        greet: greet,
        greetManyTimes: greetManyTimes,
        longGreet: longGreet
    })
    server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), () => {
        server.start()
        console.log("server is running")
    })
}

main()