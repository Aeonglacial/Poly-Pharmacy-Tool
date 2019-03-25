const fs = require('fs');
const os = require('os');
const ipcRen = require('electron').ipcRenderer;


let data = fs.readFileSync('src/Utilities/patientdata.json');
let patient;
const ptName = document.getElementById('patientName');
const ptDOB = document.getElementById('dob');
const ptAdm = document.getElementById('adm');
const ptSub = document.getElementById('sub');
const meds = document.getElementById('meds');
const button = document.getElementById('print');

var tableBody = document.getElementById('output');



patient = JSON.parse(data);

ptName.innerHTML = 'Patient Name: ' + patient.name;
ptDOB.innerHTML = 'Patient Date of Birth: ' + patient.dob;
ptAdm.innerHTML = patient.adm;
ptSub.innerHTML = patient.sub;


for(i = 0; i < patient.meds.length; i++){

    var x = tableBody.insertRow(0);
    let c1,c2,c3,c4,c5,c6,c7;

    c1 = x.insertCell(0);
    c2 = x.insertCell(1);
    c3 = x.insertCell(2);
    c4 = x.insertCell(3);
    c5 = x.insertCell(4);
    c6 = x.insertCell(5);
    c7 = x.insertCell(6);
  
    c1.innerHTML = patient.meds[i];
    c2.innerHTML = '<td><input id="inputdose" type="text" name="dose" class="form-control" size=2><select name="dosage" id="dosageid" class="form-control" size="1"><option id="MG" value="MG">MG</option><option id="ML" value="ML">ML</option><option id="MCG" value="MCG">MCG</option><option id="percent" value="%">%</option></td>';
    c3.innerHTML = '<td><input id="inputdir" type="text" name="dir" class="form-control"></td>';
    c4.innerHTML = '<td><input id="inputdox" type="text" name="dox" class="form-control"></td>';
    c5.innerHTML = '<td><input id="inputindict" type="text" name="indict" class="form-control"></td>';
    c6.innerHTML = '<td><input id="checkdox" type="checkbox" name="dox" value="Yes" class="form-control">Yes<br><input id="checkdox" type="checkbox" name="dox" value="No" class="form-control">No</td>';
    c7.innerHTML = '<td><input id="checkpre" type="checkbox" name="pre" value="Yes" class="form-control">Yes<br><input id="checkpre" type="checkbox" name="pre" value="No" class="form-control">No</td>';
 
};


button.addEventListener('click', function(event){


    ipcRen.send('print-to-pdf');
    button.style.visibility = "hidden";

})

ipcRen.on('wrote-pdf', function(event,path){
    const message = `Wrote PDF to: ${path}`

})














