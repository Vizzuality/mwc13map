

var categories = [{label:"All",value:0,num:1736}];
var layer;
var query;

init();
getSectors();

function init(){
  cartodb.createVis('map', 
  
  {
    "version": "0.1.0",
    "updated_at": "2013-02-07T14:12:10+01:00",
    "layers": [{
      "options": {
        "visible": true,
        "type": "Tiled",
        "name": "Nokia Day",
        "className": "httpsmapsnlpnokiacommaptilervmaptilenewestnormaldayzxypnglgengtokenYWYROufLufylEvnQappidqIWDkliFCtLntLmaeO",
        "base_type": "nokia_day",
        "urlTemplate": "https://maps.nlp.nokia.com/maptiler/v2/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?lg=eng&token=61YWYROufLu_f8ylE0vn0Q&app_id=qIWDkliFCtLntLma2e6O",
        "read_only": true,
        "maxZoom": 21,
        "attribution": "\u00a92012 Nokia <a href='http://here.net/services/terms' target='_blank'>Terms of use</a>",
        "order": 0,
        "id": 21672
      },
      "kind": "tiled",
      "infowindow": null,
      "id": 21672,
      "order": 0
    }, {
      "options": {
        "type": "CartoDB",
        "active": true,
        "opacity": 0.99,
        "auto_bound": false,
        "interactivity": "cartodb_id",
        "debug": false,
        "tiler_domain": "cartodb.com",
        "tiler_port": "443",
        "tiler_protocol": "https",
        "sql_domain": "cartodb.com",
        "sql_port": "443",
        "sql_protocol": "https",
        "extra_params": {
          "cache_policy": "persist",
          "cache_buster": 1360236531041
        },
        "cdn_url": "",
        "visible": true,
        "style_version": "2.1.1",
        "table_name": "mwc_companies",
        "user_name": "saleiva",
        "query_wrapper": null
      },
      "kind": "carto",
      "infowindow": {
        "fields": [{
          "name": "name",
          "title": true,
          "position": 0
        }, {
          "name": "contact_www",
          "title": false,
          "position": 1
        }, {
          "name": "contact_email",
          "title": true,
          "position": 2
        }],
        "template_name": "table/views/infowindow_light_header_orange",
        "template": "<div class=\"cartodb-popup header orange\">\n  <a href=\"#close\" class=\"cartodb-popup-close-button close\">x</a>\n  <div class=\"cartodb-popup-header\">\n    {{#content.fields}}\n      {{^index}}\n        {{#title}}<h4>{{title}}</h4>{{/title}}\n        {{#value}}\n          <h1>{{ value }}</h1>\n        {{/value}}\n        {{^value}}\n          <h1 class=\"empty\">null</h1>\n        {{/value}}\n        <span class=\"separator\"></span>      \n      {{/index}}\n    {{/content.fields}}\n  </div>\n  <div class=\"cartodb-popup-content-wrapper\">\n    <div class=\"cartodb-popup-content\">\n      {{#content.fields}}\n        {{#index}}\n          {{#title}}<h4>{{title}}</h4>{{/title}}\n          {{#value}}\n            <p>{{ value }}</p>\n          {{/value}}\n          {{^value}}\n            <p class=\"empty\">null</p>\n          {{/value}}\n        {{/index}}\n      {{/content.fields}}\n    </div>\n  </div>\n  <div class=\"cartodb-popup-tip-container\">\n  </div>\n</div>"
      },
      "id": 21673,
      "order": 1
    }],
    "overlays": [{
      "type": "zoom",
      "template": "<a class=\"zoom_in\">+</a><a class=\"zoom_out\">-</a>"
    }, {
      "type": "loader",
      "template": "<div class=\"loader\"></div>"
    }],
    "description": null,
    "title": "mwc_companies",
    "url": "http://saleiva.cartodb.com/tables/19287",
    "map_provider": "leaflet",
    "center": "[41.89019212449888, -8.26171875]",
    "zoom": 2
  }
  
  
  
  )
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
      filterMap(ui.item.value);
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
    url: "http://saleiva.cartodb.com/api/v2/sql?q="+escape("SELECT * FROM sectors ORDER BY num_companies DESC")
  }).done(function(data) {
    data = data.rows;
    $.each(data, function(index,value){
      categories.push({label:value.sector,value:value.cartodb_id,num:value.num_companies})
    })
    //console.log(categories);
  });
}

function filterMap(s){
  if(s==0){
    q = "SELECT * FROM mwc_companies";  
  }else{
    q = "SELECT c.* FROM mwc_companies as c INNER JOIN mwc_companies_sectors as cs ON c.cartodb_id=cs.company_id WHERE cs.sector_id = "+s;
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