import { extname } from "node:path";
import { readFile } from "node:fs/promises";
import { toModuleSource } from "./fenced.mjs";


const FencedCompoundExtensionRegExp = /\.[^.]+\.md$/;

export async function load(URLString, context, nextLoad)
{
    if (!FencedCompoundExtensionRegExp.test(URLString))
        return nextLoad(URLString);

    const source = await toModuleSource(await readFile(new URL(URLString), "utf-8"));

    return { format: "module", source, shortCircuit: true };
}
