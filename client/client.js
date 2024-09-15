const grpc = require('@grpc/grpc-js')
const greets = require('../server/proto/greet_pb')
const service = require('../server/proto/greet_grpc_pb')

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

function callGreetManyTimes() {
    const client = new service.GreetServiceClient(
        'localhost:50051',
        grpc.credentials.createInsecure())
    const request = new greets.GreetManyTimesRequest()
    const greet = new greets.Greeting()
    greet.setFirstName("Ankit")
    greet.setLastName("Jha")
    request.setGreetmanytimes(greet)

    const call = client.greetManyTimes(request, (err, response) => {

    })

    call.on('data', (response) => {
        console.log('Client Streaming Response: ', response.getResult())
    })
    call.on('status', (status) => {
        console.log(status)
    })
    call.on('error', (error) => {
        console.log(error)
    })
    call.on('end', () => {
        console.log('Streaming ended')
    })
}
function main() {
    callGreetManyTimes()
}
main()
// greetMain()