// 全局变量
var markers = [];
var map, largeInfowindow, bounds, content;

// 包含地址名称和坐标的对象数组
var locations = [
  {name: "清华大学", location: {lat: 39.999667, lng: 116.326444}},
  {name: "北京大学", location: {lat: 39.986913, lng: 116.305874}},
  {name: "中国人民大学", location: {lat: 39.9704632, lng: 116.3093536}},
  {name: "北京师范大学", location: {lat: 39.9619537, lng: 116.3640728}},
  {name: "北京航空航天大学", location: {lat: 39.9619893, lng: 116.3487519}}
];

// 初始化地图
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 39.9042, lng: 116.407396},
      zoom: 6,
  });

  largeInfowindow = new google.maps.InfoWindow();
  bounds = new google.maps.LatLngBounds();

  setMarkers(locations);
  map.fitBounds(bounds); 
}

// 生产标记
function setMarkers(filterMarkers) {
  clearMarker();
  for (var i = 0; i < filterMarkers.length; i++) {   
    var position = filterMarkers[i].location;
    var name = filterMarkers[i].name;
    var defaultIcon = makeMarkerIcon('0091ff');
    var highlightedIcon = makeMarkerIcon('FFFF24');
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      name: name,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: i
    });
    
    markers.push(marker);

// 给标记添加事件
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
    bounds.extend(markers[i].position);
  }
}

// 将标记从地图上移除
function clearMarker(){
  for(let i = 0; i < markers.length; i++){
    markers[i].setMap(null);
  }
}

// 设置信息窗口，调用维基百科API
function populateInfoWindow(marker, infowindow) {
  if (!marker.map) {
    marker.setMap(map);
  }
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    requestApi(marker.name);
    infowindow.setContent('<div id="content">' + marker.name + '</div>');
    
    infowindow.open(map, marker);
    infowindow.addListener('closeclick',function(){
      infowindow.marker = null;
    });
  }
}

// 设置标记样式
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
}

// 请求维基百科中文API
function requestApi(position) {
  var wikiUrl = 'http://zh.wikipedia.org/w/api.php?action=opensearch&search=' + position + '&format=json&callback=wikiCallback';
  var wikiRequestTimeout = setTimeout(function(){
    $("#content").text("请求失败");
  }, 8000);

  $.ajax({
      url: wikiUrl,
      dataType: "jsonp",
      jsonp: "callback",
      success: function( response ) {
          console.log(response[1]);
          var articleList = response[1];

          for (var i = 0; i < articleList.length; i++) {
              articleStr = articleList[i];
              var url = 'http://zh.wikipedia.org/wiki/' + articleStr;
              $("#content").append('<li><a href="' + url + '">' + articleStr + '</a></li>');
          };
          console.log(response);
          clearTimeout(wikiRequestTimeout);
      }
  });
}

// 地图加载错误处理
function mapError(){
  alert('Google Map initialized Error');
}
