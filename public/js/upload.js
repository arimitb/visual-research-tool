$('form').submit(function(e) {
  e.preventDefault();
  var data = {
    image: $("input[name='image']").val(),
    contributor: $("input[name='contributor']").val(),
    time: $("input[name='time']").val(),
    keywords: $("input[name='keywords']").val(),
    description: $("textarea[name='description']").val()
  };

  $.post('/upload', data, function(err) {
    if(err.length > 0) {
      var alertMsg = '';
      for(let i = 0; i < err.length; i++) {
        alertMsg += err[i] + '\r\n';
      }
      alert(alertMsg);
    } else {
      alert('Uploaded!');
    }
  });
});
