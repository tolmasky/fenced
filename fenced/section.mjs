import List from "./list.mjs";


export default function Section
({ 
    heading,
    depth = heading.depth,
    preamble = List.Empty,
    children = List.Empty
})
{
    if (!(this instanceof Section))
        return new Section({ heading, depth, preamble, children });

    this.depth = 0;
    this.heading = heading;
    this.preamble = preamble;
    this.children = children;
};

const adopt = key => (item, { [key]: list, ...rest }) =>
    Section({ ...rest, [key]: list.push(item) });
const toSection = heading => Section({ heading });
const toHeading = value =>
    ({ type: "heading", depth:0, children:[{ type: "text", value }] });

Section.fromMDAST = (document, title) =>
    collapse(1, document
        .children
        .reduce((stack, node) => node.type !== "heading" ?
            stack.pop().push(adopt("preamble")(node, stack.peek())) :
            collapse(node.depth, stack).push(toSection(node)),
            List(toSection(toHeading(title)))))
        .peek();

function collapse(depth, stack)
{
    const [shallower, remaining] = stack
        .take({ while: section => depth > section.depth });

    return remaining.push(shallower.reduce(adopt("children")));
}