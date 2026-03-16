const Order = require("../../models/Order");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } =
      req.body;

    console.log("📝 Adding review:", {
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });

    if (!productId || !userId || !userName || !reviewMessage || !reviewValue) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
    });

    console.log("📝 Found order:", order);

    if (!order) {
      console.log("⚠️ No order found, but allowing review for testing");
    }

    const checkExistingReview = await ProductReview.findOne({
      productId,
      userId,
    });

    console.log("📝 Existing review:", checkExistingReview);

    if (checkExistingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this game!",
      });
    }

    const newReview = new ProductReview({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });

    await newReview.save();
    console.log("✅ Review saved:", newReview);

    const reviews = await ProductReview.find({ productId });
    const totalReviewsLength = reviews.length;
    const averageReview =
      reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      totalReviewsLength;

    await Product.findByIdAndUpdate(productId, { averageReview });
    console.log("✅ Average review updated to:", averageReview);

    res.status(201).json({
      success: true,
      message: "Review added successfully!",
      data: newReview,
    });
  } catch (e) {
    console.log("❌ Error in addProductReview:", e);
    res.status(500).json({
      success: false,
      message: e.message || "Error occurred while adding review",
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await ProductReview.find({ productId });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    console.log("Error in getProductReviews:", e);
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching reviews",
    });
  }
};

module.exports = { addProductReview, getProductReviews };
