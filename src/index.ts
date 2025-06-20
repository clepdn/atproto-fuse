//@ts-ignore
import Fuse from "fuse-native" 
import { exec } from "child_process"

const MOUNTPOINT = "/mnt/atproto-fuse"

const ops = {
	init: (cb: (rc: number) => void) => {
		console.log("hi!")
		cb(0)
	},
	readdir: (path: string, cb: (rc: number, entries: string[]) => void) => {
		console.log("reading", path)
		cb(0, ["penis", "cock", "peepee :)"])
	},
	getattr: (path: string, cb: (rc: number, stat: any) => void) => {
		cb(0, { 
			mtime: new Date(),
			atime: new Date(),
			ctime: new Date(),
			size: 100,
			mode: 16877,
			uid: process.getuid(),
			gid: process.getgid()
		})
	}
}

const fuse = new Fuse(MOUNTPOINT, ops, { debug: true })

fuse.mount((err: any) => {
	console.log("Hello world!")
	if (err) console.log(err)
})

process.on("SIGINT", () => {
	exec(`fusermount -u ${MOUNTPOINT}`)
	process.exit(0)
})
