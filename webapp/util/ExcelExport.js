sap.ui.define([], function () {
  "use strict";

  return {
    getPurchaseOrderColumns() {
      return [
        {
          label: "PO Number",
          property: "PONumber",
          type: "string",
        },

        {
          label: "Supplier Name",
          property: "SupplierName",
          type: "string",
        },

        {
          label: "Product",
          property: "Product",
          type: "string",
        },

        {
          label: "Quantity",
          property: "Quantity",
          type: "number",
        },

        {
          label: "Unit Price (₹)",
          property: "UnitPrice",
          type: "number",
          scale: 2,
        },

        {
          label: "Total Price (₹)",
          property: "TotalPrice",
          type: "number",
          scale: 2,
        },

        {
          label: "Currency",
          property: "Currency",
          type: "string",
        },

        {
          label: "Status",
          property: "Status",
          type: "string",
        },
      ];
    },
    getSalesColumns() {
      return [
        {
          label: "Order ID",
          property: "OrderID",
          type: "string",
        },

        {
          label: "Customer Name",
          property: "CustomerName",
          type: "string",
        },

        {
          label: "Product",
          property: "Product",
          type: "string",
        },

        {
          label: "Quantity",
          property: "Quantity",
          type: "number",
        },

        {
          label: "Unit Price",
          property: "UnitPrice",
          type: "number",
          scale: 2,
        },

        {
          label: "Total Price",
          property: "TotalPrice",
          type: "number",
          scale: 2,
        },

        {
          label: "Currency",
          property: "Currency",
          type: "string",
        },

        {
          label: "Status",
          property: "Status",
          type: "string",
        },
      ];
    },
  };
});
