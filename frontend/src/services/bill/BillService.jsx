import React from 'react'

const BillService = async(request, file) => {
    const formData = new FormData();
    formData.append("file", file);

    return await request({
        url: "/bill/upload",
        method: "POST",
        body: formData,
    })
}

export default BillService