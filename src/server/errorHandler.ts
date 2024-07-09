import axios from "axios";

export function SendError(err: Error) {
    console.error(`unCaught exception: ${err.message}`);
    console.trace(err);
    if(process.env.WEBHOOK) axios.post(process.env.WEBHOOK, { content: `Error caughted: ${err.message} | ${new Date().toLocaleString()} | https://logs.betterstack.com/team/189697/tail?s=763480&rf=now-2d` });
    if(process.env.BETTERSTUCK_TOKEN) axios.post('https://in.logs.betterstack.com/', { message: err.message, stack: err.stack }, { headers: { Authorization: `Bearer ${process.env.BETTERSTUCK_TOKEN}` } });
}