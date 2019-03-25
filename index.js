const {BrowserWindow, Menu, dialog} = require('electron').remote
const path = require('path')
const url = require('url')
const ipcRen =  require('electron').ipcRenderer
const fs = require('fs')

const write = fs.writeFileSync


const btn = document.getElementById('btn');
const stimulants = document.getElementById('stim').selectedOptions;
const antiphyschotics = document.getElementById('antipsy').selectedOptions;
const antidepressant = document.getElementById('antidep').selectedOptions;
const antiepileptic = document.getElementById('anti').selectedOptions;

var boldMeds = ["Clozapine","Carbamazepine","Divalproex","Lithium","Insulin","Warfarin"];

const tableA = document.getElementById('formA').getElementsByTagName('select');


let addWindow
let medForm = document.getElementsByTagName('option');
let reg = document.getElementsByTagName('input');
let radioAdmin = document.getElementsByName('admType');
let radioAbuse = document.getElementsByName('abuse');
let medColForm = document.forms[1].elements;
let patient;



class PatientData {
  constructor(name, dob, adm, sub, meds, medcollection){
    this.name = name;
    this.dob = dob;
    this.adm = adm;
    this.sub = sub;
    this.meds = meds;
    this.medCollection = medcollection;
  }

  hasStimAbuse(){
    var stimAbuse;

    if(this.sub == 'stim' && this.medCollection.includes(stimulants)){
      stimAbuse = true;
    }
    else {
      stimAbuse = false;
    }
    return stimAbuse
  }

  issaFiend(){
    var fiend;
    let arr = [];

    for (i = 0; i < tableA.length; i++){
    
    var ell = tableA[i];
    let tableAdata = ell.selectedOptions;

    if(tableAdata != null && tableAdata.length != 0){
      arr.push(tableAdata);
      }
     }

    if (this.sub == 'oud' || this.sub == 'aud' && arr.length > 1){
      fiend = true;      
    } else { fiend = false}
    return fiend;
  }

  highAlert(){
    
    if(this.meds.includes(boldMeds[0]) || this.meds.includes(boldMeds[1]) || this.meds.includes(boldMeds[2]) || this.meds.includes(boldMeds[3]) || this.meds.includes(boldMeds[4]
      || this.meds.includes(boldMeds[5]))){
         return true
 
  } else {return false}
};
};

btn.addEventListener('click', genMedReview);

function genMedReview (){
   var name = reg.patientFistname.value + ' ' + reg.patientLastname.value;
   var dob = reg.dob.value;
   var adm;
   var sub;
   var meds = [];
   var medcollection = [];
   

    for (i = 0; i < radioAdmin.length; i++){
      if(radioAdmin[i].checked){
        adm = radioAdmin[i].value;
      break;
      }
    };

    for (i = 0; i < radioAbuse.length; i++){
      if(radioAbuse[i].checked){
        sub = radioAbuse[i].value;
      break;
      }
    };
    
    for (i = 0; i < medForm.length; i++){
      var sel = [];

      if(medForm[i].selected){
        sel  = medForm[i].value;
        meds.push(sel);
      }	
    };

    for (i = 0 ; i < medColForm.length; i++ ){
      var elem = medColForm[i];
      var selc = elem.selectedOptions;

      if(selc != null && selc.length != 0){
        medcollection.push(selc);
      }
    };

    patient = new PatientData (name, dob, adm, sub, meds, medcollection);

    var ptdata = JSON.stringify(patient)

  
    write('src/Utilities/patientdata.json', ptdata);



    if (patient.meds >= 6 && patient.name.length >4) {
      ipcRen.send('patient-data', patient);
    } else if (patient.hasStimAbuse() && patient.name.length >4 ){
      ipcRen.send('patient-data', patient);
    } else if (patient.issaFiend() && patient.name.length >4){
      ipcRen.send('patient-data', patient);
    } else if (antiphyschotics.length >= 2 && patient.name.length >4){
      ipcRen.send('patient-data', patient);
    } else if (antidepressant.length >= 3 && patient.name.length >4){
      ipcRen.send('patient-data', patient);
    } else if (antiepileptic.length >= 2 && patient.name.length >4){
      ipcRen.send('patient-data', patient);
    } else if (patient.highAlert() && patient.name.length >4){
      ipcRen.send('patient-data', patient);
    } else {
      dialog.showErrorBox('No Med Review', 'Medication Review Not Generated - Patient Does not Require Review');
    }   
    

};




var newMenu =  Menu.buildFromTemplate ([
    {
      label: 'Med Review Form',
      submenu: [
          {label: 'Clear Form'},
          {label: 'Exit',
           click() {
               app.quit()
           }  }
      ]    
    }
  ]);

