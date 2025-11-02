import { useState } from "react";
import api from "../../services/api";

export default function UserProduct() {
  const product = [
    {
      id: "1",
      category: "footwear",
      name: "Branded Shoes",
      description:
        "Experience the perfect blend of style, comfort, and performance with the AeroStride UltraComfort Sneakers. Designed for the modern lifestyle, these shoes feature a lightweight, breathable mesh upper that keeps your feet cool all day long. The advanced memory foam sole adapts to your stride, providing superior cushioning and shock absorption with every step.",
      price: 1200,
      image: [
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRm-hZv7ZMuPIR72DV_Uuwjlb0JkGEZ6wmdZoalrUNo3SIb75R2NYAAHBB_IyiXNf4MdRay-dbQyJOBeRcUqP5_4k1rxJu1Ec_znD25E-tYP9N3yhGMM0dT",
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSoWfZdx5iKsgl-tWTXW7scwzWpwvIj9_z2x6bzZuGSzirWjtWR_Mscb0d299sr-6HnEtpruPuYN-0YRxUMV0Cvalvz-4sbCtHF1uk4qWg",
        "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQ7wvJbFw5HMlGzNYwhom6AhgR4RcVXcVUsWdVlDto_8cv9HIyuM1Mt3pFI5Y2coGLUFWkDVgLyc56uRhn3x0IZQKSw65Y5tf7XK10S3hqgFlWmRDfM2G1_",
      ],
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === product[0].image.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? product[0].image.length - 1 : prev - 1
    );
  };

  async function addCart(data){
    // await api.addToCart();
    console.log("add to cart",data)
  }

  return (
    <>
      <div className="bg-black h-screen flex items-start justify-start p-8">
        {product?.map((data, index) => (
          <div key={index} className="flex flex-col w-[22rem]">
            {/* Image Section */}
            <div className="relative">
              <img
                src={data.image[currentIndex]}
                alt=""
                className="w-full h-72 object-cover rounded-2xl shadow-lg border border-gray-700 transition-transform duration-300 hover:scale-105"
              />

              {/* Left Button */}
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800/70 hover:bg-gray-700 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl font-bold shadow-md transition-all duration-300"
              >
                ‹
              </button>

              {/* Right Button */}
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800/70 hover:bg-gray-700 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl font-bold shadow-md transition-all duration-300"
              >
                ›
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 w-full flex justify-center gap-2">
                {data.image.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2.5 h-2.5 rounded-full ${
                      idx === currentIndex ? "bg-red-500" : "bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="mt-4 space-y-2 text-white">
              <h2 className="text-xl font-semibold capitalize tracking-wide">
                {data.name}
              </h2>
              <p className="text-red-400 font-medium text-lg">
                ₹{data.price.toLocaleString()}
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                {data.description}
              </p>
            </div>
            <div className="flex justify-center">

            <button className="bg-white w-30 mr-10">Buy</button>
            <button className="bg-white w-30" onClick={()=>addCart(data)}>Add to cart</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
