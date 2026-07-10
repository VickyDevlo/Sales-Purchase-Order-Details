sap.ui.define([], function () {
    "use strict";

    var Formatter = {
        statusColor: function (sStatus) {
            switch (sStatus) {
                case "Delivered":
                case "Approved": return 8; // Green
                case "Pending":
                case "In Progress": return 1; // Orange
                case "Cancelled": return 3; // Red
                default: return 7; // Grey
            }
        },

        statusState: function (sStatus) {
            switch (sStatus) {
                case "Delivered":
                case "Approved":
                    return "Success"; // Green
                case "Pending":
                    return "Warning"; // Orange
                case "In Progress":
                    return "Warning"; // Orange
                case "Cancelled":
                    return "Error";   // Red
                default:
                    return "None";    // Grey
            }
        }
    };

    // Expose globally to prevent "undefined" controller mapping runtime failures
    window.myGlobalFormatter = Formatter;

    return Formatter;
});