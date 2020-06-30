var todoLists = [
    {
        id: 1,
        name: "To-Do Label 1",
        priority: 4
    },
    {
        id: 2,
        name: "To-Do Label 2",
        priority: 3
    },
    {
        id: 3,
        name: "To-Do Label 3",
        priority: 5
    },
    {
        id: 4,
        name: "To-Do Label 4",
        priority: 1
    },
    {
        id: 5,
        name: "To-Do Label 5",
        priority: 4
    },
    {
        id: 6,
        name: "To-Do Label 6",
        priority: 3
    },
    {
        id: 7,
        name: "To-Do Label 7",
        priority: 5
    },
    {
        id: 8,
        name: "To-Do Label 8",
        priority: 1
    },
    {
        id: 9,
        name: "To-Do Label 9",
        priority: 4
    },
    {
        id: 10,
        name: "To-Do Label 10",
        priority: 3
    }
];

$.each(todoLists, function (i, todoList) {
    appendToUsrTable(todoList);
});

$("form").submit(function (e) {
    e.preventDefault();
});

$("form#addTodoList").submit(function () {
    var todoList = {};
    var nameInput = $('input[name="name"]').val().trim();
    var priorityInput = $('input[name="priority"]').val().trim();
    if (nameInput && priorityInput) {
        $(this).serializeArray().map(function (data) {
            todoList[data.name] = data.value;
        });
        var lasttodoList = todoLists[Object.keys(todoLists).sort().pop()];
        todoList.id = lasttodoList.id + 1;

        addTodoList(todoList);
    } else {
        alert("All fields must have a valid value.");
    }
});

function addTodoList(todoList) {
    todoLists.push(todoList);
    appendToUsrTable(todoList);
}

function editTodoList(id) {
    todoLists.forEach(function (todoList, i) {
        if (todoList.id == id) {
            $(".modal-body").empty().append(`
        <form id="updateTodoList" action="">
            <label for="name">Name</label>
            <input class="form-control" type="text" name="name" value="${todoList.name}"/>
            
            <label for="priority">Priority</label>
            <input class="form-control" type="number" name="priority" value="${todoList.priority}" min=1 max=10/>`);
            $(".modal-footer").empty().append(`
            <button type="button" type="submit" class="btn btn-primary" onClick="updateTodoList(${id})">Save changes</button>
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        </form>
    `);
        }
    });
}

function deleteTodoList(id) {
    var action = confirm("Are you sure you want to delete this todoList?");
    var msg = "Todo List deleted successfully!";
    todoLists.forEach(function (todoList, i) {
        if (todoList.id == id && action != false) {
            todoLists.splice(i, 1);
            $("#todoListTable #todo-" + todoList.id).remove();
            flashMessage(msg);
        }
    });
}

function updateTodoList(id) {
    var msg = "Todo List updated successfully!";
    var todoList = {};
    todoList.id = id;
    todoLists.forEach(function (todoList, i) {
        if (todoList.id == id) {
            $("#updateTodoList").children("input").each(function () {
                var value = $(this).val();
                var attr = $(this).attr("name");
                if (attr == "name") {
                    todoList.name = value;
                } else if (attr == "priority") {
                    todoList.priority = value;
                }
            });
            todoLists.splice(i, 1);
            todoLists.splice(todoList.id - 1, 0, todoList);
            $("#todoListTable #todo-" + todoList.id).children(".todoListData").each(function () {
                var attr = $(this).attr("name");
                if (attr == "name") {
                    $(this).text(todoList.name);
                } else {
                    $(this).text(todoList.priority);
                }
            });
            $(".modal").modal("toggle");
            flashMessage(msg);
        }
    });
}

function flashMessage(msg) {
    $(".flashMsg").remove();
    $(".row").prepend(`
<div class="col-sm-12"><div class="flashMsg alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> <strong>${msg}</strong></div></div>
`);
}

function appendToUsrTable(todoList) {
    $("#todoListTable > tbody:last-child").append(`
<tr id="todo-${todoList.id}">
    <td class="todoListData" name="name">${todoList.name}</td>
    '<td id="tdpriority" class="todoListData" name="priority">${todoList.priority}</td>
    '<td align="center">
        <button class="btn btn-success form-control" onClick="editTodoList(${todoList.id})" data-toggle="modal" data-target="#myModal")">EDIT</button>
    </td>
    <td align="center">
        <button class="btn btn-danger form-control" onClick="deleteTodoList(${todoList.id})">DELETE</button>
    </td>
</tr>
`);
}

// Pagination Start
const rowsPerPage = 5;
const rows = $('#todoListTable tbody tr');
const rowsCount = rows.length;
const pageCount = Math.ceil(rowsCount / rowsPerPage); // to avoid decimals
const numbers = $('#numbers');

// Generate the pagination.
for (var i = 0; i < pageCount; i++) {
    numbers.append('<li><a href="#">' + (i + 1) + '</a></li>');
}

// Active link.
$('#numbers li:first-child a').addClass('active');

// Display the first set of rows.
displayRows(1);

// pagination on click.
$('#numbers li a').click(function (e) {
    var $this = $(this);

    e.preventDefault();

    // Remove the active class from the links.
    $('#numbers li a').removeClass('active');

    // Add the active class to the current link.
    $this.addClass('active');

    // Show the rows corresponding to the clicked page row.
    displayRows($this.text());
});

// Function that displays a specific page.
function displayRows(index) {
    var start = (index - 1) * rowsPerPage;
    var end = start + rowsPerPage;

    // Hide all rows.
    rows.hide();

    // Show the proper rows.
    rows.slice(start, end).show();
}
