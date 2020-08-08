
function formatTime(date) {
  var json_date = new Date(date).toJSON();
  return new Date(new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') 
}
// 解决两个数相乘精度丢失问题
function floatMul(a, b) {
  var c = 0,
      d = a.toString(),
      e = b.toString();
  try {
      c += d.split(".")[1].length;
  } catch (f) {}
  try {
      c += e.split(".")[1].length;
  } catch (f) {}
  return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}
// 解决两个数相除精度丢失问题
function floatDiv(a, b) {
  var c, d, e = 0,
      f = 0;
  try {
      e = a.toString().split(".")[1].length;
  } catch (g) {}
  try {
      f = b.toString().split(".")[1].length;
  } catch (g) {}
  return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), floatMul(c / d, Math.pow(10, f - e));
}

/*函数防抖*/
function debounce(fn, gapTime) {
 if(gapTime == null || gapTime == undefined){
   gapTime = 500
 }

 let _lastTime = null;
 return function(){
   let _nowTime = +new Date();
   if(_nowTime-_lastTime>gapTime || !_lastTime){
     fn.apply(this,arguments);
     _lastTime = _nowTime;
   }
 }
}

module.exports = {
  formatTime: formatTime,
  floatMul:floatMul,
  floatDiv:floatDiv,
  debounce:debounce
}