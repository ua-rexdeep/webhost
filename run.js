const { exit } = require("process");

const { exec } = require("child_process");

const run = (cmd) => new Promise((done, reject) => {
    console.log("[RUN]", cmd);
    exec(cmd, (err) => {
        if (err) reject(err);
        else {
            console.log('[DONE]', cmd)
            done();
        }
    })
});

(async () => {
    await run('npm i');
    await run('cd src/frontend && npm i');
    await run('cd ../..');
    exec('npm run build:web', (err) => {
        if (err) {
            console.error("Error during build web:", err);
            exit(1);
        }
        console.log("Web build success");

        exec('npm run build:server', (err_server) => {
            if (err_server) {
                console.error("Error during build server:", err_server);
                exit(2);
            }
            console.log("Server build success");

            const run = exec('npm run serve')
            run.stdout.on('data', (data) => {
                console.log(`[WebHost] ${data}`);
            });
        });
    });
})();
