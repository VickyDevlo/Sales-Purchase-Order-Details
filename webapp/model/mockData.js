sap.ui.define([], function () {
  "use strict";
  return {
    SalesOrders: [
      {
        OrderID: "SO-2026-001",
        CustomerName: "Acme Corp",
        NetAmount: 12500,
        Currency: "₨",
        Status: "Delivered",
        Items: [
          {
            Product: "Notebook Pro 15",
            Quantity: 2,
            UnitPrice: 1500,
            TotalPrice: 3000,
          },
          {
            Product: "UltraWide Monitor 34",
            Quantity: 5,
            UnitPrice: 1900,
            TotalPrice: 9500,
          },
        ],
      },
      {
        OrderID: "SO-2026-002",
        CustomerName: "Globex Inc",
        NetAmount: 45230,
        Currency: "₨",
        Status: "Pending",
        Items: [
          {
            Product: "Server Rack Alpha",
            Quantity: 1,
            UnitPrice: 45230,
            TotalPrice: 45230,
          },
        ],
      },
      {
        OrderID: "SO-2026-003",
        CustomerName: "Initech Corporation",
        NetAmount: 3150,
        Currency: "₨",
        Status: "Delivered",
        Items: [
          {
            Product: "Ergonomic Desk Chair",
            Quantity: 6,
            UnitPrice: 450,
            TotalPrice: 2700,
          },
          {
            Product: "Wireless Keyboard Kit",
            Quantity: 10,
            UnitPrice: 45,
            TotalPrice: 450,
          },
        ],
      },
      {
        OrderID: "SO-2026-004",
        CustomerName: "Umbrella Corp",
        NetAmount: 89000,
        Currency: "₨",
        Status: "Cancelled",
        Items: [
          {
            Product: "Lab Cooling Unit Gen 4",
            Quantity: 2,
            UnitPrice: 44500,
            TotalPrice: 89000,
          },
        ],
      },
      {
        OrderID: "SO-2026-005",
        CustomerName: "Hooli Logistics",
        NetAmount: 15800,
        Currency: "₨",
        Status: "In Progress",
        Items: [
          {
            Product: "Nucleus Network Router",
            Quantity: 4,
            UnitPrice: 3200,
            TotalPrice: 12800,
          },
          {
            Product: "Cat6 Ethernet Spool",
            Quantity: 10,
            UnitPrice: 300,
            TotalPrice: 3000,
          },
        ],
      },
      {
        OrderID: "SO-2026-006",
        CustomerName: "Soylent Green Co",
        NetAmount: 6200,
        Currency: "₨",
        Status: "Delivered",
        Items: [
          {
            Product: "Processing Filter Module",
            Quantity: 20,
            UnitPrice: 310,
            TotalPrice: 6200,
          },
        ],
      },
      {
        OrderID: "SO-2026-007",
        CustomerName: "Wayne Enterprises",
        NetAmount: 245000,
        Currency: "₨",
        Status: "Pending",
        Items: [
          {
            Product: "Titanium Alloy Plating",
            Quantity: 50,
            UnitPrice: 4000,
            TotalPrice: 200000,
          },
          {
            Product: "Advanced Tactical HUD",
            Quantity: 5,
            UnitPrice: 9000,
            TotalPrice: 45000,
          },
        ],
      },
      {
        OrderID: "SO-2026-008",
        CustomerName: "Stark Industries",
        NetAmount: 1200000,
        Currency: "₨",
        Status: "Approved",
        Items: [
          {
            Product: "Arc Reactor Core Component",
            Quantity: 1,
            UnitPrice: 1200000,
            TotalPrice: 1200000,
          },
        ],
      },
      {
        OrderID: "SO-2026-009",
        CustomerName: "Cyberdyne Systems",
        NetAmount: 73400,
        Currency: "₨",
        Status: "In Progress",
        Items: [
          {
            Product: "Microprocessor Neural Link",
            Quantity: 2,
            UnitPrice: 36700,
            TotalPrice: 73400,
          },
        ],
      },
      {
        OrderID: "SO-2026-010",
        CustomerName: "Tyrell Bio-Tech",
        NetAmount: 19100,
        Currency: "₨",
        Status: "Delivered",
        Items: [
          {
            Product: "Environmental Scanner DX",
            Quantity: 3,
            UnitPrice: 5300,
            TotalPrice: 15900,
          },
          {
            Product: "Calibration Sensor Kit",
            Quantity: 4,
            UnitPrice: 800,
            TotalPrice: 3200,
          },
        ],
      },
    ],
    PurchaseOrders: [
      {
        PONumber: "PO-9901",
        SupplierName: "Logistics Hub",
        TotalCost: 85000,
        Currency: "₨",
        Status: "Approved",
        Items: [
          {
            Product: "Industrial Forklift",
            Quantity: 2,
            UnitPrice: 40000,
            TotalPrice: 80000,
          },
          {
            LineItem: "20",
            Product: "Heavy Duty Pallets",
            Quantity: 100,
            UnitPrice: 50,
            TotalPrice: 5000,
          },
        ],
      },
      {
        PONumber: "PO-9902",
        SupplierName: "Alpha Tech Solutions",
        TotalCost: 3400,
        Currency: "₨",
        Status: "In Progress",
        Items: [
          {
            Product: "Solid State Drives 2TB",
            Quantity: 17,
            UnitPrice: 200,
            TotalPrice: 3400,
          },
        ],
      },
      {
        PONumber: "PO-9903",
        SupplierName: "Global Steel Foundry",
        TotalCost: 22000,
        Currency: "₨",
        Status: "Approved",
        Items: [
          {
            Product: "Reinforced I-Beams",
            Quantity: 40,
            UnitPrice: 550,
            TotalPrice: 22000,
          },
        ],
      },
      {
        PONumber: "PO-9904",
        SupplierName: "Delta Chemical Corp",
        TotalCost: 14150,
        Currency: "₨",
        Status: "Pending",
        Items: [
          {
            Product: "Industrial Solvent Liquid",
            Quantity: 10,
            UnitPrice: 1200,
            TotalPrice: 12000,
          },
          {
            LineItem: "20",
            Product: "Safety Storage Drums",
            Quantity: 43,
            UnitPrice: 50,
            TotalPrice: 2150,
          },
        ],
      },
      {
        PONumber: "PO-9905",
        SupplierName: "Omni Plastic Matrix",
        TotalCost: 7800,
        Currency: "₨",
        Status: "Approved",
        Items: [
          {
            Product: "Polymer Resin Granules",
            Quantity: 12,
            UnitPrice: 650,
            TotalPrice: 7800,
          },
        ],
      },
      {
        PONumber: "PO-9906",
        SupplierName: "Apex Power Grid",
        TotalCost: 115000,
        Currency: "₨",
        Status: "In Progress",
        Items: [
          {
            Product: "High-Voltage Transformer",
            Quantity: 1,
            UnitPrice: 95000,
            TotalPrice: 95000,
          },
          {
            LineItem: "20",
            Product: "Ceramic Insulators Bunch",
            Quantity: 4,
            UnitPrice: 5000,
            TotalPrice: 20000,
          },
        ],
      },
      {
        PONumber: "PO-9907",
        SupplierName: "Prime Packaging Ltd",
        TotalCost: 2450,
        Currency: "₨",
        Status: "Approved",
        Items: [
          {
            Product: "Corrugated Shipping Boxes",
            Quantity: 1000,
            UnitPrice: 1,
            TotalPrice: 1900,
          },
          {
            LineItem: "20",
            Product: "Industrial Packing Tape",
            Quantity: 100,
            UnitPrice: 5,
            TotalPrice: 500,
          },
        ],
      },
      {
        PONumber: "PO-9908",
        SupplierName: "Matrix Server Supply",
        TotalCost: 68000,
        Currency: "₨",
        Status: "Cancelled",
        Items: [
          {
            Product: "Blade Server Nodes Chassis",
            Quantity: 8,
            UnitPrice: 8500,
            TotalPrice: 68000,
          },
        ],
      },
      {
        PONumber: "PO-9909",
        SupplierName: "Titan Machinery",
        TotalCost: 340000,
        Currency: "₨",
        Status: "Approved",
        Items: [
          {
            Product: "Hydraulic Press Platform",
            Quantity: 1,
            UnitPrice: 340000,
            TotalPrice: 340000,
          },
        ],
      },
      {
        PONumber: "PO-99010",
        SupplierName: "Eco Fuels Distribution",
        TotalCost: 11200,
        Currency: "₨",
        Status: "Pending",
        Items: [
          {
            Product: "Bio-Diesel Fuel Base",
            Quantity: 8000,
            UnitPrice: 1,
            TotalPrice: 11200,
          },
        ],
      },
    ],
  };
});
