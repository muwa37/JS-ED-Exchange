"use strict";

const logoutButton = new LogoutButton;
const ratesBoard = new RatesBoard;
const moneyManager = new MoneyManager;
const favoritesWidget = new FavoritesWidget;

const callback = method => response => (response.success) && method(response.data);

function updateTable(data) {
    ratesBoard.clearTable();
    ratesBoard.fillTable(data);
}

const updateStocks = () => ApiConnector.getStocks(callback(updateTable));

logoutButton.action = () => ApiConnector.logout(callback(window.location.reload.bind(window.location)));
ApiConnector.current(callback(ProfileWidget.showProfile));
ApiConnector.getFavorites(callback(updateFavorites));
updateStocks();
setInterval(updateStocks, 60000);

function updateFavorites(data) {
    favoritesWidget.clearTable(data);
    favoritesWidget.fillTable(data);
    moneyManager.updateUsersList(data);
}

const handler = (showFunc, errorBox, method, message) => data => method(data, response => {
    if (response.success) {
        showFunc(response.data);
        let fullMessage = response.data.created_at ? `${response.data.created_at}, ${response.data.login}: ` + message : message;
        errorBox.setMessage(!response.success, fullMessage);
    } else {
        errorBox.setMessage(!response.success, response.data);
    }
});

moneyManager.addMoneyCallback = handler(ProfileWidget.showProfile, moneyManager, ApiConnector.addMoney, 'Баланс успешно пополнен!');
moneyManager.conversionMoneyCallback = handler(ProfileWidget.showProfile, moneyManager, ApiConnector.convertMoney, 'Конвертация успешно выполнена!');
moneyManager.sendMoneyCallback = handler(ProfileWidget.showProfile, moneyManager, ApiConnector.transferMoney, 'Перевод успешно выполнен');
favoritesWidget.addUserCallback = handler(updateFavorites, favoritesWidget, ApiConnector.addUserToFavorites, 'Пользователь успешно добавлен!');
favoritesWidget.removeUserCallback = handler(updateFavorites, favoritesWidget, ApiConnector.removeUserFromFavorites, 'Пользователь успешно удален!');