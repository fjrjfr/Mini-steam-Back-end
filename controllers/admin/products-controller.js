const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");


const handleImageUpload = async (req, res) => {
  try {
    console.log("File received:", req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    console.log("Cloudinary result:", result);

    res.json({
      success: true,
      result: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    });
  } catch (error) {
    console.log("Error in handleImageUpload:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading image to Cloudinary",
    });
  }
};


const addProduct = async (req, res) => {
  try {
    console.log("Received data in backend:", req.body);

    const {
      image,
      title,
      description,
      trailerUrl, 
      category,
      platform,
      genre,
      ageRating,
      publisher,
      releaseDate,
      price,
      salePrice,
      totalStock,
      isMultiplayer,
      inTheBox,
      systemRequirements,
    } = req.body;

    
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, description, category",
      });
    }

    
    if (price === undefined || price === null || price === "") {
      return res.status(400).json({
        success: false,
        message: "Price is required",
      });
    }

    
    if (totalStock === undefined || totalStock === null || totalStock === "") {
      return res.status(400).json({
        success: false,
        message: "Total stock is required",
      });
    }

    
    let platformArray = platform;
    if (typeof platform === "string") {
      try {
        platformArray = JSON.parse(platform);
      } catch {
        platformArray = platform.split(",").map((p) => p.trim());
      }
    }

    
    let genreArray = genre;
    if (typeof genre === "string") {
      try {
        genreArray = JSON.parse(genre);
      } catch {
        genreArray = genre.split(",").map((g) => g.trim());
      }
    }

    
    let inTheBoxArray = inTheBox;
    if (typeof inTheBox === "string") {
      inTheBoxArray = inTheBox.split(",").map((item) => item.trim());
    }

    
    let systemRequirementsObj = systemRequirements;
    if (typeof systemRequirements === "string") {
      try {
        systemRequirementsObj = JSON.parse(systemRequirements);
      } catch {
        systemRequirementsObj = {};
      }
    }

    const newlyCreatedProduct = new Product({
      image: image || "",
      title,
      description,
      trailerUrl: trailerUrl || "",  
      category,
      platform: platformArray || [],
      genre: genreArray || [],
      ageRating: ageRating || "",
      publisher: publisher || "",
      releaseDate: releaseDate || null,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : 0,
      totalStock: Number(totalStock),
      isMultiplayer: isMultiplayer === "true" || isMultiplayer === true,
      inTheBox: inTheBoxArray || [],
      systemRequirements: systemRequirementsObj || {},
      averageReview: 0,
    });

    await newlyCreatedProduct.save();

    console.log("Product saved successfully:", newlyCreatedProduct);

    res.status(201).json({
      success: true,
      message:
        price == 0 ? "Free game added successfully" : "Game added successfully",
      data: newlyCreatedProduct,
    });
  } catch (e) {
    console.log("Error in addProduct:", e);
    res.status(500).json({
      success: false,
      message: e.message || "Error occurred while adding game",
    });
  }
};


const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({});
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (e) {
    console.log("Error in fetchAllProducts:", e);
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching games",
    });
  }
};


const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      trailerUrl, 
      category,
      platform,
      genre,
      ageRating,
      publisher,
      releaseDate,
      price,
      salePrice,
      totalStock,
      isMultiplayer,
      inTheBox,
      systemRequirements,
    } = req.body;

    
    let findProduct = await Product.findById(id);
    if (!findProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    
    let platformArray = platform;
    if (typeof platform === "string") {
      try {
        platformArray = JSON.parse(platform);
      } catch {
        platformArray = platform.split(",").map((p) => p.trim());
      }
    }

  
    let genreArray = genre;
    if (typeof genre === "string") {
      try {
        genreArray = JSON.parse(genre);
      } catch {
        genreArray = genre.split(",").map((g) => g.trim());
      }
    }

    let inTheBoxArray = inTheBox;
    if (typeof inTheBox === "string") {
      inTheBoxArray = inTheBox.split(",").map((item) => item.trim());
    }

    let systemRequirementsObj = systemRequirements;
    if (typeof systemRequirements === "string") {
      try {
        systemRequirementsObj = JSON.parse(systemRequirements);
      } catch {
        systemRequirementsObj = {};
      }
    }


    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.trailerUrl = trailerUrl || findProduct.trailerUrl; // 👈 أضف هذا
    findProduct.category = category || findProduct.category;
    findProduct.platform = platformArray || findProduct.platform;
    findProduct.genre = genreArray || findProduct.genre;
    findProduct.ageRating = ageRating || findProduct.ageRating;
    findProduct.publisher = publisher || findProduct.publisher;
    findProduct.releaseDate = releaseDate || findProduct.releaseDate;
    findProduct.price = price === "" ? 0 : Number(price) || findProduct.price;
    findProduct.salePrice =
      salePrice === "" ? 0 : Number(salePrice) || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.isMultiplayer =
      isMultiplayer === "true" || isMultiplayer === true || isMultiplayer;
    findProduct.inTheBox = inTheBoxArray || findProduct.inTheBox;
    findProduct.systemRequirements =
      systemRequirementsObj || findProduct.systemRequirements;
    findProduct.image = image || findProduct.image;

    await findProduct.save();

    res.status(200).json({
      success: true,
      message: "Game updated successfully",
      data: findProduct,
    });
  } catch (e) {
    console.log("Error in editProduct:", e);
    res.status(500).json({
      success: false,
      message: "Error occurred while editing game",
    });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Game deleted successfully",
    });
  } catch (e) {
    console.log("Error in deleteProduct:", e);
    res.status(500).json({
      success: false,
      message: "Error occurred while deleting game",
    });
  }
};


module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};