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
  const [imgUrl, setImgUrl] = useState([])

  const file_ref = useRef();
  const productRef = useRef();
  const descriptioRef = useRef();
  const priceRef = useRef();
  let arrOfFiles = [];

  function uplaodProducts(e) {
    e.preventDefault()
    // console.log("file ref--->", file_ref.current.files[0])
    file_ref.current.click();
    // arrOfFiles.push(file_ref.current.files[0]);
  }


  const handleFileChange = (event) => {

    const data = URL.createObjectURL(event.target.files[0]);
    console.log("URL -->", event.target.files[0]);
    setImgData(prev => [...prev, data]);
    const product = event.target.files[0];
    setImgToUpload(prev => [...prev, { name: product.name, type: product.type }]);
    arrOfFiles.push(event.target.files[0]);

    setImgUrl(prev => [...prev, event.target.files[0]])

    console.log("arr of files -->", arrOfFiles);

  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('category'))
    setCategory(data);
    console.log(data)

  }, [imgData])

  useEffect(() => {
    console.log("image url", imgUrl)
  }, [imgUrl])

  async function uploadProducts() {
    //upload product to backend

    const data = {
      name: productName,
      price: price,
      description: description,
      category: cName,
      product: imgToUplaod
    };

    // console.log("formData", formData)
    const response = await api.uploadProduct(data);
    console.log("incoming response ", response.product.product);
    console.log("incoming image utl ", response.imgUrl);

    const formData = new FormData();
     
    Promise.resolve(imgUrl.map(async (data, i) => {
      formData.append(`file${i}`, data);
      const file = formData.get(`file${i}`);  
      console.log("file type --->", file.type)
      const aws_response = await api.upload_to_aws(response.imgUrl[i], file);
      console.log("resposne uploaded image to aws", aws_response)

    }))

  }

  function selectCategory(data) {
    console.log("setting data ->", data)
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

          <div className="h-100 flex justify-between gap-6 mt-10 " onClick={(e) => uplaodProducts(e)}>
            <img src={imgData[0]} alt="No file" srcset="" className={imgData[0] ? 'h-100 w-100' : `h-100 w-100 bg-amber-700 rounded-2xl`} />
            <img src={imgData[1]} alt="No file" srcset="" className={imgData[1] ? 'h-100 w-100' : `h-100 w-100 bg-amber-700 rounded-2xl`} />
            <img src={imgData[2]} alt="No file" srcset="" className={imgData[2] ? 'h-100 w-100' : `h-100 w-100 bg-amber-700 rounded-2xl`} />
          </div>

          <div>
            <input type="file" id="file" name="file" ref={file_ref} multiple className="hidden" onChange={handleFileChange} />
          </div>

          <div className="flex flex-col mt-3 items-center">
            <label htmlFor="" className="text-white">Enter product name</label>
            <input type="text" className="bg-white h-10 w-50 rounded-md" ref={productRef} onChange={(e) => saveProductName(e)} />
          </div>
          <div className="flex flex-col mt-3 items-center">
            <label htmlFor="" className="text-white">Enter product price</label>
            <input type="number" className="bg-white h-10 w-50 rounded-md" ref={priceRef} onChange={(e) => savePrice(e)} />
          </div>

          <label for="myDropdown" className="text-white mt-3 mb-1">select category:</label>
          <select id="myDropdown" name="selectedOption" className="text-white bg-blue-400 h-10 px-10 text-m py-2 rounded-md">
            {
              category.map((data, index) => (
                // console.log(data.category_name)
                <option value="option1" key={index} className="text-white" onClick={() => selectCategory(data.category_name)}>{data.category_name}</option>
              ))
            }
          </select>

          <div className="flex flex-col items-center mt-3">
            <label htmlFor="description" className="text-white">Enter product name</label>
            <textarea
              name="description"
              placeholder="Describe your product..."
              rows="8"
              ref={descriptioRef}
              onChange={(e) => saveDescription(e)}
              className="w-110 bg-slate-700/50 border border-slate-600 text-white rounded-xl  px-3 py-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-500 resize-none "
            />
          </div>
          <button onClick={uploadProducts} className="bg-blue-400 mt-10 mb-30 px-8 py-3 rounded-xl" >Uplaod products</button>

        </div>
      </div>
    </>
  )
}

