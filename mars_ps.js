const mars = require("./mars")
const readline_sync = require("readline-sync")

function uni_print(data, end) {
    if (data.target === "char[]") data.value = mars.from_chars_to_string(data.value)
    else if (data.target.endsWith("[]")) data.value = mars.from_arr_to_string(data.value)
    process.stdout.write(data.value + end)
    return null
}

const println = (params) => uni_print(params[0], '\n')
const print = (params) => uni_print(params[0], '')

function input(params) {
    const result = {target: "char[]", value: []}
    for (let char of readline_sync.question('')) result.value.push({target : "char", value : char})
    return result
}

const funcs = {
    "println" : [println, 1],
    "print" : [print, 1],
    "input" : [input, 0]
};

if (require.main === module) (async () => {await new mars.mars().start(funcs)})()