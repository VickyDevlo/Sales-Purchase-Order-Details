sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/m/MessageBox",
  ],
  function (
    Controller,
    Filter,
    FilterOperator,
    MessageToast,
    JSONModel,
    formatter,
    MessageBox,
  ) {
    "use strict";

    return Controller.extend("sap.ui5.project.controller.PurchaseTable", {
      formatter: formatter,

      onSearchPurchase(oEvent) {
        var sQuery = oEvent.getParameter("query");

        var aFilters = sQuery
          ? [new Filter("PONumber", FilterOperator.Contains, sQuery)]
          : [];

        this.byId("purchaseTable").getBinding("items").filter(aFilters);
      },

      onCreatePurchase() {
        var oView = this.getView();

        if (!this._pPurchaseDialog) {
          this._pPurchaseDialog = this.loadFragment({
            name: "sap.ui5.project.view.fragments.CreatePurchaseDialog",
            controller: this,
          }).then((oDialog) => {
            oView.addDependent(oDialog);
            return oDialog;
          });
        }
        this._pPurchaseDialog.then(
          function (oDialog) {
            var oDialogModel = new JSONModel({
              dialogTitle: "Create New Purchase Order",
              btnText:"Save",
              Items: [],
            });
            oView.setModel(oDialogModel, "dialogData");
            this.byId("inputPOId").setEnabled(false);
            oDialog.setInitialFocus(this.byId("inputSupplierName"));
            this.byId("inputSupplierName").setEnabled(true);
            oDialog.open();

            // DYNAMIC: Automatically generate and set the next clean sequence ID
            var sNextId = this._generateNextPurchaseId();
            this.byId("inputPOId").setValue(sNextId);
          }.bind(this),
        );
      },

      _generateNextPurchaseId() {
        var oModel = this.getOwnerComponent().getModel("orders");
        var aOrders = oModel.getProperty("/PurchaseOrders") || [];

        if (aOrders.length === 0) {
          return "PO-9901"; // Fallback string if array is empty
        }

        var aNumbers = aOrders.map(function (oOrder) {
          // Splitting "PO-99010" by "-" yields ["PO", "99010"]
          var aParts = oOrder.PONumber.split("-");
          var sLastPart = aParts[aParts.length - 1]; // "99010"

          // Isolate just the trailing dynamic part (e.g. from 99010 we parse out the consecutive tail)
          // If your prefix is static "PO-990", let's drop the "990" string part to isolate the counter number
          var sCounterStr = sLastPart.substring(3); // Drops "990" to isolate "10"
          return parseInt(sCounterStr, 10);
        });

        var nMaxNumber = Math.max.apply(null, aNumbers);
        var nNextNumber = nMaxNumber + 1; // 10 + 1 = 11

        // Concatenate the structural prefix back onto the calculated value
        return "PO-990" + nNextNumber;
      },

      onAddPOItemRow() {
        var sProduct = this.byId("inputPOProduct").getValue();
        var sQty = this.byId("inputPOQty").getValue();
        var sPrice = this.byId("inputPOPrice").getValue();

        if (!sProduct || !sQty || !sPrice) {
          sap.m.MessageToast.show("Please enter Product, Quantity, and Price.");
          return;
        }

        var oDialogModel = this.getView().getModel("dialogData");
        var aItems = oDialogModel.getProperty("/Items");
        var nTotalRowPrice = parseInt(sQty, 10) * parseFloat(sPrice);

        aItems.push({
          Product: sProduct,
          Quantity: parseInt(sQty, 10),
          UnitPrice: parseFloat(sPrice).toFixed(2),
          TotalPrice: nTotalRowPrice.toFixed(2),
        });

        oDialogModel.setProperty("/Items", aItems);

        this.byId("inputPOProduct").setValue("");
        this.byId("inputPOQty").setValue("");
        this.byId("inputPOPrice").setValue("");
      },

      onSavePurchase() {
        var sId = this.byId("inputPOId").getValue();
        var sSupplier = this.byId("inputSupplierName").getValue();
        var sStatus = this.byId("selectPOStatus").getSelectedKey();

        var oDialogModel = this.getView().getModel("dialogData");
        var aItems = oDialogModel.getProperty("/Items") || [];

        if (!sId || !sSupplier) {
          sap.m.MessageToast.show(
            "Please complete PO Number and Supplier Name fields.",
          );
          return;
        }
        if (aItems.length === 0) {
          MessageToast.show(
            "Please add at least one line item row below before saving.",
          );
          return;
        }
        var nTotalSum = aItems.reduce(
          (acc, item) => acc + parseFloat(item.TotalPrice),
          0,
        );
        var sFormattedCost = nTotalSum.toLocaleString("en-US", {
          minimumFractionDigits: 2,
        });

        var oModel = this.getOwnerComponent().getModel("orders");
        var aPurchaseOrders = oModel.getProperty("/PurchaseOrders");

        var oNewPO = {
          PONumber: sId,
          SupplierName: sSupplier,
          TotalCost: sFormattedCost,
          Currency: "EUR",
          Status: sStatus,
          Items: aItems,
        };

        if (this._editingIndex !== undefined && this._editingIndex !== null) {
          aPurchaseOrders[this._editingIndex] = oNewPO;
        } else {
          aPurchaseOrders.push(oNewPO);
        }

        oModel.setProperty("/PurchaseOrders", aPurchaseOrders);

        // Save to localStorage
        this.getOwnerComponent().saveOrdersData();

        this._editingIndex = null;
        oModel.setProperty("/PurchaseOrders", aPurchaseOrders);

        // Save to localStorage
        this.getOwnerComponent().saveOrdersData();

        sap.m.MessageToast.show(
          "Purchase Order " + sId + " saved successfully!",
        );
        this.onClosePurchaseDialog();
      },

      onClosePurchaseDialog() {
        this.byId("idPurchaseDialog").close();

        this.byId("inputPOId").setEnabled(true);

        this.byId("inputPOId").setValue("");
        this.byId("inputSupplierName").setValue("");
        this.byId("selectPOStatus").setSelectedKey("");

        this.getView().getModel("dialogData").setProperty("/Items", []);

        this._editingIndex = null;
      },
      onDetails(oEvent) {
        var oItem = oEvent.getSource();
        var oContext = oItem.getBindingContext("orders");
        var sPOId = oContext.getProperty("PONumber");

        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteOrderDetail", {
          orderType: "purchase",
          orderId: sPOId,
        });
      },
      onEditPurchase(oEvent) {
        var oContext = oEvent.getSource().getBindingContext("orders");
        var oPurchase = oContext.getObject();

        this._editingIndex = parseInt(oContext.getPath().split("/").pop(), 10);

        this.onCreatePurchase();

        this._pPurchaseDialog.then(
          function (oDialog) {
            this.byId("inputPOId").setValue(oPurchase.PONumber);
            this.byId("inputPOId").setEnabled(false);
            this.byId("inputSupplierName").setEnabled(false);
            oDialog.setInitialFocus(this.byId("selectPOStatus"));

            this.byId("inputSupplierName").setValue(oPurchase.SupplierName);
            this.byId("selectPOStatus").setSelectedKey(oPurchase.Status);

            var oDialogModel = this.getView().getModel("dialogData");
            oDialogModel.setProperty("/dialogTitle", "Update Purchase Order");
            oDialogModel.setProperty("/btnText", "Update");

            oDialogModel.setProperty(
              "/Items",
              JSON.parse(JSON.stringify(oPurchase.Items)),
            );
          }.bind(this),
        );
      },
      onDeletePurchase(oEvent) {
        var oContext = oEvent.getSource().getBindingContext("orders");
        var iIndex = parseInt(oContext.getPath().split("/").pop(), 10);

        var oModel = this.getOwnerComponent().getModel("orders");
        var aPurchaseOrders = oModel.getProperty("/PurchaseOrders");

        MessageBox.confirm(
          "Are you sure you want to delete this Purchase Order?",
          {
            onClose: function (sAction) {
              if (sAction === MessageBox.Action.OK) {
                aPurchaseOrders.splice(iIndex, 1);

                oModel.setProperty("/PurchaseOrders", aPurchaseOrders);

                this.getOwnerComponent().saveOrdersData();

                MessageToast.show("Purchase Order deleted successfully.");
              }
            }.bind(this),
          },
        );
      },
    });
  },
);
