import { useState } from 'react'
import LoginCheck from './components/LoginCheck'
import Dash from './components/Dash'

function App() {
  const [website, setWebsite] = useState('')

  return (
    <div className="grid">
      {website === "" ? (
        <LoginCheck setWebsite={setWebsite} />
      ) : (
        <h1 style={{ textTransform: "capitalize" }}>
          Your {website} Dashboard,
        </h1>
      )}
      {website && <Dash website={website} />}
      <p style={{ textAlign: "center", fontSize: "0.9rem" }}>
        Made with love by{" "}
        <a
          href="https://www.linkedin.com/in/ashutosh-shukla-72a00b196"
          target="_blank"
        >
          Ashutosh Shukla
        </a>
      </p>
    </div>
  );
}

export default App
