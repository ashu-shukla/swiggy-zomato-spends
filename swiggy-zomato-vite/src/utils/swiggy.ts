const swiggy_orders_url = "https://www.swiggy.com/dapi/order/all";

export const isSwiggyLoggedIn = async () => {
  const response = await fetch(swiggy_orders_url);
  var data = await response.json();
  return !data.statusCode;
};

const fetchSwiggyOrders = async (lastOrderId?:any) => { 
    const response = await fetch(`${swiggy_orders_url}${lastOrderId ? `?order_id=${lastOrderId}` : ''}`);
    var data = await response.json();
    return data?.data;
};

export const getSwiggyInfo = async (callBack: any) => {
  const  swiggyOrders = await SwiggyCustom(callBack);
  return {
    orders: swiggyOrders[0],
    totalOrderCount: swiggyOrders[0].length,
    errorList: swiggyOrders[2],
    resList: swiggyOrders[1],
    totalErrorOrders: swiggyOrders[2].length,
  };
};

async function SwiggyCustom(callBack: any) {
    let completeOrderlist:any[] = [];
    let completeReslist:any[] = [];
    let completeErrorList:any[] = [];
    let flag = true;
    let lastOrderId = null;
    do {
        const swiggyOrders = await fetchSwiggyOrders(lastOrderId);
        if (!swiggyOrders || swiggyOrders.orders.length == 0) {
            flag = false;
            break;
        } else {
            callBack(swiggyOrders.orders.length);
            const structuredOrders = await createSwiggyOrderData(swiggyOrders["orders"]);
            const orderList = structuredOrders[0];
            const restaurantList = structuredOrders[1];
            const errorOrders = structuredOrders[2];
            completeOrderlist = completeOrderlist.concat(orderList);
            completeReslist = completeReslist.concat(restaurantList);
            completeErrorList = completeErrorList.concat(errorOrders);
            console.log(swiggyOrders.orders[swiggyOrders.orders.length - 1])
            lastOrderId =
              swiggyOrders.orders[swiggyOrders.orders.length - 1]?.order_id;
        }
    } while (
        flag
    );
  return [completeOrderlist, completeReslist, completeErrorList];
}

async function createSwiggyOrderData(orders: any[]) {
  var orderList: any[] = [];
  var resList: any[] = [];
  var errorOrderList: any[] = [];
  orders.forEach(function (order) {
    var temp: any = {};
    temp["orderId"] = order["order_id"];
    temp["totalCost"] = order["net_total"];
    temp["resName"] = order["restaurant_name"];
    temp["orderTime"] = order["order_time"];
    temp["orderStatus"] = order["order_status"];
    temp["deliveryTime"] = parseInt(order["delivery_time_in_seconds"]);
    if (order["order_status"]?.toLowerCase() === "delivered") {
      orderList.push(temp);
    } else {
      errorOrderList.push(temp);
    }
    resList.push(order["restaurant_name"]);
  });
  return [orderList, resList, errorOrderList];
}
