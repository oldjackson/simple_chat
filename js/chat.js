$(document).ready(function() {

    var aphorisms;
    // Will work only if the page is on a LOCAL SERVER    
    $.get('assets/aphorisms.txt', function(data){
        aphorisms = data.split('%%');
    });
    
    var do_speak=true;

    function newMessage(who,text)
    {
        if(who==='bot')
        {
            $('#wb').remove();
        }
        $('#placeholder').remove();

        var who_bubble = $("<div></div>");
        who_bubble.addClass("bubble "+ who);        
        who_bubble.text(text);
        if($("#chat div").length===0){            
            var contactDivHeight = $('#contact').height() +20;
            who_bubble.css('margin-top', contactDivHeight + 'px');
        }
        $('#chat').append(who_bubble);
             
        var os = $("#chat div:last-child").offset().top;
        $('html, body').animate({scrollTop: os}, 500);    

        var placeholder = $("<div></div>");
        placeholder.addClass(who).attr('id', 'placeholder');
        $('#chat').append(placeholder);   
        
        if($("#chat div[id!='placeholder']").length===1 || text==="So?\n"){
            do_speak=true;
            $("#chat").trigger("chat_started");
        }
        else if(text==="Shut up!\n"){
            do_speak=false;        
        }
    }

    function newWritingBotBubble()
    {
        $('#placeholder').remove(); 

        var presentBubbleNum = $("#chat div").length;
        var write_bubble = $("<div></div>").addClass("bubble bot").attr('id', 'wb'); 
        var ellipsis=$('<img></img>');
        ellipsis.attr('src', 'assets/ellipsis.gif');
        ellipsis.css('height', '20px');

        if($("#chat div").length===0){                       
            var contactDivHeight = $('#contact').height() +20;
            write_bubble.css('margin-top', contactDivHeight + 'px');            
        }
        $('#chat').append(write_bubble.append(ellipsis));
        
        var os = $("#chat div:last-child").offset().top;
        $('html, body').animate({scrollTop: os}, 500);       

        var placeholder = $("<div></div>");
        placeholder.addClass('bot').attr('id', 'placeholder');
        $('#chat').append(placeholder);        
    }


    function getRandomTime(text){
        if(text===""){
            // Generate a random interval between 0.5s and 4s
            return 500+3500*Math.random();
        }
        else{
            // Generate a random interval proportional to the length of the text to write
            return text.length*50*(0.75+0.5*Math.random());   
        }
    }

    $( "#input_form" ).keyup(function(key) {
        var code = key.keyCode || key.which;
         if(code == 13) {
            var text=$(this).val()        
            $(this).val("");    // clears the input_form
            newMessage("user",text);
         }  
    });

    $("#input_btn").click(function(event) {
        var text=$("#input_form").val(); 
        if(text!==""){  
            $("#input_form").val(""); // clears the input_form
            newMessage("user",text);
        }
    });
  

    $("#chat").on("chat_started",function loop(){
      // To obtain sequential tiems to wait, the setTimeOuts have to be innested 
      // and the innermost must call the outermost function to close the loop            
      var thinkTime=getRandomTime("");      
      setTimeout(function(){
        
        var ans = aphorisms[Math.floor(Math.random()*aphorisms.length)];        
        var writeTime=getRandomTime(ans);        
        newWritingBotBubble();
        setTimeout(function(){
          
          newMessage("bot",ans);
          
          if(do_speak){
            loop(); // loops to the main 
          }

        },writeTime); 

      },thinkTime);
    }); 
    
});