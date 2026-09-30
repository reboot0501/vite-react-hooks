import { NavLink } from "react-router-dom";
import "./app-sidebar.css";

const MENU_ITEMS = [
  { name: "메뉴1", path: "/menu1" },
  { name: "메뉴2", path: "/menu2" },
  { name: "메뉴3", path: "/menu3" },
  { name: "메뉴4", path: "/menu4" },
  { name: "메뉴5", path: "/menu5" },
];

const Sidebar = () => {
  return (
    <aside className="app-sidebar">
      <nav>
        <ul className="sidebar-nav-list">
          {MENU_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-nav-link ${isActive ? "active" : ""}`.trim()
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;