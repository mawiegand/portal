// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file. 
//
//= require jquery
//= require jquery_ujs
//= require_tree .



$(document).ready(function() {
  
  var detailsVisible = false;
  var mainbarMinHeight = 0;
  var origMargin = 0;
  var origPadding = 0;
    
  $('#switchbar').click(function() {
    if (!detailsVisible) {
      mainbarMinHeight = $('#mainbar').css('min-height')
      origMargin = $('#loginbar').css('margin-bottom');
      origPadding = $('#loginbar').css('padding-top');
      
      $('#detailsbar').show();
      $('#switchbar-bottom').show();
      
      $('#mainbar')
      .css('min-height', '0')
      .slideUp(); 
      $('#signin').fadeOut();
      
      $('#menubar').slideUp();
      $('#loginbar').animate({'margin-bottom': '-80px', 'padding-top': '10px'});
      $('#logo-small').fadeOut();
      $('#switchbar-teaser').fadeOut();
      
      
      detailsVisible = true;
    }
    else {
      $('#menubar').slideDown();
      $('#mainbar').slideDown(function() {
        $('#detailsbar').hide(); 
        $('#switchbar-bottom').hide();
        $('#mainbar').css('min-height', mainbarMinHeight);
        $('#logo-small').fadeIn();
        $('#switchbar-teaser').fadeIn()
        $('#signin').fadeIn();
      });
      $('#loginbar').animate({'margin-bottom': origMargin, 'padding-top': origPadding});

      detailsVisible = false;
    }
  });
  
  
  
    
  
});