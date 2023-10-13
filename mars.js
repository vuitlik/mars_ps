class mars {
    #get_ip() {
        const network_interfaces = require("os").networkInterfaces();
        let ipv4_address = null;
        for (const interface_name of Object.keys(network_interfaces)) {
            for (const info of network_interfaces[interface_name]) {
                if (info.family === "IPv4" && !info.internal) {
                    ipv4_address = info.address
                    break
                }
            }
            if (ipv4_address) return ipv4_address
        }
    }
    constructor(ip = this.#get_ip(), port = 55100) {
        this.server_unit = require("net").createServer()
        this.server_unit.listen(port, ip)
    }
    start(funcs) {
        this.server_unit.on("connection", (clientUnit) => {
            clientUnit.on("data", (data) => {
                data = JSON.parse(data.toString())
                if (!funcs[data.name]) clientUnit.write(JSON.stringify({family : 9, error : 2, info : `function name - "${data.name}"`}))
                else if (data.args.length !== funcs[data.name][1]) clientUnit.write(JSON.stringify({family : 9, error: 2, info: `function name - "${data.name}", provided parameters count - ${data.args.length}, function parameters count - ${funcs[data.name][1]}`}))
                else {
                    let res = funcs[data.name][0](data.args)
                    if (res === null) res = {target : "int", value : 0}
                    clientUnit.write(JSON.stringify(res))
                }
            })
        })
    }
}
function from_chars_to_string(chars) {
    let res = ''
    for (const char of chars) res += char.value
    return res
}
function from_arr_to_string(arr) {
    const res = []
    for (const el of arr) {
        if (el.target.endsWith("[]")) el.value = from_arr_to_string(el.value)
        res.push(String(el.value))
    }
    return `{${res.join(", ")}}`
}
module.exports = {mars, from_chars_to_string, from_arr_to_string}