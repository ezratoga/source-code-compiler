const basicSyntax = {
  javascript: '',
  java: 'import java.io.*;\n\npublic class Default {\n\tpublic static void main(String[] args){\n\t\n\t}\n}',
  c: '#include <stdio.h>; \n\nint main() {\n\treturn 0;\n}',
  'csharp.net': 'using System;\n\npublic class Default {\n\tpublic static void Main(string[] args) {\n\t}\n}',
  python: '',
  'c++': '#include <stdio.h>; \nint main() {\n\treturn 0;\n}',
};

const languageVersion = {
  javascript: '18.15.0',
  'c++': '10.2.0',
  c: '10.2.0',
  'csharp.net': '5.0.201',
  java: '15.0.2',
  python: '3.10.0'
};

module.exports = {
  basicSyntax,
  languageVersion
};
