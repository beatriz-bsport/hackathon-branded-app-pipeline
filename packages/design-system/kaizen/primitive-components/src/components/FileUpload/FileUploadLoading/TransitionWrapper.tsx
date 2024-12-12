import classNames from "classnames";

type TransitionWrapperProps = {
  children: React.ReactNode;
  classNameVisibility: string;
  isVisible: boolean;
};

/**
 * Wrapper to add a smooth disparition transition : first an opacity fade-out, then a space disparition.
 * @param props.classNameVisibility ClassName to apply when the children is rendered. max-h-[?px] must be specified.
 * @param props.isVisible The boolean that controls the trigger of the transition.
 */
const TransitionWrapper: React.FC<TransitionWrapperProps> = ({
  children,
  classNameVisibility,
  isVisible,
}) => (
  <div
    className={classNames(
      "transition-all ease-out duration-default delay-200 min-h-0",
      isVisible ? classNameVisibility : "max-h-[0px]",
    )}
  >
    <div
      className={classNames("transition-all ease-out duration-default", {
        "opacity-transparent": !isVisible,
      })}
    >
      {children}
    </div>
  </div>
);

export default TransitionWrapper;
