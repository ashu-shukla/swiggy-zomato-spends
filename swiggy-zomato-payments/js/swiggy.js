let swiggy_orders_url = 'https://www.swiggy.com/dapi/order/all?order_id=';

async function isSwiggyLoggedIn() {
    const response = await fetch(swiggy_orders_url);
    var data = await response.json();
    return !data.statusCode
}

async function getSwiggyInfo() {
    var swiggyOrders = [];
    const response = await fetch(swiggy_orders_url);
    var data = await response.json();
    var sections = data.data;
    swiggyOrders = await SwiggyCustom(sections['orders']);
    return { 'orders': swiggyOrders[0], 'totalOrderCount': swiggyOrders[0].length, 'errorList': swiggyOrders[2], 'resList': swiggyOrders[1], 'totalErrorOrders': swiggyOrders[2].length }
}

async function SwiggyCustom(firstBatch) {
    var completeOrderlist = [];
    var completeReslist = [];
    var completeErrorList = [];
    var flag = true;
    var complex = await getSwiggyOrders(firstBatch);
    completeOrderlist = complex[0];
    completeReslist = complex[1];
    completeErrorList = complex[2];
    while (flag) {
        var lastOrder = completeOrderlist[completeOrderlist.length - 1];
        const response = await fetch(`${swiggy_orders_url}${lastOrder.orderId}`);
        var data = await response.json();
        var sections = data.data;
        if (!sections || sections.orders.length == 0) {
            flag = false;
            break;
        } else {
            var subOrderComplex = await getSwiggyOrders(sections['orders']);
            var subOrders = subOrderComplex[0];
            var subRes = subOrderComplex[1];
            var subErrors = subOrderComplex[2];
            var tempOrders = completeOrderlist.concat(subOrders);
            var tempRes = completeReslist.concat(subRes);
            var tempError = completeErrorList.concat(subErrors);
            completeOrderlist = tempOrders;
            completeReslist = tempRes;
            completeErrorList = tempError;
        }

    }
    return [completeOrderlist, completeReslist, completeErrorList]
}

async function getSwiggyOrders(orders) {
    var orderList = [];
    var resList = [];
    var errorOrderList = [];
    orders.forEach(function (order) {
        var temp = {};
        temp['orderId'] = order['order_id'];
        temp['totalCost'] = order['net_total']
        temp['resName'] = order['restaurant_name']
        temp['orderTime'] = order['order_time']
        temp['orderStatus'] = order['order_status']
        temp['deliveryTime'] = parseInt(order['delivery_time_in_seconds'])
        if (order['order_status'] == "Delivered") {
            orderList.push(temp);
        } else {
            errorOrderList.push(temp);
        }

        resList.push(order['restaurant_name'])
    });
    return [orderList, resList, errorOrderList]
}