export const convertDate = (date: string, istext: boolean) => {
  console.log(date, istext)
  if (istext) {
    const removed = date.split("at")[0];
    return removed;
  }
  const dt = new Date(date);
  return dt.toDateString();
};

export const oldestOrder = (arr: any[], website:string) => { 
    if (arr.length == 0) return "No orders yet.";
    const oldest = arr[arr.length - 1];
    let str = `${convertToRupee(oldest.totalCost)} - ${oldest.resName} - ${convertDate(oldest.orderTime, website=='swiggy'?false:true)}`;
    return str;
};

export const highestOrder = (arr: any[], website:string) => {
    if (arr.length == 0) return "No orders yet.";
  const ans = arr.reduce(function (prev, current) {
    return prev.totalCost > current.totalCost ? prev : current;
  });
    const str = `${convertToRupee(ans.totalCost)} - ${
      ans.resName
    } - ${convertDate(ans.orderTime, website == "swiggy" ? false : true)}`;
    return str;
};

export const convertToRupee = (number: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(number);
};

export const convertToNumber = (str: string) => {
  const nocoms = str.replace(/,/g, "");
  const tnum = nocoms.substring(1);
  return parseFloat(tnum);
};

export const totalSpend = (data: any[]) => {
  let sum = 0;
  data.forEach((ele) => {
    sum = ele.totalCost + sum;
  });
  return Number(sum.toFixed(2));
};

export const getMostFrequent = (arr: any[]) => {
    if (arr.length == 0) return 'No orders yet.';
    const hashmap = arr.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
    const res = Object.keys(hashmap).reduce((a, b) =>
      hashmap[a] > hashmap[b] ? a : b
    );
    const str = `${res} - ${hashmap[res]} orders.`;
    return str;
};