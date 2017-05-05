'use strict';

var crypto = require('crypto');
var express = require('express');
var router = express.Router();

var cp = require('child_process');
var fs = require('fs');
//const drivelist = require('drivelist');

function hash(string) {
    var secret = "a secret";
    return crypto.createHmac('sha256', secret).update(string).digest('hex');
}

var userData = [{
    username: "mithrandir",
    name: {
        salutation: "Mr.",
        first: "Gandalf",
        middle: "J",
        last: "Stormcrow"
    },
    passwordHash: hash("keepItSecret!")
}, {
    username: "frodo",
    name: {
        salutation: "Mr.",
        first: "Frodo",
        middle: "P",
        last: "Baggins"
    },
    passwordHash: hash("keepItSafe!")
}];

router.get('/api/regions', function (req, res, next) {
    cp.exec("dse all -dump 2>&1 | grep Region | grep -v Replication | awk '{ print $2 }' | uniq", {
        shell: "/bin/bash"
    }, function (err, stdout, stderr) {
        var regions = stdout.split("\n");

        regions.pop();

        res.json({ regions: regions });
    });
});

router.get('/api/region/:regionName', function (req, res, next) {

    var output = {};
    var region = req.params.regionName;

    output.freeBlocks = parseInt(cp.execSync("mumps -r ^%FREECNT 2>&1 | grep " + region + " | awk '{ printf $2 }'", { shell: "/bin/bash" }).toString());
    output.totalBlocks = parseInt(cp.execSync("mumps -r ^%FREECNT 2>&1 | grep " + region + " | awk '{ printf $3 }'", { shell: "/bin/bash" }).toString());
    output.fileName = cp.execSync("mumps -r ^%FREECNT 2>&1 | grep " + region + " | awk '{ printf $5 }'", { shell: "/bin/bash" }).toString();
    output.fileSize = fs.statSync(output.fileName).size;
    output.blockSize = parseInt(cp.execSync("dse all -dump 2>&1 | sed -n '/" + region + "/,/Block size (in bytes)/p' | grep 'Block size' | awk '{printf $8}'").toString());
    output.freeBytes = output.blockSize * output.freeBlocks;

    res.json(output);
});

router.get('/api/storage', function (req, res, next) {

    var output = {};
});

router.get('/api/journaling/:regionName', function (req, res, next) {

    var output = {};
    var region = req.params.regionName;

    var onOff = cp.execSync("dse all -dump 2>&1 | sed -n '/" + region + "/,/Journal State/p' | grep 'Journal State' | awk '{print $3 $4}'").toString();

    if (onOff.includes("ON")) {
        output.enabled = true;
    } else {
        output.enabled = false;
    }

    res.json(output);
});

router.get('/api/replication', function (req, res, next) {});

router.get('/api/processes/:commandName', function (req, res, next) {

    var output = [];
    var processCount = 0;
    var totalMemory = 0;
    var totalCPU = 0;

    cp.exec("ps -C " + req.params.commandName + " -o pid:1,rss:1,pcpu:1,start_time:1,euid:1,cmd:1 --no-headers", { shell: "/bin/bash" }, function (err, stdout, stderr) {
        if (stdout.length) {
            var ps = stdout.split("\n");

            for (var index in ps) {
                var entry = ps[index].split(" ");
                var command = entry.slice(5).join(" ").trim();

                var euid = parseInt(entry[4]);

                var out = {
                    pid: parseInt(entry[0]),
                    euid: parseInt(entry[4]),
                    memory: parseInt(entry[1]) * 1024,
                    cpuPercentage: parseFloat(entry[2]),
                    startTime: entry[3],
                    command: command,
                    args: command.split(" ").slice(1)
                };

                if (index < ps.length - 1) {
                    processCount++;
                    totalMemory = totalMemory + out.memory;
                    totalCPU = totalCPU + out.cpuPercentage;
                }

                if (process.geteuid() === euid) {

                    var ports = [];

                    var portsStr = cp.execSync("lsof -Pan -p " + entry[0] + " -i | grep LISTEN | tr -s ' '", { shell: "/bin/bash" }).toString();
                    var portsLines = portsStr.split("\n");

                    portsLines.pop();

                    for (var index in portsLines) {
                        var portsArr = portsLines[index].split(" ");

                        var port = {
                            addressFamily: portsArr[4],
                            protocol: portsArr[7],
                            interface: portsArr[8].split(":")[0],
                            port: parseInt(portsArr[8].split(":")[1])
                        };

                        ports.push(port);
                    }

                    out.ports = ports;
                }

                output.push(out);
            }

            output.pop();
        }

        res.json({
            processCount: processCount,
            totalMemory: totalMemory,
            totalCPU: totalCPU,
            processes: output
        });
    });
});

router.post('/api/login', function (req, res, next) {

    res.header("Content-Type", "application/json");
});

router.get('/api/users', function (req, res, next) {

    res.header("Content-Type", "application/json");

    var response = {
        users: userData,
        success: true
    };

    res.send(response);
});

router.post('/api/users', function (req, res, next) {

    res.header("Content-Type", "application/json");

    userData.push(req.body);

    var response = {
        success: true,
        user: req.body
    };

    res.send(response);
});

module.exports = router;