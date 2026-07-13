sap.ui.define([], function () {
    "use strict";

    const STORAGE_KEY = "ordersData";

    return {
        load(defaultData) {
            var sData = localStorage.getItem(STORAGE_KEY);

            return sData ? JSON.parse(sData) : defaultData;
        },

        save(data) {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(data)
            );
        }
    };
});