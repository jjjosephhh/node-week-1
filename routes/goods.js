const express = require('express');
const Goods = require('../schemas/good');
const Carts = require('../schemas/cart');
const router = express.Router();

// /routes/good.js
const goods = [
  {
    goodsId: 4,
    name: "product 4",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/02/11/frogs-1650657_1280.jpg",
    category: "drink",
    price: 0.1,
  },
  {
    goodsId: 3,
    name: "product 3",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/02/12/frogs-1650658_1280.jpg",
    category: "drink",
    price: 2.2,
  },
  {
    goodsId: 2,
    name: "product 2",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2014/08/26/19/19/wine-428316_1280.jpg",
    category: "drink",
    price: 0.11,
  },
  {
    goodsId: 1,
    name: "product 1",
    thumbnailUrl:
      "https://cdn.pixabay.com/photo/2016/09/07/19/54/wines-1652455_1280.jpg",
    category: "drink",
    price: 6.2,
  },
];

router.get('/', (req, res) => {
  res.send('This is the home page');
});


router.get('/goods', (req, res) => {
  res.json({ goods });
});

router.get('/goods/carts', async (req, res) => {
    const carts = await Carts.find({});
    const goodsIds = carts.map(cart => cart.goodsId);
    const goods = await Goods.find({goodsId: goodsIds})
    const results = carts.map(cart => {
        return {
            quantity: cart.quantity,
            goods: goods.find(good => good.goodsId === cart.goodsId),
        };
    });
    console.log('i am here')
    res.json({
        carts: results,
    });
});

router.get('/goods/:goodsId', (req, res) => {
  const {goodsId} = req.params;
  const [detail] = goods.filter(good => good.goodsId === +goodsId)
  res.json({detail});
});

router.get('/about', (req, res) => {
    res.send('This is the about page');
});

router.post('/goods', async (req, res) => {
  const {goodsId, name, thumbnailUrl, category, price} = req.body;
  const goods = await Goods.find({goodsId});
  if (goods.length > 0) {
    return res.status(400).json({
      success: false,
      errorMessage: 'The document already exists',
    });
  }
  const createdGoods = await Goods.create({
    goodsId,
    name,
    thumbnailUrl,
    category,
    price,
  });
  return res.json({
    goods: createdGoods,
  });
});

router.post('/goods/:goodsId/cart', async (req, res) => {
  const {goodsId} = req.params;
  const {quantity} = req.body;
  const carts = await Carts.find({goodsId: +goodsId});
  if (carts.length) {
    return res.status(400).json({
      success: false,
      errorMessage: 'You already have a cart item with that goods id',
    });
  }
  await Carts.create({
    goodsId: +goodsId, 
    quantity,
  });

  res.json({
    result: 'success',
  });
});

router.put('/goods/:goodsId/cart', async (req, res) => {
  const {goodsId} = req.params;
  const {quantity} = req.body;

  if (quantity < 1) {
    res.status(400).json({
      success: false,
      errorMessage: 'Quantity must be at least 1',
    });
    return;
  }

  const carts = await Carts.find({goodsId: +goodsId});
  if (carts.length) {
    await Carts.updateOne(
      {goodsId: +goodsId},
      { $set: { quantity }},
    );
  }
  res.json({
    result: 'success',
    success: true,
  });
});

router.delete('/goods/:goodsId/cart', async (req, res) => {
  const {goodsId} = req.params;
  const carts = await Carts.find({goodsId: +goodsId});
  if (carts.length) {
    await Carts.deleteOne({goodsId: +goodsId});
  }
  res.json({
    result: 'success',
    success: true,
  });
});


module.exports = router;