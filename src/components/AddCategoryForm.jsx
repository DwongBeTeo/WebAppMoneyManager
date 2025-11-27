import { useEffect, useRef, useState } from "react";
import Input from "./Input";
import EmojiPickPopup from "./EmojiPickPopup";
import { LoaderCircle } from "lucide-react";
import { useClickOutside } from "../hooks/useClickOutside";
const AddCategoryForm = ({onAddCategory, initialCategoryData, isEditing, onClose}) => {
    const [category, setCategory] = useState({
        name: "",
        type: "income",
        icon: "",
    })

    const [loading, setLoading] = useState(false);

    const formRef = useRef(null);
    useClickOutside(formRef,onClose);

    useEffect(() => {
        if(isEditing && initialCategoryData) {
            setCategory(initialCategoryData);
        } else {
            setCategory({
                name: "",
                type: "income",
                icon: "",
            })
        }
    }, [isEditing, initialCategoryData])


    const categoryTypeOption = [
        {value: 'income', label: 'Income'},
        {value: 'expense', label: 'Expense'},
    ]
    const handleChange = (key, value) => {
        setCategory({...category, [key]: value});
    }

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onAddCategory(category);
            // setCategory({name: "", type: "income", icon: ""});
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return(
        <div 
        ref={formRef}
        className="p-4">

            <EmojiPickPopup 
                icon={category.icon}
                onSelect={(selectedIcon) => handleChange('icon', selectedIcon)}
            />

            <Input 
                value = {category.name}
                onChange={({target}) => handleChange('name', target.value)}
                label='Category Name'
                placeholder='Enter category name: Freelance, Salary, etc'
                type="text"
            />

            <Input 
                label='Category Type'
                value={category.type}
                onChange={({target}) => handleChange('type', target.value)}
                isSelect={true}
                options={categoryTypeOption}
            />

            <div className="flex justify-end mt-6">
                {/* Add Button */}
                <button 
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="add-btn add-btn-fill">
                    {loading ? (
                        <>
                            <LoaderCircle className="w-4 h-4 animate-spin" />
                            {isEditing ? 'Updating...' : 'Adding...'}
                        </>
                    ) : (
                        <>
                            {isEditing ? 'Update Category' : 'Add Category'}
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
export default AddCategoryForm;