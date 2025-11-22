import { useEffect, useState } from "react";
import { MapPin, Home, Phone, User, Check } from "lucide-react";
import UserLayout from "../../components/UserLayout";
import { data, useNavigate } from "react-router";
import api from "../../services/api";
import Payment from "./payment";
// import { Check, MapPin, Phone, User } from 'lucide-react';


export default function AddressPage() {
  const [tracker, setTracker] = useState(false)
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
  const [listAddress, setListAddress] = useState([null]);

  useEffect(() => {
    (async () => {
      const user_id = localStorage.getItem('userId');
      console.log("user id", user_id);
      const response = await api.getAddress(user_id);
      if (response.success) {
        console.log("get address", response.data);
        response.data.map((data) => {
          setListAddress((prev) => [...prev, data])
        })

      }
    })()
  }, [])


  const [selectedAddressId, setSelectedAddressId] = useState();

  const handleSelectAddress = (id, booleanValue) => {
    setSelectedAddressId(id);
    setTracker(booleanValue)
    console.log('Selected address ID:', id);
  };

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
    window.location.reload()
  };
  const navigate = useNavigate()

  return (
    <UserLayout>
      <div>
        {
          listAddress ? listAddress.map((add, i) => (
            < AddressCard
              key={i}
              address={add}
              isSelected={selectedAddressId === add?.id}
              onSelect={handleSelectAddress}
            />
          )
          ) : null
        }

        {
          tracker && <Payment address_id={selectedAddressId} />
        }

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

            </form>
          </div>
        </div>

      </div>
      <button className="bg-blue-500 h-30 w-30" onClick={() => setTracker(true)}>Next</button>
    </UserLayout>
  );
}


export const AddressCard = ({ address, isSelected, onSelect }) => {
  console.log("in the address component", address)

  return (
    address && <div
      onClick={() => onSelect(address.id, true)}
      className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${isSelected
        ? 'border-blue-500 bg-blue-50 shadow-lg'
        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
        }`}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Default Badge */}
      {/* {address?.is_default && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
          Default
        </div>
      )} */}

      {/* Full Name */}
      <div className="flex items-center mb-3">
        <User className="w-5 h-5 text-gray-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">{address?.full_name}</h3>
      </div>

      {/* Address */}
      <div className="flex items-start mb-3">
        <MapPin className="w-5 h-5 text-gray-600 mr-2 mt-1 flex-shrink-0" />
        <div className="text-gray-700">
          <p>{address?.address_line_1}</p>
          <p>
            {address?.city}, {address?.state} {address?.postal_code}
          </p>
          <p>{address?.country}</p>
        </div>
      </div>

      {/* Phone Number */}
      <div className="flex items-center text-gray-700">
        <Phone className="w-5 h-5 text-gray-600 mr-2" />
        <p>{address?.phone_number}</p>
      </div>

      {/* Metadata */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Added on {new Date(address?.created_at).toLocaleDateString()}
        </p>
      </div>

    </div>
  );
};