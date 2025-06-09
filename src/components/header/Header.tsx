import React, { useState } from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import "./header.css";

const items = [
  {
    label: "Home",
    key: "home",
  },
  {
    key: "bracket",
    label: "Bracket",
  },
  {
    key: "rankings",
    label: "Power Rankings",
  },
  {
    key: "doc",
    label: "Documentary",
  },
  {
    key: "champs",
    label: "Champions",
  },
];

const Header = () => {
  const [current, setCurrent] = useState("mail");
  const navigate = useNavigate();

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
    if (e.key === "home") {
      navigate("/");
    } else if (e.key === "bracket") {
      navigate("/bracket");
    } else if (e.key === "rankings") {
      navigate("/rankings");
    } else if (e.key === "doc") {
      navigate("/documentary");
    } else if (e.key === "champs") {
      navigate("/champs");
    }
  };

  return (
    <Menu
      className="header-menu"
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};

export default Header;
