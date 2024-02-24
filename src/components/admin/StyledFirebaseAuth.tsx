import "firebaseui/dist/firebaseui.css";

import * as firebaseui from "firebaseui";
import { useEffect, useRef } from "react";
import React from "react";

interface Props {
  // The Firebase App auth instance to use.
  firebaseAuth: any; // As firebaseui-web
  // The Firebase UI Web UI Config object.
  // See: https://github.com/firebase/firebaseui-web#configuration
  uiConfig: firebaseui.auth.Config;
}

const StyledFirebaseAuth = ({ uiConfig, firebaseAuth }: Props) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // Get or Create a firebaseUI instance.
    const firebaseUiWidget =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebaseAuth);

    if (uiConfig.signInFlow === "popup") {
      firebaseUiWidget.reset();
    }

    // Render the firebaseUi Widget.
    // @ts-ignore
    firebaseUiWidget.start(elementRef.current, uiConfig);

    return () => {
      firebaseUiWidget.reset();
    };
  }, [firebaseui, uiConfig]);

  return <div ref={elementRef} />;
};

export default StyledFirebaseAuth;
