var xmlurl='https://raw.githubusercontent.com/xandr001/dnd5ecompedium/master/Data/Items/Mundane%20Items.xml'
//var xmlurl='Data/Items/Mundane%20Items.xml'

function initDataTable() {
  
  $.tablesorter.addParser({
  // set a unique id
  id: 'dndprice',
  is: function(s, table, cell, $cell) {
    // return false so this parser is not auto detected
    return false;
  },
  format: function(s, table, cell, cellIndex) {
    // format your data for normalization
     /*
     var multiplierStr=s.toLowerCase()
      .replace(/[0-9]*\.?[0-9]+/,"")
      .replace(" платины","1000")
      .replace(" золота","100")
      .replace(" серебра","10")
      .replace(" меди","1")
      .replace(" электрума","50")
      ;
      */
    
   /* var multiplierStr=s.toLowerCase()
      .replace(/[0-9]*\.?[0-9]+/,"")
      .replace("pp","1000")
      .replace("gp","100")
      .replace("sp","10")
      .replace("cp","1")
      .replace("ep","50")
      ;

    */
    var multiplierStr=s.toLowerCase();
    if (/платин/.test(multiplierStr)) {multiplierStr="1000"};
    if (/золот/.test(multiplierStr)) {multiplierStr="100"};
    if (/серебр/.test(multiplierStr)) {multiplierStr="10"};
    if (/мед/.test(multiplierStr)) {multiplierStr="1"};
    if (/электр/.test(multiplierStr)) {multiplierStr="50"};



    var base=parseFloat(s);
    var multiplier=parseInt(multiplierStr);
    var copperprice=base*multiplier;
  
    
    return copperprice;
  },
  // set type, either numeric or text
  type: 'numeric'
});
  
  $("#DataTable").tablesorter({
    // this will apply the bootstrap theme if "uitheme" widget is included
    // the widgetOptions.uitheme is no longer required to be set
    theme : "bootstrap",
    
    headers: { 2: { sorter: 'dndprice' } },

    widthFixed: true,

    headerTemplate : '{content} {icon}', // new in v2.7. Needed to add the bootstrap icon!

    // widget code contained in the jquery.tablesorter.widgets.js file
    // use the zebra stripe widget if you plan on hiding any rows (filter widget)
    widgets : [ "uitheme", "filter", "columns", "zebra" ],

    widgetOptions : {
      // using the default zebra striping class name, so it actually isn't included in the theme variable above
      // this is ONLY needed for bootstrap theming if you are using the filter widget, because rows are hidden
      zebra : ["even", "odd"],

      // class names added to columns when sorted
      columns: [ "primary", "secondary", "tertiary" ],

      // reset filters button
      filter_reset : ".reset",

      // extra css class name (string or array) added to the filter element (input or select)
      filter_cssFilter: "form-control",

      // set the uitheme widget to use the bootstrap theme class names
      // this is no longer required, if theme is set
      // ,uitheme : "bootstrap"

    }
  })
  .tablesorterPager({

    // target the pager markup - see the HTML block below
    container: $(".ts-pager"),

    // target the pager page select dropdown - choose a page
    cssGoto  : ".pagenum",

    // remove rows from the table to speed up the sort of large tables.
    // setting this to false, only hides the non-visible rows; needed if you plan to add/remove rows with the pager enabled.
    removeRows: false,

    // output string - default is '{page}/{totalPages}';
    // possible variables: {page}, {totalPages}, {filteredPages}, {startRow}, {endRow}, {filteredRows} and {totalRows}
    output: '{startRow} - {endRow} / {filteredRows} ({totalRows})'

  });

};

function fetchDataTableFromXMLToGlobalString () {

      $.ajax({
      type: "GET",
	    url: xmlurl,
      dataType: "text",
      success: function(xmltext) {
        window.datatablexml = $.parseXML(xmltext);
        var i=1;
		    $(window.datatablexml).find("item").each(function() {
        var name=$(this).find(' > name').text()
		    var type=$(this).find(' > type').text()
        var value=$(this).find(' > value').text()
		    var weight=$(this).find(' > weight').text()
		    var text=$(this).find(' > text').text()
		  
		  $('#DataTable > tbody').append('<tr onClick="showInfo('+i+')"><td>' + name +'</td><td>' + type +'</td><td>' + value +'</td><td>' + weight +'</td></tr>');
		  i++;
        })
        $("#DataTable").trigger("update");
      }
    });
};

