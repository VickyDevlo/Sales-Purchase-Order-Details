sap.ui.define([], function () {
  "use strict";
  return {
    SalesOrders: [
      {
        OrderID: "SO-2026-001",
        CustomerName: "Acme Corp",
        NetAmount: 12500,
        Currency: "EUR",
        Status: "Delivered",
      },
      {
        OrderID: "SO-2026-002",
        CustomerName: "Globex Inc",
        NetAmount: 45230,
        Currency: "EUR",
        Status: "Pending",
      },
      {
        OrderID: "SO-2026-003",
        CustomerName: "Initech Corporation",
        NetAmount: 3150,
        Currency: "EUR",
        Status: "Delivered",
      },
      {
        OrderID: "SO-2026-004",
        CustomerName: "Umbrella Corp",
        NetAmount: 89000,
        Currency: "EUR",
        Status: "Cancelled",
      },
      {
        OrderID: "SO-2026-005",
        CustomerName: "Hooli Logistics",
        NetAmount: 15800,
        Currency: "EUR",
        Status: "In Progress",
      },
      {
        OrderID: "SO-2026-006",
        CustomerName: "Soylent Green Co",
        NetAmount: 6200,
        Currency: "EUR",
        Status: "Delivered",
      },
      {
        OrderID: "SO-2026-007",
        CustomerName: "Wayne Enterprises",
        NetAmount: 245000,
        Currency: "EUR",
        Status: "Pending",
      },
      {
        OrderID: "SO-2026-008",
        CustomerName: "Stark Industries",
        NetAmount: 1200000,
        Currency: "EUR",
        Status: "Approved",
      },
      {
        OrderID: "SO-2026-009",
        CustomerName: "Cyberdyne Systems",
        NetAmount: 73400,
        Currency: "EUR",
        Status: "In Progress",
      },
      {
        OrderID: "SO-2026-010",
        CustomerName: "Tyrell Bio-Tech",
        NetAmount: 19100,
        Currency: "EUR",
        Status: "Delivered",
      },
    ],
    PurchaseOrders: [
      {
        PONumber: "PO-9901",
        SupplierName: "Logistics Hub",
        TotalCost: 85000,
        Currency: "EUR",
        Status: "Approved",
        Items: [
          {
            Product: "Industrial Forklift",
            Quantity: 2,
            UnitPrice: 40000,
            TotalPrice:80000,
          },
          {
            LineItem: "20",
            Product: "Heavy Duty Pallets",
            Quantity: 100,
            UnitPrice: 50,
            TotalPrice:5000,
          },
        ],
      },
      {
        PONumber: "PO-9902",
        SupplierName: "Alpha Tech Solutions",
        TotalCost: 3400,
        Currency: "EUR",
        Status: "In Progress",
        Items: [
          {
            Product: "Solid State Drives 2TB",
            Quantity: 17,
            UnitPrice: 200,
            TotalPrice:3400,
          },
        ],
      },
      {
        PONumber: "PO-9903",
        SupplierName: "Global Steel Foundry",
        TotalCost: 22000,
        Currency: "EUR",
        Status: "Approved",
        Items: [
          {
            Product: "Reinforced I-Beams",
            Quantity: 40,
            UnitPrice: 550,
            TotalPrice:22000,
          },
        ],
      },
      {
        PONumber: "PO-9904",
        SupplierName: "Delta Chemical Corp",
        TotalCost: 14150,
        Currency: "EUR",
        Status: "Pending",
        Items: [
          {
            Product: "Industrial Solvent Liquid",
            Quantity: 10,
            UnitPrice: 1200,
            TotalPrice:12000,
          },
          {
            LineItem: "20",
            Product: "Safety Storage Drums",
            Quantity: 43,
            UnitPrice: 50,
            TotalPrice:2150,
          },
        ],
      },
      {
        PONumber: "PO-9905",
        SupplierName: "Omni Plastic Matrix",
        TotalCost: 7800,
        Currency: "EUR",
        Status: "Approved",
        Items: [
          {
            Product: "Polymer Resin Granules",
            Quantity: 12,
            UnitPrice: 650,
            TotalPrice:7800,
          },
        ],
      },
      {
        PONumber: "PO-9906",
        SupplierName: "Apex Power Grid",
        TotalCost: 115000,
        Currency: "EUR",
        Status: "In Progress",
        Items: [
          {
            Product: "High-Voltage Transformer",
            Quantity: 1,
            UnitPrice: 95000,
            TotalPrice:95000,
          },
          {
            LineItem: "20",
            Product: "Ceramic Insulators Bunch",
            Quantity: 4,
            UnitPrice: 5000,
            TotalPrice:20000,
          },
        ],
      },
      {
        PONumber: "PO-9907",
        SupplierName: "Prime Packaging Ltd",
        TotalCost: 2450,
        Currency: "EUR",
        Status: "Approved",
        Items: [
          {
            Product: "Corrugated Shipping Boxes",
            Quantity: 1000,
            UnitPrice: 1,
            TotalPrice:1900,
          },
          {
            LineItem: "20",
            Product: "Industrial Packing Tape",
            Quantity: 100,
            UnitPrice: 5,
            TotalPrice:500,
          },
        ],
      },
      {
        PONumber: "PO-9908",
        SupplierName: "Matrix Server Supply",
        TotalCost: 68000,
        Currency: "EUR",
        Status: "Cancelled",
        Items: [
          {
            Product: "Blade Server Nodes Chassis",
            Quantity: 8,
            UnitPrice: 8500,
            TotalPrice:68000,
          },
        ],
      },
      {
        PONumber: "PO-9909",
        SupplierName: "Titan Machinery",
        TotalCost: 340000,
        Currency: "EUR",
        Status: "Approved",
        Items: [
          {
            Product: "Hydraulic Press Platform",
            Quantity: 1,
            UnitPrice: 340000,
            TotalPrice:340000,
          },
        ],
      },
      {
        PONumber: "PO-99010",
        SupplierName: "Eco Fuels Distribution",
        TotalCost: 11200,
        Currency: "EUR",
        Status: "Pending",
        Items: [
          {
            Product: "Bio-Diesel Fuel Base",
            Quantity: 8000,
            UnitPrice: 1,
            TotalPrice:11200,
          },
        ],
      },
    ],
  };
});
