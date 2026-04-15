import React from 'react'

const BillService = async(request, file) => {
    const formData = new FormData();
    formData.append("image", file);

    return await request({
        url: "/bill/test-upload",
        method: "POST",
        body: formData,
    })
}

export default BillService