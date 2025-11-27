import Dashboard from "../components/Dashboard";
import { UseUser } from "../hooks/UseUser";

const Filter = () => {
    UseUser();
    return (
        <Dashboard activeMenu="Filters">
            this is filter page
        </Dashboard>    
    )
}

export default Filter;