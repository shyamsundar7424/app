import React, { useState } from "react";

const InputBox = ({ name, type, placeholder, id, icon }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="relative w-[100%] mb-4">
      <input
        type={type === "password" ? (passwordVisible ? "text" : "password") : type}
        name={name}
        id={id}
        placeholder={placeholder}
        className="input-box"
      />
      <i className={`fi ${icon} input-icon`}></i>

      {type === "password" ? (
        <i
          className="fi fi-rr-eye-crossed input-icon left-[auto] right-4 cursor-pointer"
          onClick={() => setPasswordVisible((currentVal) => !currentVal)}
        ></i>
      ) : (
        ""
      )}


    </div>
  );
};

export default InputBox;
