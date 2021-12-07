const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,    // will not save spaces inside the string
            required: true,
            max: 32,
            unique: true
        }
        
    }, { versionKey: false, toJSON: { virtuals: true }, id: false  }
);

CategorySchema.virtual("products", {
    localField: "_id", // relation's local field
    ref: "ProductModel", // Model?
    foreignField: "categoryId" // relation's foreign field
});

const CategoryModel = mongoose.model("CategoryModel", CategorySchema, "categories");
module.exports = CategoryModel;