function fetchDataTableFromXML () {

      $.ajax({
      type: "GET",
	    url: xmlurl,
      dataType: "xml",
      success: function(xml) {
        var i=1;
		$(xml).find("item").each(function() {
      var name=$(this).find(' > name').text()
		  var type=$(this).find(' > type').text()
      var value=$(this).find(' > value').text()
		  var weight=$(this).find(' > weight').text()
		  var text=$(this).find(' > text').text()
		  
		  $('#DataTable > tbody').append('<tr onClick="showInfo('+i+')"><td>' + name +'</td><td>' + type +'</td><td>' + value +'</td><td>' + weight +'</td></tr>');
		  i++;
        })
        $("#DataTable").trigger("update");
       }
    });
};

$(document).ready(function() {
  initDataTable() ;
  fetchDataTableFromXMLToGlobalString();
  //fetchDataTableFromXML();    
    
     
 });
 
function addInfoToContainerFromXML (i) {
$.ajax({
      type: "GET",
	    url: xmlurl,
      dataType: "xml",
      success: function(xml) {
		    i--;
		    var text="";
        var name=$(xml).find("item:eq("+i+") > name").text();
		    text+="<strong>Тип: </strong>"+$(xml).find("item:eq("+i+") > type").text()+"<br />";
		    text+="<strong>Вес: </strong>"+$(xml).find("item:eq("+i+") > weight").text()+"<br />";
		    text+="<strong>Стоимость: </strong>"+$(xml).find("item:eq("+i+") > value").text()+"<br /><br />";
		    $(xml).find("item:eq("+i+") > text").each(function() {
		      text+=$(this).text()+'<br />';
		    });
        $('#modal-container-665355 .modal-body').html(text); 
        $('#modal-container-665355 .modal-title').html(name); 
      
	  }	
    });
}; 

function addInfoToContainerFromGlobalString (i) {
    i--;
    var text="";
    var xml = $( window.datatablexml );
    var name=$(xml).find("item:eq("+i+") > name").text();
    var type=$(xml).find("item:eq("+i+") > type").text();
    var weight=$(xml).find("item:eq("+i+") > weight").text();
    var value=$(xml).find("item:eq("+i+") > value").text();
    //optional
    var ac=$(xml).find("item:eq("+i+") > ac").text();
    var strength=$(xml).find("item:eq("+i+") > strength").text();
    var stealth=$(xml).find("item:eq("+i+") > stealth").text();
    var dmg1=$(xml).find("item:eq("+i+") > dmg1").text();
    var dmg2=$(xml).find("item:eq("+i+") > dmg2").text();
    var dmgType=$(xml).find("item:eq("+i+") > dmgType").text();
    var property=$(xml).find("item:eq("+i+") > property").text();
    var range=$(xml).find("item:eq("+i+") > range").text();

    if (type) { text+="<strong>Тип: </strong>"+type+"<br />"; };
    if (weight) { text+="<strong>Вес: </strong>"+weight+"<br />"; };
    if (value) { text+="<strong>Стоимость: </strong>"+value+"<br />"; };
    if (strength) { text+="<strong>Требуется СИЛ: </strong>"+strength+"<br />" };
    if (ac) { text+="<strong>Класс Доспех: </strong>"+ac+"<br />" };
    if (dmg1) { text+="<strong>Урон: </strong>"+dmg1+"<br />" };
    if (dmg2) { text+="<strong>Урон: </strong>"+dmg2+"<br />" };
    if (dmgType) { text+="<strong>Тип урона: </strong>"+dmgType+"<br />" };
    if (property) { text+="<strong>Свойства: </strong>"+property+"<br />" };
    if (range) { text+="<strong>Дистанция: </strong>"+range+"<br />" };
    if (stealth) { text+="<strong>Помеха на проверки Скрытности: </strong>Да<br />" };

    text+="<br />";
    $(xml).find("item:eq("+i+") > text").each(function() {
      text+=$(this).text()+'<br />';
    });
    $('#modal-container-665355 .modal-body').html(text); 
    $('#modal-container-665355 .modal-title').html(name); 

};

function showInfo(i) {
   $('#modal-container-665355 .modal-body').html('Загрузка...'); 
   $('#modal-container-665355 .modal-title').html(''); 
   //addInfoToContainerFromXML(i);
   addInfoToContainerFromGlobalString(i);
   $("#DataTable").trigger("update");
   $('#modal-container-665355').modal('show');
 };