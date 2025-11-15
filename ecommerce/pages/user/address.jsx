import { useState } from "react";
import { MapPin, Home, Phone, User } from "lucide-react";
import UserLayout from "../../components/UserLayout";
import { useNavigate } from "react-router";
import api from "../../services/api";
import Payment from "./payment";

export default function AddressPage() {
  const [tracker, setTracker] = useState( )
  const [address, setAddress] = useState({
    user_id: localStorage.getItem('userId'),
    full_name: "",
    phone_number: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    is_default: false,
  });


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddress({
      ...address,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Address Saved:", address);
    const response = await api.createAddress(address);
    console.log("address response", response)
    setTracker(true);

    // ✅ You can integrate an API call here to save in DB
  };
  const navigate = useNavigate()

  

  return (
    <UserLayout>
      <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <MapPin className="text-blue-600" /> Add New Address
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="flex items-center border rounded-lg p-2 bg-gray-50">
                <User className="text-gray-400 mr-2" size={20} />
                <input
                  type="text"
                  name="full_name"
                  value={address.full_name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full bg-transparent outline-none"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="flex items-center border rounded-lg p-2 bg-gray-50">
                <Phone className="text-gray-400 mr-2" size={20} />
                <input
                  type="tel"
                  name="phone_number"
                  value={address.phone_number}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full bg-transparent outline-none"
                  required
                />
              </div>
            </div>

            {/* Address Line 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 1
              </label>
              <div className="flex items-center border rounded-lg p-2 bg-gray-50">
                <Home className="text-gray-400 mr-2" size={20} />
                <input
                  type="text"
                  name="address_line_1"
                  value={address.address_line_1}
                  onChange={handleChange}
                  placeholder="House no, street, landmark"
                  className="w-full bg-transparent outline-none"
                  required
                />
              </div>
            </div>

            {/* Address Line 2 */}
            <div>
              <input
                type="text"
                name="address_line_2"
                value={address.address_line_2}
                onChange={handleChange}
                placeholder="Apartment, landmark (optional)"
                className="w-full border rounded-lg p-2 bg-gray-50 outline-none"
              />
            </div>

            {/* City, State, Postal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleChange}
                placeholder="City"
                className="border rounded-lg p-2 bg-gray-50 outline-none"
                required
              />
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={handleChange}
                placeholder="State"
                className="border rounded-lg p-2 bg-gray-50 outline-none"
                required
              />
              <input
                type="text"
                name="postal_code"
                value={address.postal_code}
                onChange={handleChange}
                placeholder="Postal Code"
                className="border rounded-lg p-2 bg-gray-50 outline-none"
                required
              />
            </div>

            {/* Country */}
            <input
              type="text"
              name="country"
              value={address.country}
              onChange={handleChange}
              placeholder="Country"
              className="w-full border rounded-lg p-2 bg-gray-50 outline-none"
              required
            />

            {/* Default Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_default"
                checked={address.is_default}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-0"
              />
              <span className="text-gray-700 text-sm">Set as default address</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Save Address
            </button>
            {
              tracker && 
<Payment />
            
            }
          </form>
        </div>
      </div>
    </UserLayout>
  );
}
