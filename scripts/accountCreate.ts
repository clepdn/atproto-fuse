import { readFile, writeFile } from "fs/promises"
import "dotenv/config"
import { randomBytes } from "crypto"

if (!process.env.PDS_URL) throw new Error("fix ur env")

const pds_env = await readFile("pds/data/pds.env", { encoding: "utf8" })
const adminpw = pds_env.split("PDS_ADMIN_PASSWORD=")[1].split("\n")[0]
const hostname = pds_env.split("PDS_HOSTNAME=")[1].split("\n")[0]

console.log(`${process.env.PDS_URL}/xrpc/com.atproto.server.createInviteCode"`)

const Authorization = `Basic ${Buffer.from(`admin:${adminpw}`).toString('base64')}`

const res = await fetch(`${process.env.PDS_URL}/xrpc/com.atproto.server.createInviteCode`, {
	method: "POST",
	body: JSON.stringify({
		useCount: 1
	}),
	headers: {
		Authorization,
		"Content-Type": "application/json"
	}
})


const email    = randomBytes(16).toString('hex')
const handle   = randomBytes(4).toString('hex')
const password = randomBytes(16).toString('hex')
const code = (await res.json()).code

const res2 = await fetch(`${process.env.PDS_URL}/xrpc/com.atproto.server.createAccount`, {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		Authorization
	},
	body: JSON.stringify({
		inviteCode: code,
		email: `${email}@boner.com`,
		handle: `${handle}.${hostname}`,
		password
	})
})

const json = await res2.json()
console.log(res2)
console.log(email, handle, password)
await writeFile(`./password/${(json.did ?? "uh oh").replaceAll(":", "-")}`, password)

