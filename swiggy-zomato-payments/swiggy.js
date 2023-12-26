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
    var sections = data?.data;
    if (sections && sections.orders.length > 0) {
      swiggyOrders = await SwiggyCustom(sections["orders"]);
    }
    return {
      orders: swiggyOrders[0],
      totalOrderCount: swiggyOrders[0].length,
      resList: swiggyOrders[1],
    };
}

async function SwiggyCustom(firstBatch) {
    var completeOrderlist = [];
    var completeReslist = [];
    var flag = true;
    var complex = await getSwiggyOrders(firstBatch);
    completeOrderlist = complex[0];
    completeReslist = complex[1];
    while (flag) {
        var lastOrder = completeOrderlist[completeOrderlist.length - 1];
        const response = await fetch(`${swiggy_orders_url}${lastOrder.orderId}`);
        var data = await response.json();
        var sections = data.data;
        if (sections && sections.orders.length == 0) {
            flag = false;
            break;
        } else {
            var subOrderComplex = await getSwiggyOrders(sections['orders']);
            var subOrders = subOrderComplex[0];
            var subRes = subOrderComplex[1];
            var tempOrders = completeOrderlist.concat(subOrders);
            var tempRes = completeReslist.concat(subRes);
            completeOrderlist = tempOrders;
            completeReslist = tempRes;
        }

    }
    return [completeOrderlist, completeReslist]
}

async function getSwiggyOrders(orders) {
    var orderList = [];
    var resList = [];
    orders.forEach(function (order) {
        var temp = {};
        temp['orderId'] = order['order_id'];
        temp['totalCost'] = order['net_total']
        temp['resName'] = order['restaurant_name']
        temp['orderTime'] = order['order_time']
        orderList.push(temp);
        resList.push(order['restaurant_name'])
    });
    return [orderList, resList]
}