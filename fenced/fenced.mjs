import { unified } from "unified";
import remarkParse from "remark-parse";
import Section from "./section.mjs";
import { inspect } from "node:util";


const parse = unified().use(remarkParse).parse;

export async function toModuleSource (source, filename)
{
    console.log(inspect(Section.fromMDAST(await parse(source), filename), { depth:Infinity}));

    return compile(Section.fromMDAST(await parse(source), filename));
}

function compile(node)
{
    if (node instanceof Section)
        return node
            .preamble
            .map(compile)
            .concat(node.children.map(compile))
//            .mapcat(compile, node.children.map(compile))
            .join("");

    if (node.type === "paragraph")
        return node
            .children.map(compile)
            .join("");

    if (node.type === "text")
        console.log(node.value);

    if (node.type === "code")
        return node.value;

    return "";
}
