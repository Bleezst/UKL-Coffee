const { coffee } = require(`../models/index`);
const { Op } = require(`sequelize`);
const path = require(`path`);
const fs = require(`fs`);
const upload = require(`./uploud.image`).single(`image`);

exports.getAll = async (req, res) => {
  let cars = await coffee.findAll();
  return res.json({
    success: true,
    data: cars,
    message: `All coffe have been loaded`,
  });
};

exports.findCoffee = async (req, res) => {
  let keyword = req.params.key;
  let cars = await coffee.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.substring]: keyword } },
        { coffeID: { [Op.substring]: keyword } }
      ],
    },
  });
  return res.json({
    success: true,
    data: cars,
    message: `All coffee have been loaded`,
  });
};

exports.addCoffee = (request, response) => {
  upload(request, response, async (error) => {
    if (error) {
      return response.json({ message: error });
    }
    if (!request.file) {
      return response.json({
        message: `Nothing to Upload`,
      });
    }
    let newEvent = {
      name: request.body.name,
      price: request.body.price,
      size: request.body.size,
      image: request.file.filename,
    };
    coffee.create(newEvent)
      .then((result) => {
        return response.json({
          success: true,
          data: result,
          message: `New coffee has been inserted`,
        });
      })
      .catch((error) => {
        return response.json({
          success: false,
          message: error.message,
        });
      });
  });
};

exports.updateCoffee = async (request, response) => {
  upload(request, response, async (error) => {
    if (error) {
      return response.json({ message: error });
    }
    let carID = request.params.id;
    let dataEvent = {
        name: request.body.name,
        price: request.body.price,
        size: request.body.size,
        image: request.file.filename,
    };
    if (request.file) {
      const selectedEvent = await coffee.findOne({
        where: { coffeeID: carID },
      });
      const oldImage = selectedEvent.image;
      const pathImage = path.join(__dirname, `../image`, oldImage);
      if (fs.existsSync(pathImage)) {
        fs.unlink(pathImage, (error) => console.log(error));
      }
      dataEvent.image = request.file.filename;
    }
    coffee
      .update(dataEvent, { where: { coffeeID: carID } })
      .then((result) => {
        return response.json({
          success: true,
          message: `Data coffee has been updated`,
        });
      })
      .catch((error) => {
        return response.json({
          success: false,
          message: error.message,
        });
      });
  });
};

exports.deleteCoffee = async (request, response) => {
    const coffeeID = request.params.id;
    try {
      const foundCoffee = await coffee.findOne({ where: { coffeeID: coffeeID } }); // Menggunakan nama variabel yang berbeda
      const oldImage = foundCoffee.image;
      const pathImage = path.join(__dirname, `../image`, oldImage);
      if (fs.existsSync(pathImage)) {
        fs.unlink(pathImage, (error) => {
          if (error) {
            console.log(error);
          }
        });
      }
      await coffee.destroy({ where: { coffeeID: coffeeID } }); // Menggunakan model coffee, bukan variabel yang digunakan sebelumnya
      return response.json({
        success: true,
        message: `Data coffee has been deleted`,
      });
    } catch (error) {
      return response.json({
        success: false,
        message: error.message,
      });
    }
  };
  