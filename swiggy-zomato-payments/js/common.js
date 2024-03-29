// Flags to check if it's Swiggy or Zomato.
let isSwiggy = false;
let isZomato = false;

// Order JSON
var zomatoOrders = {};
var swiggyOrders = {};

// HTML elements for user prompts.
const holdon = document.querySelector('#holdon');
const wrongSite = document.querySelector('#wrongSite');
const notLoggedin = document.querySelector('#notLoggedin');
const loader = document.querySelector('#load');
const zspend = document.querySelector('#zspend');
const ztotal = document.querySelector('#ztotal');
const zerror = document.querySelector('#zerror');
const zplaced = document.querySelector('#zplaced');
const zres = document.querySelector('#zres');
const zhigh = document.querySelector('#zhigh');
const zold = document.querySelector('#zold');
const bob = document.querySelector('#bob').addEventListener('click', saveXLS);


const active = document.getElementById("active");
active.style.display = "none";
const swigInfo = document.querySelector('#swigInfo');
swigInfo.style.display = "none";
// Function to check if user is on Zomato or Swiggy and logged-in on extension open.
async function preloadFunc() {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.url.includes('www.swiggy.com')) {
        var checkSwiggyLogin = await isSwiggyLoggedIn();
        if (checkSwiggyLogin) {
            isSwiggy = true;
            holdon.style.display = "none";
            await swiggy();
        } else {
            holdon.style.display = "none";
            notLoggedin.style.display = "block";
        }

    } else if (tab.url.includes('www.zomato.com')) {
        var checkZomatoLogin = await isZomatoLoggedIn();
        if (checkZomatoLogin) {
            isZomato = true;
            holdon.style.display = "none";
            await zomato();

        } else {
            holdon.style.display = "none";
            notLoggedin.style.display = "block";
        }
    } else {
        holdon.style.display = "none";
        wrongSite.style.display = "block";
    }

}
window.onpaint = preloadFunc();

async function zomato() {
    if (isZomato) {
        loader.style.display = 'block'
        zomatoOrders = await getAllInfoZomato();
        // console.log(zomatoOrders);
        loader.style.display = 'none'
        active.style.display = "flex";
        ztotal.innerHTML = zomatoOrders.totalOrderCount + zomatoOrders.totalErrorOrders;
        zplaced.innerHTML = zomatoOrders.totalOrderCount;
        zerror.innerHTML = zomatoOrders.totalErrorOrders;
        zspend.innerHTML = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalSpend(zomatoOrders.orders));
        var frequentRes = getMostFrequent(zomatoOrders.resList);
        zres.innerHTML = `${frequentRes[0]} - ${frequentRes[1]} orders.`;
        var maxSpend = highestOrder(zomatoOrders.orders);
        zhigh.innerHTML = `${convertToRupee(maxSpend.totalCost)} <br /> ${maxSpend.resName} <br /> ${convertDate(maxSpend.orderTime, true)}`;
        var oldest = zomatoOrders.orders[zomatoOrders.orders.length - 1];
        zold.innerHTML = `${convertToRupee(oldest.totalCost)} <br /> ${oldest.resName} <br /> ${convertDate(oldest.orderTime, true)}`;

    }
}

async function swiggy() {
    if (isSwiggy) {
        loader.style.display = 'block'
        swiggyOrders = await getSwiggyInfo();
        // console.log(swiggyOrders);
        loader.style.display = 'none'
        active.style.display = "flex";
        swigInfo.style.display = "block";
        ztotal.innerHTML = swiggyOrders.totalOrderCount + swiggyOrders.totalErrorOrders;
        zplaced.innerHTML = swiggyOrders.totalOrderCount
        zerror.innerHTML = swiggyOrders.totalErrorOrders;
        zspend.innerHTML = convertToRupee(totalSpend(swiggyOrders.orders));
        var frequentRes = getMostFrequent(swiggyOrders.resList);
        zres.innerHTML = `${frequentRes[0]} - ${frequentRes[1]} orders.`;
        var maxSpend = highestOrder(swiggyOrders.orders);
        zhigh.innerHTML = `${convertToRupee(maxSpend.totalCost)} <br /> ${maxSpend.resName} <br /> ${convertDate(maxSpend.orderTime)}`;
        var oldest = swiggyOrders.orders[swiggyOrders.orders.length - 1];
        zold.innerHTML = `${convertToRupee(oldest.totalCost)} <br /> ${oldest.resName} <br /> ${convertDate(oldest.orderTime)}`;


    }
}

function convertDate(date, istext) {
    if (istext) {
        var removed = date.split('at')[0];
        return removed
    }
    var dt = new Date(date);
    return dt.toDateString()
}

function highestOrder(arr) {
    var ans = arr.reduce(function (prev, current) {
        return (prev.totalCost > current.totalCost) ? prev : current
    });
    return ans
}

function convertToRupee(number) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(number);
}

function convertToNumber(str) {
    var nocoms = str.replace(/,/g, '');
    var tnum = nocoms.substring(1);
    return parseFloat(tnum);
}

function totalSpend(data) {
    var sum = 0;
    data.forEach(ele => {
        sum = ele.totalCost + sum;
    });
    return sum.toFixed(2);
}

function getMostFrequent(arr) {
    const hashmap = arr.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1
        return acc
    }, {})
    var res = Object.keys(hashmap).reduce((a, b) => hashmap[a] > hashmap[b] ? a : b)
    return [res, hashmap[res]]
}

function saveXLS() {
    var orderList = {};
    var errorList = {};
    if (isSwiggy) {
        orderList = swiggyOrders.orders;
        errorList = swiggyOrders.errorList;
    } else {
        orderList = zomatoOrders.orders;
        errorList = zomatoOrders.errorList;
    }
    const orderWorksheet = XLSX.utils.json_to_sheet(orderList);
    const errorWorksheet = XLSX.utils.json_to_sheet(errorList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, orderWorksheet, "Orders");
    XLSX.utils.book_append_sheet(workbook, errorWorksheet, "Cancel-Refund-Error Orders");
    XLSX.writeFile(workbook, "Order Summary.xlsx");
}