sap.ui.define(
  ["sap/ui/core/UIComponent", "sap/ui5/project/model/models", "sap/ui/model/json/JSONModel"],
  (UIComponent, models,JSONModel) => {
    "use strict";

    return UIComponent.extend("sap.ui5.project.Component", {
      metadata: {
        manifest: "json",
        interfaces: ["sap.ui.core.IAsyncContentCreation"],
      },

      init() {
        // call the base component's init function
        UIComponent.prototype.init.apply(this, arguments);

        // set the device model
        this.setModel(models.createDeviceModel(), "device");

        // enable routing
        this.getRouter().initialize();
        // 2. Define the global data structure here
       var oData = {
    SalesOrders: [
        {
            OrderID: "SO-2026-001",
            CustomerName: "Acme Corp",
            NetAmount: "12,500.00",
            Currency: "EUR",
            Status: "Delivered",
            Items: [
                { Product: "Notebook Pro 15", Quantity: 2, UnitPrice: "1500.00", TotalPrice: "3000.00" },
                { LineItem: "20", Product: "UltraWide Monitor 34", Quantity: 5, UnitPrice: "1900.00", TotalPrice: "9500.00" }
            ]
        },
        {
            OrderID: "SO-2026-002",
            CustomerName: "Globex Inc",
            NetAmount: "45,230.00",
            Currency: "EUR",
            Status: "Pending",
            Items: [
                { Product: "Server Rack Alpha", Quantity: 1, UnitPrice: "45230.00", TotalPrice: "45230.00" }
            ]
        },
        {
            OrderID: "SO-2026-003",
            CustomerName: "Initech Corporation",
            NetAmount: "3,150.00",
            Currency: "EUR",
            Status: "Delivered",
            Items: [
                { Product: "Ergonomic Desk Chair", Quantity: 6, UnitPrice: "450.00", TotalPrice: "2700.00" },
                { LineItem: "20", Product: "Wireless Keyboard Kit", Quantity: 10, UnitPrice: "45.00", TotalPrice: "450.00" }
            ]
        },
        {
            OrderID: "SO-2026-004",
            CustomerName: "Umbrella Corp",
            NetAmount: "89,000.00",
            Currency: "EUR",
            Status: "Cancelled",
            Items: [
                { Product: "Lab Cooling Unit Gen 4", Quantity: 2, UnitPrice: "44500.00", TotalPrice: "89000.00" }
            ]
        },
        {
            OrderID: "SO-2026-005",
            CustomerName: "Hooli Logistics",
            NetAmount: "15,800.00",
            Currency: "EUR",
            Status: "In Progress",
            Items: [
                { Product: "Nucleus Network Router", Quantity: 4, UnitPrice: "3200.00", TotalPrice: "12800.00" },
                { LineItem: "20", Product: "Cat6 Ethernet Spool", Quantity: 10, UnitPrice: "300.00", TotalPrice: "3000.00" }
            ]
        },
        {
            OrderID: "SO-2026-006",
            CustomerName: "Soylent Green Co",
            NetAmount: "6,200.00",
            Currency: "EUR",
            Status: "Delivered",
            Items: [
                { Product: "Processing Filter Module", Quantity: 20, UnitPrice: "310.00", TotalPrice: "6200.00" }
            ]
        },
        {
            OrderID: "SO-2026-007",
            CustomerName: "Wayne Enterprises",
            NetAmount: "245,000.00",
            Currency: "EUR",
            Status: "Pending",
            Items: [
                { Product: "Titanium Alloy Plating", Quantity: 50, UnitPrice: "4000.00", TotalPrice: "20000.00" },
                { LineItem: "20", Product: "Advanced Tactical HUD", Quantity: 5, UnitPrice: "9000.00", TotalPrice: "45000.00" }
            ]
        },
        {
            OrderID: "SO-2026-008",
            CustomerName: "Stark Industries",
            NetAmount: "1,200,000.00",
            Currency: "EUR",
            Status: "Approved",
            Items: [
                { Product: "Arc Reactor Core Component", Quantity: 1, UnitPrice: "1200000.00", TotalPrice: "1200000.00" }
            ]
        },
        {
            OrderID: "SO-2026-009",
            CustomerName: "Cyberdyne Systems",
            NetAmount: "73,400.00",
            Currency: "EUR",
            Status: "In Progress",
            Items: [
                { Product: "Microprocessor Neural Link", Quantity: 2, UnitPrice: "36700.00", TotalPrice: "73400.00" }
            ]
        },
        {
            OrderID: "SO-2026-010",
            CustomerName: "Tyrell Bio-Tech",
            NetAmount: "19,100.00",
            Currency: "EUR",
            Status: "Delivered",
            Items: [
                { Product: "Environmental Scanner DX", Quantity: 3, UnitPrice: "5300.00", TotalPrice: "15900.00" },
                { LineItem: "20", Product: "Calibration Sensor Kit", Quantity: 4, UnitPrice: "800.00", TotalPrice: "3200.00" }
            ]
        }
    ],
    PurchaseOrders: [
        {
            PONumber: "PO-9901",
            SupplierName: "Logistics Hub",
            TotalCost: "85,000.00",
            Currency: "EUR",
            Status: "Approved",
            Items: [
                { Product: "Industrial Forklift", Quantity: 2, UnitPrice: "40000.00", TotalPrice: "80000.00" },
                { LineItem: "20", Product: "Heavy Duty Pallets", Quantity: 100, UnitPrice: "50.00", TotalPrice: "5000.00" }
            ]
        },
        {
            PONumber: "PO-9902",
            SupplierName: "Alpha Tech Solutions",
            TotalCost: "3,400.00",
            Currency: "EUR",
            Status: "In Progress",
            Items: [
                { Product: "Solid State Drives 2TB", Quantity: 17, UnitPrice: "200.00", TotalPrice: "3400.00" }
            ]
        },
        {
            PONumber: "PO-9903",
            SupplierName: "Global Steel Foundry",
            TotalCost: "22,000.00",
            Currency: "EUR",
            Status: "Approved",
            Items: [
                { Product: "Reinforced I-Beams", Quantity: 40, UnitPrice: "550.00", TotalPrice: "22000.00" }
            ]
        },
        {
            PONumber: "PO-9904",
            SupplierName: "Delta Chemical Corp",
            TotalCost: "14,150.00",
            Currency: "EUR",
            Status: "Pending",
            Items: [
                { Product: "Industrial Solvent Liquid", Quantity: 10, UnitPrice: "1200.00", TotalPrice: "12000.00" },
                { LineItem: "20", Product: "Safety Storage Drums", Quantity: 43, UnitPrice: "50.00", TotalPrice: "2150.00" }
            ]
        },
        {
            PONumber: "PO-9905",
            SupplierName: "Omni Plastic Matrix",
            TotalCost: "7,800.00",
            Currency: "EUR",
            Status: "Delivered",
            Items: [
                { Product: "Polymer Resin Granules", Quantity: 12, UnitPrice: "650.00", TotalPrice: "7800.00" }
            ]
        },
        {
            PONumber: "PO-9906",
            SupplierName: "Apex Power Grid",
            TotalCost: "115,000.00",
            Currency: "EUR",
            Status: "In Progress",
            Items: [
                { Product: "High-Voltage Transformer", Quantity: 1, UnitPrice: "95000.00", TotalPrice: "95000.00" },
                { LineItem: "20", Product: "Ceramic Insulators Bunch", Quantity: 4, UnitPrice: "5000.00", TotalPrice: "20000.00" }
            ]
        },
        {
            PONumber: "PO-9907",
            SupplierName: "Prime Packaging Ltd",
            TotalCost: "2,450.00",
            Currency: "EUR",
            Status: "Delivered",
            Items: [
                { Product: "Corrugated Shipping Boxes", Quantity: 1000, UnitPrice: "1.95", TotalPrice: "1950.00" },
                { LineItem: "20", Product: "Industrial Packing Tape", Quantity: 100, UnitPrice: "5.00", TotalPrice: "500.00" }
            ]
        },
        {
            PONumber: "PO-9908",
            SupplierName: "Matrix Server Supply",
            TotalCost: "68,000.00",
            Currency: "EUR",
            Status: "Cancelled",
            Items: [
                { Product: "Blade Server Nodes Chassis", Quantity: 8, UnitPrice: "8500.00", TotalPrice: "68000.00" }
            ]
        },
        {
            PONumber: "PO-9909",
            SupplierName: "Titan Machinery",
            TotalCost: "340,000.00",
            Currency: "EUR",
            Status: "Approved",
            Items: [
                { Product: "Hydraulic Press Platform", Quantity: 1, UnitPrice: "340000.00", TotalPrice: "340000.00" }
            ]
        },
        {
            PONumber: "PO-99010",
            SupplierName: "Eco Fuels Distribution",
            TotalCost: "11,200.00",
            Currency: "EUR",
            Status: "Pending",
            Items: [
                { Product: "Bio-Diesel Fuel Base", Quantity: 8000, UnitPrice: "1.40", TotalPrice: "11200.00" }
            ]
        }
    ]
};


        // 3. Set model directly on the Component level (makes it global)
        var oModel = new JSONModel(oData);
        this.setModel(oModel, "orders");
      },
    });
  },
);
