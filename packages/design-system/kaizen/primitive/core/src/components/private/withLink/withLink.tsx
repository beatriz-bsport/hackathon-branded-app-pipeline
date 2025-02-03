import React from "react";

const withLink = <P extends { link?: string; className?: string }>(
  Component: React.FC<Omit<P, "link" | "className">>,
) => {
  return function WrappedComponent({ link, className, ...rest }: P) {
    if (link) {
      return (
        <a className={className} href={link}>
          <Component {...rest} />
        </a>
      );
    }

    return <Component {...rest} />;
  };
};

export default withLink;
