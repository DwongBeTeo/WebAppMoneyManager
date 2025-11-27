import Dashboard from "../components/Dashboard";
import { UseUser } from "../hooks/UseUser";

const Expense = () => {
    UseUser();
    return (
        <Dashboard activeMenu="Expense">
            this is expense page
        </Dashboard>
    )
}
export default Expense;