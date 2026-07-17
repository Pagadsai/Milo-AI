import "./LoadingScreen.css";

import rabbit from "../../assets/rabbit.png"; // use your rabbit logo/image

export default function LoadingScreen() {
  return (
    <div className="loading-screen">

      <div className="sky"></div>

      <div className="rabbit-area">
        <img
          src={rabbit}
          alt="Milo Rabbit"
          className="running-rabbit"
        />

        <div className="dust"></div>
      </div>

      <div className="grass"></div>

      <div className="loading-text">
        <h1>Milo</h1>
        <p>Loading...</p>
      </div>

    </div>
  );
}