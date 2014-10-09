function addElement(e){
	$('#form-container #todo').append('<label class="pure-checkbox ui-state-default">'+
		'<input type="checkbox"' + 'id="change" value="'+ e.id +'"' + setCheckedStatus(e.is_complete) + '>'+
		e.description +
	'</label>'
	);
}

function setCheckedStatus(is_complete){
	if(is_complete)
		return 'checked';
	else
		return '';
}

function resetDisplay(){
	location.reload();
}

function displayProfile(user){
	$("#title").text(user.email);
	var desc = user.email + "\'s todo list";
	$('#desc').text(desc);

	$("#login-form").remove();

	$("#form-container").append('<form id="todo" class="pure-form">'+
		'</form>'
		);

	$(".center-buttons").append('<form class="pure-form">'+
			'<fieldset>'+
				'<input id="description">'+		
				'<button type="button" id="add" class="pure-button pure-button-primary">Add Todo</button>'+
			'</fieldset>'+
		'</form>');

	$("#test").append('<ul id="logout-container">' +
			'<li><a id="log-out">Log out</a></li>'+
		'</ul>');
	
	Todo.loadTodos({
		success: function(todos){ 
			for(i = 0; i < todos.length; i++){
				addElement(todos[i]);
			} },
		error: function(xhr) { alert('Error Load'); }
	});
	
	$('#todo').sortable({
		placeholder: "ui-sortable-placeholder"
	});
}

//Completed sign up in conjunction with the API 
$(document).ready(function(){
	$("#signup").click(function(){
		Todo.createUser({
			email: $("#email").val(),
			password: $('#password').val(),
			success: function(user) { alert('Success'); },
			error: function(xhr) { alert('Error'); }
		});	
	});
});


$(document).ready(function(){
	$('#login').click(function(){
		Todo.startSession({
			email: $('#email').val(),
			password: $('#password').val(),
			success: function(user) { displayProfile(user); },
			error: function(xhr) { 
				alert('Error logging in');
			}
		});
	});
});

$(document).ready(function(){
	$('#main').on('click', '#add', function(){
		Todo.createTodo({
			todo: $('#description').val(),
			success: function(todo){ addElement(todo); },
			error: function(xhr){ alert('Error adding todo'); }
		});
	
		$('#todo').sortable("refresh");
	});
});

$(document).ready(function(){
	$('#main').on('click', '#change', function(){
			var isComplete =  $(this).is(':checked');
			Todo.updateTodo({
				todoId: $(this).attr('value'),
				data: {is_complete: isComplete},
				success: function(todo){ alert(todo.is_complete)},
				error: function(xhr){ alert('todo update error!')}
		});
	});
});

$(document).ready(function(){
	$('#test').on('click', '#log-out', function(){
			Todo.endSession({
				success: function(session){ resetDisplay();},
				error: function(xhr){alert('logout error')}
		});
	});
});