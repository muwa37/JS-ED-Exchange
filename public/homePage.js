"use strict";

const logoutButton = new LogoutButton();

let callback = method => response => (response.success) && method(response.data);

function updateTable(data) {
    ratesBoard.clearTable();
    ratesBoard.fillTable(data);
}

let updateStocks = () => ApiConnector.getStocks(callback(updateTable));

logoutButton.action = () => ApiConnector.logout(callback(window.location.reload.bind(window.location)));
ApiConnector.current(callback(ProfileWidget.showProfile));
ApiConnector.getFavorites(callback(updateFavorites));
updateStocks();
setInterval(updateStocks, 60000);
