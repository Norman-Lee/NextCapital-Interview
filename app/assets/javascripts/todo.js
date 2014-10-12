/*
 * addElement
 * DESCRIPTION: Adds a checkbox form element with the checkbox either checked or unchecked
 * depending on completion status of the task
 *
 * INPUT: e - shorthand for the todo to be transformed into a form element
 *
 * OUTPUT: None
 *
 * SIDE EFFECTS: Appends html markup to display the todo.
*/
function addElement(e){
	$('#form-container #todo').append('<label class="pure-checkbox ui-state-default">'+
		'<input type="checkbox"' + 'id="change" value="'+ e.id +'"' + setCheckedStatus(e.is_complete) + '>'+
		e.description +
	'</label>'
	);
}

/*
 * setCheckedStatus
 * DESCRIPTION: Checks the status of a todo element, if completed adds the checked attribute
 * to the checkbox form
 *
 * INPUT: is_complete - completion status for the todo
 *
 * OUTPUT: An empty string or the checked attribute
 */
function setCheckedStatus(is_complete){
	if(is_complete)
		return 'checked';
	else
		return '';
}

/*
 * resetDisplay
 * DESCRIPTION: Reloads the page
 *
 * INPUT: None
 * OUTPUT: None
 *
 * SIDE EFFECTS: Reloads the page
 */

function resetDisplay(){
	location.reload();
}

/*
 * displayProfile
 *
 * DESCRIPTION: Dynamically changes the main page to display the relevant todos based on user log in
 * INPUT: user - object with all the user related info
 * OUTPUT: None
 * SIDE EFFECTS: Changes the main page to display todos
 *
 */

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


//Functionality for buttons that interface with the API to sign in, log in, add todo, logout, and finish todos


//SIGN UP
$(document).ready(function(){
	$("#signup").click(function(){
		Todo.createUser({
			email: $("#email").val(),
			password: $('#password').val(),
			success: function(user) { alert('You signed up successfully'); },
			error: function(xhr) { alert('Error'); }
		});	
	});
});

//LOG IN
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

//ADD TODO
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

//LOGOUT
$(document).ready(function(){
	$('#main').on('click', '#change', function(){
			var isComplete =  $(this).is(':checked');
			Todo.updateTodo({
				todoId: $(this).attr('value'),
				data: {is_complete: isComplete},
				success: function(todo){},
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