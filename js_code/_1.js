function writeFileNames() {
    const uploadedFiles = document.getElementById("selectFiles");
    let txt = document.getElementById("nameList").innerHTML;
    let title;
    let message;
    utils.logToElectron("hop"+uploadedFiles.files) //hop[object FileList]
    utils.logToElectron("hop"+uploadedFiles.files[0]) //hop[object File]
    if ('files' in uploadedFiles) {
        utils.logToElectron("in cycle")
        if (uploadedFiles.files.length > 0) {
            let badNames = [];
            for (let file of uploadedFiles.files) {
                globalFileIdNumber++;
                if ('name' in file) {
                    if (nameAlreadyInList(file.name)) {
                        badNames.push(file.name);
                        continue;
                    }
                    txt += "<div id = 'divnum" + globalFileIdNumber + "'> <br> ";
                    txt += file.name + " " +
                        " <button type='button' class = 'del' onclick='hideLine(" + globalFileIdNumber + " )'>x</button><br></div>";
                    var aboutFiles = {
                        fileId: globalFileIdNumber,
                        name: file.name,
                        path: file.path
                    };
                    arrayFiles.push(aboutFiles);

                }
            }
            rewrite();
            if (badNames.length === 1) {
                ipcRenderer.sendSync('synchronous-message',
                    title = 'Oops! I did it again',
                    message = 'file ' + badNames + ' is already added')
            }
            if (badNames.length > 1) {
                ipcRenderer.sendSync('synchronous-message',
                    title = 'Oops! I did it again',
                    message = 'files ' + badNames + ' are already added')

            }

            document.getElementById("selectFiles").value = '';
        }
        document.getElementById("nameList").innerHTML = txt;
    }

}