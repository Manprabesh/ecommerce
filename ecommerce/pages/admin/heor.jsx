import { useEffect } from "react";
import { Upload } from 'lucide-react';
import { useState, useCallback } from "react";
import api from "../../services/api";
import Popup from "../../components/PopUp";
import { usePopup } from "../../components/popUpContext"
import Loader from "../../components/Loader";

import { X, Image } from 'lucide-react';

const UploadCard = ({ onClose }) => {
    const [category, setCategory] = useState([]);
    const { showPopup } = usePopup();
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const response = await api.getAllCategory();
                if (response.category?.length) setCategory(response.category);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        })();
    }, []);

    const handleEscKey = useCallback((event) => {

        if (event.key === 'Escape') {
            onClose()
        }
    }, []);

    useEffect(() => {

        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [handleEscKey]);

    const [selectedFile, setSelectedFile] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        quantity: '',
        product: '',
    });

    const [showImg, setShowImg] = useState('')
    const [imgCard, setImgCard] = useState(false)
    const [imgToUpload, setImgToUpload] = useState([])
    const [imgUrl, setImgUrl] = useState([]);

    const handleFileChange = (e) => {

        const blob = URL.createObjectURL(e.target.files[0]);
        if (e.target.files && e.target.files[0]) {
            setSelectedFile((prev) => [...prev, blob]);
            setImgToUpload((prev) => [...prev, { name: e.target.files[0].name, type: e.target.files[0].type }]);
            setImgUrl((prev) => [...prev, e.target.files[0]])
        }

    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const productData = {
            name: formData.name,
            price: formData.price,
            description: formData.description,
            category: formData.category,
            product: imgToUpload,
        };

        const requiredFields = [
            productData.category,
            productData.name,
            productData.price,
            productData.description,
            productData.product,
        ];

        const hasEmptyField = requiredFields.some(
            field => !field || field.toString().trim().length === 0
        );

        console.log('Form submitted:', productData.name.length);

        if (hasEmptyField) {
            showPopup({
                message: "All fields are required",
                type: "Missing field",
                duration: 4000,
            });
        }
        else {

            try {
                setLoader(true);
                const response = await api.uploadProduct(productData);
                const formData = new FormData();
                await Promise.all(
                    imgUrl.map(async (file, i) => {
                        formData.append(`file${i}`, file);
                        await api.upload_to_aws(response.data.url[i], file);
                    })
                );
            } catch (error) {
                console.log("error while uploading product", error.message)
            } finally {
                setLoader(false);
                showPopup({
                    message: "Product uploaded successfully",
                    type: "Product upload"
                })
            }
        }




    };

    const handleImg = (file) => {
        setShowImg(file)
        setImgCard(true)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            {loader && <Loader message="Uploading product..." />}
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Upload New Product
                    </h2>
                    <button
                        onClick={() => onClose()}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-6">
                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter product name"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Price, quantity and Category Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 mr-4">
                                    Rs
                                </span>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ml-2  "
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Total quantity
                            </label>
                            <div className="relative">

                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                                placeholder="select category"


                            >
                                <option value="">Select category</option>
                                {category.map(cat => (
                                    <option value={cat.category_name} key={cat.category_id}>
                                        {cat.category_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Describe your product in detail..."
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        />
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Images
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                                accept="image/*"
                                multiple
                            />
                            <label
                                htmlFor="file-upload"
                                className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg px-6 py-8 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="p-3 bg-blue-100 rounded-full mb-3">
                                        <Image className="text-blue-600" size={24} />
                                    </div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">
                                        {selectedFile ? selectedFile.name : 'Click to upload images'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG or WEBP (max. 5MB)
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => console.log('Cancel clicked')}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center justify-center gap-2"
                        >
                            <Upload size={18} />
                            Upload Product
                        </button>
                    </div>
                    <div className="flex w-[90] overflow-x-auto whitespace-nowrap">
                        {
                            selectedFile?.map((data, index) => {
                                console.log("imgages", data)
                                return (<img key={index} src={data} alt="" className="h-10 w-20 mr-4 flex-shrink-0 cursor-pointer" onClick={() => handleImg(data)} />)
                            })
                        }
                    </div>

                </div>

            </div>
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
                {/* Header */}
                {
                    imgCard &&
                    <>
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Upload New Product
                            </h2>
                            <button
                                onClick={() => setImgCard(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <img src={showImg} alt="" className="h-full" />
                    </>
                }


            </div>
        </div>
    )
}

const Hero = () => {
    const [showUploadCard, setShowUploadCard] = useState(false)
    return (
        <>
            <div>
                {/* Card section */}
                <div className="grid grid-cols-3 ml-50 mr-40 mt-20">

                    <div className="bg-blue-500 block max-w-xs  rounded-xl shadow-xs ">

                        <div className="p-4 text-center">

                            <span className="text-xl text-white">Total no. of product</span>
                            <h5 className="mt-3 mb-4 text-4xl font-semibold tracking-tight text-heading text-white">
                                50
                            </h5>

                            <a href="#" className="inline-flex items-center text-white bg-brand hover:bg-brand-strong shadow-xs font-medium rounded-base text-xs px-3 py-1.5">
                                Read more
                                <svg className="w-4 h-4 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 12H5m14 0-4 4m4-4-4-4" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div className="bg-green-500 block max-w-xs  rounded-xl shadow-xs ">

                        <div className="p-4 text-center">

                            <span className="text-xl text-white">Total no. of category</span>
                            <h5 className="mt-3 mb-4 text-4xl font-semibold tracking-tight text-heading text-white">
                                12
                            </h5>

                            <a href="#" className="inline-flex items-center text-white bg-brand hover:bg-brand-strong shadow-xs font-medium rounded-base text-xs px-3 py-1.5">
                                Read more
                                <svg className="w-4 h-4 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 12H5m14 0-4 4m4-4-4-4" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div className="bg-red-500 block max-w-xs  rounded-xl shadow-xs " onClick={() => setShowUploadCard(!showUploadCard)}>

                        <div className="p-4 text-center">

                            <span className="text-3xl text-white font-extrabold">Add Product</span>
                            <br />
                            <button className="inline-flex items-center text-white bg-brand hover:bg-brand-strong shadow-xs font-medium rounded-base text-xs px-3 py-1.5 mt-4">
                                <Upload size={40} />
                            </button>
                        </div>
                    </div>

                    {showUploadCard && <UploadCard onClose={() => setShowUploadCard(!Upload)} />}


                </div>

            </div>
        </>
    )
}

export default Hero;