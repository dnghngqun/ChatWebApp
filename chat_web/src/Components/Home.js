import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "toastify-js";
import "toastify-js/src/toastify.css";
import "./css/Home.css";
const Home = () => {
  const [name, setName] = useState(null);
  const navigate = useNavigate();

  const notifyFail = (err) =>
    toast({
      text: err,
      duration: 3000,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #c50e0e, #ec6554)",
      },
      close: true,
      onClick: function () {}, // Callback after click
    }).showToast();

  const handleStart = () => {
    if (name != null && name != "") {
      console.log("name: ", name);
      navigate("/chat", { state: name });
    } else {
      notifyFail("Please input name before start chat 😾");
    }
  };

  return (
    <div id="container-home">
      <h1 className="text-home">Enter your name 🤩</h1>
      <input
        type="text"
        placeholder="Enter your name 😤"
        value={name}
        className="input-name"
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <button className="btn-start" onClick={handleStart}>
        Start Chat 😁
      </button>
    </div>
  );
};

export default Home;
