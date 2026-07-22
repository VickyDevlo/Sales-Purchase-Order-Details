sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/m/MessageBox",
  ],
  function (
    Controller,
    Filter,
    FilterOperator,
    Sorter,
    MessageToast,
    JSONModel,
    formatter,
    MessageBox,
  ) {
    "use strict";

    return Controller.extend("sap.ui5.project.controller.PurchaseTable", {
      formatter: formatter,

      onSearchPurchase(oEvent) {
        const sQuery = oEvent.getParameter("query");

        let aFilters = sQuery
          ? [new Filter("PONumber", FilterOperator.Contains, sQuery)]
          : [];

        this.byId("purchaseTable").getBinding("items").filter(aFilters);
      },

      onCreatePurchase() {
        const oView = this.getView();

        if (!this._pPurchaseDialog) {
          this._pPurchaseDialog = this.loadFragment({
            name: "sap.ui5.project.view.fragments.CreatePurchaseDialog",
            controller: this,
          }).then((oDialog) => {
            oView.addDependent(oDialog);
            return oDialog;
          });
        }
        this._pPurchaseDialog.then((oDialog) => {
          const oDialogModel = this._initializeDialogModel();

          oView.setModel(oDialogModel, "dialogData");
          this.byId("inputPOId").setEnabled(false);

          oDialog.setInitialFocus(this.byId("inputSupplierName"));
          this.byId("inputSupplierName").setEnabled(true);

          oDialog.open();

          // DYNAMIC: Automatically generate and set the next clean sequence ID
          let sNextId = this._generateNextPurchaseId();
          this.byId("inputPOId").setValue(sNextId);
        });
      },

      onAddPOItemRow() {
        let sProduct = this.byId("inputPOProduct").getValue();
        let sQty = this.byId("inputPOQty").getValue();
        let sPrice = this.byId("inputPOPrice").getValue();

        if (!sProduct || !sQty || !sPrice) {
          MessageToast.show("Please enter Product, Quantity, and Price.");
          return;
        }

        let oDialogModel = this.getView().getModel("dialogData");
        let aItems = oDialogModel.getProperty("/Items");
        let nTotalRowPrice = parseInt(sQty, 10) * parseFloat(sPrice);

        aItems.push({
          Product: sProduct,
          Quantity: parseInt(sQty),
          UnitPrice: parseFloat(sPrice).toFixed(2),
          TotalPrice: nTotalRowPrice.toFixed(2),
        });

        oDialogModel.setProperty("/Items", aItems);

        this._clearItemInputs();
      },

      onSavePurchase() {
        let sId = this.byId("inputPOId").getValue();
        let sSupplier = this.byId("inputSupplierName").getValue();
        let sStatus = this.byId("selectPOStatus").getSelectedKey();
        let oDialogModel = this.getView().getModel("dialogData");
        let aItems = oDialogModel.getProperty("/Items") || [];

        if (!sId || !sSupplier) {
          MessageToast.show(
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
        let nTotalSum = aItems.reduce(
          (acc, item) => acc + parseFloat(item.TotalPrice),
          0,
        );
        const oModel = this.getOwnerComponent().getModel("orders");
        let aPurchaseOrders = oModel.getProperty("/PurchaseOrders");

        let oNewPO = {
          PONumber: sId,
          SupplierName: sSupplier,
          TotalCost: nTotalSum,
          Currency: "EUR",
          Status: sStatus,
          Items: [...(aItems || [])],
        };

        if (this._editingIndex !== undefined && this._editingIndex !== null) {
          aPurchaseOrders[this._editingIndex] = oNewPO;
        } else {
          aPurchaseOrders.push(oNewPO);
        }

        oModel.setProperty("/PurchaseOrders", aPurchaseOrders);
        this.getOwnerComponent().saveOrdersData();
        this._editingIndex = null;

        MessageToast.show("Purchase Order " + sId + " saved successfully!");
        this.onClosePurchaseDialog();
      },

      onClosePurchaseDialog() {
        this.byId("idPurchaseDialog").close();
        this._resetPurchaseDialog();
      },
      onDetails(oEvent) {
        let oItem = oEvent.getSource();
        let oContext = oItem.getBindingContext("orders");
        let sPOId = oContext.getProperty("PONumber");

        let oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteOrderDetail", {
          orderType: "purchase",
          orderId: sPOId,
        });
      },
      onEditPurchase(oEvent) {
        let oContext = oEvent.getSource().getBindingContext("orders");
        let oPurchase = oContext.getObject();

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

            let oDialogModel = this.getView().getModel("dialogData");
            const oBundle = this._getResourceBundle();

            oDialogModel.setProperty(
              "/dialogTitle",
              oBundle.getText("updatePurchaseOrderTitle"),
            );

            oDialogModel.setProperty(
              "/btnText",
              oBundle.getText("updateButton"),
            );

            oDialogModel.setProperty(
              "/Items",
              JSON.parse(JSON.stringify(oPurchase.Items || [])),
            );
          }.bind(this),
        );
      },
      onDeletePurchase(oEvent) {
        let oContext = oEvent.getSource().getBindingContext("orders");
        let iIndex = parseInt(oContext.getPath().split("/").pop(), 10);

        let oModel = this.getOwnerComponent().getModel("orders");
        let aPurchaseOrders = oModel.getProperty("/PurchaseOrders");

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
      onSortPurchase(oEvent) {
        const sKey = oEvent.getParameter("item").getKey();
        this.byId("purchaseTable")
          .getBinding("items")
          .sort(this._getPurchaseSorter(sKey));
      },
      // Helper
      _initializeDialogModel() {
        const oBundle = this._getResourceBundle();
        return new JSONModel({
          dialogTitle: oBundle.getText("createPurchaseOrderTitle"),
          btnText: oBundle.getText("saveButton"),
          Currency: "EUR",
          Items: [],
        });
      },
      _getResourceBundle() {
        return this.getOwnerComponent().getModel("i18n").getResourceBundle();
      },
      _resetPurchaseDialog() {
        this.byId("inputPOId").setValue("");
        this.byId("inputSupplierName").setValue("");
        this.byId("selectPOStatus").setSelectedKey("");
        this.byId("inputPOId").setEnabled(false);
        this.byId("inputSupplierName").setEnabled(true);

        this.getView().getModel("dialogData").setProperty("/Items", []);

        this._editingIndex = null;
      },
      _clearItemInputs() {
        this.byId("inputPOProduct").setValue("");
        this.byId("inputPOQty").setValue("");
        this.byId("inputPOPrice").setValue("");
      },
      _generateNextPurchaseId() {
        let oModel = this.getOwnerComponent().getModel("orders");
        let aOrders = oModel.getProperty("/PurchaseOrders") || [];

        if (aOrders.length === 0) {
          return "PO-9901"; // Fallback string if array is empty
        }

        let aNumbers = aOrders.map(function (oOrder) {
          // Splitting "PO-99010" by "-" yields ["PO", "99010"]
          let aParts = oOrder.PONumber.split("-");
          let sLastPart = aParts[aParts.length - 1]; // "99010"

          // Isolate just the trailing dynamic part (e.g. from 99010 we parse out the consecutive tail)
          // If your prefix is static "PO-990", let's drop the "990" string part to isolate the counter number
          let sCounterStr = sLastPart.substring(3); // Drops "990" to isolate "10"
          return parseInt(sCounterStr, 10);
        });

        let nMaxNumber = Math.max.apply(null, aNumbers);
        let nNextNumber = nMaxNumber + 1; // 10 + 1 = 11

        // Concatenate the structural prefix back onto the calculated value
        return "PO-990" + nNextNumber;
      },
      _getPurchaseSorter(sKey) {
        const mSorters = {
          poAsc: {
            path: "PONumber",
            descending: false,
          },
          poDesc: {
            path: "PONumber",
            descending: true,
          },
          supplierAsc: {
            path: "SupplierName",
            descending: false,
          },
          supplierDesc: {
            path: "SupplierName",
            descending: true,
          },
          costAsc: {
            path: "TotalCost",
            descending: false,
          },
          costDesc: {
            path: "TotalCost",
            descending: true,
          },
          status: {
            path: "Status",
            descending: false,
          },
        };

        const oConfig = mSorters[sKey];

        if (!oConfig) {
          return null;
        }

        const oSorter = new Sorter(oConfig.path, oConfig.descending);

        if (oConfig.path === "PONumber") {
          oSorter.fnCompare = function (a, b) {
            const nA = Number(a.replace("PO-990", ""));
            const nB = Number(b.replace("PO-990", ""));

            return nA - nB;
          };
        }

        return oSorter;
      },
    });
  },
);
