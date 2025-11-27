import { Layers2, Pencil } from "lucide-react";

const CategoryList = ({categories,onEditCategory, onDeleteCategory}) => {
    return (
        <div className="card p-4 bg-white shadow-md inset-shadow-2xs rounded-xl">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Categories Sources</h4>
            </div>

            {/* Category list */}
            {categories.length === 0 ? (
                <p className="text-center text-gray-500">No categories available.Please add some categories.</p>
            ) : (
                // grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category,index) => (
                        <div 
                        key={category.id}
                        className="group relative flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100/60">
                            {/* Icon/Emoji */}
                            <div className="w-12 h-12 flex items-center justify-center text-xl text-gray-800 bg-gray-100 rounded-full">
                                {category.icon ? (
                                    <span className="text-2xl">
                                        <img src={category.icon} alt={category.name} className="h-5 w-5"/>
                                    </span>
                                ) : (
                                    <Layers2 className="text-purple-800" size={24} />
                                )}
                            </div>


                            {/* Category Details */}
                            <div className="flex-1 flex items-center justify-between">
                                {/* Category name and type */}

                                <div>
                                    <p className="text-sm text-gray-700 font-medium">
                                        {category.name}
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1 capitalize">
                                        {category.type}
                                    </p>
                                </div>

                                {/* Action buttons */}
                                <div className="flex items-center gap-2">
                                    <button 
                                    onClick={() => onEditCategory(category)}
                                    className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 trasition-opacity cursor-pointer">
                                        <Pencil size={20}/>
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
export default CategoryList;