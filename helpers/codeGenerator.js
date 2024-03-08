const codeGenerator = (length) => {
  let code = "";
  let codeformat = "0123456789";
  for (let i = 0; i < length; i++) {
    code += codeformat.charAt(Math.floor(Math.random() * codeformat.length));
  }
  return code;
};

export { codeGenerator };
