import React from "react";
import "./styles.css";
function Input({ label, state, setState, placeholder, type }) {
  return (
    <div className="input-wrapper">
      {/* displaying recieved label  */}
      <p className="label-input">{label}</p>

      <input
        type={type}
        //   displaying the state recieved as value initially empty
        value={state}
        //   displaying the placeholder as recieved
        placeholder={placeholder}
        //   changing the state from "" to user input from the setName hook
        onChange={(e) => {
          setState(e.target.value);
        }}
        className="custom-input"
      />
    </div>
  );
}

export default Input;
