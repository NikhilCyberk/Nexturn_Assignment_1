// assessment1

// Graded Assessment: Working with JSON Data

// Problem:

// You are tasked with implementing a product management system. The system will use JSON data for storing information about products. Each product has the following properties:

// · id: Unique identifier for the product.

// · name: Name of the product.

// · category: Category of the product.

// · price: Price of the product.

// · available: Boolean indicating if the product is in stock.

// The tasks below involve reading JSON data, adding new products, updating product information, and filtering products based on certain conditions.

// Tasks:

// 1. Parse the JSON data:

// Write a function that reads the JSON data (in the format above) and converts it into a usable data structure. You will need to parse the JSON into a JavaScript object.

// 2. Add a new product:

// Write a function to add a new product to the catalog. This product will have the same structure as the others and should be appended to the products array.

// 3. Update the price of a product:

// Write a function that takes a product ID and a new price and updates the price of the product with the given ID. If the product doesn’t exist, the function should return an error message.

// 4. Filter products based on availability:

// Write a function that returns only the products that are available (i.e., available: true).

// 5. Filter products by category:

// Write a function that takes a category name (e.g., "Electronics") and returns all products in that category.

const fs = require("fs");
const readline = require("readline");

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.products = this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error reading JSON data:", error.message);
      return [];
    }
  }

  saveProducts() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2));
    } catch (error) {
      console.error("Error saving JSON data:", error.message);
    }
  }

  validateProduct(product) {
    const requiredFields = ["id", "name", "category", "price", "available"];
    for (const field of requiredFields) {
      if (!(field in product)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (typeof product.id !== "number" || product.id <= 0) {
      throw new Error("Invalid product ID");
    }

    if (typeof product.price !== "number" || product.price < 0) {
      throw new Error("Invalid price");
    }

    if (typeof product.available !== "boolean") {
      throw new Error("Available must be a boolean value");
    }

    if (this.products.some((p) => p.id === product.id)) {
      throw new Error("Product ID already exists");
    }
  }

  addProduct(newProduct) {
    try {
      this.validateProduct(newProduct);
      this.products.push(newProduct);
      this.saveProducts();
      return true;
    } catch (error) {
      console.error("Error adding product:", error.message);
      return false;
    }
  }

  updateProductPrice(productId, newPrice) {
    if (typeof newPrice !== "number" || newPrice < 0) {
      console.error("Invalid price value");
      return false;
    }

    const product = this.products.find((p) => p.id === productId);
    if (product) {
      product.price = newPrice;
      this.saveProducts();
      return true;
    }
    console.error("Product not found");
    return false;
  }

  getAvailableProducts() {
    return this.products.filter((product) => product.available);
  }

  getProductsByCategory(category) {
    return this.products.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
  }
}

class UserInterface {
  constructor(productManager) {
    this.productManager = productManager;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async promptNewProduct() {
    try {
      const id = await this.question("Enter product ID: ");
      const name = await this.question("Enter product name: ");
      const category = await this.question("Enter product category: ");
      const price = await this.question("Enter product price: ");
      const available = await this.question(
        "Is the product available? (true/false): "
      );

      const newProduct = {
        id: parseInt(id),
        name: name.trim(),
        category: category.trim(),
        price: parseFloat(price),
        available: available.toLowerCase() === "true",
      };

      if (this.productManager.addProduct(newProduct)) {
        console.log("New product added successfully!");
      }
    } catch (error) {
      console.error("Error adding product:", error.message);
    }
  }

  async promptUpdatePrice() {
    try {
      const id = await this.question(
        "Enter the product ID to update the price: "
      );
      const price = await this.question("Enter the new price: ");

      if (
        this.productManager.updateProductPrice(parseInt(id), parseFloat(price))
      ) {
        console.log("Product price updated successfully!");
      }
    } catch (error) {
      console.error("Error updating price:", error.message);
    }
  }

  question(query) {
    return new Promise((resolve) => this.rl.question(query, resolve));
  }

  async displayMenu() {
    console.log("\nProduct Management System");
    console.log("------------------------");
    console.log("1. Add a new product");
    console.log("2. Update product price");
    console.log("3. View available products");
    console.log("4. View products by category");
    console.log("5. Exit");

    const choice = await this.question("\nEnter your choice: ");

    switch (choice) {
      case "1":
        await this.promptNewProduct();
        break;
      case "2":
        await this.promptUpdatePrice();
        break;
      case "3":
        console.log("\nAvailable Products:");
        console.table(this.productManager.getAvailableProducts());
        break;
      case "4":
        const category = await this.question("Enter category to filter by: ");
        console.log("\nProducts in category:", category);
        console.table(this.productManager.getProductsByCategory(category));
        break;
      case "5":
        console.log("Exiting program. Goodbye!");
        this.rl.close();
        process.exit(0);
      default:
        console.log("Invalid choice. Please try again.");
    }

    if (choice !== "5") {
      await this.displayMenu();
    }
  }
}

// Main program
const main = async () => {
  const productManager = new ProductManager("./products.json");
  const ui = new UserInterface(productManager);
  await ui.displayMenu();
};

main().catch((error) => {
  console.error("Application error:", error.message);
  process.exit(1);
});
