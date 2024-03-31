import { useEffect,useState } from 'react';   
import { isSwiggyLoggedIn } from '../utils/swiggy';
import { isZomatoLoggedIn } from '../utils/zomato';

function LoginCheck({ setWebsite }: any) {
  const [wrongSite, setWrongSite] = useState(false);
    const preloadFunc = async()=>{
      let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tab.url !== undefined) {
        // console.log(tab.url)
        if (tab.url.includes("www.swiggy.com")) {
          var checkSwiggyLogin = await isSwiggyLoggedIn();
          if (checkSwiggyLogin) {
            setWebsite("swiggy");
          }
        } else if (tab.url.includes("www.zomato.com")) {
          var checkZomatoLogin = await isZomatoLoggedIn();
          if (checkZomatoLogin) {
            setWebsite("zomato");
          }
        } else {
          setWrongSite(true);
        }
      } else {
        console.log("No tab found")
      }
    }
  useEffect(() => { 
    preloadFunc();
  }, []);
    return (
      <div>
        <h1> Login Check </h1>
        {wrongSite ? (
          <p>
            Not a food delivery site, Please visit and login to{" "}
            <a href="https://www.swiggy.com/" target="_blank">
              Swiggy's
            </a>{" "}
            or
            <a href="https://www.zomato.com/" target="_blank">
              Zomato's
            </a>{" "}
            website and after logging-in open the extension.
          </p>
        ) : (
          <p>Checking if logged in or not... please wait...</p>
        )}
      </div>
    );
}

export default LoginCheck;