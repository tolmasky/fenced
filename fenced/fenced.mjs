import { extname } from "path";

import { unified } from "unified";
import remarkParse from "remark-parse";
import Section from "./section.mjs";
import { inspect } from "node:util";


const given = f => f();

const parse = unified().use(remarkParse).parse;

const JavaScriptExtensions = Object
    .fromEntries(["cjs", "js", "jsx", "mjs", "javascript"]
        .map(key => [key, true]));

const isJavaScript = infoString => given((
    [first] = infoString.toLowerCase().split(" ")) =>
        JavaScriptExtensions[first] ||
        JavaScriptExtensions[extname(first)]);

export async function toModuleSource (source, filename)
{
//    console.log(inspect(Section.fromMDAST(await parse(source), filename), { depth:Infinity}));

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

    if (node.type === "code" && isJavaScript(`${node.lang} ${node.meta}`))
        return node.value;

    return "";
}
