import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import { UseUser } from "../hooks/UseUser";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import axiosConfig from "../util/axiosConfig";
import IncomeList from "../components/Income/IncomeList";
import Modal from "../components/Modal";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import AddInComeForm from "../components/Income/AddIncomeForm";
import DeleteAlert from "../components/DeleteAlert";
const Income = () => {
    UseUser();
    const [incomeData, setIncome] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });

    // Fetch all Income details from the API
    const fetchIncomeDetails = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOMES);
            if (response.status === 200) {
                console.log('income: ', response.data);
                setIncome(response.data);
            }
        } catch (error) {
            console.error('Error fetching income:', error);
            toast.error('Failed to fetch income. Please try again.', error.message);
        } finally {
            setLoading(false);
            
        }
    }

    // Fetch categories from the API
    const fetchIncomeCategories = async () => {
        try {
            const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE('income'));
            if (response.status === 200) {
                console.log('fetch income categories', response.data);
                setCategories(response.data);
            }
        } catch (error) {
            console.log('Failed to fetch income categories', error);
            toast.error('Failed to fetch income categories. Please try again.', error.message);
        }
    }

    // Save the income details
    const handleAddIncome = async (income) => {
        const {name, amount, date, icon, categoryId} = income;

        // Validation
        if(!name.trim()) return toast.error('Please fill the Name field.');
        if(!amount || amount <= 0 || isNaN(amount)) return toast.error('Amount should be a valid number and greater than 0.');
        if(!date) return toast.error('Please fill the Date field.');
        const  today = new Date().toISOString().split('T')[0];
        if(date > today) return toast.error('Date cannot be in the future.');
        if(!categoryId) return toast.error('Please select a category.');

        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_INCOME, {
                name,
                amount: Number(amount),
                date,
                icon,
                categoryId
            })
            if(response.status === 201){
                setOpenAddIncomeModal(false);
                toast.success('Income added successfully.');
                fetchIncomeDetails();
                fetchIncomeCategories(); 
            }
        } catch (error) {
            console.log('Error Adding income', error);
            toast.error('Failed to add income. Please try again.', error.message);
        }
    }

    // delete income details
    const deleteIncome = async (id) => {
        try {
            const response = await axiosConfig.delete(API_ENDPOINTS.DELETE_INCOME(id));
            // khi xóa status trả về 204 no content không trả về 200
            if(response.status === 204){
                setOpenDeleteAlert({show: false, data: null});
                toast.success('Income deleted successfully.');
                fetchIncomeDetails();
                fetchIncomeCategories();
            }
        } catch (error) {
            console.log('error deleting income', error);
            toast.error('Failed to delete income. Please try again.', error.message);
        }
    }

    useEffect(() => {
        fetchIncomeDetails();
        fetchIncomeCategories();
    }, [])

    return(
        <Dashboard activeMenu="Income">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-4">
                    {/* Add button to add Income */}
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-2xl font-semibold">Incomes</h2>
                        <button
                        onClick={()=> setOpenAddIncomeModal(true)}
                        className="add-btn flex items-center gap-1">
                            <Plus size={16} />
                            Add Income
                        </button>
                    </div>

                    {/* Income List and Delete Button */}
                    <IncomeList
                        transactions={incomeData}
                        onDelete={(id) => setOpenDeleteAlert({show: true, data: id})}
                    />

                    {/* Add Income Modal */}
                    <Modal 
                        isOpen={openAddIncomeModal}
                        onClose={() => setOpenAddIncomeModal(false)}
                        title= "Add Income"
                    >
                        <AddInComeForm 
                            onAddIncome={(income) => handleAddIncome(income)}
                            categories={categories}
                        />
                    </Modal>

                    {/* Delete Income Modal */}
                    <Modal
                        isOpen={openDeleteAlert.show}
                        onClose={() => setOpenDeleteAlert({show: false, data: null})}
                        title='Delete Income'
                    >
                        <DeleteAlert 
                            content = 'Are you sure want to delete this income ?'
                            onDelete={() => deleteIncome(openDeleteAlert.data)}
                        />
                    </Modal>
                </div>
            </div>
        </Dashboard>
    )
}

export default Income;