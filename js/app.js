

var companies = ["all", "data analysis", "data visualization", "voIP", "hardware", "network", "consultancy"];

init();

function init(){
  cartodb.createVis('map', 'http://saleiva.cartodb.com/api/v1/viz/19287/viz.json')
  .done(function(){
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
  $('#bottomBtns .about').bind('click',function(){
    show("#initialCover");
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
    source: companies,
    minLength: 0,
    select: function( event, ui ) {
      alert(ui.item.label);
    }
  });
  
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