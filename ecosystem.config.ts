module.exports = {
    apps: [{
        name: "CodeYard",
        script: "npm",
        args: "start",
        cwd: "/home/runner/CodeYard",
        watch: true,
        env: {
            NODE_ENV: "production",
        }
    }]
};