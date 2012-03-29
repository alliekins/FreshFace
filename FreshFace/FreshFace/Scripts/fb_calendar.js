
$(document).ready(function () {
    $(".calendar").fullCalendar({
        editable: false,
        header: {
            left: 'title',
            center: '',
            right: 'next,prev today',
        },
    });

    $(".fc-widget-content").hover(
        function (ev) { // Hovering in
            $(this).toggleClass("fc-hover", true);
        }, 
        function (ev) { // Hovering out
            $(this).toggleClass("fc-hover", false);
        }
    );
});