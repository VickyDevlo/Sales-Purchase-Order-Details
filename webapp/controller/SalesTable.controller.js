sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
  ],
  function (
    Controller,
    Filter,
    FilterOperator,
    Fragment,
    JSONModel,
    MessageToast,
    MessageBox,
  ) {
    "use strict";

    return Controller.extend("sap.ui5.project.controller.SalesTable", {
      // Reference global formatting mapping explicitly
      formatter: window.myGlobalFormatter,

      onCreateSales() {
        var oView = this.getView();

        // Open & Close The Dialog
        if (!this._pSalesDialog) {
          this._pSalesDialog = Fragment.load({
            id: oView.getId(),
            name: "sap.ui5.project.view.fragments.CreateSalesDialog",
            controller: this,
          }).then((oDialog) => {
            oView.addDependent(oDialog);
            return oDialog;
          });
        }

        this._pSalesDialog.then((oDialog) => {
          var oDialogModel = new JSONModel({ Items: [] });

          oView.setModel(oDialogModel, "dialogData");
          oDialog.setInitialFocus(this.byId("inputCustomerName"));

          oDialog.open();

          // Automatically generate and set the next clean sequence ID
          var sNextId = this._generateNextSalesId();
          this.byId("inputSalesId").setValue(sNextId);
          this.byId("inputCustomerName").setEnabled(true);
        });
      },

      _generateNextSalesId() {
        var oModel = this.getOwnerComponent().getModel("orders");
        var aOrders = oModel.getProperty("/SalesOrders") || [];

        var sYear = new Date().getFullYear().toString();

        // Get only current year's orders
        var aCurrentYearOrders = aOrders.filter(function (oOrder) {
          return oOrder.OrderID && oOrder.OrderID.split("-")[1] === sYear;
        });

        // If no orders for this year, start from 001
        if (aCurrentYearOrders.length === 0) {
          return "SO-" + sYear + "-001";
        }

        // Find the highest sequence number for the current year
        var nMax = Math.max.apply(
          null,
          aCurrentYearOrders.map(function (oOrder) {
            return parseInt(oOrder.OrderID.split("-")[2], 10);
          }),
        );

        return "SO-" + sYear + "-" + String(nMax + 1).padStart(3, "0");
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

        var nTotalRowPrice = parseInt(sQty, 10) * parseFloat(sPrice);

        aItems.push({
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
        var oModel = this.getOwnerComponent().getModel("orders");
        var aSalesOrders = oModel.getProperty("/SalesOrders") || [];

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

        var oNewOrder = {
          OrderID: sId,
          CustomerName: sCustomer,
          NetAmount: sFormattedAmount,
          Currency: "EUR",
          Status: sStatus,
          Items: aItems,
        };

        // Appends structural order context onto the bottom of the data grid rows array
        if (this._editingOrder) {
          var iIndex = aSalesOrders.findIndex(
            function (item) {
              return item.OrderID === this._editingOrder.OrderID;
            }.bind(this),
          );

          if (iIndex > -1) {
            aSalesOrders[iIndex] = oNewOrder;
          }

          this._editingOrder = null;
        } else {
          aSalesOrders.push(oNewOrder);
        }
        oModel.setProperty("/SalesOrders", aSalesOrders);

        // Save to localStorage
        this.getOwnerComponent().saveOrdersData();

        MessageToast.show("Sales Order " + sId + " saved successfully!");
        this.onCloseSalesDialog();
      },

      onCloseSalesDialog() {
        this.byId("idSalesDialog").close();

        this.byId("inputSalesId").setEditable(true);

        this.byId("inputSalesId").setValue("");
        this.byId("inputCustomerName").setValue("");
        this.byId("inputSalesProduct").setValue("");
        this.byId("inputSalesQty").setValue("");
        this.byId("inputSalesPrice").setValue("");

        this.byId("selectStatus").setSelectedKey("");

        this.getView().getModel("dialogData").setProperty("/Items", []);

        this._editingOrder = null;
      },

      onSearchSales(oEvent) {
        var sQuery = oEvent.getParameter("query");
        var aFilters = sQuery
          ? [new Filter("OrderID", FilterOperator.Contains, sQuery)]
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

      onEditSales(oEvent) {
        let oContext = oEvent.getSource().getBindingContext("orders");
        let oOrder = oContext.getObject();

        this._editingOrder = oOrder;

        this.onCreateSales();

        this._pSalesDialog.then(function (oDialog) {

            oDialog.setInitialFocus(this.byId("selectStatus"));

            this.byId("inputSalesId").setValue(oOrder.OrderID);
            this.byId("inputSalesId").setEditable(false);
            this.byId("inputCustomerName").setEnabled(false);
            this.byId("inputCustomerName").setValue(oOrder.CustomerName);

            this.byId("selectStatus").setSelectedKey(oOrder.Status);

            var oDialogModel = this.getView().getModel("dialogData");

            oDialogModel.setProperty(
              "/Items",
              JSON.parse(JSON.stringify(oOrder.Items)),
            );
          }.bind(this),
        );
      },

      onDeleteSales(oEvent) {
        let oContext = oEvent.getSource().getBindingContext("orders");
        let oOrder = oContext.getObject();

        let oModel = this.getOwnerComponent().getModel("orders");
        let aOrders = oModel.getProperty("/SalesOrders");

        MessageBox.confirm(
          "Are you sure you want to delete this Sales order?",
          {
            onClose: function (sAction) {
              if (sAction === MessageBox.Action.OK) {
                var iIndex = aOrders.findIndex(function (item) {
                  return item.OrderID === oOrder.OrderID;
                });

                if (iIndex > -1) {
                  aOrders.splice(iIndex, 1);

                  oModel.setProperty("/SalesOrders", aOrders);

                  this.getOwnerComponent().saveOrdersData();

                  MessageToast.show("Sales Order deleted successfully.");
                }
              }
            }.bind(this),
          },
        );
      },
    });
  },
);
