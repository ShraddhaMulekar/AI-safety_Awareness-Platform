export const scamComponent = async (request, text) => {
//   console.log("Sending request:", text);

  const res = await request({
    url: "/scam/analyze",
    method: "POST",
    body: { text },
  });

//   console.log("Response from API:", res); 

  return res;
};