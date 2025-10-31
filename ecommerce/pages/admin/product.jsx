import { useState, useEffect, useRef } from "react";
import { Upload, X, Check, Image as ImageIcon, DollarSign, FileText, Package } from 'lucide-react';
import api from "../../services/api";

export default function Product() {
  // const [img, setImg] = useState([]);
  const [imgData, setImgData] = useState([])
  const [productName, setProductName] = useState(null)
  const [price, setPrice] = useState(null);
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState([]);
  const [cName, setCname] = useState(null);
  const [imgToUplaod, setImgToUpload] = useState([])

  const file_ref = useRef();
  const productRef = useRef();
  const descriptioRef = useRef();
  const priceRef = useRef();

  function uplaodProducts(e) {
    e.preventDefault()
    console.log(file_ref)
    file_ref.current.click()
  }

  const handleFileChange = (event) => {

    const data = URL.createObjectURL(event.target.files[0])
    console.log("URL -->", event.target.files[0])
    setImgData(prev => [...prev, data])
    setImgToUpload(prev=>[...prev, event.target.files[0]]);

  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('category'))
    setCategory(data);
    console.log(data)

  }, [imgData])

  function uploadProducts() {
    //upload product to backend
    const formData = new FormData();
    formData.append('productName',productName);
    formData.append('price',price);
    formData.append('description',description);
    formData.append('category',cName);

    imgToUplaod.map((data, index) => {
      formData.append(`product${[index]}`, data)
      const data_q = formData.get(`key${[index]}`);
    })

    /**
     * upload to backend api
     */

  }

  function selectCategory(data){
    console.log(data)
    setCname(data);
  }

  function saveDescription(e) {
    console.log("on chage", e.target.value)
    setDescription(e.target.value);
  }

  function savePrice(e) {
    setPrice(e.target.value)
  }

  function saveProductName(e) {
    setProductName(e.target.value);
  }

  return (
    <>
      <div className="bg-black h-full">
        <div className="flex flex-col justify-center items-center " >

          <div className="h-100 flex justify-between gap-6 mt-30 " onClick={(e) => uplaodProducts(e)}>
            <img src={imgData[0]} alt="No file" srcset="" className={imgData[0] ? 'h-100 w-100' : `h-100 w-100 bg-amber-700`} />
            <img src={imgData[1]} alt="No file" srcset="" className={imgData[1] ? 'h-100 w-100' : `h-100 w-100 bg-amber-700`} />
            <img src={imgData[2]} alt="No file" srcset="" className={imgData[2] ? 'h-100 w-100' : `h-100 w-100 bg-amber-700`} />
          </div>

          <div>
            <input type="file" id="file" name="file" ref={file_ref} multiple className="hidden" onChange={handleFileChange} />
          </div>

          <div className="flex flex-col">
            <label htmlFor="" className="text-white">Enter product name</label>
            <input type="text" className="bg-white h-10 w-50" ref={productRef} onChange={(e) => saveProductName(e)} />
          </div>
          <div className="flex flex-col">
            <label htmlFor="" className="text-white">Enter product price</label>
            <input type="number" className="bg-white h-10 w-50" ref={priceRef} onChange={(e) => savePrice(e)} />
          </div>

          <label for="myDropdown" className="text-white">select category:</label>
          <select id="myDropdown" name="selectedOption" className="text-white bg-blue-400 h-10 px-2 py-2 rounded-md">
            {
              category.map((data) => (
                <option value="option1" className="text-white" onClick={()=>selectCategory(data)}>{data}</option>
              ))
            }
          </select>

          <div className="flex flex-col">
            <label htmlFor="description" className="text-white">Enter product name</label>
            <textarea
              name="description"
              placeholder="Describe your product..."
              rows="10"
              ref={descriptioRef}
              onChange={(e) => saveDescription(e)}
              className="w-100 bg-slate-700/50 border border-slate-600 text-white rounded-xl  px-3 py-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-500 resize-none"
            />
          </div>
          <button onClick={uploadProducts} className="bg-blue-400 mt-10" >Uplaod products</button>

        </div>
      </div>
    </>
  )
}

