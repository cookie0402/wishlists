function getCurrentDate() {
    var today = new Date();
    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2); // Months are zero-based
    var day = ('0' + today.getDate()).slice(-2);
    return year + '-' + month + '-' + day;
}

$(function () {
    // ****************************************
    //  U T I L I T Y   F U N C T I O N S
    // ****************************************

    // Updates the form with data from the response
    function update_form_data(res) {
        $("#wishlist_id").val(res.id);
        $("#wishlist_name").val(res.name);
        $("#user_name").val(res.owner);
    }

    /// Clears all form fields
    function clear_form_data() {
        $("#wishlist_id").val("");
        $("#wishlist_name").val("");
        $("#user_name").val("");
        $("#start_filter").val("");
        $("#end_filter").val("");
    }

    // Updates the flash message area
    function flash_message(message) {
        $("#flash_message").empty();
        $("#flash_message").append(message);
    }

    
    // ****************************************
    // List All Wishlists
    // ****************************************

    $("#list-btn").click(function () {
        let owner = $("#user_name").val();
        let start_date = $("#start_filter").val();
        let end_date = $("#end_filter").val();

        $("#flash_message").empty();
        
        let queryString = "";
        if (owner) {
            queryString += 'owner=' + owner;
        }
        if (start_date) {
            queryString += (queryString ? '&' : '') + 'start=' + start_date;
        }
        if (end_date) {
            queryString += (queryString ? '&' : '') + 'end=' + end_date;
        }

        let url = "/wishlists";
        if (queryString) {
            url += "?" + queryString;
        }

        let ajax = $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            data: "",
        });
        
        ajax.done(function(res){
            $("#wishlist_table_body").empty();
            let tableContent = "";
            res.forEach(function(wishlist) {
                tableContent += `<tr>
                                    <td>${wishlist.id}</td>
                                    <td>${wishlist.name}</td>
                                    <td>${wishlist.description}</td>
                                </tr>`;
            });
            $("#wishlist_table_body").append(tableContent);
            flash_message("Wishlists retrieved successfully");
        });

        ajax.fail(function(res){
            flash_message("Failed to retrieve wishlists: " + res.responseJSON.message);
        });
    });

    // ****************************************
    // Create a Wishlist
    // ****************************************

    $("#create-btn").click(function () {
        let owner = $("#user_name").val();
        let name = $("#wishlist_name").val();
        let date = getCurrentDate();

        $("#flash_message").empty();

        let data = {
            "name": name,
            "date_joined": date,
            "products": [],
            "owner": owner
        };

        $("#flash_message").empty();
        
        let ajax = $.ajax({
            type: "POST",
            url: "/wishlists",
            contentType: "application/json",
            data: JSON.stringify(data),
        });

        ajax.done(function(res){
            update_form_data(res)
            flash_message("Success")
        });

        // ajax.fail(function(res){
        //     flash_message(res.responseJSON.message)
        // });
    });

    // ****************************************
    // Update a Wishlist
    // ****************************************

    $("#update-btn").click(function () {
        let wishlist_id = $("#wishlist_id").val();
        let owner = $("#user_name").val();
        let name = $("#wishlist_name").val();
        let date = getCurrentDate();

        let data = {
            "name": name,
            "date_joined": date,
            "products": [],
            "owner": owner
        };

        $("#flash_message").empty();

        let ajax = $.ajax({
                type: "PUT",
                url: `/wishlists/${wishlist_id}`,
                contentType: "application/json",
                data: JSON.stringify(data)
            })

        ajax.done(function(res){
            update_form_data(res)
            flash_message("Success")
        });

        ajax.fail(function(res){
            flash_message(res.responseJSON.message)
        });

    });

    // ****************************************
    // Retrieve a Wishlist
    // ****************************************

    $("#retrieve-btn").click(function () {
        let wishlist_id = $("#wishlist_id").val();

        $("#flash_message").empty();

        let ajax = $.ajax({
            type: "GET",
            url: `/wishlists/${wishlist_id}`,
            contentType: "application/json",
            data: ''
        })

        ajax.done(function(res){
            //alert(res.toSource())
            update_form_data(res)
            flash_message("Success")
        });

        ajax.fail(function(res){
            clear_form_data()
            flash_message(res.responseJSON.message)
        });

    });

    // ****************************************
    // Delete a Wishlist
    // ****************************************

    $("#delete-btn").click(function () {
        let wishlist_id = $("#wishlist_id").val();

        $("#flash_message").empty();

        let ajax = $.ajax({
            type: "DELETE",
            url: `/wishlists/${wishlist_id}`,
            contentType: "application/json",
            data: '',
        })

        ajax.done(function(res){
            clear_form_data()
            flash_message("Wishlist has been Deleted!")
        });

        ajax.fail(function(res){
            flash_message("Server error!")
        });
    });

    // ****************************************
    // Clear the form
    // ****************************************

    $("#clear-btn").click(function () {
        $("#wishlist_id").val("");
        $("#flash_message").empty();
        clear_form_data()
    });
})
