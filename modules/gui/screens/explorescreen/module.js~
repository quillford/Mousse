var Explore = Module.extend({

    // The "Explore" button was clicked in the navigation bar
    on_main_menu_open_explore: function(){
        // Append the asset to the main frame
        this.asset("explore").appendTo("#main");

        // Set up the search box
        $("#search_things").search();

        // Add a hook for when the user searches something
        var _that = this;
        $("#search_things").on('searched.fu.search', function( test ){
            var keyword = $("#search_things input").val(); 
            _that.on_search(keyword); 
        });
    },

    // We were asked to exit this screen
    on_main_menu_close_explore: function(){
        $("#main").empty();
    },

    // Trigger a search and display results
    on_search: function( keyword ){
        // Call the bridge for this search 
        $.ajax({ 
            url: "http://localhost:3000/search/" + keyword, 
            caller: this,
            async: true,
        }).done( function(data, state, xhr){
            this.caller.display_search_results.call(this.caller, jQuery.parseJSON(data)); 
        });
    },

    // Display the results of a search
    display_search_results: function( results ){
        // Set up the list
        $("#main").empty();
        $("<div id='result_list'></div>").appendTo("#main");

        // Insert the list
        for( var index in results ){
            // For each thumbnail
            var result = results[index];

            // Get the thumbnail asset
            var thumbnail = this.asset("thumbnail");
           
            // Set the main picture
            thumbnail.find("img").first().attr("src", result.thing_picture_url);

            // Set the title
            thumbnail.find("h4").html(result.name);


            thumbnail.appendTo("#result_list");
        }
    },

});



