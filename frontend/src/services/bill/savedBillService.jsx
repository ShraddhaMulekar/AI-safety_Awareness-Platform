const saveBill = async (request, billData, extractedText) => {
  return await request({
    url: "/saved-bills/save",
    method: "POST",
    body: { billData, extractedText },
  })
}

const getSavedBills = async (request) => {
  return await request({
    url: "/saved-bills",
    method: "GET",
  })
}

const savedBillService = {
  saveBill,
  getSavedBills,
}

export default savedBillService