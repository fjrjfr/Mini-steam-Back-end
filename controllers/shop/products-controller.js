const Product = require("../../models/Product");
const getFilteredProducts = async (req, res) => {
  try {
    const {
      category = [],
      genre = [],
      platform = [],
      ageRating = [],
      isMultiplayer = [],
      sortBy = "price-lowtohigh",
    } = req.query;

    let filters = {};

    if (category.length) {
      const categoryArray = category.split(",");
      filters.category = { $in: categoryArray };
      console.log("📌 Category filter:", filters.category);
    }

    if (genre.length) {
      const genreArray = genre.split(",");
      filters.genre = { $in: genreArray };
      console.log("📌 Genre filter:", filters.genre);
    }

    if (platform.length) {
      const platformArray = platform.split(",");
      filters.platform = { $in: platformArray };
      console.log("📌 Platform filter:", filters.platform);
    }

    if (ageRating.length) {
      const ageRatingArray = ageRating.split(",");
      filters.ageRating = { $in: ageRatingArray };
      console.log("📌 AgeRating filter:", filters.ageRating);
    }

    if (isMultiplayer.length) {
      const multiplayerValue = isMultiplayer === "true" ? true : false;
      filters.isMultiplayer = multiplayerValue;
      console.log("📌 Multiplayer filter:", filters.isMultiplayer);
    }

    let sort = {};

    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      default:
        sort.price = 1;
        break;
    }

    console.log("📌 Final filters:", filters);
    console.log("📌 Sort:", sort);

    const products = await Product.find(filters).sort(sort);

    console.log(`📌 Found ${products.length} products`);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (e) {
    console.log("❌ Error in getFilteredProducts:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (e) {
    console.log("❌ Error in getProductDetails:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

module.exports = { getFilteredProducts, getProductDetails };
