import React, { useState } from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import "./header.css";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    label: "Home",
    key: "home",
  },
  {
    key: "bracket",
    label: "Bracket",
  },
  {
    key: "powerrankings",
    label: "Power Rankings",
  },
  {
    key: "doc",
    label: "Documentary",
  },
];

const Header: React.FC = () => {
  const [current, setCurrent] = useState("mail");

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
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
