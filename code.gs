var token = //INSERT YOUR BOT TOKEN HERE; 
var telegramUrl = //INSERT YOUR PRIVATE BOT URL + token; 
var webAppUrl = //INSERT THE DEPLOYMENT WEB APP FROM APPSCRIPTS; 
var ssID = //INSERT THE SPREADSHEETID;

function setWebhook() { //THIS SETUP THE WEBHOOK WITH THE TELEGRAM BOT. REMEMBER TO INIT THIS METHOD BEFORE ANYTHING
  var url = telegramUrl + "/setWebhook?url=" + webAppUrl;
  var response = UrlFetchApp.fetch(url);
}

function sendMessage(chat_id, text) { //THIS SENDS THE MESSAGE FROM THE BOT TO THE CHAT IN WHICH THE COMMAND WAS WRITTEN
  var url = telegramUrl + "/sendMessage?chat_id=" + chat_id + "&text="+ text;
  var response = UrlFetchApp.fetch(url);
}

function doPost(e) {
  var contents = JSON.parse(e.postData.contents); //GETS VARIOUS DATA
  var chat_id = contents.message.chat.id; 
  var message = contents.message.text;
  var answer = "";
  var sheet = SpreadsheetApp.openById(ssID).getSheetByName(//YOUR SHEET NAME); //SHEET NAME
  switch(message){
    case "/nuovoprovino": //COMMAND NAME (THIS IS VERY STATIC, BE CAREFUL)
      
      var sheetRange = sheet.getRange(2,1,sheet.getLastRow(),sheet.getLastColumn());
      var values = sheetRange.getValues();
      var end = false;
      for(var i=0; i<values.length && !end; i++){
        if((values[i][13] === null || values[i][13] === "") && !(values[i][0] === "")){

          answer = "Nome: "+(values[i][0]).toString()+"%0A%0AIGN: "+(values[i][1]).toString()+"%0A%0ATag Telegram: "+(values[i][2]).toString()+"%0A%0AEta: "+(values[i][3]).toString()+"%0A%0AModalita: "+(values[i][4]).toString()+"%0A%0ARuolo: "+(values[i][5]).toString()+"%0A%0ADa Dove viene: "+(values[i][6]).toString()+"%0A%0AQuanto Tempo Sta On: "+(values[i][7]).toString()+"%0A%0AHa il Microfono?: "+(values[i][8]).toString()+"%0A%0AEsperienza su MC: "+(values[i][9]).toString()+"%0A%0ACome ci ha Conosciuto: "+(values[i][10]).toString()+"%0A%0ALingue Conosciute: "+(values[i][11]).toString()+"%0A%0ACose su di Lvi: "+(values[i][12]).toString(); //GIVES OUT THE MESSAGE TO THE USER THAT CALLED THE COMMAND "/nuovoprovino"
          end = true;
        }
      }
      if(answer === ""){
        answer = "Non ci sono provini da fare, unlucky"; //IF THERE ARE NO AVAIABLE ROWS, IT SENDS AN ERROR MESSAGE
      }
      sendMessage(chat_id, answer);
      
      break;
    
    case "/confermaprovino":
  
      var sheetRange = sheet.getRange(2,1,sheet.getLastRow(),sheet.getLastColumn());
      var values = sheetRange.getValues();
      
      var end = false;
      for(var i=0; i<values.length && !end; i++){
        if(values[i][13] === ""){
          end = true;
          var x = "x";
          sheet.getRange(i+2,14).setValue(x);
        }
      }
      answer = "Confermato il provino per la prima persona della lista";
      sendMessage(chat_id, answer);
      break;

    case "/help":
        answer = "Per favore, usa uno dei comandi disponibili%0A%0A/nuovoprovino - Manda una richiesta di un nuovo provino%0A/confermaprovino - conferma un provino";
        sendMessage(chat_id, answer);
    break;

    default:
      break;
  }
  
}