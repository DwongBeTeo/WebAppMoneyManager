import { Plus } from "lucide-react";
import Dashboard from "../components/Dashboard";
import { UseUser } from "../hooks/UseUser";
import CategoryList from "../components/CategoryList";
import { useEffect, useState } from "react";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import AddCategoryForm from "../components/AddCategoryForm";

const Category = () => {
    UseUser();
    const [loading, setLoading] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
    const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    


    const fetchCategoriesDetails = async () => {
        if(loading) return;
        setLoading(true);

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
            if (response.status === 200) {
                console.log('categories', response.data);
                setCategoryData(response.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to fetch categories. Please try again.', error.message);
        } finally {
           setLoading(false);
        }
    }

    useEffect(() => {
        fetchCategoriesDetails();
    }, []);

    const handleAddCategory = async (category) => {
        // console.log('Category added successfully', category);
        const {name, type, icon} = category;
        if(!name.trim()){
            toast.error('Category name is required.');
            return;
        }

        //check if the category already exists
        const isCategoryExists = categoryData.some((category) => {
            return category.name.toLowerCase() === name.trim().toLowerCase();
        })

        if(isCategoryExists){
            toast.error('Category already exists.');
            return;
        }

        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, {
                name,
                type,
                icon
            })
            if(response.status === 201){
                toast.success('Category added successfully.');
                setOpenAddCategoryModal(false);
                fetchCategoriesDetails();
            }
        } catch (error) {
            console.error('Error adding category: ', error);
            toast.error('Failed to add category. Please try again.', error.message);
        }
    }

    const handleEditCategory = (categoryToEdit) => {
        console.log('Editing the Category', categoryToEdit);
        setSelectedCategory(categoryToEdit);
        setOpenEditCategoryModal(true);
    }

    const handleUpdateCategory = async (updatedCategory) => {
        const {id ,name, type, icon} = updatedCategory;
        if (!name.trim()) {
            toast.error('Category name is required.');
            return;
        }
        try {
            const response = await axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY(id), {
                name,
                type,
                icon
            });
            if(response.status === 200){
                toast.success('Category updated successfully.');
                setOpenEditCategoryModal(false);
                fetchCategoriesDetails();
            }
        } catch (error) {
            console.error('Error updating category: ', error);
            toast.error('Failed to update category.', error.message);
        }
    }

    return (
        <Dashboard activeMenu="Category">
            <div className="my-5 mx-auto">
                {/* Add button to add category */}
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-2xl font-semibold">Categories</h2>
                    <button
                    onClick={()=> setOpenAddCategoryModal(true)}
                    className="add-btn flex items-center gap-1">
                        <Plus size={16} />
                        Add Category
                    </button>
                </div>

                {/* List of categories */}
                <CategoryList categories={categoryData} onEditCategory={handleEditCategory}/>

                {/* Adding category modal */}
                <Modal
                    title="Add Category"
                    isOpen={openAddCategoryModal}
                    onClose={() => setOpenAddCategoryModal(false)}
                >
                    <AddCategoryForm 
                        onAddCategory={handleAddCategory}
                        onClose={() => 
                            setOpenAddCategoryModal(false)
                            
                        }    
                    />
                </Modal>

                {/* Updating category modal */}
                <Modal 
                    isOpen={openEditCategoryModal}
                    onClose={() => {
                        setOpenEditCategoryModal(false)
                        setSelectedCategory(null)
                    }}
                    title="Update Category"
                >
                    <AddCategoryForm 
                        initialCategoryData={selectedCategory}
                        onAddCategory={handleUpdateCategory}
                        isEditing={true}
                        onClose={() => {
                            setOpenEditCategoryModal(false)
                            setSelectedCategory(null)
                        }}
                    />
                </Modal>
            </div>
        </Dashboard>
    )
}

export default Category;