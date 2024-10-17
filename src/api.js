// To get detail each programming language from EMKC API
export const getVersion = async () => {
  const response = await fetch("https://emkc.org/api/v2/piston/runtimes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  }).then((res) => res)
  .catch((error) => JSON.stringify(error));



  const data = await response.json();
  return data;
};

// API for compiling source code inputted
export const compileCode = async (language, code) => {
  let detailLanguage = await getVersion(); // call function for get detail of programming language
  detailLanguage?.sort(() => -1); // sort by versioning of programming language framework
  const getSpecificDetailLanguage = detailLanguage?.find((elem) => elem?.language === language); // get language according to the input

  // execute the source code using EMKC API
  const response = await fetch("https://emkc.org/api/v2/piston/execute", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language: language, // language inputted
      version: getSpecificDetailLanguage?.version, // get version that available from EMKC API
      files: [{content: code}], // content of source code inputted is put into key files[$].content
    }),
  });

  const data = await response.json();
  return data;
};
