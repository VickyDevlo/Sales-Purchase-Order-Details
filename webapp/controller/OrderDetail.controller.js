sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
  function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("sap.ui5.project.controller.OrderDetail", {
      onInit() {
        // Create a local detail view model to house active item arrays
        var oDetailModel = new JSONModel({ Items: [] });
        this.getView().setModel(oDetailModel, "detail");

        var oRouter = this.getOwnerComponent().getRouter();
        oRouter
          .getRoute("RouteOrderDetail")
          .attachPatternMatched(this._onObjectMatched, this);
      },
      onNavBack() {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteView1", {}, true);
      },

      _onObjectMatched(oEvent) {
        var sOrderType = oEvent.getParameter("arguments").orderType;
        var sOrderId = oEvent.getParameter("arguments").orderId;

        this._sCurrentOrderType = sOrderType;
        this._sCurrentOrderId = sOrderId;

        var oModel = this.getView().getModel("orders");

        if (!oModel) {
          this.getView().attachEventOnce(
            "modelContextChange",
            function () {
              this._populateOrderData(
                this._sCurrentOrderType,
                this._sCurrentOrderId,
              );
            },
            this,
          );
          return;
        }

        this._populateOrderData(sOrderType, sOrderId);
      },

      _populateOrderData(sOrderType, sOrderId) {
        var oModel =
          this.getView().getModel("orders") ||
          this.getOwnerComponent().getModel("orders");

        if (!oModel) {
          return;
        }

        var aOrders = [];
        var oMatchedData = null;

        if (sOrderType === "sales") {
          aOrders = oModel.getProperty("/SalesOrders") || [];
          oMatchedData = aOrders.find((item) => item.OrderID === sOrderId);

          this.byId("idPageTitle").setText("Sales Order: " + sOrderId);
          this.byId("txtPartnerName").setText(
            oMatchedData ? oMatchedData.CustomerName : "",
          );
          this.byId("txtTotal").setText(
            oMatchedData
              ? oMatchedData.NetAmount + " " + oMatchedData.Currency
              : "",
          );
        } else {
          aOrders = oModel.getProperty("/PurchaseOrders") || [];
          oMatchedData = aOrders.find((item) => item.PONumber === sOrderId);

          this.byId("idPageTitle").setText("Purchase Order: " + sOrderId);
          this.byId("txtPartnerName").setText(
            oMatchedData ? oMatchedData.SupplierName : "",
          );
          this.byId("txtTotal").setText(
            oMatchedData
              ? oMatchedData.TotalCost + " " + oMatchedData.Currency
              : "",
          );
        }

        if (oMatchedData) {
          this.byId("txtOrderId").setText(sOrderId);
          this.byId("txtStatus").setText(oMatchedData.Status);

          // NEW: Update the local detail model with the nested items array
          var aItems = oMatchedData.Items || [];
          this.getView().getModel("detail").setProperty("/Items", aItems);
        } else {
          // Clear table if no data found
          this.getView().getModel("detail").setProperty("/Items", []);
        }
      },
    });
  },
);
