import { useState, useEffect, useRef } from "react";
import { Plus } from 'lucide-react';


function Category() {
    const [category, setCategory] = useState([]);
    const categoryRef = useRef()

    function createCategory(e) {
        setCategory(prev => [...prev, categoryRef.current.value]);
        console.log(categoryRef.current.value);

    }

    useEffect(() => {
        console.log("category", category);
        localStorage.setItem('category',JSON.stringify(category));
    }, [category])

    return (
        <div className="bg-zinc-900 h-screen">
            <div className="flex flex-col justify-center">

                <input type="text" name="category" className="bg-white w-30 mt-10" ref={categoryRef} />
                <button className="bg-blue-500 w-30 mt-5" onClick={(e) => createCategory(e)}>Create category</button>
            </div>

            <div className="bg-white h-1 flex  justify-center"></div>
            <div className="flex">
                {
                    category?.map((data) => (
                        <div className="w-30 px-10">
                            <p className="text-white bg-blue-500 w-20 px-2 py-2 rounded-md">{data}</p>
                        </div>
                    ))
                }
            </div>



        </div>
    )
}

export default Category;