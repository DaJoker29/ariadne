/*
    Github: jQuery plugin
 */
(function($) {
    $.fn.qod = function(options) {
        // Parameters
        var settings = $.extend({}, options);
        // Variables
        var rootURL = 'http://quotes.rest';
        var endpoint = '/qod.json';
        var that = this;
        // Fetch Data
        $.ajax({
            url: rootURL + endpoint,
            success: function(data) {
                that.prepend(buildDOM(data));
            },
            error: function() {
                console.log('Problem fetching quote');
            }
        });
        function buildDOM(data) {
            var quote = data.contents.quotes[0];
            return $('<div>').addClass('well').append('<blockquote>').find('blockquote').append('<p>' + quote.quote + '</p>').append('<footer>' + quote.author + '</footer>').append('<span style="z-index:50;font-size:0.9em;"><img src="https://theysaidso.com/branding/theysaidso.png" height="20" width="20" alt="theysaidso.com"/><a href="https://theysaidso.com" title="Powered by quotes from theysaidso.com" style="color: #9fcc25; margin-left: 4px; vertical-align: middle;">theysaidso.com</a></span>');
        }
        return this;
    };
})(jQuery);
//# sourceMappingURL=script.js.map