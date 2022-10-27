import { unified } from "unified";
import remarkParse from "remark-parse";
import Section from "./section.mjs";


const parse = unified().use(remarkParse).parse;

const file = Section.fromMDAST(await parse(`\
# Hi

\`\`\`js
OK...
\`\`\`

`), "whateer.js");

  console.log(file)
  
