
init();

function init(){
  cartodb.createVis('map', 'http://saleiva.cartodb.com/api/v1/viz/19287/viz.json')
  .done(function(){
    $('#zoom').fadeOut();
  })
  $('#initialCover').bind('click',function(){
    hide(this)
  })
  $('#filterCover').bind('click',function(){
    hide(this);
  })
  $('#filterBtn a').bind('click',function(){
    show("#filterCover");
  })
}

function openFiltersCover(){
  $("#filterCover").fadeIn();
}

function hide(o){
  $(o).fadeOut();
  $('#filterBtn').fadeIn();
  $('#bottomBtns').fadeIn();
}

function show(o){
  $(o).fadeIn();
  $('#filterBtn').fadeOut();
  $('#bottomBtns').fadeOut();
}