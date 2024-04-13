import { Menu } from "antd";
import "./header.css";

const Header = () => {
  const menuItems = [
    {
      key: "next-date",
      id: "next-date",
      label: "NEXT TOURNAMENT: 4/20/2024 @ 8 PM",
    },
  ];

  return <Menu mode="horizontal" id="header-menu" items={menuItems} />;
};

export default Header;
