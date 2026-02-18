import { useEffect, useState } from "react";
import { MapPin, Home, Phone, User, Check, Plus } from "lucide-react";
import UserLayout from "../../components/UserLayout";
import { useNavigate } from "react-router";
import api from "../../services/api";
import Payment from "./payment";
import { UseAuth } from "../../components/AuthContext";

export default function AddressPage() {
  const navigate = useNavigate();
  const { userID } = UseAuth()
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [address, setAddress] = useState({
    user_id: userID,
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

  /* -------------------- Fetch Addresses -------------------- */
  useEffect(() => {
    (async () => {
      const response = await api.getAddress(userID);
      if (response?.success) {
        setAddresses(response.data);
      }
    })();
  }, [userID]);

  /* -------------------- Handlers -------------------- */
  const handleSelectAddress = (id) => {
    setShowForm(false);

    if (selectedAddressId) {

      setSelectedAddressId(null);
    } else {
      setSelectedAddressId(id);
    }
  };

  const newAddress = () => {
    setSelectedAddressId(null);
    setShowForm((prev) => !prev);
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await api.createAddress(address);

    if (response?.success) {
      setAddresses((prev) => [...prev, response.data]);
      setShowForm(false);
      setAddress((prev) => ({
        ...prev,
        full_name: "",
        phone_number: "",
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        is_default: false,
      }));
    }
  };

  return (
    <UserLayout>
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8 mt-10">


        {addresses.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Select Delivery Address
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {addresses.map((addr) => (
                <AddressCard
                  key={addr.id}
                  address={addr}
                  isSelected={selectedAddressId === addr.id}
                  onSelect={handleSelectAddress}
                />
              ))}
            </div>

            {/* Add Address Button */}
            <button
              onClick={() => newAddress()}
              className="mt-6 flex items-center gap-2 text-blue-600 font-medium hover:underline"
            >
              <Plus size={18} /> Add New Address
            </button>
          </div>
        )}

        {/* -------------------- Payment -------------------- */}
        {selectedAddressId && (
          <Payment address_id={selectedAddressId} />
        )}

        {/* -------------------- Address Form -------------------- */}
        {(addresses.length === 0 || showForm) && (
          <div className="bg-white shadow-xl rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <MapPin className="text-blue-600" /> Add Address
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="full_name"
                    placeholder="Enter your full name"
                    value={address.full_name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone_number"
                    placeholder="Enter your phone number"
                    value={address.phone_number}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Address Line 1 */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 1 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Home className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="address_line_1"
                    placeholder="House/Flat No., Street Name"
                    value={address.address_line_1}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Address Line 2 */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 2 <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="address_line_2"
                  placeholder="Landmark, Area, Locality"
                  value={address.address_line_2}
                  onChange={handleChange}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* City, State, Postal Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Enter city"
                    value={address.city}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    placeholder="Enter state"
                    value={address.state}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="postal_code"
                    placeholder="Enter PIN code"
                    value={address.postal_code}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Country */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="country"
                    placeholder="Enter country"
                    value={address.country}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Default Address Checkbox */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    name="is_default"
                    checked={address.is_default}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                  />
                </div>
                <div className="ml-3">
                  <label className="text-sm font-medium text-gray-700 cursor-pointer">
                    Set as default address
                  </label>
                  <p className="text-xs text-gray-500 mt-0.5">
                    This address will be used as your primary shipping address
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Address
              </button>
            </form>
          </div>
        )}
      </div>
    </UserLayout>
  );
}



// const Input = ({ icon: Icon, ...props }) => (
//   <div className="flex items-center border rounded-lg p-2 bg-gray-50">
//     <Icon className="text-gray-400 mr-2" size={18} />
//     <input {...props} className="w-full bg-transparent outline-none" required />
//   </div>
// );

export const AddressCard = ({ address, isSelected, onSelect }) => (
  <div
    onClick={() => onSelect(address.id)}
    className={`relative p-6 rounded-xl border-2 cursor-pointer transition ${isSelected
      ? "border-blue-500 bg-blue-50 shadow-lg"
      : "border-gray-200 hover:shadow-md"
      }`}
  >
    {isSelected && (
      <div className="absolute top-4 right-4 bg-blue-500 text-white rounded-full p-1">
        <Check size={14} />
      </div>
    )}

    <h4 className="font-semibold text-gray-800 mb-2">{address.full_name}</h4>

    <p className="text-gray-700 text-sm">
      {address.address_line_1}, {address.city}, {address.state} -{" "}
      {address.postal_code}
    </p>

    <p className="text-sm text-gray-600 mt-2">{address.phone_number}</p>
  </div>
);
