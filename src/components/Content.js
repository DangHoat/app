import React from "react";

const Content = ({ children }) => <div className="content scrollbar-style-1 scrollbar-width-2x" style={{overflow: "auto", height: window.innerHeight-54-66}}>{children}</div>;

export default Content;
