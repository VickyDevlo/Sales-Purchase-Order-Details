sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
  ],
  function (
    Controller,
    Filter,
    FilterOperator,
    Sorter,
    JSONModel,
    MessageToast,
    MessageBox,
  ) {
    "use strict";

    return Controller.extend("sap.ui5.project.controller.SalesTable", {
      // Reference global formatting mapping explicitly
      formatter: window.myGlobalFormatter,

      onCreateSales() {
        const oView = this.getView();
        if (!this._pSalesDialog) {
          this._pSalesDialog = this.loadFragment({
            name: "sap.ui5.project.view.fragments.CreateSalesDialog",
            controller: this,
          }).then((oDialog) => {
            oView.addDependent(oDialog);
            return oDialog;
          });
        }
        this._pSalesDialog.then((oDialog) => {
          const oDialogModel = this._initializeDialogModel();
          oView.setModel(oDialogModel, "dialogData");
          oDialog.setInitialFocus(this.byId("inputCustomerName"));

          oDialog.open();

          // Automatically generate and set the next clean sequence ID
          let sNextId = this._generateNextSalesId();
          this.byId("inputSalesId").setValue(sNextId);
          this.byId("inputCustomerName").setEnabled(true);
        });
      },

      onAddSalesItemRow() {
        let sProduct = this.byId("inputSalesProduct").getValue();
        let sQty = this.byId("inputSalesQty").getValue();
        let sPrice = this.byId("inputSalesPrice").getValue();

        if (!sProduct || !sQty || !sPrice) {
          MessageToast.show("Please enter Product, Quantity, and Price.");
          return;
        }

        let oDialogModel = this.getView().getModel("dialogData");
        let aItems = oDialogModel.getProperty("/Items") || [];

        let nTotalRowPrice = parseInt(sQty, 10) * parseFloat(sPrice);

        aItems.push({
          Product: sProduct,
          Quantity: parseInt(sQty),
          UnitPrice: parseFloat(sPrice).toFixed(2),
          TotalPrice: nTotalRowPrice.toFixed(2),
        });

        oDialogModel.setProperty("/Items", aItems);

        // Clear input row elements to allow consecutive entries
        this._clearItemInputs();
      },

      onSaveSales() {
        const oModel = this.getOwnerComponent().getModel("orders");
        let aSalesOrders = oModel.getProperty("/SalesOrders") || [];

        let sId = this.byId("inputSalesId").getValue();
        let sCustomer = this.byId("inputCustomerName").getValue();
        let sStatus = this.byId("selectStatus").getSelectedKey();

        let oDialogModel = this.getView().getModel("dialogData");
        let aItems = oDialogModel.getProperty("/Items") || [];

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
        let nTotalSum = aItems.reduce(
          (acc, item) => acc + parseFloat(item.TotalPrice),
          0,
        );
        let oNewOrder = {
          OrderID: sId,
          CustomerName: sCustomer,
          NetAmount: nTotalSum,
          Currency: "EUR",
          Status: sStatus,
          Items: [...(aItems || [])],
        };

        // Appends structural order context onto the bottom of the data grid rows array
        if (this._editingOrder) {
          let iIndex = aSalesOrders.findIndex(
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
        this._resetSaleDialog();
      },

      onSearchSales(oEvent) {
        let sQuery = oEvent.getParameter("query");
        let aFilters = sQuery
          ? [new Filter("OrderID", FilterOperator.Contains, sQuery)]
          : [];
        this.byId("salesTable").getBinding("items").filter(aFilters);
      },

      onDetails(oEvent) {
        let oItem = oEvent.getSource();
        let oContext = oItem.getBindingContext("orders");
        let sOrderId = oContext.getProperty("OrderID");

        let oRouter = this.getOwnerComponent().getRouter();
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

        this._pSalesDialog.then(
          function (oDialog) {
            oDialog.setInitialFocus(this.byId("selectStatus"));

            this.byId("inputSalesId").setValue(oOrder.OrderID);
            this.byId("inputSalesId").setEditable(false);
            this.byId("inputCustomerName").setEnabled(false);
            this.byId("inputCustomerName").setValue(oOrder.CustomerName);

            this.byId("selectStatus").setSelectedKey(oOrder.Status);

            let oDialogModel = this.getView().getModel("dialogData");
            const oBundle = this._getResourceBundle();
            oDialogModel.setProperty(
              "/dialogTitle",
              oBundle.getText("updateSalesOrderTitle"),
            );

            oDialogModel.setProperty(
              "/btnText",
              oBundle.getText("updateButton"),
            );

            oDialogModel.setProperty(
              "/Items",
              JSON.parse(JSON.stringify(oOrder.Items || [])),
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
                let iIndex = aOrders.findIndex(function (item) {
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
      onSortSales(oEvent) {
        const sKey = oEvent.getParameter("item").getKey();
        this.byId("salesTable")
          .getBinding("items")
          .sort(this._getSalesSorter(sKey));
      },
      // Helper
      _initializeDialogModel() {
        const oBundle = this._getResourceBundle();
        return new JSONModel({
          dialogTitle: oBundle.getText("createSalesOrderTitle"),
          btnText: oBundle.getText("saveButton"),
          Items: [],
        });
      },
      _getResourceBundle() {
        return this.getOwnerComponent().getModel("i18n").getResourceBundle();
      },
      _resetSaleDialog() {
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
      _clearItemInputs() {
        this.byId("inputSalesProduct").setValue("");
        this.byId("inputSalesQty").setValue("");
        this.byId("inputSalesPrice").setValue("");
      },
      _generateNextSalesId() {
        const oModel = this.getOwnerComponent().getModel("orders");
        let aOrders = oModel.getProperty("/SalesOrders") || [];

        let sYear = new Date().getFullYear().toString();

        // Get only current year's orders
        let aCurrentYearOrders = aOrders.filter(function (oOrder) {
          return oOrder.OrderID && oOrder.OrderID.split("-")[1] === sYear;
        });

        // If no orders for this year, start from 001
        if (aCurrentYearOrders.length === 0) {
          return "SO-" + sYear + "-001";
        }

        // Find the highest sequence number for the current year
        let nMax = Math.max.apply(
          null,
          aCurrentYearOrders.map(function (oOrder) {
            return parseInt(oOrder.OrderID.split("-")[2], 10);
          }),
        );

        return "SO-" + sYear + "-" + String(nMax + 1).padStart(3, "0");
      },
      _getSalesSorter(sKey) {
        const mSorters = {
          orderAsc: {
            path: "OrderID",
            descending: false,
          },

          orderDesc: {
            path: "OrderID",
            descending: true,
          },

          customerAsc: {
            path: "CustomerName",
            descending: false,
          },

          customerDesc: {
            path: "CustomerName",
            descending: true,
          },

          amountAsc: {
            path: "NetAmount",
            descending: false,
          },

          amountDesc: {
            path: "NetAmount",
            descending: true,
          },

          status: {
            path: "Status",
            descending: false,
          },
        };

        const oConfig = mSorters[sKey];

        return oConfig ? new Sorter(oConfig.path, oConfig.descending) : null;
      },
    });
  },
);
