// STEP 1: Create library database and insert members

const libraryDB = db.getSiblingDB("library");

libraryDB.members.insertMany([
    {
        name: "Ravi",
        address: {
            city: "Chennai",
            pin: "600001"
        },
        borrowed: ["Python Basics", "MongoDB Guide"],
        fee: 0
    },
    {
        name: "Sita",
        address: {
            city: "Mumbai",
            pin: "400001"
        },
        borrowed: ["MongoDB Guide"],
        fee: 50
    },
    {
        name: "Lakshmi",
        address: {
            city: "Delhi",
            pin: "110001"
        },
        borrowed: ["Python Basics"],
        fee: 120
    },
    {
        name: "Kumar",
        address: {
            city: "Chennai",
            pin: "600028"
        },
        borrowed: [],
        fee: 0
    }
]);

// List all databases
print("All Databases:");
printjson(db.adminCommand({ listDatabases: 1 }));

// List collections
print("Collections:");
printjson(libraryDB.getCollectionNames());


// STEP 2: Find members living in Chennai
// Using dot notation

print("Members living in Chennai:");

libraryDB.members.find(
    { "address.city": "Chennai" },
    { _id: 0, name: 1, address: 1 }
).forEach(printjson);


// STEP 3: Find members who borrowed MongoDB Guide

print("Members who borrowed MongoDB Guide:");

libraryDB.members.find(
    { borrowed: "MongoDB Guide" },
    { _id: 0, name: 1, borrowed: 1 }
).forEach(printjson);


// STEP 4: Find members who borrowed both books
// Using $all operator

print("Members who borrowed both books:");

libraryDB.members.find(
    {
        borrowed: {
            $all: ["Python Basics", "MongoDB Guide"]
        }
    },
    { _id: 0, name: 1 }
).forEach(printjson);


// STEP 5: Find members who have not borrowed any book
// Using $size operator

print("Members with no borrowed books:");

libraryDB.members.find(
    { borrowed: { $size: 0 } },
    { _id: 0, name: 1 }
).forEach(printjson);


// STEP 6: Change Sita's city to Chennai
// Using dot notation and $set

print("Updating Sita's city:");

printjson(
    libraryDB.members.updateOne(
        { name: "Sita" },
        {
            $set: {
                "address.city": "Chennai"
            }
        }
    )
);


// STEP 7: Count members who owe fees greater than zero

print("Members owing fees:");

const feeCount = libraryDB.members.countDocuments({
    fee: { $gt: 0 }
});

print("Total members owing fees: " + feeCount);

// Drop collection for cleanup

print("Dropping members collection:");

print(libraryDB.members.drop());



// SCENARIO 2.2 - SALES REPORT

// STEP 1: Create sales database and insert six orders

const salesDB = db.getSiblingDB("sales");

salesDB.orders.insertMany([
    {
        orderId: 1,
        customer: "Arun",
        product: "Laptop",
        category: "Electronics",
        qty: 1,
        price: 55000
    },
    {
        orderId: 2,
        customer: "Divya",
        product: "Mouse",
        category: "Electronics",
        qty: 2,
        price: 500
    },
    {
        orderId: 3,
        customer: "Arun",
        product: "Notebook",
        category: "Stationery",
        qty: 10,
        price: 40
    },
    {
        orderId: 4,
        customer: "Meena",
        product: "Pen",
        category: "Stationery",
        qty: 20,
        price: 10
    },
    {
        orderId: 5,
        customer: "Divya",
        product: "Headphones",
        category: "Electronics",
        qty: 1,
        price: 1500
    },
    {
        orderId: 6,
        customer: "Karthik",
        product: "Chair",
        category: "Furniture",
        qty: 2,
        price: 3500
    }
]);

print("Six orders inserted successfully.");


// STEP 2: Display only Electronics orders
// Using $match and $project

print("Electronics Orders:");

salesDB.orders.aggregate([
    {
        $match: {
            category: "Electronics"
        }
    },
    {
        $project: {
            _id: 0,
            orderId: 1,
            product: 1
        }
    }
]).forEach(printjson);


// STEP 3: Calculate line total of every order
// Formula: Quantity x Price
// Using $project and $multiply

print("Line Total of Every Order:");

salesDB.orders.aggregate([
    {
        $project: {
            _id: 0,
            orderId: 1,
            customer: 1,
            lineTotal: {
                $multiply: ["$qty", "$price"]
            }
        }
    }
]).forEach(printjson);


// STEP 4: Calculate total quantity sold per category
// Using $group and $sum

print("Total Quantity Sold Per Category:");

salesDB.orders.aggregate([
    {
        $group: {
            _id: "$category",
            totalQty: {
                $sum: "$qty"
            }
        }
    }
]).forEach(printjson);


// STEP 5: Calculate revenue and average price per category
// Sort by highest revenue first
// Using $group, $sum, $avg and $sort

print("Revenue and Average Price Per Category:");

salesDB.orders.aggregate([
    {
        $group: {
            _id: "$category",
            revenue: {
                $sum: {
                    $multiply: ["$qty", "$price"]
                }
            },
            avgPrice: {
                $avg: "$price"
            }
        }
    },
    {
        $sort: {
            revenue: -1
        }
    }
]).forEach(printjson);


// STEP 6: Find top two customers by total spending
// Using $group, $sum, $sort and $limit

print("Top Two Customers by Total Spending:");

salesDB.orders.aggregate([
    {
        $group: {
            _id: "$customer",
            spent: {
                $sum: {
                    $multiply: ["$qty", "$price"]
                }
            }
        }
    },
    {
        $sort: {
            spent: -1
        }
    },
    {
        $limit: 2
    }
]).forEach(printjson);


// END OF MONGODB SET 2 SOLUTIONS
