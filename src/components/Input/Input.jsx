import React from 'react';
import './Input.css';

export default function Input({
  name,
  type,
  label,
  value = '',
  onChange = () => {},
}) {
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
      />
    </>
  );
}
