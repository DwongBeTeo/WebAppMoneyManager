import Dashboard from "../components/Dashboard";
import { UseUser } from "../hooks/UseUser";

const Home = () => {
    UseUser();
    return (
        <div>
            <Dashboard activeMenu="Dashboard">
                this is home page
            </Dashboard>
        </div>
    )
}

export default Home;