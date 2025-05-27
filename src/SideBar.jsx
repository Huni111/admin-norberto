import React, { useState, Suspense } from "react";
import { Link } from "react-router-dom";
import { 
  FaThLarge, 
  FaBoxOpen, 
  FaShoppingCart, 
  FaUsers, 
  FaCog 
} from "react-icons/fa";

const SideBar = () => {
  // State to track which menu item is being hovered
  const [hoveredItem, setHoveredItem] = useState(null);

  // Menu items data
  const menuItems = [
    { id: "dashboard", title: "Tablou de bord", icon: <FaThLarge size={24} />, path: "/" },
    { id: "products", title: "Produse", icon: <FaBoxOpen size={24} />, path: "/produse" },
    { id: "orders", title: "Comenzi", icon: <FaShoppingCart size={24} />, path: "/orders" },
    { id: "clients", title: "Clienți", icon: <FaUsers size={24} />, path: "/clients" },
    { id: "settings", title: "Setări", icon: <FaCog size={24} />, path: "/settings" }
  ];

  return (
    <div style={{
      position: "fixed",
      left: 0,
      top: 0,
      height: "100vh",
      width: "70px",
      backgroundColor: "#2c3e50",
      padding: "20px 0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      boxShadow: "2px 0 5px rgba(0,0,0,0.2)",
      zIndex: 100
    }}>
      {menuItems.map((item) => (
        <Link 
          key={item.id} 
          to={item.path}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            width: "100%",
            padding: "15px 0",
            color: "#ecf0f1",
            textDecoration: "none",
            transition: "all 0.3s ease",
            marginBottom: "10px",
            cursor: "pointer"
          }}
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {item.icon}
          </div>
          <div 
            style={{
              position: "absolute",
              left: "70px",
              backgroundColor: "#34495e",
              color: "white",
              padding: "5px 15px",
              borderRadius: "3px",
              fontSize: "14px",
              whiteSpace: "nowrap",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              opacity: hoveredItem === item.id ? 1 : 0,
              visibility: hoveredItem === item.id ? "visible" : "hidden",
              transition: "all 0.3s ease",
              pointerEvents: "none"
            }}
          >
            {item.title}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SideBar;
