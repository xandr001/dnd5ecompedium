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
    
    var multiplierStr=s.toLowerCase()
      .replace(/[0-9]*\.?[0-9]+/,"")
      .replace("pp","1000")
      .replace("gp","100")
      .replace("sp","10")
      .replace("cp","1")
      .replace("ep","50")
      ;
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


$(document).ready(function() {
      initDataTable() ;
      $.ajax({
      type: "GET",
	    url: 'https://raw.githubusercontent.com/ceryliae/DnDAppFiles/master/Items/Mundane%20Items.xml',
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
      //$("table").trigger("update");
		  i++;
        })
        $("table").trigger("update");
       }
    });
    
     
 });
 
 function showInfo(i) {
   $('#modal-container-665355 .modal-body').html('Загрузка...'); 
   $('#modal-container-665355 .modal-title').html(''); 
   $.ajax({
      type: "GET",
	    url: 'https://raw.githubusercontent.com/ceryliae/DnDAppFiles/master/Items/Mundane%20Items.xml',
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
   $("table").trigger("update");
   $('#modal-container-665355').modal('show');
 };