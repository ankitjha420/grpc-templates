const grpc = require('@grpc/grpc-js')
const greets = require('../server/proto/greet_pb')
const service = require('../server/proto/greet_grpc_pb')
const calculation = require('../server/proto/calculator_pb')
const calculationService = require('../server/proto/calculator_grpc_pb')

/*
    Implements the Greet RPC method
*/
function greet (call, callback) {
    const greeting = new greets.GreetResponse()
    greeting.setResult(
        'Hello, ' + call.request.getGreeting().getFirstName() + ' ' + call.request.getGreeting().getLastName()
    )
    callback(null, greeting)
}

/*
    Implements the Calculate RPC method
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

function main() {
    const server = new grpc.Server()
    // server.addService(service.GreetServiceService, {greet: greet})
    server.addService(calculationService.CalculationServiceService, {calculation: calculation})
    server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), () => {
        server.start()
        console.log("server is running")
    })
}

main()