import React from 'react';
import './styles.css';

export type Props = {
  numberOfItems: number;
};

export const FunctionalComponentCssOnlyBoilerPlate: React.FC<Props> = ({
  numberOfItems,
}) => {
  return (
    <div className="container">
      {Array.from(Array(numberOfItems).keys()).map((item, index) => (
        <div className="item" key={index}>
          <p>{item}</p>
        </div>
      ))}
    </div>
  );
};
export default FunctionalComponentCssOnlyBoilerPlate;
