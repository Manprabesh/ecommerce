class ApiResponse{

    constructor(message, success, data, file,error){
        this.success=success;
        this.message=message;
        if(data!==null) this.data=data;
        if(file !== null) this.file = file
        if(error != null) this.error = error
    }

    response(message="Request successfull", data=null,file=null){
        return new ApiResponse (message, true, data, file)
    }

    reject(message="server error",error=null , data =null){
        return new ApiResponse(message, false, data, error);
    }
}

const api = new ApiResponse()
export default api