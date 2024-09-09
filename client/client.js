const grpc = require('@grpc/grpc-js')
const greets = require('../server/proto/greet_pb')
const service = require('../server/proto/greet_grpc_pb')
const calculate = require('../server/proto/calculator_pb')
const calculateService = require('../server/proto/calculator_grpc_pb')

function greetMain() {
    const client = new service.GreetServiceClient(
        'localhost:50051',
        grpc.credentials.createInsecure())

    const request = new greets.GreetRequest()
    const greet = new greets.Greeting()
    greet.setFirstName("Ankit")
    greet.setLastName("Jha")
    request.setGreeting(greet)

    client.greet(request, (err, response) => {
        if (err) {
            console.error(err)
        }
        else {
            console.log("Greeting response: " + response.getResult())
        }
    })
}

function calculateMain() {
    const client = new calculateService.CalculationServiceClient(
        'localhost:50051',
        grpc.credentials.createInsecure())

    const request = new calculate.CalculationRequest()
    const calculation = new calculate.Calculation()
    calculation.setA(10)
    calculation.setB(20)
    request.setCalculation(calculation)

    client.calculation(request, (err, response) => {
        if (err) {
            console.error(err)
        }
        else {
            console.log("Calculation response: " + response.getResult())
        }
    })
}

// greetMain()
calculateMain()