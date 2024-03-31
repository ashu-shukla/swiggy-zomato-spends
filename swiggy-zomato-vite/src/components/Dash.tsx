import { useEffect, useState } from "react";
import {
  convertToRupee,
  getMostFrequent,
  highestOrder,
  oldestOrder,
  totalSpend,
} from "../utils/common";
import { saveXLS } from "../utils/xls";
import { getSwiggyInfo } from "../utils/swiggy";
import { getAllInfoZomato } from "../utils/zomato";

function Dash({ website }: any) {
  const [orders, setOrders] = useState({
    totalOrderCount: 0,
    orders: [],
    errorList: [],
    resList: [],
    totalErrorOrders: 0,
  });
  const [loader, setLoading] = useState(true);
  const [orderLen, setOrderLen] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  const totalCallback = async (totalOrders: any) => {
    setTotalOrders(totalOrders);
  };

  const loaderCallback = async (iorderLen: any) => {
    setOrderLen((prev) => prev + iorderLen);
  };

  const getOrders = async () => {
    switch (website) {
      case "swiggy":
        let sorders: any = await getSwiggyInfo(loaderCallback);
        setLoading(false);
        setOrders(sorders);
        break;
      case "zomato":
        let zorders: any = await getAllInfoZomato(
          loaderCallback,
          totalCallback
        );
        setLoading(false);
        setOrders(zorders);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getOrders();
  }, []);
  return (
    <div>
      {loader ? (
        <div>
          {website == "swiggy" ? (
            <p>{orderLen} orders fetched...</p>
          ) : (
            <p>
              {orderLen} of {totalOrders} orders fetched...
            </p>
          )}
        </div>
      ) : (
        <div>
          {website === "swiggy" && (
            <div className="alert">
              <img src="/images/alert.svg" alt="alert" />
              <p style={{ fontSize: "0.8rem", marginLeft: "5px" }}>
                Swiggy limits your order list to only 1 year of data from the
                current date.
              </p>
            </div>
          )}
          <div className="card-container">
            <div className="card">
              <p>Total Orders</p>
              <h3>{orders?.totalOrderCount + orders?.totalErrorOrders}</h3>
            </div>
            <div className="card">
              <p>Delivered Orders</p>
              <h3>{orders?.totalOrderCount}</h3>
            </div>
            <div className="card">
              <p>Total Amount Spent</p>
              <h3>{convertToRupee(totalSpend(orders?.orders))}</h3>
            </div>
          </div>
          <div>
            <div className="card text-left my-2">
              <p>Orders Cancelled/Refunded/Errored</p>
              <h3>{orders?.totalErrorOrders}</h3>
            </div>
            <div className="card text-left my-2">
              <p>Restaurant Most Ordered from</p>
              <h3>{getMostFrequent(orders?.resList)}</h3>
            </div>
            <div className="card text-left my-2">
              <p>Oldest Order</p>
              <h3>{oldestOrder(orders?.orders, website)}</h3>
            </div>
            <div className="card text-left my-2">
              <p>Highest Paid Order</p>
              <h3>{highestOrder(orders?.orders, website)}</h3>
            </div>
          </div>
          <div className="card-container">
            <button
              onClick={async () => {
                await chrome.tabs.create({
                  url:
                    website == "swiggy"
                      ? `https://www.zomato.com/`
                      : `https://www.swiggy.com/`,
                });
              }}
            >
              Check {website == "swiggy" ? "Zomato" : "Swiggy"}?
            </button>
            <button
              style={{
                display: "flex",
                alignItems: "center",
              }}
              onClick={async () => {
                await saveXLS(orders?.orders, orders?.errorList);
              }}
            >
              {/* <img
                src="/images/file.svg"
                alt="xls"
                width="18px"
                style={{ marginRight: "5px" }}
              />{" "} */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#0fba81"
                width="18px"
                style={{ marginRight: "5px" }}
                viewBox="0 0 24 24"
              >
                <g data-name="Layer 2">
                  <g data-name="file-text">
                    <rect width="24" height="24" opacity="0" />
                    <path d="M15 16H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2z" />
                    <path d="M9 14h3a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2z" />
                    <path d="M19.74 8.33l-5.44-6a1 1 0 0 0-.74-.33h-7A2.53 2.53 0 0 0 4 4.5v15A2.53 2.53 0 0 0 6.56 22h10.88A2.53 2.53 0 0 0 20 19.5V9a1 1 0 0 0-.26-.67zM14 5l2.74 3h-2a.79.79 0 0 1-.74-.85zm3.44 15H6.56a.53.53 0 0 1-.56-.5v-15a.53.53 0 0 1 .56-.5H12v3.15A2.79 2.79 0 0 0 14.71 10H18v9.5a.53.53 0 0 1-.56.5z" />
                  </g>
                </g>
              </svg>
              Download your orders
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dash;
