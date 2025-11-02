const base_url = "http://localhost:5000/api/v1";

class Api {
    async makeRequest(endpoint, options) {
        const url = `${base_url}${endpoint}`
        const response = await fetch(url, options);
        return await this.handleResponse(response)
    }

    async handleResponse(response) {
        const data = await response.json();
        console.log("response --->", data)
        // if (!response.ok) {
        //     if (response.status === 404) {
        //         // return empty result instead of throwing
        //         return { statusCode: 404, message: data.message };
        //     }
        //     throw new Error(data.message || `HTTP error! status: ${response.status}`);
        // }
        // console.log("returning data", data)
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

      async addToCart(data){
        console.log("added to cart",JSON.stringify(data));
    }

}
const api = new Api()
export default api;