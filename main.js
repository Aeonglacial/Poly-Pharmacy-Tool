const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const shell = require('electron').shell
const fs = require('fs');
const os = require('os');



let win
let addWin
let patient

function createWindow () {

  win = new BrowserWindow({ width: 1750, height: 970, icon:__dirname +'/src/assets/img/icon1.png', resizable: false})

  win.loadFile('src/index.html')

 
  win.on('closed', () => {
    win = null
  })

  Menu.setApplicationMenu(menu)
};



var menu =  Menu.buildFromTemplate ([
  {
    label: 'Menu',
    submenu: [
        {label: 'Clear Form', click() {
          win.reload()
        }},
        {label: 'Print', click() {
          addWin.print()
        }},
        {label: 'Exit',
         click() {
             app.quit()
         }  }
    ]    
  }
]);



ipcMain.on('patient-data', (event, arg) => {

  patient = arg;
  event.sender.send('patient-shit', patient);
  addWin = new BrowserWindow({width: 1100, height: 700, icon:__dirname +'/src/assets/img/icon1.png'})

  addWin.loadFile('src/reviewform.html');
    addWin.on('closed', () => {
    addWin = null
  })
  
        
});

ipcMain.on('print-to-pdf', function(event) {
  
  const pdfPath = path.join(os.tmpdir(),`medreviewformfor${patient.name}.pdf`);
  const boom = BrowserWindow.fromWebContents(event.sender);

  boom.webContents.printToPDF({}, function (err, data){
    if(err){
      return console.log(err.message)
    };
    fs.writeFile(pdfPath, data, function(error){
      if (error){
        return console.log(error.message)
      };
      shell.openExternal('file://' + pdfPath)
      event.sender.send('wrote-pdf', pdfPath)
    })

  })

})


app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {

  if (win === null) {
    createWindow()
  }
})
