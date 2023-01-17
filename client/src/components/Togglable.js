import { forwardRef, useImperativeHandle, useState } from "react";
import PropTypes from "prop-types";

const Togglable = forwardRef(({ buttonLabel, children }, ref) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "unset" };
  const showWhenVisible = { display: visible ? "unset" : "none" };

  const toggleVisibility = () => setVisible(!visible);

  useImperativeHandle(ref, () => ({ toggleVisibility }));

  return (
    <>
      <div className="togglable">
        <div style={hideWhenVisible}>
          <input type="button" value={buttonLabel} onClick={toggleVisibility} />
        </div>
        <div style={showWhenVisible}>
          {children}
          <input type="button" value="cancel" onClick={toggleVisibility} />
        </div>
      </div>
    </>
  );
});

Togglable.displayName = "Togglable";

Togglable.propTypes = {
  buttonLabel: PropTypes.string,
  children: PropTypes.any,
};

Togglable.defaultProps = {
  buttonLabel: "create",
};

export default Togglable;
