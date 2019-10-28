
function generateChatDiv(chat){

  let div = document.createElement('div');
  div.className = "container-chat darker";

  let imageContainer = document.createElement('div');

  let img = document.createElement('img');

  let p_content = document.createElement('p');
  p_content.innerText = chat.content;

  let p_USER = document.createElement('p')
  p_USER.innerHTML = `<i><b>User: </b> ${chat.username}</i>`;

  let now = new Date();
  let h = now.getHours();
  let m = now.getMinutes();
  h = h < 10 ? "0" + h : h;
  m = m < 10 ? "0" + m : m;
  let span_time = document.createElement('span');
  span_time.innerText = `${h}:${m}`;

  if (sessionStorage.chosenName.toLowerCase() === chat.username.toLowerCase()) {
    span_time.className = 'time-left';
    p_content.innerText.className = 'text-left';
    imageContainer.className = "image-container-right";
    img.src =  "https://i.pinimg.com/474x/18/92/16/189216c6bd7ff34f4fda2032b6d18a78--fb-profile-facebook-profile.jpg";
  }
  else {
    span_time.className = 'time-right';
    p_content.className = 'text-right';
    imageContainer.className = "image-container-left";
    img.src =  "http://2.bp.blogspot.com/-HzFJhEY3KtU/Tea7Ku92cpI/AAAAAAAAALw/uBMzwdFi_kA/s1600/1.jpg";
  }

  imageContainer.appendChild(img);
  imageContainer.appendChild(p_USER);
  div.appendChild(imageContainer);
  div.appendChild(p_content);
  div.appendChild(span_time);


  return div;


}


$(document).ready(function(){


  $('#namePick').on('keypress', (e)=> {
    if (e.which == 13) { //enter
      let chosenName = $("#namePick").val();
      let socket = new WebSocket(`wss://global-history.herokuapp.com/?name=${chosenName}`);

      // message received - show the message in div#messages
      socket.onmessage = function(event) {
        let message = JSON.parse(event.data);
        console.log(message);
        if (message.content) { console.log('update');
          let newChat = generateChatDiv(message);
          $("#chatlog").append(newChat);
          var chatlog = document.getElementById("chatlog");
          chatlog.scrollTop = chatlog.scrollHeight ;
        }
        else if(message.terminated) {
          alert(message.mess);
          socket.close();
          return;
        }
        else if (!message.terminated) {
          console.log('pass');


          window.sessionStorage.chosenName = chosenName;
          document.getElementById("chatInput").disabled = false;
          $("#namePick").remove();
          $('#chatInput').on('keypress', (e)=> {
            if (e.which == 13) { //enter
              e.preventDefault();
              let outgoingMessage = $("#chatInput").val();
              let outgoingData = {
                username: sessionStorage.chosenName,
                content: outgoingMessage
              };
              socket.send(JSON.stringify(outgoingData));
              $("#chatInput").val("");
            }
          });
        }

        //if (message)
      }
    }
  });




});
