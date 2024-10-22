import { languageVersion } from "./helper/constant";

// API for compiling source code inputted
export const compileCode = async (language, code, input = '') => {
  // execute the source code using EMKC API
  const response = await fetch("https://emkc.org/api/v2/piston/execute", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language: language, // language inputted
      version: languageVersion[language], // get version that available from EMKC API
      files: [{content: code}], // content of source code inputted is put into key files[$].content
      stdin: input // handle if any input
    }),
  });

  const data = await response.json();
  return data;
};

export const handleIfAnynput = async (language = '', code = '', input = '') => {
  switch (language) {
  case 'javascript':
    if (code && code?.includes('require(\'readline\')') && !input) {
      const question = code?.split('readline.question(')[1].split(',')[0];
      return question;
    }
    break;
  default:
    return '';
  }
};