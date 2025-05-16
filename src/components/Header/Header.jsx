import { Menu } from "antd";
import "./header.css";

const Header = () => {
  const menuItems = [
    {
      key: "next-date",
      id: "next-date",
      label: "NEXT TOURNAMENT: 6/7/2025 @ 2 PM",
    },
  ];

  return <Menu mode="horizontal" id="header-menu" items={menuItems} />;
};

export default Header;
