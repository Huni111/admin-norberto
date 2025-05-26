import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

const Root = () => {
    return (
        <div style={{ display: "flex" }}>
            <SideBar />
            <div style={{ 
                marginLeft: "70px", /* Same as sidebar width */
                padding: "20px",
                width: "100%" 
            }}>
                <Outlet />
            </div>
        </div>
    );
};

export default Root;
