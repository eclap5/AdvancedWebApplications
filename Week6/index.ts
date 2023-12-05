import express, { Express, Request, Response } from "express"

const app: Express = express()
const port: number = 3000

app.use(express.json())

interface Vehicle {
    model: string
    color: string
    year: number
    power: number
}

interface Car extends Vehicle {
    bodyType: string
    wheelCount: number
}

interface Boat extends Vehicle {
    draft: number   
}

interface Plane extends Vehicle {
    wingspan: number
}

const vehicleList: Vehicle[] = []

app.get('/hello', (req: Request, res: Response) => {
    res.send('Hello world')
})

app.post('/vehicle/add', (req: Request, res: Response) => {
    try {
        if (req.body.bodyType && req.body.wheelCount) {
            let newCar: Car = req.body
            vehicleList.push(newCar)    
        }
        else if (req.body.draft) {
            let newBoat: Boat = req.body
            vehicleList.push(newBoat)
        }
        else if (req.body.wingspan) {
            let newPlane: Plane = req.body
            vehicleList.push(newPlane)
        }
        else {
            let newVehicle: Vehicle = req.body
            vehicleList.push(newVehicle)
        }
        console.log(vehicleList)
        res.status(201).send('Vehicle added')
    } catch (error) {
        console.log(error)
    }
})

app.get('/vehicle/search/:model', (req: Request, res: Response) => {
    try {
        vehicleList.forEach((vehicle: Vehicle) => {
            if (vehicle.model === req.params.model) {
                return res.send(vehicle)
            }
        })
        return res.status(404).send()
    } catch (error) {
        console.log(error)
    }
})

app.listen(port)
