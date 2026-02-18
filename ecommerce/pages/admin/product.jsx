import { useState, useEffect, useRef } from "react";
import { Upload } from 'lucide-react';
import api from "../../services/api";
import AdminLayout from "../../components/AdminLayout";
import Loader from "../../components/Loader";

export default function Product() {
  const [imgData, setImgData] = useState([]);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState([]);
  const [cName, setCname] = useState("");
  const [imgToUpload, setImgToUpload] = useState([]);
  const [imgUrl, setImgUrl] = useState([]);
  const [loader, setLoader] = useState(false);

  const fileRef = useRef();

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    const previewUrls = files.map(file => URL.createObjectURL(file));

    setImgData(prev => [...prev, ...previewUrls]);

    setImgToUpload(prev => [...prev, ...files.map(file => ({ name: file.name, type: file.type }))]);
    
    setImgUrl(prev => [...prev, ...files]);
  };

  const handleUploadClick = (e) => {
    e.preventDefault();
    fileRef.current?.click();
  };

  const handleUploadProduct = async () => {
    if (!productName || !price || !description || !cName || imgUrl.length === 0) {
      alert("⚠️ Please fill all fields and upload at least one image.");
      return;
    }

    try {
      setLoader(true);

      const productData = {
        name: productName,
        price,
        description,
        category: cName,
        product: imgToUpload,
      };

      const response = await api.uploadProduct(productData);
      console.log("response --->", response)
      const formData = new FormData();

      await Promise.all(
        imgUrl.map(async (file, i) => {
          console.log("--------------------", file)
          formData.append(`file${i}`, file);
          console.log("data", formData.get(`file${i}`))
          await api.upload_to_aws(response.data.url[i], file);
        })
      );

      alert("✅ Product uploaded successfully!");
      // Reset form
      setImgData([]);
      setImgToUpload([]);
      setImgUrl([]);
      setProductName("");
      setPrice("");
      setDescription("");
      setCname("");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("❌ Failed to upload product");
    } finally {
      setLoader(false);
    }
  };

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

  return (
    <AdminLayout>
      <div className="bg-black h-full flex flex-col items-center mt-10">
        {loader && <Loader message="Uploading product..." />}

        {/* Image Upload Section */}
        <div className="flex justify-between gap-6 mt-10 cursor-pointer" onClick={handleUploadClick}>
          {[0, 1, 2].map((i) => (
            <img
              key={i}
              src={imgData[i] || null}
              alt=""
              className={`h-100 w-100 rounded-2xl ${imgData[i] ? "" : "bg-amber-700"}`}
            />
          ))}
        </div>

        <input
          type="file"
          ref={fileRef}
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Product Details */}
        <div className="flex flex-col mt-5 items-center gap-4">
          <div className="flex flex-col items-center">
            <label className="text-white mb-1">Enter product name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="bg-white h-10 w-50 rounded-md px-2"
            />
          </div>

          <div className="flex flex-col items-center">
            <label className="text-white mb-1">Enter product price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-white h-10 w-50 rounded-md px-2"
            />
          </div>

          <div className="flex flex-col items-center">
            <label htmlFor="category" className="text-white mb-1">Select category:</label>
            <select
              id="category"
              value={cName}
              onChange={(e) => setCname(e.target.value)}
              className="text-white bg-blue-400 h-10 px-10 rounded-md"
            >
              <option value="">Select category</option>
              {category.map(cat => (
                <option value={cat.category_name} key={cat.category_id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col items-center w-full">
            <label htmlFor="description" className="text-white mb-1">Enter product description</label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="8"
              placeholder="Describe your product..."
              className="w-110 bg-slate-700/50 border border-slate-600 text-white rounded-xl px-3 py-5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-slate-500 resize-none"
            />
          </div>

          <button
            onClick={handleUploadProduct}
            className="bg-blue-400 mt-10 mb-30 px-8 py-3 rounded-xl hover:bg-blue-500 transition"
          >
            Upload Product
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
