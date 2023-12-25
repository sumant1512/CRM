const getwallet = async (req, res) => {
  console.log(req);
  // try {
  //   const products = await Product.find({});
  //   res.json(products);
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ message: "Server Error" });
  // }
};

const addwallet = async (req, res) => {
  console.log(req.params);
  // try {
  //   const product = await Product.findById(req.params.id);

  //   res.json(product);
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ message: "Server Error" });
  // }
};

const updatewallet = async (req, res) => {
  console.log(req);
  // try {
  //   const products = await Product.find({});
  //   res.json(products);
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ message: "Server Error" });
  // }
};

const getwalletById = async (req, res) => {
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
  getwallet,
  addwallet,
  updatewallet,
  getwalletById,
};
