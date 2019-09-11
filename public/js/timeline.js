$(function() {
  fetch('/search')
    .then(function(res) {
      return res.json();
    })
    .then(function(myJson) {
      console.log(myJson);
      insertItems(myJson);
    })
    .catch(err => console.error(err));
});

function insertItems(rows) {
  for(let i = 0; i < rows.length; i++) {
    var time = (rows[i].time + (rows[i].isera ? 's' : ''));
    if($('#' + time).length == 0) {
      $('.timeline-container').append(`
        <div id="` + time + `" class="time-period">
          <div class="time-period-heading">` + time + `</div>
        </div>
      `);
    }

    $('#' + time).append('<div class="db-item" style="background-image: url(\'' + rows[i].image + '\')"></div>');
  }
}
