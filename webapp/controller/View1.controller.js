sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "../model/formatter",
  ],
  (Controller, JSONModel, Filter, FilterOperator, MessageToast, formatter) => {
    "use strict";

    return Controller.extend("sap.ui5.project.controller.View1", {
      formatter,
    });
  },
);
