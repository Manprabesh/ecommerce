const base_url = "http://192.168.162.191:5000/api/v1";
// const base_url = "http://localhost:5000/api/v1";

class Api {
    async makeRequest(endpoint, options) {
        const url = `${base_url}${endpoint}`
        const response = await fetch(url, options);
        return await this.handleResponse(response)
    }

    async handleResponse(response) {
        const data = await response.json();
        console.log("response --->", data)
        return data;
    }

    async uploadProduct(data) {
        const response = await this.makeRequest('/upload/product',
            {
                method: 'POST',
                // credentials: 'include',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        )
        return await response
    }

    async createCategory(data) {
        const response = await this.makeRequest('/create/category', {
            method: "POST",
            body: JSON.stringify({
                category_name: data
            }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        return await response;

    }

    async getCategory() {

        const response = await this.makeRequest('/get/category', {
            method: "GET",
            headers: {
                'Accept': 'application/json'
            }
        })
        console.log("response ---->", response)
        return await response;
    }

    async upload_to_aws(data, file) {
        console.log("incoming data--->", data)
        console.log("incoming file--->", file)

        const response = await fetch(data, {
            method: "PUT",
            headers: {
                "Content-Type": file.type
            },
            body: file
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log("File uploaded succesully")
        return response;
    }

    async addToCart(data) {
        console.log("added to cart", JSON.stringify(data));
        const response = await this.makeRequest('/create/cart', {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }

        })
        return response;
    }

    async reduceFromCart(data) {
        console.log("added to cart", JSON.stringify(data));
        const response = await this.makeRequest('/update/cart', {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }

        });
        return response;
    }

    async getAllProduct() {
        const response = await this.makeRequest('/get/products', {
            method: "GET",
            headers: {
                'Accept': 'application/json'
            }
        })
        return response;
    }

    async getAllCategory() {
        const response = await this.makeRequest('/get/category', {
            method: "GET",
            headers: {
                'Accept': 'application/json'
            }
        })
        return response;
    }

    async createUser(data) {
        console.log("creating user", data)
        const response = await this.makeRequest('/create/user', {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                category_name: data
            }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        return response;
    }
    async loginUser(data) {
        console.log("data", data)
        const response = await this.makeRequest('/login/user', {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        return response;
    }

    async isAuthenticated() {
        const response = await this.makeRequest('/isAuthenticated', {
            method: "GET",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        return response;
    }

    async getCart(user_id) {
        const response = await this.makeRequest(`/get/cart/${user_id}`, {
            method: "GET",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        return response;
    }

    async deleteFromCart(cart_id) {
        console.log("delete from art", cart_id)
        const response = await this.makeRequest('/delete/cart', {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({ cart_id }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }

        });
        console.log("response--------->", response)
        return response;
    }

    async createAddress(data) {
        console.log("data", data)
        const response = await this.makeRequest('/create/address', {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }

        });
        console.log("response--------->", response)
        return response;
    }

    async getAddress(user_id) {

        const response = await this.makeRequest(`/get/address/${user_id}`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        )
        return response;
    }

    async createOrder(data) {
        const response = await this.makeRequest("/create-order", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
        return response;
    }

    async verifyPaymnet(response) {
        const result = await this.makeRequest('/verify-payment', {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
            }),
        })
        return result
    }
}
const api = new Api()
export default api;
