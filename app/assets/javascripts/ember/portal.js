#= require_self
#= require_tree ./models
#= require_tree ./controllers
#= require_tree ./views
#= require_tree ./helpers
#= require_tree ./templates


Portal = Ember.Application.create({
  ready: function() {
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
  },
});
