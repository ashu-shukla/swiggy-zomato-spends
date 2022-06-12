// background.js

chrome.runtime.onInstalled.addListener(() => {
    // Initialize button with user's preferred color
    let isZomato = false;
    let isSwiggy = false;
    preloadFunc();
    async function preloadFunc() {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab.url.includes('www.zomato.com')) {
            isZomato = true;
        }
        await main();
    }

    async function main() {
        var orders = {};
        if (isZomato) {
            orders = await getAllInfo();
            console.log(orders)
        }
    }
    async function getAllInfo() {
        var totalPages;
        var totalOrderCount;
        var orders = [];
        const response = await fetch('https://www.zomato.com/webroutes/user/orders?page=1');
        var data = await response.json();
        var sections = data.sections['SECTION_USER_ORDER_HISTORY'];
        totalPages = sections.totalPages;
        totalOrderCount = sections.count;
        orders = await getOrders(totalPages, totalOrderCount);
        return { 'orders': orders, 'totalOrderCount': totalOrderCount }
    }

    async function getOrders(tpage, torders) {
        var orderlist = [];
        for (var i = 1; i <= tpage; i++) {
            const response = await fetch(`https://www.zomato.com/webroutes/user/orders?page=${i}`);
            var data = await response.json();
            var entities = data.entities['ORDER'];
            for (var key in entities) {
                var order = {};
                var obj = entities[key];
                order['orderId'] = obj['orderId'];
                order['totalCost'] = convertToNumber(obj['totalCost']);
                order['resName'] = obj.resInfo.name;
                orderlist.push(order);
            }
        }
        return orderlist
    }

    function convertToNumber(str) {
        var tnum = str.substring(1);
        return parseFloat(tnum);
    }
    console.log('Hello');
});
// chrome.tabs.onUpdated.addListener(function
//     (tabId, changeInfo, tab) {
//     // read changeInfo data and do something with it (like read the url)
//     if (changeInfo.url) {
//         // do something here

//     }
// }
// );

