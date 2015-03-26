# Laboratory

Simply environment for testing and experimentation

## How to add new page/section

Just add in body (affter #Nav):

    <section id="NameOfYourPage" class="page">
    
      <!-- Your code gose here -->
    
    </section>

    <script>
        Pages.make( 'NameOfYourPage' ).init = function() {
            // If you want to do somting when page is created,
            // put that code here
        };
        
        // Your code gose here
    </script>

