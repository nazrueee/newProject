let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET , POST , OPTIONS ,  PUT , PATCH, DELETE, HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
const port = 2410;
app.listen(port, () => console.log(`Listening on port ${port} !`));
let { carsData } = require("./carsData");
let {carMasterData}=require("./carsData");

app.get("/cars", function (req, res) {
  let minprice = req.query.minprice;
  let maxprice = req.query.maxprice;
  let fuel = req.query.fuel;
  let type = req.query.type;
  let sort = req.query.sort;
  let carsArr = carsData;
  if (minprice) {
    carsArr = carsArr.filter(car=>car.price >= minprice);
  }
  if (maxprice) {
    carsArr = carsArr.filter(car=>car.price <= maxprice);
  }
  if (fuel) {
    carsArr = carsArr.filter(car => carMasterData.find(master => master.model === car.model).fuel === fuel);
  }
  if (type) {
    carsArr = carsArr.filter(car => carMasterData.find(master => master.model === car.model).type === type);
  }
  if(sort=='id')
  carsArr.sort((c1,c2)=>c1.id.localeCompare(c2.id))
  if(sort=='model')
  carsArr.sort((c1,c2)=>c1.model.localeCompare(c2.model))
  if(sort=='price')
  carsArr.sort((c1,c2)=>c1.price-c2.price)
  if(sort=='year')
  carsArr.sort((c1,c2)=>c1.year-c2.year)
  if(sort=='kms')
  carsArr.sort((c1,c2)=>c1.kms-c2.kms)

  res.send(carsArr);
});

app.get("/cars/:id", function (req, res) {
  let id = req.params.id;
  let car = carsData.find((cu) => cu.id === id);
  if (car) res.send(car);
  else res.status(404).send("Not Car Found");

});
app.post("/cars", function (req, res) {
    const newCar = req.body;
    const existingCar = carsData.find(
      (car) => car.id === newCar.id
    );
    if (existingCar) {
      return res.status(409).send("Car already exists.");
    }
    carsData.push(newCar);
    res.send(newCar);
  });

app.put("/car/:id", function (req, res) {
    let id = req.params.id;
    let body = req.body;
    let index = carsData.findIndex((c1) => c1.id === id);
    if (index >= 0) {
      let updatedCar = { id: id, ...body };
      carsData[index] = updatedCar;
      res.send(updatedCar);
    } else res.status(404).send("No Car found");
  });
app.delete("/car/:id", function (req, res) {
    let id = req.params.id;
    let index = carsData.findIndex((c1) => c1.id === id);
    if (index >= 0) {
      let deletedCar = carsData.splice(index, 1);
      res.send(deletedCar);
    } 
    else res.status(404).send("No Customer found");
  });
  

  app.get("/carmaster", function (req, res){
    res.send(carMasterData)
  })