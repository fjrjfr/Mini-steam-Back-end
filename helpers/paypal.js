const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id:
    "AUFyCUOXrETTrROQlwlPL-361MfRNSpqOyU6oK3crRmjbn78AIp5GnMObGaxwG2xt5LlLAY6p311f3Rk",
  client_secret:
    "EBsBacZ_kq2Li_AMwnFUiBq5I_b65IFjLWAFP2trpszw2VPbZrOOCHB5GLOQXjezmb03_6SgXGCmB39o",
});

module.exports = paypal;
