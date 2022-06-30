let zomato_orders_url = 'https://www.zomato.com/webroutes/user/orders?page='

async function isZomatoLoggedIn() {
    const response = await fetch(zomato_orders_url);
    var data = await response.json();
    var sections = data.sections['SECTION_USER_ORDER_HISTORY'];
    var totalPages = sections.totalPages;
    var totalOrderCount = sections.count;
    if (totalOrderCount == 0 && totalPages == 0) {
        return false
    }
    return true
}

async function getAllInfoZomato() {
    var totalPages;
    var totalOrderCount;
    var orders = [];
    const response = await fetch(`${zomato_orders_url}1`);
    var data = await response.json();
    var sections = data.sections['SECTION_USER_ORDER_HISTORY'];
    totalPages = sections.totalPages;
    totalOrderCount = sections.count;
    orders = await getZomatoOrders(totalPages, totalOrderCount);
    return { 'orders': orders[0], 'totalOrderCount': orders[0].length, 'resList': orders[1], 'errorList': orders[2], 'totalErrorOrders': orders[2].length }
}

async function getZomatoOrders(tpage, torders) {
    var orderList = [];
    var resList = [];
    var errorOrderList = [];
    for (var i = 1; i <= tpage; i++) {
        const response = await fetch(`${zomato_orders_url}${i}`);
        var data = await response.json();
        var entities = data.entities['ORDER'];
        for (var key in entities) {
            var order = {};
            var obj = entities[key];
            order['orderId'] = obj['orderId'];
            order['totalCost'] = convertToNumber(obj['totalCost']);
            order['resName'] = obj.resInfo.name;
            order['orderTime'] = obj['orderDate']
            order['orderStatus'] = obj.deliveryDetails['deliveryLabel']
            resList.push(obj.resInfo.name);
            if (order['orderStatus'] == "Delivered") {
                orderList.push(order);
            } else {
                errorOrderList.push(order);
            }
        }
    }
    return [orderList, resList, errorOrderList]
}

