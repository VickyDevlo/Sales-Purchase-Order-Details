sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
  ],
  function (
    Controller,
    Filter,
    FilterOperator,
    Fragment,
    JSONModel,
    MessageToast,
  ) {
    "use strict";

    return Controller.extend("sap.ui5.project.controller.SalesTable", {
      // Reference global formatting mapping explicitly
      formatter: window.myGlobalFormatter,

      onCreateSales() {
        var oView = this.getView();

        if (!this._pSalesDialog) {
          this._pSalesDialog = Fragment.load({
            id: oView.getId(),
            name: "sap.ui5.project.view.fragments.CreateSalesDialog",
            controller: this,
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            return oDialog;
          });
        }

        // FIXED: Using arrow function safely preserves controller execution context 'this'
        this._pSalesDialog.then((oDialog) => {
          var oDialogModel = new JSONModel({ Items: [] });

          // Set model directly on both view and dialog instance to guarantee synchronization
          oView.setModel(oDialogModel, "dialogData");
          oDialog.setModel(oDialogModel, "dialogData");

          oDialog.open();

          // Automatically generate and set the next clean sequence ID
          var sNextId = this._generateNextSalesId();
          this.byId("inputSalesId").setValue(sNextId);
        });
      },

      _generateNextSalesId() {
        var oModel = this.getOwnerComponent().getModel("orders");
        var aOrders = oModel.getProperty("/SalesOrders") || [];

        if (aOrders.length === 0) {
          return "SO-2026-001";
        }

        var aNumbers = aOrders.map(function (oOrder) {
          var aParts = oOrder.OrderID.split("-");
          var sLastPart = aParts[aParts.length - 1];
          return parseInt(sLastPart, 10);
        });

        var nMaxNumber = Math.max.apply(null, aNumbers);
        var nNextNumber = nMaxNumber + 1;
        var sPaddedNumber = nNextNumber.toString().padStart(3, "0");

        return "SO-2026-" + sPaddedNumber;
      },

      onAddSalesItemRow() {
        var sProduct = this.byId("inputSalesProduct").getValue();
        var sQty = this.byId("inputSalesQty").getValue();
        var sPrice = this.byId("inputSalesPrice").getValue();

        if (!sProduct || !sQty || !sPrice) {
          MessageToast.show("Please enter Product, Quantity, and Price.");
          return;
        }

        var oDialogModel = this.getView().getModel("dialogData");
        var aItems = oDialogModel.getProperty("/Items") || [];

        var sLineItemNum = ((aItems.length + 1) * 10).toString();
        var nTotalRowPrice = parseInt(sQty, 10) * parseFloat(sPrice);

        aItems.push({
          LineItem: sLineItemNum,
          Product: sProduct,
          Quantity: parseInt(sQty, 10),
          UnitPrice: parseFloat(sPrice).toFixed(2),
          TotalPrice: nTotalRowPrice.toFixed(2),
        });

        oDialogModel.setProperty("/Items", aItems);

        // Clear input row elements to allow consecutive entries
        this.byId("inputSalesProduct").setValue("");
        this.byId("inputSalesQty").setValue("");
        this.byId("inputSalesPrice").setValue("");
      },

      onSaveSales() {
        var sId = this.byId("inputSalesId").getValue();
        var sCustomer = this.byId("inputCustomerName").getValue();
        var sStatus = this.byId("selectStatus").getSelectedKey();

        var oDialogModel = this.getView().getModel("dialogData");
        var aItems = oDialogModel.getProperty("/Items") || [];

        // FIXED: Checks the added items array table content length instead of blank input elements
        if (!sId || !sCustomer) {
          MessageToast.show("Please enter the Customer Name.");
          return;
        }

        if (aItems.length === 0) {
          MessageToast.show(
            "Please add at least one line item row below before saving.",
          );
          return;
        }

        // Sum NetAmount from staged item objects collection
        var nTotalSum = aItems.reduce(
          (acc, item) => acc + parseFloat(item.TotalPrice),
          0,
        );
        var sFormattedAmount = nTotalSum.toLocaleString("en-US", {
          minimumFractionDigits: 2,
        });

        var oModel = this.getOwnerComponent().getModel("orders");
        var aSalesOrders = oModel.getProperty("/SalesOrders") || [];

        var oNewOrder = {
          OrderID: sId,
          CustomerName: sCustomer,
          NetAmount: sFormattedAmount,
          Currency: "EUR",
          Status: sStatus,
          Items: aItems,
        };

        // Appends structural order context onto the bottom of the data grid rows array
        aSalesOrders.push(oNewOrder);
        oModel.setProperty("/SalesOrders", aSalesOrders);

        MessageToast.show("Sales Order " + sId + " saved successfully!");
        this.onCloseSalesDialog();
      },

      onCloseSalesDialog() {
        this.byId("idSalesDialog").close();
        this.byId("inputSalesId").setValue("");
        this.byId("inputCustomerName").setValue("");
        this.byId("inputSalesProduct").setValue("");
        this.byId("inputSalesQty").setValue("");
        this.byId("inputSalesPrice").setValue("");
      },

      onSearchSales(oEvent) {
        var sQuery = oEvent.getParameter("query");
        var aFilters = sQuery
          ? [new Filter("CustomerName", FilterOperator.Contains, sQuery)]
          : [];
        this.byId("salesTable").getBinding("items").filter(aFilters);
      },

      onDetails(oEvent) {
        var oItem = oEvent.getSource();
        var oContext = oItem.getBindingContext("orders");
        var sOrderId = oContext.getProperty("OrderID");

        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteOrderDetail", {
          orderType: "sales",
          orderId: sOrderId,
        });
      },
    });
  },
);
