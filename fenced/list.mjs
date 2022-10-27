export default function List(item, next = List.Empty)
{//console.log("ITEM IS", item);
//    if (!item) { console.log(Error().stack) };
    if (!(this instanceof List))
        return new List(item, next);

    this.count = next.count + 1;
    this.item = item;
    this.next = next;
}

List.prototype[Symbol.iterator] = function * ()
{
    if (this.count <= 0)
        return;

    yield this.item;
    yield * this.next[Symbol.iterator]();
}

List.prototype.mapcat = function (f, rhs)
{
    return this.count <= 0 ?
        rhs :
        List(f(this.item), this.next.mapcat(f, rhs));
}

List.prototype.concat = function (rhs)
{
    return this.count <= 0 ?
        rhs :
        List(this.item, this.next.concat(rhs));
}

List.prototype.join = function (...args)
{
    return [...this].join(...args);
}

List.prototype.map = function (f, self, index = 0, original = this)
{
    return this.count <= 0 ?
        List.Empty :
        List(
            f.call(self, this.item, index, original),
            this.next.map(f, self, index + 1, original));
}

List.prototype.reverse = function (next = List.Empty)
{
    return this.count <= 0 ?
        next :
        this.next.reverse(List(this.item, next));
}

List.prototype.pop = function ()
{
    return this.next;
}

List.prototype.peek = function ()
{
    return this.item;
}

List.prototype.push = function (item)
{
    return List(item, this);
}

List.prototype.take = function ({ while: f,  until })
{
    const take = f || ((...args) => !until(...args));

    if (this.count <= 0)
        return [List.Empty, List.Empty];

    if (!take(this.item))
        return [List.Empty, this];
//console.log(this.next);
    const [taken, rest] = this.next.take({ while: f });

    return [List(this.item, taken), rest];
}

List.prototype.reduce = function (f, ...rest)
{
    return this.count <= 0 ?
        rest[0] :
        this.next.reduce(f, rest.length > 0 ?
            f(rest[0], this.item) :
            this.item);
}

List.Empty = { count: 0 };
Object.setPrototypeOf(List.Empty, List.prototype);
