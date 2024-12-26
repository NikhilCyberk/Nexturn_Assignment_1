# Product Management System

A Node.js-based command-line application for managing product inventory using JSON data storage.

## Features

- Add new products to the inventory
- Update product prices
- View available products
- Filter products by category
- Persistent storage using JSON
- Interactive command-line interface

## Prerequisites

- Node.js (v12.0.0 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/product-management.git
cd product-management
```

2. Install dependencies:

```bash
npm install
```

## Usage

Start the application:

```bash
npm start
```

The application provides an interactive menu with the following options:

1. **Add a new product**: Add a product with ID, name, category, price, and availability status
2. **Update product price**: Modify the price of an existing product using its ID
3. **View available products**: Display all products currently in stock
4. **View products by category**: Filter and display products by their category
5. **Exit**: Close the application

## Data Structure

Products are stored in `products.json` with the following structure:

```json
{
  "id": 1,
  "name": "Product Name",
  "category": "Category Name",
  "price": 99.99,
  "available": true
}
```

## File Structure

```
product-management/
├── package.json
├── productmanager.js
├── products.json
└── README.md
```

## Error Handling

The application includes error handling for:

- File reading/writing operations
- Invalid input validation
- Product not found scenarios
- JSON parsing errors
