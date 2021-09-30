const { PythonShell } = require('python-shell');
const fs = require('fs');
const constants = require("./constants_js");






const options = {
    pythonPath: `${__dirname}/Python38/python.exe`,
    args: [],
};

const buttonFileCycle = document.getElementById('go');
buttonFileCycle.addEventListener('click', () => {
    const textOpt = fs.readFileSync(`${constants.PATHS.utils_path}options.args.txt`, 'utf8');
    writeLog(`TEXT_OPT: ${textOpt}`);
    const textByLine = textOpt.split('?');
    for (const strr of textByLine) {
        options.args.push(strr);
    }


    PythonShell.run(`${__dirname}/python_code/entry_python_point.py`, options, (err, results) => {
        makeLog(`options: ${options.args}`);
        writeLog(`PYTHONSHELLRUN OPTIONS.ARGS: ${options.args}`);
        if (err) {
            makeLog(`PYTHONSHELLRUN ERROR: ${err}`);
            alert(err);
            writeLog(`PYTHONSHELLRUN ERROR: ${err}`);
        }
        document.getElementById('reset').style.display = 'inline';
        document.body.style.cursor = 'auto';
        document.getElementById('wait').style.display = 'none';

        makeLog(results);
        writeLog(`RESULT: ${results}`);



    });
});
buttonFileCycle.addEventListener('click', () => {
    document.getElementById('leftbuttons').style.display = 'none';
    document.getElementById('inputLabel').style.display = 'none';
    document.getElementById('rightbox').style.display = 'none';
    document.getElementById('nameList').style.display = 'none';

    document.getElementById('go').style.display = 'none';
    document.body.style.cursor = 'wait';
    document.getElementById('wait').style.display = 'inline';
});
const buttonReset = document.getElementById('reset');

buttonReset.addEventListener('click', () => {
    document.getElementById('inputLabel').style.display = 'block';
    document.getElementById('rightbox').style.display = 'inline';
    document.getElementById('nameList').innerHTML = '';
    document.getElementById('nameList').style.display = 'inline';
    document.getElementById('leftbuttons').style.display = 'inline';
    document.getElementById('go').style.display = 'inline';
    document.getElementById('reset').style.display = 'none';
    options.args.length = 0;
});


