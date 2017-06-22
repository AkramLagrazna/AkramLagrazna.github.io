(function() {
  var currentLine, insertLineBreak, linkLeft, linkRight, showLinks, typeLine;

  insertLineBreak = function() {
    return $('.screen .content').append($('<br />'));
  };

  currentLine = 0;

  typeLine = function(string) {
    var $newLine, i, interval, len;
    $newLine = $('<span></span>');
    $('.screen .content').append($newLine);
    i = 0;
    len = string.length;
    return interval = setInterval(function() {
      if (i < len) {
        $newLine.append(string[i]);
        return i++;
      } else {
        currentLine++;
        if (currentLine < $('.screen-hidden span').length) {
          insertLineBreak();
        }
        clearInterval(interval);
        if ($('.screen-hidden span').eq(currentLine).hasClass('links','link')) {
          return showLinks();
        } else {
          return setTimeout(function() {
            if (currentLine < $('.screen-hidden span').length) {
              return typeLine($('.screen-hidden span').eq(currentLine).text());
            }
          }, 500);
        }
      }
    }, 100);
  };

  showLinks = function() {
    $('.cursor').hide();
    $('.screen .content').append($('.screen-hidden .links'));
    $('.screen .content a').mouseenter(function() {
      $('.active').removeClass('active');
      return $(this).addClass('active');
    });
    return $(document).keydown(function(e) {
      switch (e.which) {
        case 37:
          linkLeft();
          break;
        case 39:
          linkRight();
          break;
        default:
          return;
      }
      return e.preventDefault();
    });
  };


  linkLeft = function() {
    var $newActive;
    $newActive = $('.active').prev();
    if (!$newActive[0]) {
      $newActive = $('.links a:last');
    }
    $('.active').removeClass('active');
    return $newActive.addClass('active');
  };

  linkRight = function() {
    var $newActive;
    $newActive = $('.active').next();
    if (!$newActive[0]) {
      $newActive = $('.links a:first');
    }
    $('.active').removeClass('active');
    return $newActive.addClass('active');
  };

  typeLine($('.screen-hidden span').eq(0).text());

}).call(this);
