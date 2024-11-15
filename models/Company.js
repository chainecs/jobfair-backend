const mongoose = require("mongoose");
const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    business: {
      type: String,
      required: [true, "Please add business description"],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    province: {
      type: String,
      required: [true, "Please add a province"],
    },
    postalcode: {
      type: String,
      required: [true, "Please add a postalcode"],
      maxlength: [5, "Postalcode cannot be more than 5 digits"],
    },
    tel: {
      type: String,
    },
    picture: {
      type: String,
      required: [true, "Please add URL to company picture"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// Cascade delete bookings when a company is deleted
CompanySchema.pre("remove", async function (next) {
  console.log(`Booking being removed from company ${this._id}`);
  await this.model("Booking").deleteMany({ company: this._id });
  next();
});
// Reverse populate with virtuals
CompanySchema.virtual("bookings", {
  ref: "Booking",
  localField: "_id",
  foreignField: "company",
  justOne: false,
});
module.exports = mongoose.model("Company", CompanySchema);
