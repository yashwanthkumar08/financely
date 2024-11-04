import React from 'react'
import "./styles.css";

function AddButton({ text, onClick }) {
  return (
    <div className="button-container"> {/* Add a container for the button */}
      <button
        onClick={onClick}
        type='button'
        className='button'
      >
        {text}
      </button>
    </div>
  )
}

export default AddButton
