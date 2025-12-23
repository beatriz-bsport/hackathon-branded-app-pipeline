import React, { type ChangeEvent } from "react";

type ColorInputProps = {
  value: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

const ColorInput: React.FC<ColorInputProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const normalizeHex = (hex: string) => {
    if (hex.length === 4) {
      return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }
    return hex;
  };

  return (
    <div data-component="Kaizen-TextField-ColorInput">
      {/* 🎨 Input type="color" custom swatch style as there is no way to do it with tailwind. https://developer.mozilla.org/fr/docs/Web/CSS/::-moz-color-swatch */}
      <style>
        {`
          input[type="color"]::-webkit-color-swatch {
            box-shadow: 0 0 #0000, 0 0 #0000, var(--kz-shadow-border-thin-default);
            border: none;
            border-radius: var(--kz-border-radius-md);
            height: 32px;
          }
          
          input[type="color"]::-moz-color-swatch {
            box-shadow: 0 0 #0000, 0 0 #0000, var(--kz-shadow-border-thin-default);
            border: none;
            border-radius: var(--kz-border-radius-md);
            height: 32px;
          }
        `}
      </style>
      {/* Increased height and width ensure the native color input fully covers the custom swatch area, preventing visual gaps or misalignment.*/}
      <input
        className="appearance-none m-[-4px] h-[38px] w-[50px] border-none bg-[transparent]"
        type="color"
        value={normalizeHex(value)}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};

export default ColorInput;
