(function () {
    $(document).ready(
        function () {
            initialize_twentytwenty();
        }
    );
    function initialize_twentytwenty() {
        if ($(".twentytwenty-container").twentytwenty) {
            $(".twentytwenty-container").twentytwenty();
        } else {
            setTimeout(function () {
                initialize_twentytwenty();
            }, 250);
        }
    }
})();