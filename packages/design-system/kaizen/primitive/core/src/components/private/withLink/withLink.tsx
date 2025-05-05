import React from "react";

type WithLinkProps = {
  link?: string;
  color?: string;
  className?: string;
};

const withLink = <P extends object>(
  Component: React.ComponentType<P>,
): React.FC<P & WithLinkProps> => {
  return ({ link, className, ...props }: WithLinkProps & P) => {
    if (link) {
      return (
        <a className={className} href={link}>
          <Component {...(props as P)} />
        </a>
      );
    }
    return <Component {...(props as P)} />;
  };
};

export default withLink;
