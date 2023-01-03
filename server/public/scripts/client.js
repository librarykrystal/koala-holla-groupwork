console.log( 'js' );



$( document ).ready( function(){
  console.log( 'JQ' );
  // Establish Click Listeners
  setupClickListeners()
  // load existing koalas on page load
  getKoalas();

}); // end doc ready

function setupClickListeners() {
  $( '#viewKoalas' ).on( 'click', '.transferBtn', transferUpdate);
  $( '#viewKoalas' ).on( 'click', '.deleteBtn', deleteKoala);
  $( '#addButton' ).on( 'click', function(){
    console.log( 'in addButton on click' );
    // get user input and put in an object
    // NOT WORKING YET :(
    // using a test object
    if ($("#nameIn").val() == "" || $("#readyForTransferIn").val() == "") {
      alert("Please fill in Name and Transfer Status");
    } else {
    let koalaToSend = {
      name: $("#nameIn").val(),
      age: $("#ageIn").val(),
      gender: $("#genderIn").val(),
      ready_to_transfer: $("#readyForTransferIn").val(),
      notes: $("#notesIn").val(),
    };
    // call saveKoala with the new obejct
  saveKoala( koalaToSend );
  }
}); 
  $('#nameIn').val('');
}

function transferUpdate(){
      // console.log('f completeIt TEST');
      const id = $(this).parent().parent().data('id');
      console.log('transferUpdate THIS ID:', id);
      $.ajax({
          type: 'PUT',
          url: `/koala.router/ready_to_transfer/${id}`,
          data: {ready_to_transfer: 'true'}
      }).then(function() {
          getKoalas();
      }).catch(function(error) {
          console.log('transferUpdate ajax PUT ERROR:', error);
      })
}

function getKoalas(){
  console.log( 'in getKoalas' );
  // ajax call to server to get koalas
  $.ajax({
    method: "GET",
    url: "/koala.router",
  })
  .then(function (response){
    console.log("in getKoalas", response);
    appendKoalas(response);
  })
.catch(function(error){
    alert(error);
  });
} // end getKoalas

function saveKoala( newKoala ){
  console.log( 'in saveKoala', newKoala );
  // ajax call to server to post koalas
 $.ajax({
  method: "POST",
  url: "/koala.router",
  data: newKoala
 })
 .then (function(response){
  console.log("in saveKoala", response);
  getKoalas();
 })
 .catch (function(error){
  console.log(error);
  alert("data not sent");
 });
};

function appendKoalas(array){
    $('#viewKoalas').empty()
    for (let i = 0; i < array.length; i++) {
      if(array[i].ready_to_transfer == false){
          $('#viewKoalas').append(`
          <tr data-id=${array[i].id}>
          <td>${array[i].name}</td>
          <td>${array[i].age}</td>
          <td>${array[i].gender}</td>
          <td>${array[i].ready_to_transfer}
            <button class="transferBtn">Mark Ready for Transfer</button>
          </td>
          <td>${array[i].notes}</td>
          <td><button class="deleteBtn">Delete</button></td>
          </tr>
      `)
      } else {
      $('#viewKoalas').append(`
      <tr data-id=${array[i].id}>
      <td>${array[i].name}</td>
      <td>${array[i].age}</td>
      <td>${array[i].gender}</td>
      <td>${array[i].ready_to_transfer}</td>
      <td>${array[i].notes}</td>
      <td><button class="deleteBtn">Delete</button></td>
      </tr>
      `)}
  }
}

function deleteKoala(){
  console.log("deleteKoala firing off");
  const id = $(this).parent().parent().data('id');
console.log(id);
  $.ajax({
    type: "DELETE",
    url: `/koala.router/${id}`,
  })
    .then(function () {
      getKoalas();
    })
    .catch(function (error) {
      console.log("error with deleting,", error);
    });
}