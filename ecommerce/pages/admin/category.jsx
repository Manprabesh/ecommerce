import { useState, useEffect, useRef } from "react";
import { Plus, Trash } from 'lucide-react';
import api from "../../services/api";
import AdminLayout from "../../components/AdminLayout"
function Category() {
    const [category, setCategory] = useState([]);
    const [displayCategory, setDisplayCategory] = useState([]);
    const categoryRef = useRef();



    async function createCategory(e) {
        setCategory(prev => [...prev, categoryRef.current.value]);
        console.log(categoryRef.current.value);
        console.log("creating category------>", category)
        // localStorage.setItem('category', JSON.stringify(category));
        /**
         * upload it to database
         */

        const response = await api.createCategory(categoryRef.current.value);
        console.log("category uploaded to database", response);


    }

    useEffect(() => {
        async function fetchCategory() {
            try {
                const response = await api.getCategory();
                console.log("fetching data ------->", response.category);
                // setCategory(response.category)
                setCategory(response.category);
                // localStorage.setItem('category',category);
                console.log("oknoknno", category)
            } catch (error) {
                console.error("Failed to fetch category:", error);
            }
        }

        fetchCategory();
        console.log("data"); // runs immediately
    }, []);

    useEffect(() => {
        console.log("category", category);
        localStorage.setItem('category', JSON.stringify(category));
    }, [category])


    return (
        <AdminLayout>
        <div className="bg-zinc-900 h-screen">
            <div className="flex flex-col justify-center ml-30">

                <input type="text" name="category" className="bg-white w-56 mt-10 h-8 " ref={categoryRef} />
                <button className="bg-blue-500 w-30 mt-5 mb-10 h-10 rounded-xl" onClick={(e) => createCategory(e)}>Create category</button>
            </div>

            <div className="border border-indigo-300"></div>
            <div className="flex flex-wrap mt-10 gap-4 ml-10 mr-10">
                {category?.map((data, index) => (
                    <div className="flex-1 min-w-[300px]" key={data.category_id || index}>
                        <div className="text-white bg-red-500 text-center py-2 rounded-md flex justify-between px-10">
                            {data.category_name || data}
                            <Trash />
                        </div>
                    </div>
                ))}
            </div>



        </div>
        </AdminLayout>
    )
}

export default Category;