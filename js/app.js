
// 创建knockout视图对象
var ViewModel = function() {
    var self = this;
  
    this.inputValue = ko.observable("");
  
    this.filterList = ko.computed(function() {
      res = locations.filter(function (loction) {
        return loction.name.indexOf(self.inputValue()) !== -1;
      });
      setMarkers(res);
      return res;
    });
  
    this.hideOrShow = function() {
        $("nav").toggleClass("hide");
        $("main").toggleClass("full");
    };  
  
    this.openWindow = function(e) {
        google.maps.event.trigger(markers[locations.indexOf(e)], 'click');
    }
  
  };
  
// 初始化应用
function initApp(){
    initMap();
    ko.applyBindings(new ViewModel());
}