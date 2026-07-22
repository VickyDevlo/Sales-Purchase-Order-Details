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
        } else {
          aOrders = oModel.getProperty("/PurchaseOrders") || [];
          oMatchedData = aOrders.find((item) => item.PONumber === sOrderId);

          this.byId("idPageTitle").setText("Purchase Order: " + sOrderId);
          this.byId("txtPartnerName").setText(
            oMatchedData ? oMatchedData.SupplierName : "",
          );
        }

        if (oMatchedData) {
          this.byId("txtOrderId").setText(sOrderId);
          this.byId("txtStatus").setText(oMatchedData.Status);

          // Set Total Amount
          this.byId("txtTotal").setNumber(
            sOrderType === "sales"
              ? oMatchedData.NetAmount
              : oMatchedData.TotalCost,
          );

          this.byId("txtTotal").setUnit(oMatchedData.Currency);

          // Update line items
          this.getView()
            .getModel("detail")
            .setProperty("/Items", oMatchedData.Items || []);
        } else {
          this.byId("txtOrderId").setText("");
          this.byId("txtPartnerName").setText("");
          this.byId("txtStatus").setText("");

          this.byId("txtTotal").setNumber("");
          this.byId("txtTotal").setUnit("");

          this.getView().getModel("detail").setProperty("/Items", []);
        }
      },
    });
  },
);
