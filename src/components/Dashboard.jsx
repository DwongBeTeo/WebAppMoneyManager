
import { useContext } from "react";
import MenuBar from "./MenuBar";
import SideBar from "./SideBar";
import AppContext from "../context/AppContext";

// Dashboard component to wrap around pages with MenuBar and SideBar
const Dashboard = ({children, activeMenu}) => {
    const {user} = useContext(AppContext); // Ensure context is available if needed
    return(
        <div>
            <MenuBar activeMenu={activeMenu} />
            {user && (
                <div className="flex">
                {/* Khi chiều rộng màn hình ≤ 1080px → ẩn thanh SideBar bên trái đi */}
                <div className="max-[1080px]:hidden">
                    <SideBar activeMenu={activeMenu} />
                </div>

                <div className="grow mx-5 ">{children}</div>
            </div>
            )}
        </div>
    )
}
export default Dashboard;