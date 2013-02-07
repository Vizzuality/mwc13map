

var categories = ["All"];
var layer;
var query;

init();
getSectors();

function init(){
  cartodb.createVis('map', 'http://saleiva.cartodb.com/api/v1/viz/19287/viz.json')
  .done(function(vis, layers){
    layer = layers[1];
    $('#zoom').fadeOut();
  })
  $('#initialCover').bind('click',function(){
    hide(this)
  })
  $('#filterCover').bind('click',function(e){
    if (!$(e.target).is("a,input"))
      hide(this)
  })
  $('#filterBtn a').bind('click',function(){
    show("#filterCover");
    $("#filterCover input")
      .focus()
      .autocomplete("search","")
  })
  $('.defaultLogo').bind('click',function(){
    show("#initialCover");
  })
  $('#bottomBtns .downloadBtn').bind('click',function(){
    getDownload();
  })


  initAutocomplete(); 

  $(window).resize(function(){
    var pre;
    if($("#filterCover").is(":visible")){
      pre = "#filterCover";
    }else if($("#initialCover").is(":visible")){
      pre = "#initialCover";
    }else{
      return;
    }
    var calc = (($(this).height() - $(pre+" .wrapper").height())/2)-30;
    $(pre+" .wrapper").css('margin-top',calc)
  });
}

function initAutocomplete() {
  var $input = $("#filterCover").find('input[type="text"]');
  $input.autocomplete({
    source: categories,
    minLength: 0,
    select: function( event, ui ) {
      filterMap(ui.item.label);
      var self = this;
      setTimeout(function(){
        if (ui.item.label.length > 20) {
          $(self).val(ui.item.label.substr(0,19) + "...");
        }
      },0)
    }
  }); 
}

function getSectors(){
  $.ajax({
    url: "http://saleiva.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20sectors_mwc%20ORDER%20BY%20numof"
  }).done(function(data) {
    data = data.rows;
    $.each(data, function(index,value){
      categories.push(value.name)
    })
    console.log(categories);
  });
}

function filterMap(s){
  if(s=="All"){
    q = "SELECT * FROM mwc_companies";  
  }else{
    q = "SELECT * FROM mwc_companies WHERE subcategories_array ilike '%"+s+"%'";
  }
  layer.setQuery(q);
}

function getDownload(){
  window.location.href = encodeURI("http://saleiva.cartodb.com/api/v2/sql?q="+q+"&format=csv");
}

function hide(o){
  $(o).fadeOut();
  $('#filterBtn').fadeIn();
  $('#bottomBtns').fadeIn();
  $('.defaultLogo').fadeIn();
}

function show(o){
  $(o).fadeIn();
  var calc = (($(window).height() - $(o+" .wrapper").height())/2)-30;
  $(o+" .wrapper").css('margin-top',calc)
  $('#filterBtn').fadeOut();
  $('#bottomBtns').fadeOut();
  $('.defaultLogo').fadeOut();
}