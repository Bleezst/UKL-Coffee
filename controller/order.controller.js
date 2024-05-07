const { coffe, order_detail, order_list } = require(`../models/index`);
const { Op } = require(`sequelize`);

exports.findAll = async (req, res) => {
    try {
      let orders = await order_list.findAll({
        include: [{
          model: order_detail,
          as: 'listCoffe',
          include:[coffe]
        }]
      });
      return res.json({
        success: true,
        data: orders,
        message: 'Order list has been retrieved along with order details'
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

exports.addOrder = async (req, res) => {
  try {
    const { customer_name, order_type, order_date, order_Detail } = req.body;

    // Buat entri OrderList baru
    const orderList = await order_list.create({
      customer_name,
      order_type,
      order_date,
    });

    // Iterasi melalui setiap detail pesanan dan buat entri OrderDetail
    for (const item of order_Detail) {
      const { coffee_id, price, quantity } = item;
      await order_detail.create({
        orderID: orderList.orderID,
        coffeID: coffee_id,
        price,
        quantity,
      });
    }

    res.status(201).json({
      data: {
        id: orderList.orderID,
        customer_name,
        order_type,
        order_date,
      },
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};