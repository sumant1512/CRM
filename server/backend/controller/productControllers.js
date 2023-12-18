const getProducts = async (req, res) => {
  console.log(req);
  // try {
  //   const products = await Product.find({});
  //   res.json(products);
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ message: "Server Error" });
  // }
};

const getProductById = async (req, res) => {
  console.log(req.params);
  // try {
  //   const product = await Product.findById(req.params.id);

  //   res.json(product);
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ message: "Server Error" });
  // }
};

module.exports = {
  getProducts,
  getProductById,
};
