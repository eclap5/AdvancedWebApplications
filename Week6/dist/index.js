"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
const vehicleList = [];
app.get('/hello', (req, res) => {
    res.send('Hello world');
});
app.post('/vehicle/add', (req, res) => {
    try {
        if (req.body.bodyType && req.body.wheelCount) {
            let newCar = req.body;
            vehicleList.push(newCar);
        }
        else if (req.body.draft) {
            let newBoat = req.body;
            vehicleList.push(newBoat);
        }
        else if (req.body.wingspan) {
            let newPlane = req.body;
            vehicleList.push(newPlane);
        }
        else {
            let newVehicle = req.body;
            vehicleList.push(newVehicle);
        }
        console.log(vehicleList);
        res.status(201).send('Vehicle added');
    }
    catch (error) {
        console.log(error);
    }
});
app.get('/vehicle/search/:model', (req, res) => {
    try {
        vehicleList.forEach((vehicle) => {
            if (vehicle.model === req.params.model) {
                return res.send(vehicle);
            }
        });
        return res.status(404).send();
    }
    catch (error) {
        console.log(error);
    }
});
app.listen(port);
