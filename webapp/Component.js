sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui5/project/model/models",
    "sap/ui/model/json/JSONModel",
    "./model/mockData",
  ],
  (UIComponent, models, JSONModel, mockData) => {
    "use strict";

    const STORAGE_KEY = "ordersData";

    return UIComponent.extend("sap.ui5.project.Component", {
      metadata: {
        manifest: "json",
        interfaces: ["sap.ui.core.IAsyncContentCreation"],
      },

      init() {
        UIComponent.prototype.init.apply(this, arguments);

        // Device model
        this.setModel(models.createDeviceModel(), "device");

        // Load data from localStorage or mockData
        var oData = this._loadOrdersData(mockData);

        // Orders model
        this.setModel(new JSONModel(oData), "orders");

        // Initialize router
        this.getRouter().initialize();
      },

      _loadOrdersData(oDefaultData) {
        var sData = localStorage.getItem(STORAGE_KEY);

        if (sData) {
          try {
            return JSON.parse(sData);
          } catch (e) {
            console.error("Invalid localStorage data:", e);
            localStorage.removeItem(STORAGE_KEY);
          }
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(oDefaultData));

        return oDefaultData;
      },

      saveOrdersData() {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(this.getModel("orders").getData()),
        );
      },

      clearOrdersData() {
        localStorage.removeItem(STORAGE_KEY);
      },
    });
  },
);
