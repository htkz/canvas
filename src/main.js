setMouseCoordinate = function (target, source) {
  target.x = source.clientX;
  target.y = source.clientY - 40;
};

setTouchCoordinate = function (target, source) {
  target.x = source.touches[0].clientX;
  target.y = source.touches[0].clientY - 40;
};

initCanvas = function () {
  $canvas = $('#canvas');
  canvas = $canvas[0];

  ctx = canvas.getContext('2d');
  mouseDown = false;
  curPos = {x: undefined, y: undefined};
  lastPos = {x: undefined, y: undefined};
  $(canvas).attr({'height': '600', 'width': '800'});
  curMaterial = 'pen';
  curColor = '000000';
  eraserSizeTrans = {
    'small': 5,
    'media': 15,
    'large': 30
  };
  curEraserSize = 15;
};

resize = function () {
  window.addEventListener('resize', resizeCanvas, false);

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 40;
  }

  resizeCanvas();
};

bindMouseEvent = function () {
  $canvas.on('mousedown', function (event) {
    event.preventDefault();
    mouseDown = true;
    setMouseCoordinate(curPos, event);
  });

  $canvas.on('mousemove', function (event) {
    event.preventDefault();
    if (!mouseDown) return;
    lastPos = Object.assign({}, curPos);
    setMouseCoordinate(curPos, event);
    //draw line
    switch (curMaterial) {
      case 'pen':
        ctx.strokeStyle = curColor;
        ctx.beginPath();
        ctx.moveTo(lastPos.x, lastPos.y);
        ctx.lineTo(curPos.x, curPos.y);
        ctx.stroke();
        break;
      case 'eraser':
        ctx.clearRect(lastPos.x, lastPos.y, curEraserSize, curEraserSize);
        break;
      default:
        return false;
    }
  });

  $canvas.on('mouseup', function (event) {
    event.preventDefault();
    mouseDown = false;
  });
};

bindTouchEvent = function () {
  $canvas.on('touchstart', function (event) {
    event.preventDefault();
    mouseDown = true;
    setTouchCoordinate(curPos, event);
  });

  $canvas.on('touchmove', function (event) {
    event.preventDefault();
    if (!mouseDown) return;
    lastPos = Object.assign({}, curPos);
    setTouchCoordinate(curPos, event);
    //draw line
    switch (curMaterial) {
      case 'pen':
        ctx.strokeStyle = curColor;
        ctx.beginPath();
        ctx.moveTo(lastPos.x, lastPos.y);
        ctx.lineTo(curPos.x, curPos.y);
        ctx.stroke();
        break;
      case 'eraser':
        ctx.clearRect(lastPos.x, lastPos.y, curEraserSize, curEraserSize);
        break;
      default:
        return false;
    }
  });

  $canvas.on('touchend', function (event) {
    event.preventDefault();
    mouseDown = false;
  });
};

bindEvent = function () {
  var isTouchDevice = 'ontouchstart' in document.documentElement;
  (isTouchDevice) ? bindTouchEvent() : bindMouseEvent();

  $('.options').on('click', '.option', function (event) {
    event.preventDefault();
    if($(this).attr('class').indexOf('action') !== -1) {
        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');
    }
    var oldMaterial = curMaterial;
    curMaterial = $(this).attr('id');
    var $html = $('html');
    switch (curMaterial) {
      case 'pen':
        $html.removeClass('eraser');
        break;
      case  'eraser':
        $html.addClass('eraser');
        break;
      case 'clear':
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        curMaterial = oldMaterial;
        break;
      case 'download':
        var url = canvas.toDataURL("image/png");
        var $a = $("<a href=" + url + " download=" + "image" + "></a>");
        $a[0].click();
        curMaterial = oldMaterial;
        break;
      default:
        return false;
    }
  });

  $('input[type=color]').change(function (event) {
    curColor = $(this).val();
  });

  $('select[name=size]').change(function (event) {
    curEraserSize = eraserSizeTrans[$(this).val()];
  });

  $('.color').click(function(event) {
      curColor = this.id;
  });
};

initCanvas();
bindEvent();
resize();
